/**
 * Treat Street Operations - Clean Production Source
 * STRICT ZERO-MOCK ENFORCEMENT: MOCK_DATA_ALLOWED = false
 * All fake, synthetic, and dummy seed purchase orders are strictly disabled.
 * Tables and views display ONLY authentic database records and real uploaded settlements.
 */

const MOCK_DATA_ALLOWED = false;

// Authentic Physical Audited Stock Levels from Milton Keynes Store Audit
const AUTHENTIC_STOCK_LEVELS = Object.freeze({
  "1": 0,
  "3": 0,
  "4": 0,
  "10": 1,
  "11": 0.66,
  "12": 1,
  "13": 2,
  "14": 2,
  "16": 2,
  "18": 2,
  "31": 1.75,
  "38": 2,
  "48": 0.66,
  "53": 1,
  "56": 4,
  "68": 0.53,
  "70": 1,
  "71": 2,
  "76": 0,
  "97": 3,
  "104": 2,
  "105": 6,
  "106": 2,
  "112": 7,
  "113": 3,
  "114": 1,
  "115": 4,
  "117": 7,
  "118": 7,
  "119": 7,
  "120": 3,
  "122": 8,
  "125": 4,
  "126": 2,
  "128": 3,
  "129": 2,
  "130": 4,
  "139": 1,
  "140": 1.16,
  "177": 5,
  "197": 3.5,
  "225": 1,
  "226": 2,
  "299": 9,
  "Roquito Hot Honey 720g": 5,
  "Chef's Menu Onion Powder 480g": 2,
  "Chef's Menu Ground Black Pepper 500g": 2,
  "Chef's Menu Garlic Powder 500g": 2,
  "Chef's Menu Cayenne Pepper 460g": 2,
  "Chef's Larder Salt 6kg": 0.66,
  "St Pierre Brioche buns": 3.5,
  "Chef's Larder White Wine Vinegar 2 Litres": 1,
  "Strathmore Still Spring Water 750ml": 2,
  "Strathmore Sparkling Spring Water 330ml": 1,
  "Chef's Larder Lightly Salted Tortilla Chips 454g": 1,
  "Lichfields Plain Flour 1.5kg": 9,
  "Schwartz Ground Cumin 400g": 3,
  "All butter croissant": 3,
  "Ambassador gelato": 8,
  "Heinz Tomato Ketchup 4.5kg": 2
});

function generateInitialSampleOrders() {
  // STRICT ZERO-MOCK CONSTRAINT: Never return fake or synthetic seed orders
  return [];
}

function restoreTreatStreetDefaultOrders() {
  return { orders: [], stockLevels: AUTHENTIC_STOCK_LEVELS };
}

const AUTHENTIC_ORDERS = Object.freeze([]);

if (typeof window !== 'undefined') {
  window.MOCK_DATA_ALLOWED = false;
  window.AUTHENTIC_ORDERS = AUTHENTIC_ORDERS;
  window.AUTHENTIC_STOCK_LEVELS = AUTHENTIC_STOCK_LEVELS;
  window.generateInitialSampleOrders = generateInitialSampleOrders;
  window.restoreTreatStreetDefaultOrders = restoreTreatStreetDefaultOrders;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    MOCK_DATA_ALLOWED: false,
    AUTHENTIC_ORDERS,
    AUTHENTIC_STOCK_LEVELS,
    generateInitialSampleOrders,
    restoreTreatStreetDefaultOrders
  };
}
