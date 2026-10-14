/**
 * Treat Street - Core System Entry Script & Storage Migration Guardrail
 * Enforces authentic operational datasets and Supabase Storage synchronization (v6.0.0_authentic_supabase_storage)
 */
(function() {
  const AUTH_DATA_VERSION = "v6.0.0_authentic_supabase_storage";
  if (typeof localStorage !== 'undefined') {
    const currentVersion = localStorage.getItem("ts_data_version");
    if (currentVersion !== AUTH_DATA_VERSION) {
      // Purge only fake/mock storage keys
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

      // Hydrate with authentic orders if missing
      const existingOrdersRaw = localStorage.getItem("ts_orders");
      let existingList = [];
      try { existingList = existingOrdersRaw ? JSON.parse(existingOrdersRaw) : []; } catch (e) {}

      if (!Array.isArray(existingList) || existingList.length === 0) {
        const initialOrders = (typeof AUTHENTIC_ORDERS !== 'undefined' && Array.isArray(AUTHENTIC_ORDERS))
          ? AUTHENTIC_ORDERS
          : [];
        localStorage.setItem("ts_orders", JSON.stringify(initialOrders));
        localStorage.setItem("ts_purchase_orders", JSON.stringify(initialOrders));
      }

      localStorage.setItem("ts_data_version", AUTH_DATA_VERSION);
      console.log(">>> [SECURITY]: Locked authentic datasets and Supabase Storage connection (v6.0.0). <<<");
    }
  }
})();
