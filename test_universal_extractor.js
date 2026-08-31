const FranchiseAnalytics = require('./analytics_engine.js');

// Test 1: Real Deliveroo export with large Order ID & Barcodes
const deliverooWithID = {
  "Order ID": "14319277",
  "Item SKU": "50192839210",
  "Item Name": "Signature Cookie Dough",
  "Quantity": "1",
  "Item Price": "8.50",
  "Gross Sales": "8.50",
  "Commission": "2.38",
  "Time Placed": "19:15:00"
};

// Test 2: In-Store POS with Receipt Number and Barcode
const posWithReceipt = {
  "Receipt Number": "9928374",
  "Barcode": "500012849201",
  "Item": "Mac & Cheese Base",
  "Qty": "2",
  "Line Total": "14.00",
  "Date": "2026-08-31 14:30"
};

console.log('--- 1. Testing Strict Data Cleaning ---');
console.log('Cleaned Deliveroo Row:', FranchiseAnalytics.extractSalesFields(deliverooWithID));
console.log('Cleaned POS Row:', FranchiseAnalytics.extractSalesFields(posWithReceipt));

const analysis1 = FranchiseAnalytics.analyzeDailyPerformance([deliverooWithID, posWithReceipt], [], [], []);
console.log(`Total Orders: ${analysis1.total_orders}`);
console.log(`Gross Revenue: £${analysis1.gross_sales} (Correct: £22.50)`);
console.log(`Commission Paid: £${analysis1.commissions}`);
console.log(`Net Profit: £${analysis1.net_profit} (Margin: ${analysis1.net_margin_pct}%)`);
