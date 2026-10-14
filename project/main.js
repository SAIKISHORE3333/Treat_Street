/**
 * Treat Street - Core System Entry Script & Storage Migration Guardrail
 * Enforces zero-mock authentic datasets (v5.0.0_zero_mock_original)
 */
(function() {
  const AUTH_DATA_VERSION = "v5.0.0_zero_mock_original";
  if (typeof localStorage !== 'undefined' && localStorage.getItem("ts_data_version") !== AUTH_DATA_VERSION) {
    // Flush all corrupted/mock storage keys
    const keysToPurge = [
      "ts_stock_levels",
      "ts_purchase_orders",
      "mock_orders",
      "ts_orders",
      "mock_ingredients",
      "ts_fake_mock",
      "mock_production_logs",
      "sample_orders",
      "fake_orders",
      "dummy_catalog",
      "ts_shared_catalog"
    ];
    keysToPurge.forEach(k => {
      try { localStorage.removeItem(k); } catch (e) {}
    });
    
    // Authentic audited stock levels (Milton Keynes Store Physical Audit)
    const stockLevels = (typeof AUTHENTIC_STOCK_LEVELS !== 'undefined') 
      ? AUTHENTIC_STOCK_LEVELS 
      : (typeof window !== 'undefined' && window.AUTHENTIC_STOCK_LEVELS ? window.AUTHENTIC_STOCK_LEVELS : {});

    // Strictly clean zero-mock orders: no synthetic seed orders
    localStorage.setItem("ts_stock_levels", JSON.stringify(stockLevels));
    localStorage.setItem("ts_purchase_orders", JSON.stringify([]));
    localStorage.setItem("ts_orders", JSON.stringify([]));
    localStorage.setItem("ts_data_version", AUTH_DATA_VERSION);
    console.log(">>> [SECURITY]: Purged all fake purchase orders & synthetic stock levels. Locked authentic datasets (v5.0.0). <<<");
  }
})();
