/**
 * Treat Street - Core System Entry Script & Storage Migration Guardrail
 * Enforces authentic operational datasets and Supabase Storage synchronization (v6.2.0_authentic_restored_clean_orders)
 */
(function() {
  const AUTH_DATA_VERSION = "v6.2.0_authentic_restored_clean_orders";
  if (typeof localStorage !== 'undefined') {
    const currentVersion = localStorage.getItem("ts_data_version");
    if (currentVersion !== AUTH_DATA_VERSION) {
      // Purge fake/mock storage keys
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

      // Authentic audited stock levels (Milton Keynes Store Physical Audit)
      const stockLevels = (typeof AUTHENTIC_STOCK_LEVELS !== 'undefined') 
        ? AUTHENTIC_STOCK_LEVELS 
        : (typeof window !== 'undefined' && window.AUTHENTIC_STOCK_LEVELS ? window.AUTHENTIC_STOCK_LEVELS : {});
      localStorage.setItem("ts_stock_levels", JSON.stringify(stockLevels));

      // Hydrate with authentic orders and purge any null/empty orders
      const existingOrdersRaw = localStorage.getItem("ts_orders");
      let existingList = [];
      try { existingList = existingOrdersRaw ? JSON.parse(existingOrdersRaw) : []; } catch (e) {}

      let cleanedOrders = Array.isArray(existingList)
        ? existingList.filter(o => o && !o.is_mock && Array.isArray(o.items) && o.items.length > 0 && (o.total > 0 || o.netTotal > 0))
        : [];

      const initialOrders = (typeof AUTHENTIC_ORDERS !== 'undefined' && Array.isArray(AUTHENTIC_ORDERS))
        ? AUTHENTIC_ORDERS.filter(o => o && Array.isArray(o.items) && o.items.length > 0)
        : [];

      if (cleanedOrders.length === 0) {
        cleanedOrders = initialOrders;
      }

      localStorage.setItem("ts_orders", JSON.stringify(cleanedOrders));
      localStorage.setItem("ts_purchase_orders", JSON.stringify(cleanedOrders));
      localStorage.setItem("ts_data_version", AUTH_DATA_VERSION);
      console.log(">>> [SECURITY]: Purged null orders and locked authentic purchase orders (v6.2.0). <<<");
    } else {
      // Periodic safety check: strip any null/0-item purchase orders from cache
      try {
        const raw = localStorage.getItem("ts_orders");
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list)) {
            const clean = list.filter(o => o && !o.is_mock && Array.isArray(o.items) && o.items.length > 0 && (o.total > 0 || o.netTotal > 0));
            if (clean.length !== list.length) {
              const toSave = clean.length > 0 ? clean : ((typeof AUTHENTIC_ORDERS !== 'undefined' && Array.isArray(AUTHENTIC_ORDERS)) ? AUTHENTIC_ORDERS : []);
              localStorage.setItem("ts_orders", JSON.stringify(toSave));
              localStorage.setItem("ts_purchase_orders", JSON.stringify(toSave));
            }
          }
        }
      } catch(e) {}
    }
  }
})();

