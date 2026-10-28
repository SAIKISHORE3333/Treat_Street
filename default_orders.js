/**
 * Treat Street Operations - Production Stock Levels & Zero Mock Guardrails
 * CRITICAL POLICY: ZERO MOCK PURCHASE ORDERS. All purchase orders are fetched exclusively
 * from the connected Supabase table ('orders').
 */

const MOCK_DATA_ALLOWED = false;

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

// All fake, synthetic sample orders and static fallback mock arrays have been completely purged.
// Step 1: Remove initial mock fallback completely. Default initial state must be an empty array [].
const ORIGINAL_16_ORDERS = Object.freeze([]);
const AUTHENTIC_ORDERS = Object.freeze([]);
const mockPurchaseOrders = Object.freeze([]);
const defaultOrders = Object.freeze([]);
const initialOrders = Object.freeze([]);

function restoreTreatStreetDefaultOrders() {
  // Purged fake orders. Does NOT generate or restore synthetic purchase orders.
  const levels = { ...AUTHENTIC_STOCK_LEVELS };
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem("ts_stock_levels", JSON.stringify(levels));
      localStorage.setItem("ts_data_version", "v8.0.0_strict_supabase_no_mock");
    } catch (e) {
      console.warn("Storage set error:", e);
    }
  }
  return { orders: [], stockLevels: levels };
}

if (typeof window !== "undefined") {
  window.MOCK_DATA_ALLOWED = false;
  window.AUTHENTIC_ORDERS = AUTHENTIC_ORDERS;
  window.ORIGINAL_16_ORDERS = ORIGINAL_16_ORDERS;
  window.mockPurchaseOrders = mockPurchaseOrders;
  window.defaultOrders = defaultOrders;
  window.initialOrders = initialOrders;
  window.AUTHENTIC_STOCK_LEVELS = AUTHENTIC_STOCK_LEVELS;
  window.restoreTreatStreetDefaultOrders = restoreTreatStreetDefaultOrders;
}

if (typeof globalThis !== "undefined") {
  globalThis.MOCK_DATA_ALLOWED = false;
  globalThis.AUTHENTIC_ORDERS = AUTHENTIC_ORDERS;
  globalThis.ORIGINAL_16_ORDERS = ORIGINAL_16_ORDERS;
  globalThis.mockPurchaseOrders = mockPurchaseOrders;
  globalThis.defaultOrders = defaultOrders;
  globalThis.initialOrders = initialOrders;
  globalThis.AUTHENTIC_STOCK_LEVELS = AUTHENTIC_STOCK_LEVELS;
  globalThis.restoreTreatStreetDefaultOrders = restoreTreatStreetDefaultOrders;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    MOCK_DATA_ALLOWED: false,
    AUTHENTIC_ORDERS,
    ORIGINAL_16_ORDERS,
    mockPurchaseOrders,
    defaultOrders,
    initialOrders,
    AUTHENTIC_STOCK_LEVELS,
    restoreTreatStreetDefaultOrders
  };
}
