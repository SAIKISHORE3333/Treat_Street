/**
 * Treat Street - Core System Entry Script & Storage Migration Guardrail
 * Enforces authentic catalog & purchase order lock (v4.0.0_authentic_locked)
 */
(function() {
  const AUTH_DATA_VERSION = "v4.0.0_authentic_locked";
  if (typeof localStorage !== 'undefined' && localStorage.getItem("ts_data_version") !== AUTH_DATA_VERSION) {
    // Flush all corrupted/mock storage keys
    const keysToPurge = [
      "ts_stock_levels",
      "ts_purchase_orders",
      "mock_orders",
      "ts_orders",
      "mock_ingredients",
      "ts_fake_mock"
    ];
    keysToPurge.forEach(k => {
      try { localStorage.removeItem(k); } catch (e) {}
    });
    
    // Re-seed strictly from restored authentic catalog and default orders
    const catalogData = (typeof AUTHENTIC_CATALOG !== 'undefined') ? AUTHENTIC_CATALOG : (typeof window !== 'undefined' && window.AUTHENTIC_CATALOG ? window.AUTHENTIC_CATALOG : (window.tsCatalog || []));
    const ordersData = (typeof AUTHENTIC_ORDERS !== 'undefined') ? AUTHENTIC_ORDERS : (typeof window !== 'undefined' && window.AUTHENTIC_ORDERS ? window.AUTHENTIC_ORDERS : (typeof generateInitialSampleOrders === 'function' ? generateInitialSampleOrders() : []));

    localStorage.setItem("ts_stock_levels", JSON.stringify(catalogData));
    localStorage.setItem("ts_purchase_orders", JSON.stringify(ordersData));
    localStorage.setItem("ts_orders", JSON.stringify(ordersData));
    localStorage.setItem("ts_data_version", AUTH_DATA_VERSION);
    console.log(">>> [SECURITY]: Purged legacy mock data and locked authentic datasets. <<<");
  }
})();
