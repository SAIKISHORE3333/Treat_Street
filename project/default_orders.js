/**
 * Treat Street Operations - Default Orders
 * Fake / sample purchase orders removed. All purchase orders are strictly genuine and created by the user.
 */

function generateInitialSampleOrders() {
  return [];
}

function restoreTreatStreetDefaultOrders() {
  return { orders: [], stockLevels: {} };
}

if (typeof window !== 'undefined') {
  window.generateInitialSampleOrders = generateInitialSampleOrders;
  window.restoreTreatStreetDefaultOrders = restoreTreatStreetDefaultOrders;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateInitialSampleOrders,
    restoreTreatStreetDefaultOrders
  };
}
