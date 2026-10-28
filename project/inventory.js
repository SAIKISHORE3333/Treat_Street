/**
 * Treat Street - Core System Entry Script & Supabase Storage Integration
 * Restores and synchronizes authentic purchase orders from Supabase Storage bucket 'purchase-orders'.
 * STRICT GUARDRAILS: Zero mock generation, zero resurrection of user-deleted orders.
 */

var SUPABASE_URL = (typeof window !== 'undefined' && window.SUPABASE_URL) ? window.SUPABASE_URL : 'https://sdlrwosjebiiztclsydu.supabase.co';
var SUPABASE_ANON_KEY = (typeof window !== 'undefined' && window.SUPABASE_ANON_KEY) ? window.SUPABASE_ANON_KEY : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkbHJ3b3NqZWJpaXp0Y2xzeWR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2NDIzNzYsImV4cCI6MjEwMDIxODM3Nn0.ETNHA-Ku6Sb-cBVQCLk4rKlq1M7_GBu4810KphuOxTw';
var SUPABASE_BUCKET = (typeof window !== 'undefined' && window.SUPABASE_BUCKET) ? window.SUPABASE_BUCKET : 'purchase-orders';
var AUTH_DATA_VERSION = "v7.0.0_permanent_clean_orders";
var supabaseClient = (typeof window !== 'undefined' && window.supabaseClient) ? window.supabaseClient : null;

var GHOST_REFS = new Set();
if (typeof window !== 'undefined') {
  window.GHOST_REFS = GHOST_REFS;
}

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

function getDeletedOrdersSet() {
  const deleted = new Set(GHOST_REFS);
  if (typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem('ts_deleted_orders');
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) arr.forEach(r => deleted.add(r));
      }
    } catch (e) {}
  }
  return deleted;
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

  // 3. User deleted orders blacklist
  const deletedSet = getDeletedOrdersSet();

  const ordersMap = new Map();

  // 4. Fetch directly from connected Supabase database table ('purchase_orders' with fallback to 'orders')
  if (client) {
    try {
      console.log("[Supabase inventory.js]: Fetching purchase orders via supabase.from('purchase_orders').select('*')...");
      let { data: dbOrders, error: dbErr } = await client.from('purchase_orders').select('*');
      console.log('[Supabase inventory.js purchase_orders data]:', dbOrders);
      console.log('[Supabase inventory.js purchase_orders error]:', dbErr);

      if (dbErr && (dbErr.code === 'PGRST205' || (dbErr.message && dbErr.message.includes('purchase_orders')))) {
        console.log("[Supabase inventory.js]: 'purchase_orders' table not found, querying 'orders' table...");
        const ordersRes = await client
          .from('orders')
          .select('*, order_items(*)')
          .order('created_at', { ascending: false });
        console.log('[Supabase inventory.js orders data]:', ordersRes.data);
        console.log('[Supabase inventory.js orders error]:', ordersRes.error);
        if (!ordersRes.error) {
          dbOrders = ordersRes.data;
          dbErr = null;
        } else {
          dbErr = ordersRes.error;
        }
      }

      if (!dbErr && Array.isArray(dbOrders)) {
        dbOrders.forEach(dbo => {
          let notesObj = {};
          if (typeof dbo.notes === 'string') {
            try { notesObj = JSON.parse(dbo.notes); } catch(e) { notesObj = { text: dbo.notes }; }
          } else if (typeof dbo.notes === 'object' && dbo.notes !== null) {
            notesObj = dbo.notes;
          }

          const d = dbo.created_at ? new Date(dbo.created_at) : (dbo.timestamp ? new Date(dbo.timestamp) : new Date());
          const dateStr = dbo.date || (d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          const primaryRef = dbo.primaryRef || dbo.primary_ref || dbo.po_number || notesObj.primaryRef || `TSMK-${(dbo.id || '').slice(0, 8).toUpperCase()}`;

          const rawItems = Array.isArray(dbo.order_items) ? dbo.order_items : (Array.isArray(dbo.items) ? dbo.items : []);
          const items = rawItems.map(item => ({
            id: item.id || item.product_id || item.product_name || 'ITEM',
            name: item.product_name || item.name || 'Unnamed Item',
            supplier: item.supplier_name || item.supplier || 'Standard Supplier',
            category: item.category || 'General',
            qty: parseFloat(item.quantity !== undefined ? item.quantity : item.qty) || 1,
            price: parseFloat(item.unit_price !== undefined ? item.unit_price : item.price) || 0,
            vatRate: item.vatRate !== undefined ? item.vatRate : 0,
            trackingStatus: item.trackingStatus || dbo.status || 'Pending',
            stockSynced: item.stockSynced || false
          }));

          const netTotal = dbo.net_total !== undefined ? parseFloat(dbo.net_total) : (notesObj.netTotal !== undefined ? parseFloat(notesObj.netTotal) : items.reduce((sum, i) => sum + (i.price * i.qty), 0));
          const totalVal = parseFloat(dbo.total_cost !== undefined ? dbo.total_cost : (dbo.total !== undefined ? dbo.total : 0));
          const vatTotal = dbo.vat_total !== undefined ? parseFloat(dbo.vat_total) : (notesObj.vatTotal !== undefined ? parseFloat(notesObj.vatTotal) : (totalVal > netTotal ? totalVal - netTotal : 0));
          const finalTotal = totalVal > 0 ? totalVal : (netTotal + vatTotal);

          const ordObj = {
            id: dbo.id,
            primaryRef: primaryRef,
            ddmmyy: dbo.ddmmyy || notesObj.ddmmyy || '',
            serial: dbo.serial || notesObj.serial || '',
            timestamp: d.getTime(),
            date: dateStr,
            requestedBy: dbo.staff_name || dbo.requested_by || dbo.requestedBy || 'Staff',
            targetLocation: dbo.branch_name || dbo.target_location || dbo.department || dbo.targetLocation || 'Milton Keynes',
            status: dbo.status || 'Pending',
            notes: dbo.notes,
            netTotal: netTotal,
            vatTotal: vatTotal,
            total: finalTotal,
            items: items,
            supabaseUrls: dbo.supabase_urls || notesObj.supabaseUrls || {}
          };

          ordersMap.set(ordObj.primaryRef, ordObj);
        });
      }
    } catch (e) {
      console.warn("[Supabase Orders Table]: Query exception:", e);
    }
  }

  // 5. Match authentic PDF orders in bucket
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
    return o && !deletedSet.has(o.primaryRef) && !deletedSet.has(o.id) && !o.is_mock && Array.isArray(o.items) && o.items.length > 0 && (o.total > 0 || o.netTotal > 0);
  });
  // Sort descending by timestamp / primaryRef
  finalOrders.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0) || (b.primaryRef || '').localeCompare(a.primaryRef || ''));

  // 6. CACHE HYDRATION: Sync to localStorage without reviving deleted orders
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
    const deletedSet = getDeletedOrdersSet();

    // Clean fake storage keys
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

    // Ensure no ghost or deleted orders exist in localStorage
    ['ts_orders', 'ts_purchase_orders'].forEach(key => {
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list)) {
            const clean = list.filter(o => o && !deletedSet.has(o.primaryRef) && !deletedSet.has(o.id) && !o.is_mock && Array.isArray(o.items) && o.items.length > 0 && (o.total > 0 || o.netTotal > 0));
            localStorage.setItem(key, JSON.stringify(clean));
          }
        }
      } catch (err) {}
    });
  }

  // Auto-trigger Supabase storage fetch when DOM is ready
  if (typeof window !== 'undefined') {
    window.SUPABASE_URL = SUPABASE_URL;
    window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
    window.SUPABASE_BUCKET = SUPABASE_BUCKET;
    window.fetchSupabaseStoragePurchaseOrders = fetchSupabaseStoragePurchaseOrders;

    window.addEventListener('DOMContentLoaded', async () => {
      try {
        const updated = await fetchSupabaseStoragePurchaseOrders();
        if (typeof renderPurchaseOrdersView === 'function') {
          renderPurchaseOrdersView();
        }
        if (typeof filterAndRenderAdminOrders === 'function') {
          if (typeof orders !== 'undefined') {
            orders = updated.map(o => (typeof normalizeOrder === 'function' ? normalizeOrder(o) : o));
            filterAndRenderAdminOrders();
          }
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
