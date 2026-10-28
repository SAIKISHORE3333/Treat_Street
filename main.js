/**
 * Treat Street - Core System Entry Script & Storage Migration Guardrail
 * Enforces zero mock data and strict Supabase database integrity (v8.0.0_strict_supabase_no_mock)
 */
(function() {
  const AUTH_DATA_VERSION = "v8.0.0_strict_supabase_no_mock";

  const GHOST_REFS = new Set();

  if (typeof localStorage !== 'undefined') {
    // 1. Maintain permanent deletion blacklist
    let deletedRefs = new Set();
    try {
      const rawDel = localStorage.getItem('ts_deleted_orders');
      let delArr = rawDel ? JSON.parse(rawDel) : [];
      if (!Array.isArray(delArr)) delArr = [];
      GHOST_REFS.forEach(r => { if (!delArr.includes(r)) delArr.push(r); });
      localStorage.setItem('ts_deleted_orders', JSON.stringify(delArr));
      delArr.forEach(r => deletedRefs.add(r));
    } catch (e) {}

    const isInvalidOrDeleted = (o) => {
      if (!o) return true;
      if (o.is_mock) return true;
      if (deletedRefs.has(o.primaryRef) || deletedRefs.has(o.id)) return true;
      if (GHOST_REFS.has(o.primaryRef) || GHOST_REFS.has(o.id)) return true;
      if (!Array.isArray(o.items) || o.items.length === 0) return true;
      if ((!o.total || o.total === 0) && (!o.netTotal || o.netTotal === 0)) return true;
      return false;
    };

    // 2. Clean fake storage keys
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

    // 3. Purge mock orders from caches
    ['ts_orders', 'ts_purchase_orders'].forEach(key => {
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list)) {
            const clean = list.filter(o => !isInvalidOrDeleted(o));
            localStorage.setItem(key, JSON.stringify(clean));
          }
        }
      } catch (e) {}
    });

    // 4. Version migration & stock pot baseline
    const currentVersion = localStorage.getItem("ts_data_version");
    if (currentVersion !== AUTH_DATA_VERSION) {
      const stockLevels = (typeof AUTHENTIC_STOCK_LEVELS !== 'undefined') 
        ? AUTHENTIC_STOCK_LEVELS 
        : (typeof window !== 'undefined' && window.AUTHENTIC_STOCK_LEVELS ? window.AUTHENTIC_STOCK_LEVELS : {});
      localStorage.setItem("ts_stock_levels", JSON.stringify(stockLevels));

      const existingRaw = localStorage.getItem("ts_orders");
      let existingList = [];
      try { existingList = existingRaw ? JSON.parse(existingRaw) : []; } catch (e) {}

      let cleanedOrders = Array.isArray(existingList) ? existingList.filter(o => !isInvalidOrDeleted(o)) : [];

      // STRICT ZERO-MOCK: If empty, do NOT seed fake fallback orders
      localStorage.setItem("ts_orders", JSON.stringify(cleanedOrders));
      localStorage.setItem("ts_purchase_orders", JSON.stringify(cleanedOrders));
      localStorage.setItem("ts_data_version", AUTH_DATA_VERSION);
      console.log(">>> [SECURITY]: Purged all synthetic mock data; strict Supabase mode active (v8.0.0). <<<");
    }
  }
})();
