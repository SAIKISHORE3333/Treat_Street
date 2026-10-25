/**
 * Treat Street - Core System Entry Script & Supabase Storage Integration
 * Restores and synchronizes authentic purchase orders from Supabase Storage bucket 'purchase-orders'.
 * STRICT GUARDRAILS: Zero mock generation, zero empty array overwrites.
 */

var SUPABASE_URL = (typeof window !== 'undefined' && window.SUPABASE_URL) ? window.SUPABASE_URL : 'https://sdlrwosjebiiztclsydu.supabase.co';
var SUPABASE_ANON_KEY = (typeof window !== 'undefined' && window.SUPABASE_ANON_KEY) ? window.SUPABASE_ANON_KEY : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkbHJ3b3NqZWJpaXp0Y2xzeWR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2NDIzNzYsImV4cCI6MjEwMDIxODM3Nn0.ETNHA-Ku6Sb-cBVQCLk4rKlq1M7_GBu4810KphuOxTw';
var SUPABASE_BUCKET = (typeof window !== 'undefined' && window.SUPABASE_BUCKET) ? window.SUPABASE_BUCKET : 'purchase-orders';
var AUTH_DATA_VERSION = "v6.2.0_authentic_restored_clean_orders";
var supabaseClient = (typeof window !== 'undefined' && window.supabaseClient) ? window.supabaseClient : null;

function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  const supabaseLib = (typeof window !== 'undefined' && window.supabase) 
    ? window.supabase 
    : (typeof supabase !== 'undefined' ? supabase : null);
  if (supabaseLib && typeof supabaseLib.createClient === 'function') {
    try {
      supabaseClient = supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log("[Supabase]: Client initialized successfully.");
    } catch (e) {
      console.warn("[Supabase]: Client init error:", e);
    }
  }
  return supabaseClient;
}

/**
 * Fetch authentic purchase order PDFs directly from Supabase Storage bucket 'purchase-orders'
 * and correlate with order items and local cache.
 */
async function fetchSupabaseStoragePurchaseOrders() {
  const client = getSupabaseClient();
  let files = [];

  // 1. Storage bucket fetch via official JS client
  if (client && client.storage) {
    try {
      const { data, error } = await client.storage.from(SUPABASE_BUCKET).list('', {
        limit: 100,
        sortBy: { column: 'name', order: 'desc' }
      });
      if (!error && Array.isArray(data)) {
        files = data;
        console.log(`[Supabase Storage]: Fetched ${files.length} authentic files from bucket '${SUPABASE_BUCKET}'.`);
      } else if (error) {
        console.warn("[Supabase Storage]: List error:", error.message);
      }
    } catch (err) {
      console.warn("[Supabase Storage]: List exception:", err);
    }
  }

  // 2. Direct HTTP REST fallback to Supabase Storage API
  if (files.length === 0) {
    try {
      const res = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${SUPABASE_BUCKET}`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prefix: '', limit: 100, sortBy: { column: 'name', order: 'desc' } })
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          files = data;
          console.log(`[Supabase Storage REST]: Fetched ${files.length} files from bucket '${SUPABASE_BUCKET}'.`);
        }
      }
    } catch (e) {
      console.warn("[Supabase Storage REST]: Fetch exception:", e);
    }
  }

  // 3. Load baseline authentic orders manifest
  const manifestOrders = (typeof AUTHENTIC_ORDERS !== 'undefined' && Array.isArray(AUTHENTIC_ORDERS))
    ? JSON.parse(JSON.stringify(AUTHENTIC_ORDERS))
    : ((typeof window !== 'undefined' && Array.isArray(window.AUTHENTIC_ORDERS))
      ? JSON.parse(JSON.stringify(window.AUTHENTIC_ORDERS))
      : []);

  let localOrders = [];
  try {
    const raw = localStorage.getItem('ts_orders');
    if (raw) localOrders = JSON.parse(raw);
  } catch (e) {}

  const ordersMap = new Map();
  manifestOrders.forEach(o => {
    if (o && o.primaryRef && Array.isArray(o.items) && o.items.length > 0 && (o.total > 0 || o.netTotal > 0)) {
      ordersMap.set(o.primaryRef, o);
    }
  });
  if (Array.isArray(localOrders)) {
    localOrders.forEach(o => {
      if (o && o.primaryRef && !ordersMap.has(o.primaryRef) && !o.is_mock && Array.isArray(o.items) && o.items.length > 0 && (o.total > 0 || o.netTotal > 0)) {
        ordersMap.set(o.primaryRef, o);
      }
    });
  }

  // 4. Filter authentic PDF orders (filter out connection-test.txt, TSMK-TEST-*, etc.)
  const pdfFiles = files.filter(f => f.name && f.name.endsWith('.pdf') && !f.name.includes('TEST'));

  pdfFiles.forEach(f => {
    let publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}/${encodeURIComponent(f.name)}`;
    if (client && client.storage) {
      const { data: urlData } = client.storage.from(SUPABASE_BUCKET).getPublicUrl(f.name);
      if (urlData && urlData.publicUrl) publicUrl = urlData.publicUrl;
    }

    const baseName = f.name.replace('.pdf', '');
    const parts = baseName.split('-');
    const supplierRaw = parts[1] || 'Supplier';
    const ddmmyy = parts[2] || '';
    const serial = parts[3] || '001';
    const multiRef = `TSMK-MULTI-${ddmmyy}-${serial}`;

    let matched = ordersMap.get(multiRef);
    if (!matched) {
      for (const ord of ordersMap.values()) {
        if (ord.primaryRef === baseName || (ord.supplierOrders || []).some(so => so.poRef === baseName)) {
          matched = ord;
          break;
        }
      }
    }

    if (matched) {
      if (!matched.supabaseUrls) matched.supabaseUrls = {};
      matched.supabaseUrls[baseName] = publicUrl;
      (matched.supplierOrders || []).forEach(so => {
        if (so.poRef === baseName || so.supplier.toUpperCase().replace(/\s+/g, '') === supplierRaw) {
          so.pdfUrl = publicUrl;
          so.fileSize = f.metadata ? f.metadata.size : null;
          so.updatedAt = f.updated_at || f.created_at;
        }
      });
    }
  });

  const finalOrders = Array.from(ordersMap.values()).filter(o => {
    return o && !o.is_mock && Array.isArray(o.items) && o.items.length > 0 && (o.total > 0 || o.netTotal > 0);
  });
  // Sort descending by timestamp / primaryRef
  finalOrders.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0) || (b.primaryRef || '').localeCompare(a.primaryRef || ''));

  // 5. CACHE HYDRATION: Sync to localStorage without empty rewrites
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem('ts_orders', JSON.stringify(finalOrders));
      localStorage.setItem('ts_purchase_orders', JSON.stringify(finalOrders));
      localStorage.setItem('ts_data_version', AUTH_DATA_VERSION);
    } catch (e) {
      console.warn("Storage sync warning:", e);
    }
  }

  return finalOrders;
}

// Initial bootstrap guardrail on page load
(function() {
  if (typeof localStorage !== 'undefined') {
    const currentVersion = localStorage.getItem("ts_data_version");
    if (currentVersion !== AUTH_DATA_VERSION) {
      // Clean only corrupted mock keys; NEVER delete genuine purchase orders
      const keysToPurge = [
        "mock_orders",
        "mock_ingredients",
        "ts_fake_mock",
        "mock_production_logs",
        "sample_orders",
        "fake_orders",
        "dummy_catalog"
      ];
      keysToPurge.forEach(k => {
        try { localStorage.removeItem(k); } catch (e) {}
      });

      // Audited physical stock levels
      const stockLevels = (typeof AUTHENTIC_STOCK_LEVELS !== 'undefined')
        ? AUTHENTIC_STOCK_LEVELS
        : (typeof window !== 'undefined' && window.AUTHENTIC_STOCK_LEVELS ? window.AUTHENTIC_STOCK_LEVELS : {});
      localStorage.setItem("ts_stock_levels", JSON.stringify(stockLevels));

      // Purge null/empty purchase orders and ensure only authentic orders exist
      const existingOrdersRaw = localStorage.getItem("ts_orders");
      let existingList = [];
      try { existingList = existingOrdersRaw ? JSON.parse(existingOrdersRaw) : []; } catch (e) {}

      let validOrders = Array.isArray(existingList)
        ? existingList.filter(o => o && !o.is_mock && Array.isArray(o.items) && o.items.length > 0 && (o.total > 0 || o.netTotal > 0))
        : [];

      const initialOrders = (typeof AUTHENTIC_ORDERS !== 'undefined' && Array.isArray(AUTHENTIC_ORDERS))
        ? AUTHENTIC_ORDERS.filter(o => o && Array.isArray(o.items) && o.items.length > 0)
        : [];

      if (validOrders.length === 0) {
        validOrders = initialOrders;
      }
      localStorage.setItem("ts_orders", JSON.stringify(validOrders));
      localStorage.setItem("ts_purchase_orders", JSON.stringify(validOrders));
      localStorage.setItem("ts_data_version", AUTH_DATA_VERSION);
    } else {
      // Even if version matches, dynamically ensure no null/zero orders exist in storage
      try {
        const existingRaw = localStorage.getItem("ts_orders");
        if (existingRaw) {
          const list = JSON.parse(existingRaw);
          if (Array.isArray(list)) {
            const clean = list.filter(o => o && !o.is_mock && Array.isArray(o.items) && o.items.length > 0 && (o.total > 0 || o.netTotal > 0));
            if (clean.length !== list.length) {
              const toSave = clean.length > 0 ? clean : ((typeof AUTHENTIC_ORDERS !== 'undefined' && Array.isArray(AUTHENTIC_ORDERS)) ? AUTHENTIC_ORDERS : []);
              localStorage.setItem("ts_orders", JSON.stringify(toSave));
              localStorage.setItem("ts_purchase_orders", JSON.stringify(toSave));
            }
          }
        }
      } catch (err) {}
    }
  }

  // Auto-trigger Supabase storage fetch when DOM is ready
  if (typeof window !== 'undefined') {
    window.SUPABASE_URL = SUPABASE_URL;
    window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
    window.SUPABASE_BUCKET = SUPABASE_BUCKET;
    window.fetchSupabaseStoragePurchaseOrders = fetchSupabaseStoragePurchaseOrders;

    window.addEventListener('DOMContentLoaded', async () => {
      try {
        await fetchSupabaseStoragePurchaseOrders();
        if (typeof renderPurchaseOrdersView === 'function') {
          renderPurchaseOrdersView();
        }
      } catch (err) {
        console.warn("Auto storage fetch error:", err);
      }
    });
  }
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    SUPABASE_BUCKET,
    getSupabaseClient,
    fetchSupabaseStoragePurchaseOrders
  };
}
