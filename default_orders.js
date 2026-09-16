/**
 * Treat Street Operations - Zero-Mock Data Constraint
 * STRICT ENFORCEMENT: MOCK_DATA_ALLOWED = false
 * All mock, synthetic, and dummy seed data are disabled.
 * Tables and views display ONLY authentic database records and real uploaded settlements.
 */

const MOCK_DATA_ALLOWED = false;

function generateInitialSampleOrders() {
  // STRICT ZERO-MOCK CONSTRAINT: Never return mock/synthetic seed orders
  return [];
}

function restoreTreatStreetDefaultOrders() {
  return { orders: [], stockLevels: {} };
}

if (typeof window !== 'undefined') {
  window.MOCK_DATA_ALLOWED = false;
  window.generateInitialSampleOrders = generateInitialSampleOrders;
  window.restoreTreatStreetDefaultOrders = restoreTreatStreetDefaultOrders;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    MOCK_DATA_ALLOWED: false,
    generateInitialSampleOrders,
    restoreTreatStreetDefaultOrders
  };
}
