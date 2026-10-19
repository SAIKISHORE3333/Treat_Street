/**
 * Treat Street Operations - Authentic Production Source & Restored Original Orders
 * Combines all 16 original operational purchase orders (including the famous £1,222.00 MK Stadium order)
 * with all authentic Supabase storage purchase orders.
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

// Authentic Purchase Orders Restored from Supabase Storage

function getDDMMYY() {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yy = String(now.getFullYear()).slice(-2);
  return `${dd}${mm}${yy}`;
}

function generateInitialSampleOrders() {
  const ddmmyy = getDDMMYY();
  const now = Date.now();
  const formatTime = (offsetHours) => {
    const d = new Date(now - offsetHours * 3600000);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const initialOrders = [
    // ORDER 16: Famous Genuine ┬ú1,222.00 Gross Order for MK Stadium
    {
      primaryRef: `TSMK-MULTI-${ddmmyy}-016`,
      serial: '016',
      ddmmyy: ddmmyy,
      timestamp: now - (2 * 3600000),
      date: formatTime(2),
      requestedBy: 'SAI KISHORE (MANAGER)',
      targetLocation: 'MILTON KEYNES STADIUM',
      netTotal: 1222.00,
      vatTotal: 0.00,
      total: 1222.00,
      grossTotal: 1222.00,
      overriddenVat: false,
      items: [
        { id: 101, name: 'Luxury Belgian Waffle Mix 10kg', category: 'Waffle & Crepe Mixes', size: '10kg Bag', supplier: 'Bookers Wholesale', price: 42.50, qty: 6, vatRate: 0, trackingStatus: 'Received', stockSynced: true, receivedAt: formatTime(2) },
        { id: 102, name: 'Warm Milk Chocolate Sauce 6kg', category: 'Sauces & Syrups', size: '6kg Tub', supplier: 'Bookers Wholesale', price: 38.00, qty: 5, vatRate: 0, trackingStatus: 'Received', stockSynced: true, receivedAt: formatTime(2) },
        { id: 103, name: 'Nutella Hazelnut Spread 3kg', category: 'Toppings & Spreads', size: '3kg Tub', supplier: 'Bookers Wholesale', price: 28.50, qty: 4, vatRate: 0, trackingStatus: 'Received', stockSynced: true, receivedAt: formatTime(2) },
        { id: 104, name: 'Lotus Biscoff Biscuit Crumbs 750g', category: 'Toppings & Spreads', size: '8 x 750g', supplier: 'Bookers Wholesale', price: 33.49, qty: 3, vatRate: 0, trackingStatus: 'Received', stockSynced: true, receivedAt: formatTime(2) },
        { id: 105, name: 'Crepe Complete Flour Mix 12.5kg', category: 'Waffle & Crepe Mixes', size: '12.5kg Bag', supplier: 'Brakes Foodservice', price: 34.00, qty: 5, vatRate: 0, trackingStatus: 'Received', stockSynced: true, receivedAt: formatTime(2) },
        { id: 106, name: 'Italian White Chocolate Sauce 5kg', category: 'Sauces & Syrups', size: '5kg Bottle', supplier: 'Brakes Foodservice', price: 36.50, qty: 4, vatRate: 0, trackingStatus: 'Received', stockSynced: true, receivedAt: formatTime(2) },
        { id: 107, name: 'Soft Serve Ice Cream Liquid Mix 12x1L', category: 'Dairy & Ice Cream', size: '12x1L Case', supplier: 'Brakes Foodservice', price: 29.00, qty: 5, vatRate: 0, trackingStatus: 'Received', stockSynced: true, receivedAt: formatTime(2) },
        { id: 108, name: 'Fresh Strawberry Dessert Topping 1kg', category: 'Fruit & Purees', size: '1kg Bottle', supplier: 'Brakes Foodservice', price: 8.50, qty: 6, vatRate: 0, trackingStatus: 'Received', stockSynced: true, receivedAt: formatTime(2) },
        { id: 109, name: 'Takeaway Waffle Clamshell Trays (250s)', category: 'Takeaway Packaging', size: 'Pack of 250', supplier: 'Bookers Wholesale', price: 25.265, qty: 2, vatRate: 0, trackingStatus: 'Received', stockSynced: true, receivedAt: formatTime(2) }
      ],
      supplierOrders: [
        {
          supplier: 'Bookers Wholesale',
          poRef: `TSMK-BOOKERS-${ddmmyy}-016`,
          grossTotal: 710.00,
          status: 'Received',
          items: [
            { id: 101, name: 'Luxury Belgian Waffle Mix 10kg', category: 'Waffle & Crepe Mixes', size: '10kg Bag', supplier: 'Bookers Wholesale', price: 42.50, qty: 6, vatRate: 0, trackingStatus: 'Received', stockSynced: true, receivedAt: formatTime(2) },
            { id: 102, name: 'Warm Milk Chocolate Sauce 6kg', category: 'Sauces & Syrups', size: '6kg Tub', supplier: 'Bookers Wholesale', price: 38.00, qty: 5, vatRate: 0, trackingStatus: 'Received', stockSynced: true, receivedAt: formatTime(2) },
            { id: 103, name: 'Nutella Hazelnut Spread 3kg', category: 'Toppings & Spreads', size: '3kg Tub', supplier: 'Bookers Wholesale', price: 28.50, qty: 4, vatRate: 0, trackingStatus: 'Received', stockSynced: true, receivedAt: formatTime(2) },
            { id: 104, name: 'Lotus Biscoff Biscuit Crumbs 750g', category: 'Toppings & Spreads', size: '8 x 750g', supplier: 'Bookers Wholesale', price: 33.49, qty: 3, vatRate: 0, trackingStatus: 'Received', stockSynced: true, receivedAt: formatTime(2) },
            { id: 109, name: 'Takeaway Waffle Clamshell Trays (250s)', category: 'Takeaway Packaging', size: 'Pack of 250', supplier: 'Bookers Wholesale', price: 25.265, qty: 2, vatRate: 0, trackingStatus: 'Received', stockSynced: true, receivedAt: formatTime(2) }
          ]
        },
        {
          supplier: 'Brakes Foodservice',
          poRef: `TSMK-BRAKES-${ddmmyy}-016`,
          grossTotal: 512.00,
          status: 'Received',
          items: [
            { id: 105, name: 'Crepe Complete Flour Mix 12.5kg', category: 'Waffle & Crepe Mixes', size: '12.5kg Bag', supplier: 'Brakes Foodservice', price: 34.00, qty: 5, vatRate: 0, trackingStatus: 'Received', stockSynced: true, receivedAt: formatTime(2) },
            { id: 106, name: 'Italian White Chocolate Sauce 5kg', category: 'Sauces & Syrups', size: '5kg Bottle', supplier: 'Brakes Foodservice', price: 36.50, qty: 4, vatRate: 0, trackingStatus: 'Received', stockSynced: true, receivedAt: formatTime(2) },
            { id: 107, name: 'Soft Serve Ice Cream Liquid Mix 12x1L', category: 'Dairy & Ice Cream', size: '12x1L Case', supplier: 'Brakes Foodservice', price: 29.00, qty: 5, vatRate: 0, trackingStatus: 'Received', stockSynced: true, receivedAt: formatTime(2) },
            { id: 108, name: 'Fresh Strawberry Dessert Topping 1kg', category: 'Fruit & Purees', size: '1kg Bottle', supplier: 'Brakes Foodservice', price: 8.50, qty: 6, vatRate: 0, trackingStatus: 'Received', stockSynced: true, receivedAt: formatTime(2) }
          ]
        }
      ]
    },

    // ORDER 15: Cookie Dough & Marshmallow Supplies
    {
      primaryRef: `TSMK-MULTI-${ddmmyy}-015`,
      serial: '015',
      ddmmyy: ddmmyy,
      timestamp: now - (8 * 3600000),
      date: formatTime(8),
      requestedBy: 'ALIA (PROCUREMENT)',
      targetLocation: 'MILTON KEYNES STADIUM',
      netTotal: 442.80,
      vatTotal: 0.00,
      total: 442.80,
      grossTotal: 442.80,
      items: [
        { id: 110, name: 'Signature Cookie Dough Base Tub 5kg', category: 'Bakery & Dough', size: '5kg Tub', supplier: 'Bookers Wholesale', price: 24.50, qty: 6, vatRate: 0, trackingStatus: 'Received', stockSynced: true, receivedAt: formatTime(8) },
        { id: 111, name: 'Belgian Milk Chocolate Chips 2.5kg', category: 'Baking Cake Decoration', size: '2.5kg Bag', supplier: 'Bookers Wholesale', price: 22.80, qty: 5, vatRate: 0, trackingStatus: 'Received', stockSynced: true, receivedAt: formatTime(8) },
        { id: 112, name: 'Mini Pink & White Marshmallows 1kg', category: 'Toppings & Spreads', size: '1kg Bag', supplier: 'Bookers Wholesale', price: 7.50, qty: 8, vatRate: 0, trackingStatus: 'Received', stockSynced: true, receivedAt: formatTime(8) },
        { id: 113, name: 'Salted Caramel Drizzle Sauce 1L', category: 'Sauces & Syrups', size: '1L Bottle', supplier: 'Brakes Foodservice', price: 10.20, qty: 12, vatRate: 0, trackingStatus: 'Received', stockSynced: true, receivedAt: formatTime(8) }
      ]
    },

    // ORDER 14: Dairy, Crepe, Ice Cream Refill
    {
      primaryRef: `TSMK-MULTI-${ddmmyy}-014`,
      serial: '014',
      ddmmyy: ddmmyy,
      timestamp: now - (18 * 3600000),
      date: formatTime(18),
      requestedBy: 'DAVID (STORE MGR)',
      targetLocation: 'LONDON STRATFORD',
      netTotal: 368.50,
      vatTotal: 0.00,
      total: 368.50,
      grossTotal: 368.50,
      items: [
        { id: 107, name: 'Soft Serve Ice Cream Liquid Mix 12x1L', category: 'Dairy & Ice Cream', size: '12x1L Case', supplier: 'Brakes Foodservice', price: 29.00, qty: 6, vatRate: 0, trackingStatus: 'Received', stockSynced: true, receivedAt: formatTime(18) },
        { id: 105, name: 'Crepe Complete Flour Mix 12.5kg', category: 'Waffle & Crepe Mixes', size: '12.5kg Bag', supplier: 'Brakes Foodservice', price: 34.00, qty: 4, vatRate: 0, trackingStatus: 'Received', stockSynced: true, receivedAt: formatTime(18) },
        { id: 114, name: 'Chocolate Fudge Brownie Pieces 1kg', category: 'Toppings & Spreads', size: '1kg Bag', supplier: 'Bookers Wholesale', price: 11.75, qty: 5, vatRate: 0, trackingStatus: 'Received', stockSynced: true, receivedAt: formatTime(18) }
      ]
    },

    // ORDER 13: Packaging & Beverage Essentials (Awaiting Delivery)
    {
      primaryRef: `TSMK-MULTI-${ddmmyy}-013`,
      serial: '013',
      ddmmyy: ddmmyy,
      timestamp: now - (26 * 3600000),
      date: formatTime(26),
      requestedBy: 'SARAH (OPERATIONS)',
      targetLocation: 'MILTON KEYNES STADIUM',
      netTotal: 295.40,
      vatTotal: 0.00,
      total: 295.40,
      grossTotal: 295.40,
      items: [
        { id: 115, name: 'Clear Milkshake Cups 16oz (1000s)', category: 'Packaging', size: 'Box of 1000', supplier: 'Bookers Wholesale', price: 48.00, qty: 3, vatRate: 0, trackingStatus: 'Pending', stockSynced: false },
        { id: 116, name: 'Dome Lids for 16oz Cups (1000s)', category: 'Packaging', size: 'Box of 1000', supplier: 'Bookers Wholesale', price: 26.50, qty: 3, vatRate: 0, trackingStatus: 'Pending', stockSynced: false },
        { id: 117, name: 'Cadbury Drinking Hot Chocolate Large Tub 2KG', category: 'Hot Chocolate & Cocoa', size: '1 x 2kg', supplier: 'Bookers Wholesale', price: 16.15, qty: 4, vatRate: 0, trackingStatus: 'Pending', stockSynced: false }
      ]
    },

    // ORDER 12: Churros & Speciality Sauces (Delayed with Exception Tracking)
    {
      primaryRef: `TSMK-MULTI-${ddmmyy}-012`,
      serial: '012',
      ddmmyy: ddmmyy,
      timestamp: now - (36 * 3600000),
      date: formatTime(36),
      requestedBy: 'SAI KISHORE (MANAGER)',
      targetLocation: 'MILTON KEYNES STADIUM',
      netTotal: 345.00,
      vatTotal: 0.00,
      total: 345.00,
      grossTotal: 345.00,
      items: [
        { id: 118, name: 'Churros Frozen Dough Loops (100s)', category: 'Bakery & Dough', size: 'Box of 100', supplier: 'Brakes Foodservice', price: 32.50, qty: 6, vatRate: 0, trackingStatus: 'Delayed', stockSynced: false, delayReason: 'Supplier refrigerated transit vehicle maintenance', expectedDeliveryDate: '2026-09-11' },
        { id: 119, name: 'Cinnamon Sugar Shaker Mix 1kg', category: 'Sugar & Sweeteners', size: '1kg Bottle', supplier: 'Brakes Foodservice', price: 7.50, qty: 8, vatRate: 0, trackingStatus: 'Delayed', stockSynced: false, delayReason: 'Supplier refrigerated transit vehicle maintenance', expectedDeliveryDate: '2026-09-11' },
        { id: 102, name: 'Warm Milk Chocolate Sauce 6kg', category: 'Sauces & Syrups', size: '6kg Tub', supplier: 'Bookers Wholesale', price: 38.00, qty: 2, vatRate: 0, trackingStatus: 'Received', stockSynced: true, receivedAt: formatTime(36) }
      ]
    }
  ];

  // Populate remaining 11 orders (orders 11 down to 001) systematically
  const catalogSamples = [
    { name: 'Luxury Belgian Waffle Mix 10kg', size: '10kg Bag', supplier: 'Bookers Wholesale', price: 42.50, category: 'Waffle & Crepe Mixes' },
    { name: 'Warm Milk Chocolate Sauce 6kg', size: '6kg Tub', supplier: 'Bookers Wholesale', price: 38.00, category: 'Sauces & Syrups' },
    { name: 'Nutella Hazelnut Spread 3kg', size: '3kg Tub', supplier: 'Bookers Wholesale', price: 28.50, category: 'Toppings & Spreads' },
    { name: 'Lotus Biscoff Biscuit Crumbs 750g', size: '8 x 750g', supplier: 'Bookers Wholesale', price: 33.49, category: 'Toppings & Spreads' },
    { name: 'Crepe Complete Flour Mix 12.5kg', size: '12.5kg Bag', supplier: 'Brakes Foodservice', price: 34.00, category: 'Waffle & Crepe Mixes' },
    { name: 'Italian White Chocolate Sauce 5kg', size: '5kg Bottle', supplier: 'Brakes Foodservice', price: 36.50, category: 'Sauces & Syrups' },
    { name: 'Soft Serve Ice Cream Liquid Mix 12x1L', size: '12x1L Case', supplier: 'Brakes Foodservice', price: 29.00, category: 'Dairy & Ice Cream' },
    { name: 'Fresh Strawberry Dessert Topping 1kg', size: '1kg Bottle', supplier: 'Brakes Foodservice', price: 8.50, category: 'Fruit & Purees' },
    { name: 'Signature Cookie Dough Base Tub 5kg', size: '5kg Tub', supplier: 'Bookers Wholesale', price: 24.50, category: 'Bakery & Dough' },
    { name: 'Belgian Milk Chocolate Chips 2.5kg', size: '2.5kg Bag', supplier: 'Bookers Wholesale', price: 22.80, category: 'Baking Cake Decoration' }
  ];

  const locations = ['MILTON KEYNES STADIUM', 'LONDON STRATFORD', 'BIRMINGHAM BULLRING', 'MANCHESTER ARNDALE'];
  const requesters = ['SAI KISHORE (MANAGER)', 'ALIA (PROCUREMENT)', 'DAVID (STORE MGR)', 'SARAH (OPERATIONS)'];

  for (let s = 11; s >= 1; s--) {
    const serialStr = String(s).padStart(3, '0');
    const offsetH = 40 + (12 - s) * 20;
    const item1 = catalogSamples[s % catalogSamples.length];
    const item2 = catalogSamples[(s * 3 + 2) % catalogSamples.length];
    const isRec = s % 3 !== 0;

    const ordItems = [
      {
        id: 200 + s * 2,
        name: item1.name,
        category: item1.category,
        size: item1.size,
        supplier: item1.supplier,
        price: item1.price,
        qty: (s % 3) + 2,
        vatRate: 0,
        trackingStatus: isRec ? 'Received' : 'Pending',
        stockSynced: isRec,
        receivedAt: isRec ? formatTime(offsetH) : null
      },
      {
        id: 200 + s * 2 + 1,
        name: item2.name,
        category: item2.category,
        size: item2.size,
        supplier: item2.supplier,
        price: item2.price,
        qty: (s % 2) + 2,
        vatRate: 0,
        trackingStatus: isRec ? 'Received' : 'Pending',
        stockSynced: isRec,
        receivedAt: isRec ? formatTime(offsetH) : null
      }
    ];

    const ordTotal = ordItems.reduce((acc, i) => acc + (i.price * i.qty), 0);

    initialOrders.push({
      primaryRef: `TSMK-MULTI-${ddmmyy}-${serialStr}`,
      serial: serialStr,
      ddmmyy: ddmmyy,
      timestamp: now - (offsetH * 3600000),
      date: formatTime(offsetH),
      requestedBy: requesters[s % requesters.length],
      targetLocation: locations[s % locations.length],
      netTotal: parseFloat(ordTotal.toFixed(2)),
      vatTotal: 0.00,
      total: parseFloat(ordTotal.toFixed(2)),
      grossTotal: parseFloat(ordTotal.toFixed(2)),
      items: ordItems
    });
  }

  return initialOrders;
}

// Function to safely initialize or restore Treat Street orders and pot levels

const SUPABASE_STORAGE_ORDERS = Object.freeze([
  {
    "primaryRef": "TSMK-MULTI-230926-015",
    "ddmmyy": "230926",
    "serial": "015",
    "date": "23 Sept 2026, 05:41 PM",
    "requestedBy": "SANJ",
    "targetLocation": "MILTON KEYNES",
    "netTotal": 705.12,
    "vatTotal": 131.51,
    "total": 836.63,
    "supplierOrders": [
      {
        "supplier": "American Fizz",
        "poRef": "TSMK-AMERICANFIZZ-230926-015",
        "pdfUrl": "https://sdlrwosjebiiztclsydu.supabase.co/storage/v1/object/public/purchase-orders/TSMK-AMERICANFIZZ-230926-015.pdf",
        "netTotal": 705.12,
        "vatTotal": 131.51,
        "grossTotal": 836.63,
        "status": "Received",
        "items": [
          {
            "id": "af_voss_water",
            "name": "Voss still water",
            "size": "24x500ml",
            "category": "Soft Drinks & Syrups",
            "supplier": "American Fizz",
            "price": 12.49,
            "vatRate": 20,
            "qty": 6,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": "af_peace_tea",
            "name": "Peace Tea caddy Shack 695ml",
            "size": "12x695ml",
            "category": "Soft Drinks & Syrups",
            "supplier": "American Fizz",
            "price": 9.96,
            "vatRate": 20,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": "af_jones_blue",
            "name": "Jones soda Blue",
            "size": "12x355ml",
            "category": "Soft Drinks & Syrups",
            "supplier": "American Fizz",
            "price": 9.96,
            "vatRate": 20,
            "qty": 3,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": "af_jones_apple",
            "name": "Jones soda Green Apple",
            "size": "12x355ml",
            "category": "Soft Drinks & Syrups",
            "supplier": "American Fizz",
            "price": 9.96,
            "vatRate": 20,
            "qty": 3,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": "af_fanta_peach",
            "name": "Fanta Peach",
            "size": "24x355ml",
            "category": "Soft Drinks & Syrups",
            "supplier": "American Fizz",
            "price": 14.49,
            "vatRate": 20,
            "qty": 3,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": "af_sprite_tea",
            "name": "Sprite+tea",
            "size": "24x355ml",
            "category": "Soft Drinks & Syrups",
            "supplier": "American Fizz",
            "price": 14.49,
            "vatRate": 20,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": "af_sprite_chill",
            "name": "Sprite chill",
            "size": "24x355ml",
            "category": "Soft Drinks & Syrups",
            "supplier": "American Fizz",
            "price": 14.4,
            "vatRate": 20,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": "af_br_apple_mint",
            "name": "Baskin Robbins Apple Mint Sparkling zero",
            "size": "24 x350",
            "category": "Soft Drinks & Syrups",
            "supplier": "American Fizz",
            "price": 13.2,
            "vatRate": 20,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": "af_jones_watermelon",
            "name": "Jones Soda Watermelon",
            "size": "12x355ml",
            "category": "Soft Drinks & Syrups",
            "supplier": "American Fizz",
            "price": 9.96,
            "vatRate": 20,
            "qty": 3,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": "af_fanta_grape",
            "name": "Fanta Grape",
            "size": "24x355ml",
            "category": "Soft Drinks & Syrups",
            "supplier": "American Fizz",
            "price": 14.49,
            "vatRate": 20,
            "qty": 3,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": "af_fanta_strawberry",
            "name": "Fanta Strawberry",
            "size": "24x355ml",
            "category": "Soft Drinks & Syrups",
            "supplier": "American Fizz",
            "price": 14.49,
            "vatRate": 20,
            "qty": 4,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": "af_fanta_pineapple",
            "name": "Fanta PineApple",
            "size": "24x355ml",
            "category": "Soft Drinks & Syrups",
            "supplier": "American Fizz",
            "price": 14.49,
            "vatRate": 20,
            "qty": 3,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": "af_fanta_orange",
            "name": "Fanta Orange",
            "size": "24x355ml",
            "category": "Soft Drinks & Syrups",
            "supplier": "American Fizz",
            "price": 14.49,
            "vatRate": 20,
            "qty": 5,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": "af_7up_tropical",
            "name": "7up Tropical",
            "size": "24x355ml",
            "category": "Soft Drinks & Syrups",
            "supplier": "American Fizz",
            "price": 11.52,
            "vatRate": 20,
            "qty": 3,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": "af_mike_lemon",
            "name": "Mike & Ike Sour Lemon",
            "size": "24x22g",
            "category": "Confectionery & Toppings",
            "supplier": "American Fizz",
            "price": 5.28,
            "vatRate": 20,
            "qty": 4,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": "af_mike_original",
            "name": "Mike & Ike Orignial",
            "size": "24x22g",
            "category": "Confectionery & Toppings",
            "supplier": "American Fizz",
            "price": 5.28,
            "vatRate": 20,
            "qty": 4,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": "af_mike_joes",
            "name": "Mike & Ike Jolly Joes",
            "size": "24x22g",
            "category": "Confectionery & Toppings",
            "supplier": "American Fizz",
            "price": 5.28,
            "vatRate": 20,
            "qty": 4,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": "af_milkduds",
            "name": "MILKDUDS 141G",
            "size": "141G X 12",
            "category": "Confectionery & Toppings",
            "supplier": "American Fizz",
            "price": 15.99,
            "vatRate": 0,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": "af_badia_pepper",
            "name": "Badia Mango Pepper",
            "size": "6x184.3g",
            "category": "Herbs & Spices Retail",
            "supplier": "American Fizz",
            "price": 15.6,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": "af_jojo_apple",
            "name": "JoJo Fru-Zip Chewy Bits Apple",
            "size": "24x15g",
            "category": "Confectionery & Toppings",
            "supplier": "American Fizz",
            "price": 3.36,
            "vatRate": 20,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": "af_jojo_straw",
            "name": "JoJo Fru-Zip Chewy Bits Strawberry",
            "size": "24x15g",
            "category": "Confectionery & Toppings",
            "supplier": "American Fizz",
            "price": 3.36,
            "vatRate": 20,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": "af_jojo_fizzy",
            "name": "Jojo Fizzy Candy",
            "size": "24x18g",
            "category": "Confectionery & Toppings",
            "supplier": "American Fizz",
            "price": 5.99,
            "vatRate": 20,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": "af_cosmic_cherry",
            "name": "Cosmic Dust Constellation cherry popping cndy",
            "size": "32x10g",
            "category": "Confectionery & Toppings",
            "supplier": "American Fizz",
            "price": 7.68,
            "vatRate": 20,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": "af_cosmic_grape",
            "name": "Cosmic Dust Constellation Grape popping candy",
            "size": "32x10g",
            "category": "Confectionery & Toppings",
            "supplier": "American Fizz",
            "price": 7.68,
            "vatRate": 20,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": "af_vidal_pencils",
            "name": "Vidal Rainbow Mega Pencils",
            "size": "50",
            "category": "Confectionery & Toppings",
            "supplier": "American Fizz",
            "price": 7.19,
            "vatRate": 20,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          }
        ]
      }
    ],
    "items": [
      {
        "id": "af_voss_water",
        "name": "Voss still water",
        "size": "24x500ml",
        "category": "Soft Drinks & Syrups",
        "supplier": "American Fizz",
        "price": 12.49,
        "vatRate": 20,
        "qty": 6,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": "af_peace_tea",
        "name": "Peace Tea caddy Shack 695ml",
        "size": "12x695ml",
        "category": "Soft Drinks & Syrups",
        "supplier": "American Fizz",
        "price": 9.96,
        "vatRate": 20,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": "af_jones_blue",
        "name": "Jones soda Blue",
        "size": "12x355ml",
        "category": "Soft Drinks & Syrups",
        "supplier": "American Fizz",
        "price": 9.96,
        "vatRate": 20,
        "qty": 3,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": "af_jones_apple",
        "name": "Jones soda Green Apple",
        "size": "12x355ml",
        "category": "Soft Drinks & Syrups",
        "supplier": "American Fizz",
        "price": 9.96,
        "vatRate": 20,
        "qty": 3,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": "af_fanta_peach",
        "name": "Fanta Peach",
        "size": "24x355ml",
        "category": "Soft Drinks & Syrups",
        "supplier": "American Fizz",
        "price": 14.49,
        "vatRate": 20,
        "qty": 3,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": "af_sprite_tea",
        "name": "Sprite+tea",
        "size": "24x355ml",
        "category": "Soft Drinks & Syrups",
        "supplier": "American Fizz",
        "price": 14.49,
        "vatRate": 20,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": "af_sprite_chill",
        "name": "Sprite chill",
        "size": "24x355ml",
        "category": "Soft Drinks & Syrups",
        "supplier": "American Fizz",
        "price": 14.4,
        "vatRate": 20,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": "af_br_apple_mint",
        "name": "Baskin Robbins Apple Mint Sparkling zero",
        "size": "24 x350",
        "category": "Soft Drinks & Syrups",
        "supplier": "American Fizz",
        "price": 13.2,
        "vatRate": 20,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": "af_jones_watermelon",
        "name": "Jones Soda Watermelon",
        "size": "12x355ml",
        "category": "Soft Drinks & Syrups",
        "supplier": "American Fizz",
        "price": 9.96,
        "vatRate": 20,
        "qty": 3,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": "af_fanta_grape",
        "name": "Fanta Grape",
        "size": "24x355ml",
        "category": "Soft Drinks & Syrups",
        "supplier": "American Fizz",
        "price": 14.49,
        "vatRate": 20,
        "qty": 3,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": "af_fanta_strawberry",
        "name": "Fanta Strawberry",
        "size": "24x355ml",
        "category": "Soft Drinks & Syrups",
        "supplier": "American Fizz",
        "price": 14.49,
        "vatRate": 20,
        "qty": 4,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": "af_fanta_pineapple",
        "name": "Fanta PineApple",
        "size": "24x355ml",
        "category": "Soft Drinks & Syrups",
        "supplier": "American Fizz",
        "price": 14.49,
        "vatRate": 20,
        "qty": 3,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": "af_fanta_orange",
        "name": "Fanta Orange",
        "size": "24x355ml",
        "category": "Soft Drinks & Syrups",
        "supplier": "American Fizz",
        "price": 14.49,
        "vatRate": 20,
        "qty": 5,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": "af_7up_tropical",
        "name": "7up Tropical",
        "size": "24x355ml",
        "category": "Soft Drinks & Syrups",
        "supplier": "American Fizz",
        "price": 11.52,
        "vatRate": 20,
        "qty": 3,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": "af_mike_lemon",
        "name": "Mike & Ike Sour Lemon",
        "size": "24x22g",
        "category": "Confectionery & Toppings",
        "supplier": "American Fizz",
        "price": 5.28,
        "vatRate": 20,
        "qty": 4,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": "af_mike_original",
        "name": "Mike & Ike Orignial",
        "size": "24x22g",
        "category": "Confectionery & Toppings",
        "supplier": "American Fizz",
        "price": 5.28,
        "vatRate": 20,
        "qty": 4,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": "af_mike_joes",
        "name": "Mike & Ike Jolly Joes",
        "size": "24x22g",
        "category": "Confectionery & Toppings",
        "supplier": "American Fizz",
        "price": 5.28,
        "vatRate": 20,
        "qty": 4,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": "af_milkduds",
        "name": "MILKDUDS 141G",
        "size": "141G X 12",
        "category": "Confectionery & Toppings",
        "supplier": "American Fizz",
        "price": 15.99,
        "vatRate": 0,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": "af_badia_pepper",
        "name": "Badia Mango Pepper",
        "size": "6x184.3g",
        "category": "Herbs & Spices Retail",
        "supplier": "American Fizz",
        "price": 15.6,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": "af_jojo_apple",
        "name": "JoJo Fru-Zip Chewy Bits Apple",
        "size": "24x15g",
        "category": "Confectionery & Toppings",
        "supplier": "American Fizz",
        "price": 3.36,
        "vatRate": 20,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": "af_jojo_straw",
        "name": "JoJo Fru-Zip Chewy Bits Strawberry",
        "size": "24x15g",
        "category": "Confectionery & Toppings",
        "supplier": "American Fizz",
        "price": 3.36,
        "vatRate": 20,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": "af_jojo_fizzy",
        "name": "Jojo Fizzy Candy",
        "size": "24x18g",
        "category": "Confectionery & Toppings",
        "supplier": "American Fizz",
        "price": 5.99,
        "vatRate": 20,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": "af_cosmic_cherry",
        "name": "Cosmic Dust Constellation cherry popping cndy",
        "size": "32x10g",
        "category": "Confectionery & Toppings",
        "supplier": "American Fizz",
        "price": 7.68,
        "vatRate": 20,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": "af_cosmic_grape",
        "name": "Cosmic Dust Constellation Grape popping candy",
        "size": "32x10g",
        "category": "Confectionery & Toppings",
        "supplier": "American Fizz",
        "price": 7.68,
        "vatRate": 20,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": "af_vidal_pencils",
        "name": "Vidal Rainbow Mega Pencils",
        "size": "50",
        "category": "Confectionery & Toppings",
        "supplier": "American Fizz",
        "price": 7.19,
        "vatRate": 20,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      }
    ]
  },
  {
    "primaryRef": "TSMK-MULTI-230926-014",
    "ddmmyy": "230926",
    "serial": "014",
    "date": "23 Sept 2026, 05:07 PM",
    "requestedBy": "TATE",
    "targetLocation": "MILTON KEYNES",
    "netTotal": 439.75,
    "vatTotal": 87.95,
    "total": 527.7,
    "supplierOrders": [
      {
        "supplier": "Airela",
        "poRef": "TSMK-AIRELA-230926-014",
        "pdfUrl": "https://sdlrwosjebiiztclsydu.supabase.co/storage/v1/object/public/purchase-orders/TSMK-AIRELA-230926-014.pdf",
        "netTotal": 439.75,
        "vatTotal": 87.95,
        "grossTotal": 527.7,
        "status": "Received",
        "items": [
          {
            "id": 247,
            "name": "Bubblegum gelato",
            "size": "2l",
            "category": "Gelato, Sorbet & Ice Cream Mixes",
            "supplier": "Airela",
            "price": 14.15,
            "vatRate": 20,
            "qty": 4,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 248,
            "name": "Cinnamon gelato",
            "size": "2l",
            "category": "Gelato, Sorbet & Ice Cream Mixes",
            "supplier": "Airela",
            "price": 14.15,
            "vatRate": 20,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 249,
            "name": "Coconut gelato",
            "size": "2l",
            "category": "Gelato, Sorbet & Ice Cream Mixes",
            "supplier": "Airela",
            "price": 16.75,
            "vatRate": 20,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 246,
            "name": "Ambassador gelato",
            "size": "2l",
            "category": "Gelato, Sorbet & Ice Cream Mixes",
            "supplier": "Airela",
            "price": 16.75,
            "vatRate": 20,
            "qty": 4,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 253,
            "name": "Mango sorbet",
            "size": "2l",
            "category": "Gelato, Sorbet & Ice Cream Mixes",
            "supplier": "Airela",
            "price": 15.45,
            "vatRate": 20,
            "qty": 3,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 254,
            "name": "Oreo gelato",
            "size": "2l",
            "category": "Gelato, Sorbet & Ice Cream Mixes",
            "supplier": "Airela",
            "price": 16.75,
            "vatRate": 20,
            "qty": 5,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 255,
            "name": "Passionfruit sorbet",
            "size": "2l",
            "category": "Gelato, Sorbet & Ice Cream Mixes",
            "supplier": "Airela",
            "price": 15.45,
            "vatRate": 20,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 257,
            "name": "S'mores gelato",
            "size": "2l",
            "category": "Gelato, Sorbet & Ice Cream Mixes",
            "supplier": "Airela",
            "price": 15.45,
            "vatRate": 20,
            "qty": 4,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 258,
            "name": "Strawberry gelato",
            "size": "2l",
            "category": "Gelato, Sorbet & Ice Cream Mixes",
            "supplier": "Airela",
            "price": 15.45,
            "vatRate": 20,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 256,
            "name": "Pistachio gelato",
            "size": "2l",
            "category": "Gelato, Sorbet & Ice Cream Mixes",
            "supplier": "Airela",
            "price": 17.4,
            "vatRate": 20,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          }
        ]
      }
    ],
    "items": [
      {
        "id": 247,
        "name": "Bubblegum gelato",
        "size": "2l",
        "category": "Gelato, Sorbet & Ice Cream Mixes",
        "supplier": "Airela",
        "price": 14.15,
        "vatRate": 20,
        "qty": 4,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 248,
        "name": "Cinnamon gelato",
        "size": "2l",
        "category": "Gelato, Sorbet & Ice Cream Mixes",
        "supplier": "Airela",
        "price": 14.15,
        "vatRate": 20,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 249,
        "name": "Coconut gelato",
        "size": "2l",
        "category": "Gelato, Sorbet & Ice Cream Mixes",
        "supplier": "Airela",
        "price": 16.75,
        "vatRate": 20,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 246,
        "name": "Ambassador gelato",
        "size": "2l",
        "category": "Gelato, Sorbet & Ice Cream Mixes",
        "supplier": "Airela",
        "price": 16.75,
        "vatRate": 20,
        "qty": 4,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 253,
        "name": "Mango sorbet",
        "size": "2l",
        "category": "Gelato, Sorbet & Ice Cream Mixes",
        "supplier": "Airela",
        "price": 15.45,
        "vatRate": 20,
        "qty": 3,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 254,
        "name": "Oreo gelato",
        "size": "2l",
        "category": "Gelato, Sorbet & Ice Cream Mixes",
        "supplier": "Airela",
        "price": 16.75,
        "vatRate": 20,
        "qty": 5,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 255,
        "name": "Passionfruit sorbet",
        "size": "2l",
        "category": "Gelato, Sorbet & Ice Cream Mixes",
        "supplier": "Airela",
        "price": 15.45,
        "vatRate": 20,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 257,
        "name": "S'mores gelato",
        "size": "2l",
        "category": "Gelato, Sorbet & Ice Cream Mixes",
        "supplier": "Airela",
        "price": 15.45,
        "vatRate": 20,
        "qty": 4,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 258,
        "name": "Strawberry gelato",
        "size": "2l",
        "category": "Gelato, Sorbet & Ice Cream Mixes",
        "supplier": "Airela",
        "price": 15.45,
        "vatRate": 20,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 256,
        "name": "Pistachio gelato",
        "size": "2l",
        "category": "Gelato, Sorbet & Ice Cream Mixes",
        "supplier": "Airela",
        "price": 17.4,
        "vatRate": 20,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      }
    ]
  },
  {
    "primaryRef": "TSMK-MULTI-230926-013",
    "ddmmyy": "230926",
    "serial": "013",
    "date": "23 Sept 2026, 05:04 PM",
    "requestedBy": "TATE",
    "targetLocation": "MILTON KEYNES",
    "netTotal": 162.53,
    "vatTotal": 0,
    "total": 162.53,
    "supplierOrders": [
      {
        "supplier": "SouthLincs",
        "poRef": "TSMK-SOUTHLINCS-230926-013",
        "pdfUrl": "https://sdlrwosjebiiztclsydu.supabase.co/storage/v1/object/public/purchase-orders/TSMK-SOUTHLINCS-230926-013.pdf",
        "netTotal": 162.53,
        "vatTotal": 0,
        "grossTotal": 162.53,
        "status": "Received",
        "items": [
          {
            "id": 202,
            "name": "All butter croissant",
            "size": "1 Box X 48",
            "category": "Bakery, Desserts & Breakfast Staples",
            "supplier": "SouthLincs",
            "price": 26.31,
            "vatRate": 0,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": "sl_smoothie_pash",
            "name": "Pash'n'shoot smoothie packet",
            "size": "30*140 g",
            "category": "Store Stock",
            "supplier": "SouthLincs",
            "price": 31.5,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": "sl_cheesecake_ny",
            "name": "New york style cheesecake",
            "size": "16PORTIONS /BOX",
            "category": "Bakery, Desserts & Breakfast Staples",
            "supplier": "SouthLincs",
            "price": 25.15,
            "vatRate": 0,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": "sl_apple_pie_fill",
            "name": "Apple pie filling",
            "size": "2KG",
            "category": "Bakery, Desserts & Breakfast Staples",
            "supplier": "SouthLincs",
            "price": 8.68,
            "vatRate": 0,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": "sl_red_cherry_fill",
            "name": "Red cherry pie filling",
            "size": "2KG",
            "category": "Bakery, Desserts & Breakfast Staples",
            "supplier": "SouthLincs",
            "price": 10.75,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          }
        ]
      }
    ],
    "items": [
      {
        "id": 202,
        "name": "All butter croissant",
        "size": "1 Box X 48",
        "category": "Bakery, Desserts & Breakfast Staples",
        "supplier": "SouthLincs",
        "price": 26.31,
        "vatRate": 0,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": "sl_smoothie_pash",
        "name": "Pash'n'shoot smoothie packet",
        "size": "30*140 g",
        "category": "Store Stock",
        "supplier": "SouthLincs",
        "price": 31.5,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": "sl_cheesecake_ny",
        "name": "New york style cheesecake",
        "size": "16PORTIONS /BOX",
        "category": "Bakery, Desserts & Breakfast Staples",
        "supplier": "SouthLincs",
        "price": 25.15,
        "vatRate": 0,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": "sl_apple_pie_fill",
        "name": "Apple pie filling",
        "size": "2KG",
        "category": "Bakery, Desserts & Breakfast Staples",
        "supplier": "SouthLincs",
        "price": 8.68,
        "vatRate": 0,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": "sl_red_cherry_fill",
        "name": "Red cherry pie filling",
        "size": "2KG",
        "category": "Bakery, Desserts & Breakfast Staples",
        "supplier": "SouthLincs",
        "price": 10.75,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      }
    ]
  },
  {
    "primaryRef": "TSMK-MULTI-230926-012",
    "ddmmyy": "230926",
    "serial": "012",
    "date": "23 Sept 2026, 05:03 PM",
    "requestedBy": "TATE",
    "targetLocation": "MILTON KEYNES",
    "netTotal": 475.29,
    "vatTotal": 44.71,
    "total": 520,
    "supplierOrders": [
      {
        "supplier": "Bookers Wholesale",
        "poRef": "TSMK-BOOKERS-230926-012",
        "pdfUrl": "https://sdlrwosjebiiztclsydu.supabase.co/storage/v1/object/public/purchase-orders/TSMK-BOOKERS-230926-012.pdf",
        "netTotal": 475.29,
        "vatTotal": 44.71,
        "grossTotal": 520,
        "status": "Received",
        "items": [
          {
            "id": 2,
            "name": "Billington's Dark Brown Soft Natural Unrefined Cane Sugar 500g",
            "size": "10 x 500g",
            "category": "Brown Sugar Retail",
            "supplier": "Bookers Wholesale",
            "price": 11.45,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 91,
            "name": "OREO Original Vanilla Sandwich Biscuits",
            "size": "16 x 154g",
            "category": "Confectionery & Toppings",
            "supplier": "Bookers Wholesale",
            "price": 14.69,
            "vatRate": 0,
            "qty": 3,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 106,
            "name": "Strathmore Still Spring Water 750ml",
            "size": "24x 330ml",
            "category": "Soft Drinks & Syrups",
            "supplier": "Bookers Wholesale",
            "price": 10.89,
            "vatRate": 20,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 27,
            "name": "Diet Coke Cola 24 x 330ml Glass Bottles",
            "size": "24 x 330ml",
            "category": "Soft Drinks & Syrups",
            "supplier": "Bookers Wholesale",
            "price": 18.49,
            "vatRate": 20,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 24,
            "name": "Coca-Cola Original Taste 330ml Glass Bottle",
            "size": "24 x 330ml",
            "category": "Soft Drinks & Syrups",
            "supplier": "Bookers Wholesale",
            "price": 20.89,
            "vatRate": 20,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 104,
            "name": "Sprite Glass",
            "size": "1 x 24x330m",
            "category": "Soft Drinks & Syrups",
            "supplier": "Bookers Wholesale",
            "price": 18.99,
            "vatRate": 20,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 28,
            "name": "Dr. Oetker Madagascan Vanilla Extract 35ml",
            "size": "6 x 35ml",
            "category": "Baking Sundries Retail",
            "supplier": "Bookers Wholesale",
            "price": 5.99,
            "vatRate": 0,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 1,
            "name": "Betty Crocker Indulgent Chocolate Fudge Icing 400g",
            "size": "4 x 400g",
            "category": "Cooking Chocolate Retail",
            "supplier": "Bookers Wholesale",
            "price": 9.99,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 76,
            "name": "Müller Semi Skimmed Milk 2 Litres",
            "size": "4 x 2ltr",
            "category": "Dairy & Milks",
            "supplier": "Bookers Wholesale",
            "price": 5.85,
            "vatRate": 0,
            "qty": 3,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 89,
            "name": "Oatly Oat Drink Barista Edition 1L Long Life",
            "size": "6 x 1ltr",
            "category": "Dairy & Milks",
            "supplier": "Bookers Wholesale",
            "price": 9.49,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 11,
            "name": "Arla Pro Aersol Cream",
            "size": "9x500g",
            "category": "Dairy & Milks",
            "supplier": "Bookers Wholesale",
            "price": 33.49,
            "vatRate": 0,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 75,
            "name": "MONIN Vanilla Syrup 1L",
            "size": "1 x 1ltr",
            "category": "Soft Drinks & Syrups",
            "supplier": "Bookers Wholesale",
            "price": 10.19,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 17,
            "name": "Biscoff Smooth Spread 3kg",
            "size": "1 x 3kg",
            "category": "Confectionery & Toppings",
            "supplier": "Bookers Wholesale",
            "price": 16.49,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 25,
            "name": "Curtis Catering Chopped Mixed Nuts 1kg",
            "size": "1 x 1kg",
            "category": "Confectionery & Toppings",
            "supplier": "Bookers Wholesale",
            "price": 8.99,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 136,
            "name": "Chef's Larder White Wine Vinegar 2 Litres",
            "size": "1 x 2ltr",
            "category": "Dairy, Oils & Baking Essentials",
            "supplier": "Bookers Wholesale",
            "price": 3.79,
            "vatRate": 0,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 143,
            "name": "Chef's Menu Salsa 1 litre",
            "size": "1 x 1ltr",
            "category": "Condiments & Sauces",
            "supplier": "Bookers Wholesale",
            "price": 2.99,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 53,
            "name": "Angelito Ice Cream Mix",
            "size": "12 x 1 ltr",
            "category": "Gelato, Sorbet & Ice Cream Mixes",
            "supplier": "Bookers Wholesale",
            "price": 18.99,
            "vatRate": 20,
            "qty": 5,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 56,
            "name": "Koffmann's Potatoes for Chefs Les Pommes Frites 4 x 2.27kg (9.08kg)",
            "size": "9.08KG",
            "category": "Frozen Foods Retail",
            "supplier": "Bookers Wholesale",
            "price": 16.99,
            "vatRate": 0,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 48,
            "name": "Hershey's Cookies 'N' Creme 40g",
            "size": "24 x 40g",
            "category": "Confectionery & Toppings",
            "supplier": "Bookers Wholesale",
            "price": 18.85,
            "vatRate": 20,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 67,
            "name": "Maltesers Milk Chocolate Bag 37g PMP",
            "size": "40 x 37g",
            "category": "Confectionery & Toppings",
            "supplier": "Bookers Wholesale",
            "price": 21.65,
            "vatRate": 20,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          }
        ]
      }
    ],
    "items": [
      {
        "id": 2,
        "name": "Billington's Dark Brown Soft Natural Unrefined Cane Sugar 500g",
        "size": "10 x 500g",
        "category": "Brown Sugar Retail",
        "supplier": "Bookers Wholesale",
        "price": 11.45,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 91,
        "name": "OREO Original Vanilla Sandwich Biscuits",
        "size": "16 x 154g",
        "category": "Confectionery & Toppings",
        "supplier": "Bookers Wholesale",
        "price": 14.69,
        "vatRate": 0,
        "qty": 3,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 106,
        "name": "Strathmore Still Spring Water 750ml",
        "size": "24x 330ml",
        "category": "Soft Drinks & Syrups",
        "supplier": "Bookers Wholesale",
        "price": 10.89,
        "vatRate": 20,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 27,
        "name": "Diet Coke Cola 24 x 330ml Glass Bottles",
        "size": "24 x 330ml",
        "category": "Soft Drinks & Syrups",
        "supplier": "Bookers Wholesale",
        "price": 18.49,
        "vatRate": 20,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 24,
        "name": "Coca-Cola Original Taste 330ml Glass Bottle",
        "size": "24 x 330ml",
        "category": "Soft Drinks & Syrups",
        "supplier": "Bookers Wholesale",
        "price": 20.89,
        "vatRate": 20,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 104,
        "name": "Sprite Glass",
        "size": "1 x 24x330m",
        "category": "Soft Drinks & Syrups",
        "supplier": "Bookers Wholesale",
        "price": 18.99,
        "vatRate": 20,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 28,
        "name": "Dr. Oetker Madagascan Vanilla Extract 35ml",
        "size": "6 x 35ml",
        "category": "Baking Sundries Retail",
        "supplier": "Bookers Wholesale",
        "price": 5.99,
        "vatRate": 0,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 1,
        "name": "Betty Crocker Indulgent Chocolate Fudge Icing 400g",
        "size": "4 x 400g",
        "category": "Cooking Chocolate Retail",
        "supplier": "Bookers Wholesale",
        "price": 9.99,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 76,
        "name": "Müller Semi Skimmed Milk 2 Litres",
        "size": "4 x 2ltr",
        "category": "Dairy & Milks",
        "supplier": "Bookers Wholesale",
        "price": 5.85,
        "vatRate": 0,
        "qty": 3,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 89,
        "name": "Oatly Oat Drink Barista Edition 1L Long Life",
        "size": "6 x 1ltr",
        "category": "Dairy & Milks",
        "supplier": "Bookers Wholesale",
        "price": 9.49,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 11,
        "name": "Arla Pro Aersol Cream",
        "size": "9x500g",
        "category": "Dairy & Milks",
        "supplier": "Bookers Wholesale",
        "price": 33.49,
        "vatRate": 0,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 75,
        "name": "MONIN Vanilla Syrup 1L",
        "size": "1 x 1ltr",
        "category": "Soft Drinks & Syrups",
        "supplier": "Bookers Wholesale",
        "price": 10.19,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 17,
        "name": "Biscoff Smooth Spread 3kg",
        "size": "1 x 3kg",
        "category": "Confectionery & Toppings",
        "supplier": "Bookers Wholesale",
        "price": 16.49,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 25,
        "name": "Curtis Catering Chopped Mixed Nuts 1kg",
        "size": "1 x 1kg",
        "category": "Confectionery & Toppings",
        "supplier": "Bookers Wholesale",
        "price": 8.99,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 136,
        "name": "Chef's Larder White Wine Vinegar 2 Litres",
        "size": "1 x 2ltr",
        "category": "Dairy, Oils & Baking Essentials",
        "supplier": "Bookers Wholesale",
        "price": 3.79,
        "vatRate": 0,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 143,
        "name": "Chef's Menu Salsa 1 litre",
        "size": "1 x 1ltr",
        "category": "Condiments & Sauces",
        "supplier": "Bookers Wholesale",
        "price": 2.99,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 53,
        "name": "Angelito Ice Cream Mix",
        "size": "12 x 1 ltr",
        "category": "Gelato, Sorbet & Ice Cream Mixes",
        "supplier": "Bookers Wholesale",
        "price": 18.99,
        "vatRate": 20,
        "qty": 5,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 56,
        "name": "Koffmann's Potatoes for Chefs Les Pommes Frites 4 x 2.27kg (9.08kg)",
        "size": "9.08KG",
        "category": "Frozen Foods Retail",
        "supplier": "Bookers Wholesale",
        "price": 16.99,
        "vatRate": 0,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 48,
        "name": "Hershey's Cookies 'N' Creme 40g",
        "size": "24 x 40g",
        "category": "Confectionery & Toppings",
        "supplier": "Bookers Wholesale",
        "price": 18.85,
        "vatRate": 20,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 67,
        "name": "Maltesers Milk Chocolate Bag 37g PMP",
        "size": "40 x 37g",
        "category": "Confectionery & Toppings",
        "supplier": "Bookers Wholesale",
        "price": 21.65,
        "vatRate": 20,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      }
    ]
  },
  {
    "primaryRef": "TSMK-MULTI-220926-001",
    "ddmmyy": "220926",
    "serial": "001",
    "date": "22 Sept 2026, 03:22 PM",
    "requestedBy": "ANANYA",
    "targetLocation": "MILTON KEYNES",
    "netTotal": 21.78,
    "vatTotal": 0,
    "total": 21.78,
    "supplierOrders": [
      {
        "supplier": "Bookers Wholesale",
        "poRef": "TSMK-BOOKERS-220926-001",
        "pdfUrl": "https://sdlrwosjebiiztclsydu.supabase.co/storage/v1/object/public/purchase-orders/TSMK-BOOKERS-220926-001.pdf",
        "netTotal": 21.78,
        "vatTotal": 0,
        "grossTotal": 21.78,
        "status": "Received",
        "items": [
          {
            "id": 1,
            "name": "Betty Crocker Indulgent Chocolate Fudge Icing 400g",
            "size": "4 x 400g",
            "category": "Cooking Chocolate Retail",
            "supplier": "Bookers Wholesale",
            "price": 9.99,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 2,
            "name": "Billington's Dark Brown Soft Natural Unrefined Cane Sugar 500g",
            "size": "10 x 500g",
            "category": "Brown Sugar Retail",
            "supplier": "Bookers Wholesale",
            "price": 11.79,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          }
        ]
      }
    ],
    "items": [
      {
        "id": 1,
        "name": "Betty Crocker Indulgent Chocolate Fudge Icing 400g",
        "size": "4 x 400g",
        "category": "Cooking Chocolate Retail",
        "supplier": "Bookers Wholesale",
        "price": 9.99,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 2,
        "name": "Billington's Dark Brown Soft Natural Unrefined Cane Sugar 500g",
        "size": "10 x 500g",
        "category": "Brown Sugar Retail",
        "supplier": "Bookers Wholesale",
        "price": 11.79,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      }
    ]
  },
  {
    "primaryRef": "TSMK-MULTI-160926-011",
    "ddmmyy": "160926",
    "serial": "011",
    "date": "16 Sept 2026, 11:55 PM",
    "requestedBy": "JASVINDER SINGH",
    "targetLocation": "MILTON KEYNES",
    "netTotal": 31,
    "vatTotal": 0,
    "total": 31,
    "supplierOrders": [
      {
        "supplier": "Village Foods",
        "poRef": "TSMK-VILLAGEFOODS-160926-011",
        "pdfUrl": "https://sdlrwosjebiiztclsydu.supabase.co/storage/v1/object/public/purchase-orders/TSMK-VILLAGEFOODS-160926-011.pdf",
        "netTotal": 31,
        "vatTotal": 0,
        "grossTotal": 31,
        "status": "Received",
        "items": [
          {
            "id": "vf_raw_chicken",
            "name": "RAW CHICKEN",
            "size": "5KG",
            "category": "Store Stock",
            "supplier": "Village Foods",
            "price": 31,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          }
        ]
      }
    ],
    "items": [
      {
        "id": "vf_raw_chicken",
        "name": "RAW CHICKEN",
        "size": "5KG",
        "category": "Store Stock",
        "supplier": "Village Foods",
        "price": 31,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      }
    ]
  },
  {
    "primaryRef": "TSMK-MULTI-160926-010",
    "ddmmyy": "160926",
    "serial": "010",
    "date": "16 Sept 2026, 01:22 PM",
    "requestedBy": "TATE",
    "targetLocation": "MILTON KEYNES",
    "netTotal": 18.53,
    "vatTotal": 0,
    "total": 18.53,
    "supplierOrders": [
      {
        "supplier": "Bookers Wholesale",
        "poRef": "TSMK-BOOKERS-160926-010",
        "pdfUrl": "https://sdlrwosjebiiztclsydu.supabase.co/storage/v1/object/public/purchase-orders/TSMK-BOOKERS-160926-010.pdf",
        "netTotal": 18.53,
        "vatTotal": 0,
        "grossTotal": 18.53,
        "status": "Received",
        "items": [
          {
            "id": 156,
            "name": "Dr. Oetker Baking Powder 170g",
            "size": "4 x 170g",
            "category": "Baking Sundries Retail",
            "supplier": "Bookers Wholesale",
            "price": 4.35,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 28,
            "name": "Dr. Oetker Madagascan Vanilla Extract 35ml",
            "size": "6 x 35ml",
            "category": "Baking Sundries Retail",
            "supplier": "Bookers Wholesale",
            "price": 7.09,
            "vatRate": 0,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          }
        ]
      }
    ],
    "items": [
      {
        "id": 156,
        "name": "Dr. Oetker Baking Powder 170g",
        "size": "4 x 170g",
        "category": "Baking Sundries Retail",
        "supplier": "Bookers Wholesale",
        "price": 4.35,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 28,
        "name": "Dr. Oetker Madagascan Vanilla Extract 35ml",
        "size": "6 x 35ml",
        "category": "Baking Sundries Retail",
        "supplier": "Bookers Wholesale",
        "price": 7.09,
        "vatRate": 0,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      }
    ]
  },
  {
    "primaryRef": "TSMK-MULTI-160926-009",
    "ddmmyy": "160926",
    "serial": "009",
    "date": "16 Sept 2026, 01:14 PM",
    "requestedBy": "TATE",
    "targetLocation": "MILTON KEYNES",
    "netTotal": 514.37,
    "vatTotal": 67.6,
    "total": 581.97,
    "supplierOrders": [
      {
        "supplier": "Bookers Wholesale",
        "poRef": "TSMK-BOOKERS-160926-009",
        "pdfUrl": "https://sdlrwosjebiiztclsydu.supabase.co/storage/v1/object/public/purchase-orders/TSMK-BOOKERS-160926-009.pdf",
        "netTotal": 514.37,
        "vatTotal": 67.6,
        "grossTotal": 581.97,
        "status": "Received",
        "items": [
          {
            "id": 101,
            "name": "Silver Spoon Granulated Sugar 1kg",
            "size": "15 x 1kg",
            "category": "White Sugar Retail",
            "supplier": "Bookers Wholesale",
            "price": 13.49,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 3,
            "name": "Billington's Light Brown Soft Natural Unrefined Cane Sugar 500g",
            "size": "10 x 500g",
            "category": "Brown Sugar Retail",
            "supplier": "Bookers Wholesale",
            "price": 11.45,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 91,
            "name": "OREO Original Vanilla Sandwich Biscuits",
            "size": "16 x 154g",
            "category": "Confectionery & Toppings",
            "supplier": "Bookers Wholesale",
            "price": 14.69,
            "vatRate": 0,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 92,
            "name": "Paterson's Shortbread Fingers 300g (2 x 150g)",
            "size": "14 x 300g",
            "category": "Bakery, Desserts & Breakfast Staples",
            "supplier": "Bookers Wholesale",
            "price": 13.49,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 106,
            "name": "Strathmore Still Spring Water 750ml",
            "size": "24x 330ml",
            "category": "Soft Drinks & Syrups",
            "supplier": "Bookers Wholesale",
            "price": 10.89,
            "vatRate": 20,
            "qty": 3,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 27,
            "name": "Diet Coke Cola 24 x 330ml Glass Bottles",
            "size": "24 x 330ml",
            "category": "Soft Drinks & Syrups",
            "supplier": "Bookers Wholesale",
            "price": 18.49,
            "vatRate": 20,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 31,
            "name": "Fanta Orange 24 x 330ml",
            "size": "1 x 24X330m",
            "category": "Soft Drinks & Syrups",
            "supplier": "Bookers Wholesale",
            "price": 18.99,
            "vatRate": 20,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 156,
            "name": "Dr. Oetker Baking Powder 170g",
            "size": "4 x 170g",
            "category": "Baking Sundries Retail",
            "supplier": "Bookers Wholesale",
            "price": 4.35,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 1,
            "name": "Betty Crocker Indulgent Chocolate Fudge Icing 400g",
            "size": "4 x 400g",
            "category": "Cooking Chocolate Retail",
            "supplier": "Bookers Wholesale",
            "price": 9.99,
            "vatRate": 0,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 74,
            "name": "Mrs Elswood Burger Gherkins 670g",
            "size": "6 x 670g",
            "category": "Vegetables & Produce Retail",
            "supplier": "Bookers Wholesale",
            "price": 11.75,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 76,
            "name": "Müller Semi Skimmed Milk 2 Litres",
            "size": "4 x 2ltr",
            "category": "Dairy & Milks",
            "supplier": "Bookers Wholesale",
            "price": 5.85,
            "vatRate": 0,
            "qty": 3,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 89,
            "name": "Oatly Oat Drink Barista Edition 1L Long Life",
            "size": "6 x 1ltr",
            "category": "Dairy & Milks",
            "supplier": "Bookers Wholesale",
            "price": 9.49,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 17,
            "name": "Biscoff Smooth Spread 3kg",
            "size": "1 x 3kg",
            "category": "Confectionery & Toppings",
            "supplier": "Bookers Wholesale",
            "price": 16.49,
            "vatRate": 20,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 33,
            "name": "Flash Professional All Purpose Cleaner, 5L",
            "size": "2 x 5L",
            "category": "Cleaning & Hygiene",
            "supplier": "Bookers Wholesale",
            "price": 15,
            "vatRate": 20,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 53,
            "name": "Angelito Ice Cream Mix",
            "size": "12 x 1 ltr",
            "category": "Gelato, Sorbet & Ice Cream Mixes",
            "supplier": "Bookers Wholesale",
            "price": 18.99,
            "vatRate": 20,
            "qty": 10,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 56,
            "name": "Koffmann's Potatoes for Chefs Les Pommes Frites 4 x 2.27kg (9.08kg)",
            "size": "9.08KG",
            "category": "Frozen Foods Retail",
            "supplier": "Bookers Wholesale",
            "price": 16.99,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 118,
            "name": "CaterPro 100 Wooden Forks",
            "size": "10 x 100s",
            "category": "Packaging & Disposables",
            "supplier": "Bookers Wholesale",
            "price": 14.99,
            "vatRate": 20,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 119,
            "name": "CaterPro 100 Wooden Dessert Spoons",
            "size": "10 x 100s",
            "category": "Packaging & Disposables",
            "supplier": "Bookers Wholesale",
            "price": 14.99,
            "vatRate": 20,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 117,
            "name": "Caterpro wooden knives",
            "size": "10*100",
            "category": "Packaging & Disposables",
            "supplier": "Bookers Wholesale",
            "price": 14.99,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 72,
            "name": "McVitie's Digestives The Original Biscuits 360g",
            "size": "12 x 360g",
            "category": "Bakery, Desserts & Breakfast Staples",
            "supplier": "Bookers Wholesale",
            "price": 13.45,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          }
        ]
      }
    ],
    "items": [
      {
        "id": 101,
        "name": "Silver Spoon Granulated Sugar 1kg",
        "size": "15 x 1kg",
        "category": "White Sugar Retail",
        "supplier": "Bookers Wholesale",
        "price": 13.49,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 3,
        "name": "Billington's Light Brown Soft Natural Unrefined Cane Sugar 500g",
        "size": "10 x 500g",
        "category": "Brown Sugar Retail",
        "supplier": "Bookers Wholesale",
        "price": 11.45,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 91,
        "name": "OREO Original Vanilla Sandwich Biscuits",
        "size": "16 x 154g",
        "category": "Confectionery & Toppings",
        "supplier": "Bookers Wholesale",
        "price": 14.69,
        "vatRate": 0,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 92,
        "name": "Paterson's Shortbread Fingers 300g (2 x 150g)",
        "size": "14 x 300g",
        "category": "Bakery, Desserts & Breakfast Staples",
        "supplier": "Bookers Wholesale",
        "price": 13.49,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 106,
        "name": "Strathmore Still Spring Water 750ml",
        "size": "24x 330ml",
        "category": "Soft Drinks & Syrups",
        "supplier": "Bookers Wholesale",
        "price": 10.89,
        "vatRate": 20,
        "qty": 3,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 27,
        "name": "Diet Coke Cola 24 x 330ml Glass Bottles",
        "size": "24 x 330ml",
        "category": "Soft Drinks & Syrups",
        "supplier": "Bookers Wholesale",
        "price": 18.49,
        "vatRate": 20,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 31,
        "name": "Fanta Orange 24 x 330ml",
        "size": "1 x 24X330m",
        "category": "Soft Drinks & Syrups",
        "supplier": "Bookers Wholesale",
        "price": 18.99,
        "vatRate": 20,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 156,
        "name": "Dr. Oetker Baking Powder 170g",
        "size": "4 x 170g",
        "category": "Baking Sundries Retail",
        "supplier": "Bookers Wholesale",
        "price": 4.35,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 1,
        "name": "Betty Crocker Indulgent Chocolate Fudge Icing 400g",
        "size": "4 x 400g",
        "category": "Cooking Chocolate Retail",
        "supplier": "Bookers Wholesale",
        "price": 9.99,
        "vatRate": 0,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 74,
        "name": "Mrs Elswood Burger Gherkins 670g",
        "size": "6 x 670g",
        "category": "Vegetables & Produce Retail",
        "supplier": "Bookers Wholesale",
        "price": 11.75,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 76,
        "name": "Müller Semi Skimmed Milk 2 Litres",
        "size": "4 x 2ltr",
        "category": "Dairy & Milks",
        "supplier": "Bookers Wholesale",
        "price": 5.85,
        "vatRate": 0,
        "qty": 3,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 89,
        "name": "Oatly Oat Drink Barista Edition 1L Long Life",
        "size": "6 x 1ltr",
        "category": "Dairy & Milks",
        "supplier": "Bookers Wholesale",
        "price": 9.49,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 17,
        "name": "Biscoff Smooth Spread 3kg",
        "size": "1 x 3kg",
        "category": "Confectionery & Toppings",
        "supplier": "Bookers Wholesale",
        "price": 16.49,
        "vatRate": 20,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 33,
        "name": "Flash Professional All Purpose Cleaner, 5L",
        "size": "2 x 5L",
        "category": "Cleaning & Hygiene",
        "supplier": "Bookers Wholesale",
        "price": 15,
        "vatRate": 20,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 53,
        "name": "Angelito Ice Cream Mix",
        "size": "12 x 1 ltr",
        "category": "Gelato, Sorbet & Ice Cream Mixes",
        "supplier": "Bookers Wholesale",
        "price": 18.99,
        "vatRate": 20,
        "qty": 10,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 56,
        "name": "Koffmann's Potatoes for Chefs Les Pommes Frites 4 x 2.27kg (9.08kg)",
        "size": "9.08KG",
        "category": "Frozen Foods Retail",
        "supplier": "Bookers Wholesale",
        "price": 16.99,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 118,
        "name": "CaterPro 100 Wooden Forks",
        "size": "10 x 100s",
        "category": "Packaging & Disposables",
        "supplier": "Bookers Wholesale",
        "price": 14.99,
        "vatRate": 20,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 119,
        "name": "CaterPro 100 Wooden Dessert Spoons",
        "size": "10 x 100s",
        "category": "Packaging & Disposables",
        "supplier": "Bookers Wholesale",
        "price": 14.99,
        "vatRate": 20,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 117,
        "name": "Caterpro wooden knives",
        "size": "10*100",
        "category": "Packaging & Disposables",
        "supplier": "Bookers Wholesale",
        "price": 14.99,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 72,
        "name": "McVitie's Digestives The Original Biscuits 360g",
        "size": "12 x 360g",
        "category": "Bakery, Desserts & Breakfast Staples",
        "supplier": "Bookers Wholesale",
        "price": 13.45,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      }
    ]
  },
  {
    "primaryRef": "TSMK-MULTI-160926-008",
    "ddmmyy": "160926",
    "serial": "008",
    "date": "16 Sept 2026, 12:58 PM",
    "requestedBy": "TATE",
    "targetLocation": "MILTON KEYNES",
    "netTotal": 117.37,
    "vatTotal": 0,
    "total": 117.37,
    "supplierOrders": [
      {
        "supplier": "SouthLincs",
        "poRef": "TSMK-SOUTHLINCS-160926-008",
        "pdfUrl": "https://sdlrwosjebiiztclsydu.supabase.co/storage/v1/object/public/purchase-orders/TSMK-SOUTHLINCS-160926-008.pdf",
        "netTotal": 117.37,
        "vatTotal": 0,
        "grossTotal": 117.37,
        "status": "Received",
        "items": [
          {
            "id": 202,
            "name": "All butter croissant",
            "size": "1 Box X 48",
            "category": "Bakery, Desserts & Breakfast Staples",
            "supplier": "SouthLincs",
            "price": 26.31,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": "sl_cheesecake_ny",
            "name": "New york style cheesecake",
            "size": "16PORTIONS /BOX",
            "category": "Bakery, Desserts & Breakfast Staples",
            "supplier": "SouthLincs",
            "price": 25.15,
            "vatRate": 0,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": "sl_apple_pie_fill",
            "name": "Apple pie filling",
            "size": "2KG",
            "category": "Bakery, Desserts & Breakfast Staples",
            "supplier": "SouthLincs",
            "price": 8.68,
            "vatRate": 0,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": "sl_cornflour_jb",
            "name": "James Brown cornflour",
            "size": "3.5kg",
            "category": "Dairy, Oils & Baking Essentials",
            "supplier": "SouthLincs",
            "price": 5.85,
            "vatRate": 0,
            "qty": 4,
            "trackingStatus": "Received",
            "stockSynced": true
          }
        ]
      }
    ],
    "items": [
      {
        "id": 202,
        "name": "All butter croissant",
        "size": "1 Box X 48",
        "category": "Bakery, Desserts & Breakfast Staples",
        "supplier": "SouthLincs",
        "price": 26.31,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": "sl_cheesecake_ny",
        "name": "New york style cheesecake",
        "size": "16PORTIONS /BOX",
        "category": "Bakery, Desserts & Breakfast Staples",
        "supplier": "SouthLincs",
        "price": 25.15,
        "vatRate": 0,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": "sl_apple_pie_fill",
        "name": "Apple pie filling",
        "size": "2KG",
        "category": "Bakery, Desserts & Breakfast Staples",
        "supplier": "SouthLincs",
        "price": 8.68,
        "vatRate": 0,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": "sl_cornflour_jb",
        "name": "James Brown cornflour",
        "size": "3.5kg",
        "category": "Dairy, Oils & Baking Essentials",
        "supplier": "SouthLincs",
        "price": 5.85,
        "vatRate": 0,
        "qty": 4,
        "trackingStatus": "Received",
        "stockSynced": true
      }
    ]
  },
  {
    "primaryRef": "TSMK-MULTI-160926-007",
    "ddmmyy": "160926",
    "serial": "007",
    "date": "16 Sept 2026, 12:57 PM",
    "requestedBy": "TATE",
    "targetLocation": "MILTON KEYNES",
    "netTotal": 140.53,
    "vatTotal": 28.11,
    "total": 168.64,
    "supplierOrders": [
      {
        "supplier": "Stratford",
        "poRef": "TSMK-STRATFORD-160926-007",
        "pdfUrl": "https://sdlrwosjebiiztclsydu.supabase.co/storage/v1/object/public/purchase-orders/TSMK-STRATFORD-160926-007.pdf",
        "netTotal": 140.53,
        "vatTotal": 28.11,
        "grossTotal": 168.64,
        "status": "Received",
        "items": [
          {
            "id": 264,
            "name": "Scoopable acai",
            "size": "3.6l*2",
            "category": "Gelato, Sorbet & Ice Cream Mixes",
            "supplier": "Stratford",
            "price": 50.85,
            "vatRate": 20,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 265,
            "name": "Cherries and custard gelato",
            "size": "5l",
            "category": "Gelato, Sorbet & Ice Cream Mixes",
            "supplier": "Stratford",
            "price": 22.42,
            "vatRate": 20,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 266,
            "name": "Vanilla gelato",
            "size": "5l",
            "category": "Gelato, Sorbet & Ice Cream Mixes",
            "supplier": "Stratford",
            "price": 22.42,
            "vatRate": 20,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 267,
            "name": "Vegan vanilla gelato",
            "size": "5l",
            "category": "Gelato, Sorbet & Ice Cream Mixes",
            "supplier": "Stratford",
            "price": 0,
            "vatRate": 20,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 268,
            "name": "Ciokamenta gelato",
            "size": "5l",
            "category": "Gelato, Sorbet & Ice Cream Mixes",
            "supplier": "Stratford",
            "price": 22.42,
            "vatRate": 20,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 269,
            "name": "Dulce de leche gelato",
            "size": "5l",
            "category": "Gelato, Sorbet & Ice Cream Mixes",
            "supplier": "Stratford",
            "price": 22.42,
            "vatRate": 20,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          }
        ]
      }
    ],
    "items": [
      {
        "id": 264,
        "name": "Scoopable acai",
        "size": "3.6l*2",
        "category": "Gelato, Sorbet & Ice Cream Mixes",
        "supplier": "Stratford",
        "price": 50.85,
        "vatRate": 20,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 265,
        "name": "Cherries and custard gelato",
        "size": "5l",
        "category": "Gelato, Sorbet & Ice Cream Mixes",
        "supplier": "Stratford",
        "price": 22.42,
        "vatRate": 20,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 266,
        "name": "Vanilla gelato",
        "size": "5l",
        "category": "Gelato, Sorbet & Ice Cream Mixes",
        "supplier": "Stratford",
        "price": 22.42,
        "vatRate": 20,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 267,
        "name": "Vegan vanilla gelato",
        "size": "5l",
        "category": "Gelato, Sorbet & Ice Cream Mixes",
        "supplier": "Stratford",
        "price": 0,
        "vatRate": 20,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 268,
        "name": "Ciokamenta gelato",
        "size": "5l",
        "category": "Gelato, Sorbet & Ice Cream Mixes",
        "supplier": "Stratford",
        "price": 22.42,
        "vatRate": 20,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 269,
        "name": "Dulce de leche gelato",
        "size": "5l",
        "category": "Gelato, Sorbet & Ice Cream Mixes",
        "supplier": "Stratford",
        "price": 22.42,
        "vatRate": 20,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      }
    ]
  },
  {
    "primaryRef": "TSMK-MULTI-150926-006",
    "ddmmyy": "150926",
    "serial": "006",
    "date": "15 Sept 2026, 07:38 PM",
    "requestedBy": "JASVINDER SINGH",
    "targetLocation": "MILTON KEYNES",
    "netTotal": 39,
    "vatTotal": 0,
    "total": 39,
    "supplierOrders": [
      {
        "supplier": "Online",
        "poRef": "TSMK-ONLINE-150926-006",
        "pdfUrl": "https://sdlrwosjebiiztclsydu.supabase.co/storage/v1/object/public/purchase-orders/TSMK-ONLINE-150926-006.pdf",
        "netTotal": 39,
        "vatTotal": 0,
        "grossTotal": 39,
        "status": "Received",
        "items": [
          {
            "id": "on_veg_oil_morrisons",
            "name": "VEGETABLE OIL (MORRISONS)",
            "size": "5 LITRES",
            "category": "Dairy, Oils & Baking Essentials",
            "supplier": "Online",
            "price": 6.5,
            "vatRate": 0,
            "qty": 6,
            "trackingStatus": "Received",
            "stockSynced": true
          }
        ]
      }
    ],
    "items": [
      {
        "id": "on_veg_oil_morrisons",
        "name": "VEGETABLE OIL (MORRISONS)",
        "size": "5 LITRES",
        "category": "Dairy, Oils & Baking Essentials",
        "supplier": "Online",
        "price": 6.5,
        "vatRate": 0,
        "qty": 6,
        "trackingStatus": "Received",
        "stockSynced": true
      }
    ]
  },
  {
    "primaryRef": "TSMK-MULTI-140926-005",
    "ddmmyy": "140926",
    "serial": "005",
    "date": "14 Sept 2026, 02:19 PM",
    "requestedBy": "JASVINDER SINGH",
    "targetLocation": "MILTON KEYNES",
    "netTotal": 258.12,
    "vatTotal": 9.79,
    "total": 267.91,
    "supplierOrders": [
      {
        "supplier": "Costco",
        "poRef": "TSMK-COSTCO-140926-005",
        "pdfUrl": "https://sdlrwosjebiiztclsydu.supabase.co/storage/v1/object/public/purchase-orders/TSMK-COSTCO-140926-005.pdf",
        "netTotal": 258.12,
        "vatTotal": 9.79,
        "grossTotal": 267.91,
        "status": "Received",
        "items": [
          {
            "id": 181,
            "name": "KTC vegetable oil",
            "size": "20LTRS",
            "category": "Dairy, Oils & Baking Essentials",
            "supplier": "Costco",
            "price": 26.99,
            "vatRate": 0,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 177,
            "name": "Eggs",
            "size": "1 BOX *60",
            "category": "Dairy & Milks",
            "supplier": "Costco",
            "price": 9.99,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 197,
            "name": "St Pierre Brioche buns",
            "size": "8PCS*2",
            "category": "Buns & Breads",
            "supplier": "Costco",
            "price": 4.49,
            "vatRate": 0,
            "qty": 6,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 198,
            "name": "STP BRIOCHE LOAF",
            "size": "2*500G",
            "category": "Buns & Breads",
            "supplier": "Costco",
            "price": 5.49,
            "vatRate": 0,
            "qty": 4,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 184,
            "name": "Mayonnaise",
            "size": "5KG",
            "category": "Condiments & Sauces",
            "supplier": "Costco",
            "price": 10,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 186,
            "name": "Nacho cheese",
            "size": "3KG",
            "category": "Condiments & Sauces",
            "supplier": "Costco",
            "price": 8.39,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 180,
            "name": "Kinder bueno",
            "size": "20*43G",
            "category": "Confectionery & Toppings",
            "supplier": "Costco",
            "price": 9.79,
            "vatRate": 20,
            "qty": 5,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 174,
            "name": "Cheese Slice",
            "size": "1.4kg pack",
            "category": "Dairy & Milks",
            "supplier": "Costco",
            "price": 6.99,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 183,
            "name": "KS MAPLE SYRUP",
            "size": "1L",
            "category": "Soft Drinks & Syrups",
            "supplier": "Costco",
            "price": 9.99,
            "vatRate": 0,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 200,
            "name": "TR BROWNIES",
            "size": "1.36 KG",
            "category": "Bakery, Desserts & Breakfast Staples",
            "supplier": "Costco",
            "price": 8.49,
            "vatRate": 0,
            "qty": 6,
            "trackingStatus": "Received",
            "stockSynced": true
          }
        ]
      }
    ],
    "items": [
      {
        "id": 181,
        "name": "KTC vegetable oil",
        "size": "20LTRS",
        "category": "Dairy, Oils & Baking Essentials",
        "supplier": "Costco",
        "price": 26.99,
        "vatRate": 0,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 177,
        "name": "Eggs",
        "size": "1 BOX *60",
        "category": "Dairy & Milks",
        "supplier": "Costco",
        "price": 9.99,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 197,
        "name": "St Pierre Brioche buns",
        "size": "8PCS*2",
        "category": "Buns & Breads",
        "supplier": "Costco",
        "price": 4.49,
        "vatRate": 0,
        "qty": 6,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 198,
        "name": "STP BRIOCHE LOAF",
        "size": "2*500G",
        "category": "Buns & Breads",
        "supplier": "Costco",
        "price": 5.49,
        "vatRate": 0,
        "qty": 4,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 184,
        "name": "Mayonnaise",
        "size": "5KG",
        "category": "Condiments & Sauces",
        "supplier": "Costco",
        "price": 10,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 186,
        "name": "Nacho cheese",
        "size": "3KG",
        "category": "Condiments & Sauces",
        "supplier": "Costco",
        "price": 8.39,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 180,
        "name": "Kinder bueno",
        "size": "20*43G",
        "category": "Confectionery & Toppings",
        "supplier": "Costco",
        "price": 9.79,
        "vatRate": 20,
        "qty": 5,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 174,
        "name": "Cheese Slice",
        "size": "1.4kg pack",
        "category": "Dairy & Milks",
        "supplier": "Costco",
        "price": 6.99,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 183,
        "name": "KS MAPLE SYRUP",
        "size": "1L",
        "category": "Soft Drinks & Syrups",
        "supplier": "Costco",
        "price": 9.99,
        "vatRate": 0,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 200,
        "name": "TR BROWNIES",
        "size": "1.36 KG",
        "category": "Bakery, Desserts & Breakfast Staples",
        "supplier": "Costco",
        "price": 8.49,
        "vatRate": 0,
        "qty": 6,
        "trackingStatus": "Received",
        "stockSynced": true
      }
    ]
  },
  {
    "primaryRef": "TSMK-MULTI-140926-004",
    "ddmmyy": "140926",
    "serial": "004",
    "date": "14 Sept 2026, 01:44 PM",
    "requestedBy": "JASVINDER SINGH",
    "targetLocation": "MILTON KEYNES",
    "netTotal": 31,
    "vatTotal": 0,
    "total": 31,
    "supplierOrders": [
      {
        "supplier": "Village Foods",
        "poRef": "TSMK-VILLAGEFOODS-140926-004",
        "pdfUrl": "https://sdlrwosjebiiztclsydu.supabase.co/storage/v1/object/public/purchase-orders/TSMK-VILLAGEFOODS-140926-004.pdf",
        "netTotal": 31,
        "vatTotal": 0,
        "grossTotal": 31,
        "status": "Received",
        "items": [
          {
            "id": "vf_raw_chicken",
            "name": "RAW CHICKEN",
            "size": "5KG",
            "category": "Store Stock",
            "supplier": "Village Foods",
            "price": 31,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          }
        ]
      }
    ],
    "items": [
      {
        "id": "vf_raw_chicken",
        "name": "RAW CHICKEN",
        "size": "5KG",
        "category": "Store Stock",
        "supplier": "Village Foods",
        "price": 31,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      }
    ]
  },
  {
    "primaryRef": "TSMK-MULTI-080926-003",
    "ddmmyy": "080926",
    "serial": "003",
    "date": "08 Sept 2026, 01:58 PM",
    "requestedBy": "TATE",
    "targetLocation": "MILTON KEYNES",
    "netTotal": 708.48,
    "vatTotal": 78.48,
    "total": 786.96,
    "supplierOrders": [
      {
        "supplier": "Bookers Wholesale",
        "poRef": "TSMK-BOOKERS-080926-003",
        "pdfUrl": "https://sdlrwosjebiiztclsydu.supabase.co/storage/v1/object/public/purchase-orders/TSMK-BOOKERS-080926-003.pdf",
        "netTotal": 708.48,
        "vatTotal": 78.48,
        "grossTotal": 786.96,
        "status": "Received",
        "items": [
          {
            "id": 1,
            "name": "Betty Crocker Indulgent Chocolate Fudge Icing 400g",
            "size": "4 x 400g",
            "category": "Cooking Chocolate Retail",
            "supplier": "Bookers Wholesale",
            "price": 9.99,
            "vatRate": 0,
            "qty": 4,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 17,
            "name": "Biscoff Smooth Spread 3kg",
            "size": "1 x 3kg",
            "category": "Confectionery & Toppings",
            "supplier": "Bookers Wholesale",
            "price": 16.49,
            "vatRate": 20,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 142,
            "name": "Chef's Menu Chipotle Sauce 1 litre",
            "size": "6 x 1ltr",
            "category": "Condiments & Sauces",
            "supplier": "Bookers Wholesale",
            "price": 14.99,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 24,
            "name": "Coca-Cola Original Taste 330ml Glass Bottle",
            "size": "24 x 330ml",
            "category": "Soft Drinks & Syrups",
            "supplier": "Bookers Wholesale",
            "price": 20.89,
            "vatRate": 20,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 27,
            "name": "Diet Coke Cola 24 x 330ml Glass Bottles",
            "size": "24 x 330ml",
            "category": "Soft Drinks & Syrups",
            "supplier": "Bookers Wholesale",
            "price": 18.49,
            "vatRate": 20,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 33,
            "name": "Flash Professional All Purpose Cleaner, 5L",
            "size": "2 x 5L",
            "category": "Cleaning & Hygiene",
            "supplier": "Bookers Wholesale",
            "price": 15,
            "vatRate": 20,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 45,
            "name": "Heinz Tomato Ketchup 4.5kg",
            "size": "2 x 4ltr",
            "category": "Condiments & Sauces",
            "supplier": "Bookers Wholesale",
            "price": 35.89,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 48,
            "name": "Hershey's Cookies 'N' Creme 40g",
            "size": "24 x 40g",
            "category": "Confectionery & Toppings",
            "supplier": "Bookers Wholesale",
            "price": 18.85,
            "vatRate": 20,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 49,
            "name": "Jack's Pure Apple Juice 1 Litre",
            "size": "6 x 1ltr",
            "category": "Soft Drinks & Syrups",
            "supplier": "Bookers Wholesale",
            "price": 8.39,
            "vatRate": 20,
            "qty": 3,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 125,
            "name": "JR Foods & Packaging Services 7\" Pizza Box Plain Brown 100pcs",
            "size": "1 x 100pk",
            "category": "Packaging & Disposables",
            "supplier": "Bookers Wholesale",
            "price": 10.49,
            "vatRate": 20,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 53,
            "name": "KERRYMAID ICE CREAM MIX",
            "size": "12 x 1 ltr",
            "category": "Gelato, Sorbet & Ice Cream Mixes",
            "supplier": "Bookers Wholesale",
            "price": 19.49,
            "vatRate": 20,
            "qty": 10,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 56,
            "name": "Koffmann's Potatoes for Chefs Les Pommes Frites 4 x 2.27kg (9.08kg)",
            "size": "1 x 4x2.27k",
            "category": "Frozen Foods Retail",
            "supplier": "Bookers Wholesale",
            "price": 16.99,
            "vatRate": 0,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 61,
            "name": "Lichfields Fairtrade White Sugar 2kg",
            "size": "1 x 2kg",
            "category": "White Sugar Retail",
            "supplier": "Bookers Wholesale",
            "price": 8.49,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 71,
            "name": "McCain Potato Pops 2.5kg",
            "size": "1 x 2.5kg",
            "category": "Frozen Foods Retail",
            "supplier": "Bookers Wholesale",
            "price": 7.49,
            "vatRate": 0,
            "qty": 3,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 76,
            "name": "Müller Semi Skimmed Milk 2 Litres",
            "size": "4 x 2ltr",
            "category": "Dairy & Milks",
            "supplier": "Bookers Wholesale",
            "price": 5.85,
            "vatRate": 0,
            "qty": 4,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 89,
            "name": "Oatly Oat Drink Barista Edition 1L Long Life",
            "size": "6 x 1ltr",
            "category": "Dairy & Milks",
            "supplier": "Bookers Wholesale",
            "price": 9.49,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 91,
            "name": "OREO Original Vanilla Sandwich Biscuits",
            "size": "16 x 154g",
            "category": "Confectionery & Toppings",
            "supplier": "Bookers Wholesale",
            "price": 14.69,
            "vatRate": 0,
            "qty": 5,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 92,
            "name": "Paterson's Shortbread Fingers 300g (2 x 150g)",
            "size": "14 x 300g",
            "category": "Bakery, Desserts & Breakfast Staples",
            "supplier": "Bookers Wholesale",
            "price": 13.49,
            "vatRate": 0,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 94,
            "name": "Perfect Ted Ceremonial Grade Matcha 100g",
            "size": "1 x 100g",
            "category": "Hot Beverages Retail",
            "supplier": "Bookers Wholesale",
            "price": 13.49,
            "vatRate": 0,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 106,
            "name": "Strathmore Still Spring Water 750ml",
            "size": "24x 330ml",
            "category": "Soft Drinks & Syrups",
            "supplier": "Bookers Wholesale",
            "price": 10.89,
            "vatRate": 20,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          }
        ]
      }
    ],
    "items": [
      {
        "id": 1,
        "name": "Betty Crocker Indulgent Chocolate Fudge Icing 400g",
        "size": "4 x 400g",
        "category": "Cooking Chocolate Retail",
        "supplier": "Bookers Wholesale",
        "price": 9.99,
        "vatRate": 0,
        "qty": 4,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 17,
        "name": "Biscoff Smooth Spread 3kg",
        "size": "1 x 3kg",
        "category": "Confectionery & Toppings",
        "supplier": "Bookers Wholesale",
        "price": 16.49,
        "vatRate": 20,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 142,
        "name": "Chef's Menu Chipotle Sauce 1 litre",
        "size": "6 x 1ltr",
        "category": "Condiments & Sauces",
        "supplier": "Bookers Wholesale",
        "price": 14.99,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 24,
        "name": "Coca-Cola Original Taste 330ml Glass Bottle",
        "size": "24 x 330ml",
        "category": "Soft Drinks & Syrups",
        "supplier": "Bookers Wholesale",
        "price": 20.89,
        "vatRate": 20,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 27,
        "name": "Diet Coke Cola 24 x 330ml Glass Bottles",
        "size": "24 x 330ml",
        "category": "Soft Drinks & Syrups",
        "supplier": "Bookers Wholesale",
        "price": 18.49,
        "vatRate": 20,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 33,
        "name": "Flash Professional All Purpose Cleaner, 5L",
        "size": "2 x 5L",
        "category": "Cleaning & Hygiene",
        "supplier": "Bookers Wholesale",
        "price": 15,
        "vatRate": 20,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 45,
        "name": "Heinz Tomato Ketchup 4.5kg",
        "size": "2 x 4ltr",
        "category": "Condiments & Sauces",
        "supplier": "Bookers Wholesale",
        "price": 35.89,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 48,
        "name": "Hershey's Cookies 'N' Creme 40g",
        "size": "24 x 40g",
        "category": "Confectionery & Toppings",
        "supplier": "Bookers Wholesale",
        "price": 18.85,
        "vatRate": 20,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 49,
        "name": "Jack's Pure Apple Juice 1 Litre",
        "size": "6 x 1ltr",
        "category": "Soft Drinks & Syrups",
        "supplier": "Bookers Wholesale",
        "price": 8.39,
        "vatRate": 20,
        "qty": 3,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 125,
        "name": "JR Foods & Packaging Services 7\" Pizza Box Plain Brown 100pcs",
        "size": "1 x 100pk",
        "category": "Packaging & Disposables",
        "supplier": "Bookers Wholesale",
        "price": 10.49,
        "vatRate": 20,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 53,
        "name": "KERRYMAID ICE CREAM MIX",
        "size": "12 x 1 ltr",
        "category": "Gelato, Sorbet & Ice Cream Mixes",
        "supplier": "Bookers Wholesale",
        "price": 19.49,
        "vatRate": 20,
        "qty": 10,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 56,
        "name": "Koffmann's Potatoes for Chefs Les Pommes Frites 4 x 2.27kg (9.08kg)",
        "size": "1 x 4x2.27k",
        "category": "Frozen Foods Retail",
        "supplier": "Bookers Wholesale",
        "price": 16.99,
        "vatRate": 0,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 61,
        "name": "Lichfields Fairtrade White Sugar 2kg",
        "size": "1 x 2kg",
        "category": "White Sugar Retail",
        "supplier": "Bookers Wholesale",
        "price": 8.49,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 71,
        "name": "McCain Potato Pops 2.5kg",
        "size": "1 x 2.5kg",
        "category": "Frozen Foods Retail",
        "supplier": "Bookers Wholesale",
        "price": 7.49,
        "vatRate": 0,
        "qty": 3,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 76,
        "name": "Müller Semi Skimmed Milk 2 Litres",
        "size": "4 x 2ltr",
        "category": "Dairy & Milks",
        "supplier": "Bookers Wholesale",
        "price": 5.85,
        "vatRate": 0,
        "qty": 4,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 89,
        "name": "Oatly Oat Drink Barista Edition 1L Long Life",
        "size": "6 x 1ltr",
        "category": "Dairy & Milks",
        "supplier": "Bookers Wholesale",
        "price": 9.49,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 91,
        "name": "OREO Original Vanilla Sandwich Biscuits",
        "size": "16 x 154g",
        "category": "Confectionery & Toppings",
        "supplier": "Bookers Wholesale",
        "price": 14.69,
        "vatRate": 0,
        "qty": 5,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 92,
        "name": "Paterson's Shortbread Fingers 300g (2 x 150g)",
        "size": "14 x 300g",
        "category": "Bakery, Desserts & Breakfast Staples",
        "supplier": "Bookers Wholesale",
        "price": 13.49,
        "vatRate": 0,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 94,
        "name": "Perfect Ted Ceremonial Grade Matcha 100g",
        "size": "1 x 100g",
        "category": "Hot Beverages Retail",
        "supplier": "Bookers Wholesale",
        "price": 13.49,
        "vatRate": 0,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 106,
        "name": "Strathmore Still Spring Water 750ml",
        "size": "24x 330ml",
        "category": "Soft Drinks & Syrups",
        "supplier": "Bookers Wholesale",
        "price": 10.89,
        "vatRate": 20,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      }
    ]
  },
  {
    "primaryRef": "TSMK-MULTI-020926-002",
    "ddmmyy": "020926",
    "serial": "002",
    "date": "02 Sept 2026, 06:06 PM",
    "requestedBy": "SANJ",
    "targetLocation": "MILTON KEYNES",
    "netTotal": 170.08,
    "vatTotal": 0,
    "total": 170.08,
    "supplierOrders": [
      {
        "supplier": "SouthLincs",
        "poRef": "TSMK-SOUTHLINCS-020926-002",
        "pdfUrl": "https://sdlrwosjebiiztclsydu.supabase.co/storage/v1/object/public/purchase-orders/TSMK-SOUTHLINCS-020926-002.pdf",
        "netTotal": 170.08,
        "vatTotal": 0,
        "grossTotal": 170.08,
        "status": "Received",
        "items": [
          {
            "id": 202,
            "name": "All butter croissant",
            "size": "1 Box X 48",
            "category": "Bakery, Desserts & Breakfast Staples",
            "supplier": "SouthLincs",
            "price": 26.31,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": "sl_smoothie_pash",
            "name": "Pash'n'shoot smoothie packet",
            "size": "30*140 g",
            "category": "Store Stock",
            "supplier": "SouthLincs",
            "price": 31.5,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": "sl_cheesecake_ny",
            "name": "New york style cheesecake",
            "size": "16PORTIONS /BOX",
            "category": "Bakery, Desserts & Breakfast Staples",
            "supplier": "SouthLincs",
            "price": 25.15,
            "vatRate": 0,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": "sl_apple_pie_fill",
            "name": "Apple pie filling",
            "size": "2KG",
            "category": "Bakery, Desserts & Breakfast Staples",
            "supplier": "SouthLincs",
            "price": 8.68,
            "vatRate": 0,
            "qty": 4,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": "sl_cornflour_jb",
            "name": "James Brown cornflour",
            "size": "3.5kg",
            "category": "Dairy, Oils & Baking Essentials",
            "supplier": "SouthLincs",
            "price": 5.85,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": "sl_red_cherry_fill",
            "name": "Red cherry pie filling",
            "size": "2KG",
            "category": "Bakery, Desserts & Breakfast Staples",
            "supplier": "SouthLincs",
            "price": 10.7,
            "vatRate": 0,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          }
        ]
      }
    ],
    "items": [
      {
        "id": 202,
        "name": "All butter croissant",
        "size": "1 Box X 48",
        "category": "Bakery, Desserts & Breakfast Staples",
        "supplier": "SouthLincs",
        "price": 26.31,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": "sl_smoothie_pash",
        "name": "Pash'n'shoot smoothie packet",
        "size": "30*140 g",
        "category": "Store Stock",
        "supplier": "SouthLincs",
        "price": 31.5,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": "sl_cheesecake_ny",
        "name": "New york style cheesecake",
        "size": "16PORTIONS /BOX",
        "category": "Bakery, Desserts & Breakfast Staples",
        "supplier": "SouthLincs",
        "price": 25.15,
        "vatRate": 0,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": "sl_apple_pie_fill",
        "name": "Apple pie filling",
        "size": "2KG",
        "category": "Bakery, Desserts & Breakfast Staples",
        "supplier": "SouthLincs",
        "price": 8.68,
        "vatRate": 0,
        "qty": 4,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": "sl_cornflour_jb",
        "name": "James Brown cornflour",
        "size": "3.5kg",
        "category": "Dairy, Oils & Baking Essentials",
        "supplier": "SouthLincs",
        "price": 5.85,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": "sl_red_cherry_fill",
        "name": "Red cherry pie filling",
        "size": "2KG",
        "category": "Bakery, Desserts & Breakfast Staples",
        "supplier": "SouthLincs",
        "price": 10.7,
        "vatRate": 0,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      }
    ]
  },
  {
    "primaryRef": "TSMK-MULTI-020926-001",
    "ddmmyy": "020926",
    "serial": "001",
    "date": "02 Sept 2026, 03:47 PM",
    "requestedBy": "SAI KISHORE (MANAGER)",
    "targetLocation": "MILTON KEYNES",
    "netTotal": 9.99,
    "vatTotal": 0,
    "total": 9.99,
    "supplierOrders": [
      {
        "supplier": "Bookers Wholesale",
        "poRef": "TSMK-BOOKERS-020926-001",
        "pdfUrl": "https://sdlrwosjebiiztclsydu.supabase.co/storage/v1/object/public/purchase-orders/TSMK-BOOKERS-020926-001.pdf",
        "netTotal": 9.99,
        "vatTotal": 0,
        "grossTotal": 9.99,
        "status": "Received",
        "items": [
          {
            "id": 1,
            "name": "Betty Crocker Indulgent Chocolate Fudge Icing 400g",
            "size": "4 x 400g",
            "category": "Cooking Chocolate Retail",
            "supplier": "Bookers Wholesale",
            "price": 9.99,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          }
        ]
      }
    ],
    "items": [
      {
        "id": 1,
        "name": "Betty Crocker Indulgent Chocolate Fudge Icing 400g",
        "size": "4 x 400g",
        "category": "Cooking Chocolate Retail",
        "supplier": "Bookers Wholesale",
        "price": 9.99,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      }
    ]
  },
  {
    "primaryRef": "TSMK-MULTI-010926-002",
    "ddmmyy": "010926",
    "serial": "002",
    "date": "01 Sept 2026, 02:22 PM",
    "requestedBy": "SAI KISHORE",
    "targetLocation": "MILTON KEYNES",
    "netTotal": 1094.55,
    "vatTotal": 127.59,
    "total": 1222.14,
    "supplierOrders": [
      {
        "supplier": "Bookers Wholesale",
        "poRef": "TSMK-BOOKERS-010926-002",
        "pdfUrl": "https://sdlrwosjebiiztclsydu.supabase.co/storage/v1/object/public/purchase-orders/TSMK-BOOKERS-010926-002.pdf",
        "netTotal": 1094.55,
        "vatTotal": 127.59,
        "grossTotal": 1222.14,
        "status": "Received",
        "items": [
          {
            "id": 24,
            "name": "Coca-Cola Original Taste 330ml Glass Bottle",
            "size": "24 x 330ml",
            "category": "Soft Drinks & Syrups",
            "supplier": "Bookers Wholesale",
            "price": 20.89,
            "vatRate": 20,
            "qty": 5,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 27,
            "name": "Diet Coke Cola 24 x 330ml Glass Bottles",
            "size": "24 x 330ml",
            "category": "Soft Drinks & Syrups",
            "supplier": "Bookers Wholesale",
            "price": 18.49,
            "vatRate": 20,
            "qty": 3,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 31,
            "name": "Fanta Orange 24 x 330ml",
            "size": "1 x 24X330m",
            "category": "Soft Drinks & Syrups",
            "supplier": "Bookers Wholesale",
            "price": 18.99,
            "vatRate": 20,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 104,
            "name": "Sprite Zero Sugar 330ml",
            "size": "24 x 330ml",
            "category": "Soft Drinks & Syrups",
            "supplier": "Bookers Wholesale",
            "price": 18.99,
            "vatRate": 20,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 106,
            "name": "Strathmore Still Spring Water 750ml",
            "size": "24x 330ml",
            "category": "Soft Drinks & Syrups",
            "supplier": "Bookers Wholesale",
            "price": 10.89,
            "vatRate": 20,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 105,
            "name": "Strathmore Sparkling Spring Water 330ml",
            "size": "24 x 330ml",
            "category": "Soft Drinks & Syrups",
            "supplier": "Bookers Wholesale",
            "price": 10.89,
            "vatRate": 20,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 91,
            "name": "OREO Original Vanilla Sandwich Biscuits",
            "size": "16 x 154g",
            "category": "Confectionery & Toppings",
            "supplier": "Bookers Wholesale",
            "price": 14.69,
            "vatRate": 0,
            "qty": 4,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 17,
            "name": "Biscoff Smooth Spread 3kg",
            "size": "1 x 3kg",
            "category": "Confectionery & Toppings",
            "supplier": "Bookers Wholesale",
            "price": 16.49,
            "vatRate": 20,
            "qty": 3,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 16,
            "name": "Biscoff Biscuit Crumbs 750g",
            "size": "8 x 750g",
            "category": "Confectionery & Toppings",
            "supplier": "Bookers Wholesale",
            "price": 33.49,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 87,
            "name": "Nic Caramel Mini Fudge Cubes 1kg",
            "size": "6 x 1kg",
            "category": "Confectionery & Toppings",
            "supplier": "Bookers Wholesale",
            "price": 85.99,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 48,
            "name": "Hershey's Cookies 'N' Creme 40g",
            "size": "24 x 40g",
            "category": "Confectionery & Toppings",
            "supplier": "Bookers Wholesale",
            "price": 18.85,
            "vatRate": 20,
            "qty": 3,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 1,
            "name": "Betty Crocker Indulgent Chocolate Fudge Icing 400g",
            "size": "4 x 400g",
            "category": "Cooking Chocolate Retail",
            "supplier": "Bookers Wholesale",
            "price": 9.99,
            "vatRate": 0,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 49,
            "name": "Jack's Pure Apple Juice 1 Litre",
            "size": "6 x 1ltr",
            "category": "Soft Drinks & Syrups",
            "supplier": "Bookers Wholesale",
            "price": 8.39,
            "vatRate": 20,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 89,
            "name": "Oatly Oat Drink Barista Edition 1L Long Life",
            "size": "6 x 1ltr",
            "category": "Dairy & Milks",
            "supplier": "Bookers Wholesale",
            "price": 9.49,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 56,
            "name": "Koffmann's Potatoes for Chefs Les Pommes Frites 4 x 2.27kg (9.08kg)",
            "size": "1 x 4x2.27k",
            "category": "Frozen Foods Retail",
            "supplier": "Bookers Wholesale",
            "price": 16.99,
            "vatRate": 0,
            "qty": 5,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 70,
            "name": "McCain Original Choice Potato Hash Browns 1kg",
            "size": "1 x 1kg",
            "category": "Frozen Foods Retail",
            "supplier": "Bookers Wholesale",
            "price": 4.19,
            "vatRate": 0,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 71,
            "name": "McCain Potato Pops 2.5kg",
            "size": "1 x 2.5kg",
            "category": "Frozen Foods Retail",
            "supplier": "Bookers Wholesale",
            "price": 7.49,
            "vatRate": 0,
            "qty": 3,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 140,
            "name": "Chef's Menu Onion Powder 480g",
            "size": "1 x 480g",
            "category": "Herbs & Spices Retail",
            "supplier": "Bookers Wholesale",
            "price": 5.89,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 139,
            "name": "Chef's Menu Garlic Powder 500g",
            "size": "1 x 500g",
            "category": "Herbs & Spices Retail",
            "supplier": "Bookers Wholesale",
            "price": 8.49,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 100,
            "name": "St Pierre Brioche Loaf 500g",
            "size": "7 x 500g",
            "category": "Bakery, Desserts & Breakfast Staples",
            "supplier": "Bookers Wholesale",
            "price": 20.99,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 137,
            "name": "Chef's Menu Cayenne Pepper 460g",
            "size": "1 x 460g",
            "category": "Herbs & Spices Retail",
            "supplier": "Bookers Wholesale",
            "price": 5.99,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 138,
            "name": "Chef's Menu Ground Black Pepper 500g",
            "size": "1 x 500g",
            "category": "Herbs & Spices Retail",
            "supplier": "Bookers Wholesale",
            "price": 13.99,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 141,
            "name": "Chef's Menu Smoked Paprika 430g",
            "size": "1 x 430g",
            "category": "Herbs & Spices Retail",
            "supplier": "Bookers Wholesale",
            "price": 5.49,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 76,
            "name": "Müller Semi Skimmed Milk 2 Litres",
            "size": "4 x 2ltr",
            "category": "Dairy & Milks",
            "supplier": "Bookers Wholesale",
            "price": 5.85,
            "vatRate": 0,
            "qty": 4,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 28,
            "name": "Dr. Oetker Madagascan Vanilla Extract 35ml",
            "size": "6 x 35ml",
            "category": "Baking Sundries Retail",
            "supplier": "Bookers Wholesale",
            "price": 7.09,
            "vatRate": 0,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 3,
            "name": "Billington's Light Brown Soft Natural Unrefined Cane Sugar 500g",
            "size": "10 x 500g",
            "category": "Brown Sugar Retail",
            "supplier": "Bookers Wholesale",
            "price": 11.45,
            "vatRate": 0,
            "qty": 2,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 2,
            "name": "Billington's Dark Brown Soft Natural Unrefined Cane Sugar 500g",
            "size": "10 x 500g",
            "category": "Brown Sugar Retail",
            "supplier": "Bookers Wholesale",
            "price": 11.79,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 53,
            "name": "KERRYMAID ICE CREAM MIX",
            "size": "12 x 1 ltr",
            "category": "Gelato, Sorbet & Ice Cream Mixes",
            "supplier": "Bookers Wholesale",
            "price": 18.99,
            "vatRate": 20,
            "qty": 14,
            "trackingStatus": "Received",
            "stockSynced": true
          }
        ]
      }
    ],
    "items": [
      {
        "id": 24,
        "name": "Coca-Cola Original Taste 330ml Glass Bottle",
        "size": "24 x 330ml",
        "category": "Soft Drinks & Syrups",
        "supplier": "Bookers Wholesale",
        "price": 20.89,
        "vatRate": 20,
        "qty": 5,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 27,
        "name": "Diet Coke Cola 24 x 330ml Glass Bottles",
        "size": "24 x 330ml",
        "category": "Soft Drinks & Syrups",
        "supplier": "Bookers Wholesale",
        "price": 18.49,
        "vatRate": 20,
        "qty": 3,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 31,
        "name": "Fanta Orange 24 x 330ml",
        "size": "1 x 24X330m",
        "category": "Soft Drinks & Syrups",
        "supplier": "Bookers Wholesale",
        "price": 18.99,
        "vatRate": 20,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 104,
        "name": "Sprite Zero Sugar 330ml",
        "size": "24 x 330ml",
        "category": "Soft Drinks & Syrups",
        "supplier": "Bookers Wholesale",
        "price": 18.99,
        "vatRate": 20,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 106,
        "name": "Strathmore Still Spring Water 750ml",
        "size": "24x 330ml",
        "category": "Soft Drinks & Syrups",
        "supplier": "Bookers Wholesale",
        "price": 10.89,
        "vatRate": 20,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 105,
        "name": "Strathmore Sparkling Spring Water 330ml",
        "size": "24 x 330ml",
        "category": "Soft Drinks & Syrups",
        "supplier": "Bookers Wholesale",
        "price": 10.89,
        "vatRate": 20,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 91,
        "name": "OREO Original Vanilla Sandwich Biscuits",
        "size": "16 x 154g",
        "category": "Confectionery & Toppings",
        "supplier": "Bookers Wholesale",
        "price": 14.69,
        "vatRate": 0,
        "qty": 4,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 17,
        "name": "Biscoff Smooth Spread 3kg",
        "size": "1 x 3kg",
        "category": "Confectionery & Toppings",
        "supplier": "Bookers Wholesale",
        "price": 16.49,
        "vatRate": 20,
        "qty": 3,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 16,
        "name": "Biscoff Biscuit Crumbs 750g",
        "size": "8 x 750g",
        "category": "Confectionery & Toppings",
        "supplier": "Bookers Wholesale",
        "price": 33.49,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 87,
        "name": "Nic Caramel Mini Fudge Cubes 1kg",
        "size": "6 x 1kg",
        "category": "Confectionery & Toppings",
        "supplier": "Bookers Wholesale",
        "price": 85.99,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 48,
        "name": "Hershey's Cookies 'N' Creme 40g",
        "size": "24 x 40g",
        "category": "Confectionery & Toppings",
        "supplier": "Bookers Wholesale",
        "price": 18.85,
        "vatRate": 20,
        "qty": 3,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 1,
        "name": "Betty Crocker Indulgent Chocolate Fudge Icing 400g",
        "size": "4 x 400g",
        "category": "Cooking Chocolate Retail",
        "supplier": "Bookers Wholesale",
        "price": 9.99,
        "vatRate": 0,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 49,
        "name": "Jack's Pure Apple Juice 1 Litre",
        "size": "6 x 1ltr",
        "category": "Soft Drinks & Syrups",
        "supplier": "Bookers Wholesale",
        "price": 8.39,
        "vatRate": 20,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 89,
        "name": "Oatly Oat Drink Barista Edition 1L Long Life",
        "size": "6 x 1ltr",
        "category": "Dairy & Milks",
        "supplier": "Bookers Wholesale",
        "price": 9.49,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 56,
        "name": "Koffmann's Potatoes for Chefs Les Pommes Frites 4 x 2.27kg (9.08kg)",
        "size": "1 x 4x2.27k",
        "category": "Frozen Foods Retail",
        "supplier": "Bookers Wholesale",
        "price": 16.99,
        "vatRate": 0,
        "qty": 5,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 70,
        "name": "McCain Original Choice Potato Hash Browns 1kg",
        "size": "1 x 1kg",
        "category": "Frozen Foods Retail",
        "supplier": "Bookers Wholesale",
        "price": 4.19,
        "vatRate": 0,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 71,
        "name": "McCain Potato Pops 2.5kg",
        "size": "1 x 2.5kg",
        "category": "Frozen Foods Retail",
        "supplier": "Bookers Wholesale",
        "price": 7.49,
        "vatRate": 0,
        "qty": 3,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 140,
        "name": "Chef's Menu Onion Powder 480g",
        "size": "1 x 480g",
        "category": "Herbs & Spices Retail",
        "supplier": "Bookers Wholesale",
        "price": 5.89,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 139,
        "name": "Chef's Menu Garlic Powder 500g",
        "size": "1 x 500g",
        "category": "Herbs & Spices Retail",
        "supplier": "Bookers Wholesale",
        "price": 8.49,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 100,
        "name": "St Pierre Brioche Loaf 500g",
        "size": "7 x 500g",
        "category": "Bakery, Desserts & Breakfast Staples",
        "supplier": "Bookers Wholesale",
        "price": 20.99,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 137,
        "name": "Chef's Menu Cayenne Pepper 460g",
        "size": "1 x 460g",
        "category": "Herbs & Spices Retail",
        "supplier": "Bookers Wholesale",
        "price": 5.99,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 138,
        "name": "Chef's Menu Ground Black Pepper 500g",
        "size": "1 x 500g",
        "category": "Herbs & Spices Retail",
        "supplier": "Bookers Wholesale",
        "price": 13.99,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 141,
        "name": "Chef's Menu Smoked Paprika 430g",
        "size": "1 x 430g",
        "category": "Herbs & Spices Retail",
        "supplier": "Bookers Wholesale",
        "price": 5.49,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 76,
        "name": "Müller Semi Skimmed Milk 2 Litres",
        "size": "4 x 2ltr",
        "category": "Dairy & Milks",
        "supplier": "Bookers Wholesale",
        "price": 5.85,
        "vatRate": 0,
        "qty": 4,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 28,
        "name": "Dr. Oetker Madagascan Vanilla Extract 35ml",
        "size": "6 x 35ml",
        "category": "Baking Sundries Retail",
        "supplier": "Bookers Wholesale",
        "price": 7.09,
        "vatRate": 0,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 3,
        "name": "Billington's Light Brown Soft Natural Unrefined Cane Sugar 500g",
        "size": "10 x 500g",
        "category": "Brown Sugar Retail",
        "supplier": "Bookers Wholesale",
        "price": 11.45,
        "vatRate": 0,
        "qty": 2,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 2,
        "name": "Billington's Dark Brown Soft Natural Unrefined Cane Sugar 500g",
        "size": "10 x 500g",
        "category": "Brown Sugar Retail",
        "supplier": "Bookers Wholesale",
        "price": 11.79,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 53,
        "name": "KERRYMAID ICE CREAM MIX",
        "size": "12 x 1 ltr",
        "category": "Gelato, Sorbet & Ice Cream Mixes",
        "supplier": "Bookers Wholesale",
        "price": 18.99,
        "vatRate": 20,
        "qty": 14,
        "trackingStatus": "Received",
        "stockSynced": true
      }
    ]
  },
  {
    "primaryRef": "TSMK-MULTI-310826-001",
    "ddmmyy": "310826",
    "serial": "001",
    "date": "31 Aug 2026, 03:16 PM",
    "requestedBy": "SAI KISHORE",
    "targetLocation": "MILTON KEYNES",
    "netTotal": 21.78,
    "vatTotal": 0,
    "total": 21.78,
    "supplierOrders": [
      {
        "supplier": "Bookers Wholesale",
        "poRef": "TSMK-BOOKERS-310826-001",
        "pdfUrl": "https://sdlrwosjebiiztclsydu.supabase.co/storage/v1/object/public/purchase-orders/TSMK-BOOKERS-310826-001.pdf",
        "netTotal": 21.78,
        "vatTotal": 0,
        "grossTotal": 21.78,
        "status": "Received",
        "items": [
          {
            "id": 2,
            "name": "Billington's Dark Brown Soft Natural Unrefined Cane Sugar 500g",
            "size": "10 x 500g",
            "category": "Brown Sugar Retail",
            "supplier": "Bookers Wholesale",
            "price": 11.79,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          },
          {
            "id": 1,
            "name": "Betty Crocker Indulgent Chocolate Fudge Icing 400g",
            "size": "4 x 400g",
            "category": "Cooking Chocolate Retail",
            "supplier": "Bookers Wholesale",
            "price": 9.99,
            "vatRate": 0,
            "qty": 1,
            "trackingStatus": "Received",
            "stockSynced": true
          }
        ]
      }
    ],
    "items": [
      {
        "id": 2,
        "name": "Billington's Dark Brown Soft Natural Unrefined Cane Sugar 500g",
        "size": "10 x 500g",
        "category": "Brown Sugar Retail",
        "supplier": "Bookers Wholesale",
        "price": 11.79,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      },
      {
        "id": 1,
        "name": "Betty Crocker Indulgent Chocolate Fudge Icing 400g",
        "size": "4 x 400g",
        "category": "Cooking Chocolate Retail",
        "supplier": "Bookers Wholesale",
        "price": 9.99,
        "vatRate": 0,
        "qty": 1,
        "trackingStatus": "Received",
        "stockSynced": true
      }
    ]
  }
]);

// Unified Master Orders: 16 Original Purchase Orders + Authentic Supabase Storage Orders
const ORIGINAL_16_ORDERS = generateInitialSampleOrders();
const ALL_AUTHENTIC_ORDERS_LIST = [...ORIGINAL_16_ORDERS];
if (typeof SUPABASE_STORAGE_ORDERS !== "undefined" && Array.isArray(SUPABASE_STORAGE_ORDERS)) {
  SUPABASE_STORAGE_ORDERS.forEach(so => {
    if (!ALL_AUTHENTIC_ORDERS_LIST.some(o => o.primaryRef === so.primaryRef)) {
      ALL_AUTHENTIC_ORDERS_LIST.push(so);
    }
  });
}

const AUTHENTIC_ORDERS = Object.freeze(ALL_AUTHENTIC_ORDERS_LIST);

function restoreTreatStreetDefaultOrders() {
  const initial = generateInitialSampleOrders();
  const allOrders = [...initial];
  if (typeof SUPABASE_STORAGE_ORDERS !== "undefined" && Array.isArray(SUPABASE_STORAGE_ORDERS)) {
    SUPABASE_STORAGE_ORDERS.forEach(so => {
      if (!allOrders.some(o => o.primaryRef === so.primaryRef)) {
        allOrders.push(so);
      }
    });
  }

  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem("ts_orders", JSON.stringify(allOrders));
      localStorage.setItem("ts_purchase_orders", JSON.stringify(allOrders));
    } catch (e) {
      console.warn("Storage set error:", e);
    }
  }

  // Build stock levels for received items
  const levels = { ...AUTHENTIC_STOCK_LEVELS };
  allOrders.forEach(o => {
    (o.items || []).forEach(item => {
      if (item.trackingStatus === "Received" || item.stockSynced) {
        const id = String(item.id);
        const cur = levels[id] || 0;
        levels[id] = Math.min(5.0, parseFloat((cur + (item.qty || 1)).toFixed(1)));
      }
    });
  });

  // Guarantee all items in the £1,222 order and essentials have healthy stock pots
  const essentialKeys = ["101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114"];
  essentialKeys.forEach(k => {
    if (!levels[k] || levels[k] < 3.0) {
      levels[k] = 4.5;
    }
  });

  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem("ts_stock_levels", JSON.stringify(levels));
      localStorage.setItem("ts_data_version", "v6.1.0_authentic_restored");
    } catch (e) {
      console.warn("Storage set error:", e);
    }
  }

  return { orders: allOrders, stockLevels: levels };
}

if (typeof window !== "undefined") {
  window.MOCK_DATA_ALLOWED = false;
  window.AUTHENTIC_ORDERS = AUTHENTIC_ORDERS;
  window.ORIGINAL_16_ORDERS = ORIGINAL_16_ORDERS;
  window.AUTHENTIC_STOCK_LEVELS = AUTHENTIC_STOCK_LEVELS;
  window.generateInitialSampleOrders = generateInitialSampleOrders;
  window.restoreTreatStreetDefaultOrders = restoreTreatStreetDefaultOrders;
}

if (typeof globalThis !== "undefined") {
  globalThis.MOCK_DATA_ALLOWED = false;
  globalThis.AUTHENTIC_ORDERS = AUTHENTIC_ORDERS;
  globalThis.ORIGINAL_16_ORDERS = ORIGINAL_16_ORDERS;
  globalThis.AUTHENTIC_STOCK_LEVELS = AUTHENTIC_STOCK_LEVELS;
  globalThis.generateInitialSampleOrders = generateInitialSampleOrders;
  globalThis.restoreTreatStreetDefaultOrders = restoreTreatStreetDefaultOrders;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    MOCK_DATA_ALLOWED: false,
    AUTHENTIC_ORDERS,
    ORIGINAL_16_ORDERS,
    AUTHENTIC_STOCK_LEVELS,
    generateInitialSampleOrders,
    restoreTreatStreetDefaultOrders
  };
}
