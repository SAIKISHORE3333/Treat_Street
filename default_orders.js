/**
 * Treat Street Operations - Verified Purchase Orders & Initial Stock Dataset
 * Guarantees that purchase orders, delivery statuses, and stock pots are always fully populated.
 */

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
    // ORDER 16: Famous Genuine £1,222.00 Gross Order for MK Stadium
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
function restoreTreatStreetDefaultOrders() {
  const initial = generateInitialSampleOrders();
  localStorage.setItem('ts_orders', JSON.stringify(initial));

  // Build stock levels for received items
  const levels = {};
  initial.forEach(o => {
    (o.items || []).forEach(item => {
      if (item.trackingStatus === 'Received' || item.stockSynced) {
        const id = String(item.id);
        const cur = levels[id] || 0;
        levels[id] = Math.min(5.0, parseFloat((cur + (item.qty || 1)).toFixed(1)));
      }
    });
  });

  // Guarantee all items in the £1,222 order and essentials have 3.0 to 5.0 units in pot
  const essentialKeys = ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114'];
  essentialKeys.forEach(k => {
    if (!levels[k] || levels[k] < 3.0) {
      levels[k] = 4.5;
    }
  });

  localStorage.setItem('ts_stock_levels', JSON.stringify(levels));
  return { orders: initial, stockLevels: levels };
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
