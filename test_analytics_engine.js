const FranchiseAnalytics = require('./analytics_engine.js');

const sampleSales = [
  { item_name: 'Signature Cookie Dough', channel: 'In-Store POS', units_sold: 45, gross_sales: 337.50, discount_amount: 0, platform_commission: 0, timestamp: '14:30' },
  { item_name: 'Signature Cookie Dough', channel: 'Deliveroo', units_sold: 35, gross_sales: 280.00, discount_amount: 35.00, platform_commission: 68.60, timestamp: '19:15' },
  { item_name: 'Signature Cookie Dough', channel: 'Just Eat', units_sold: 25, gross_sales: 200.00, discount_amount: 10.00, platform_commission: 47.50, timestamp: '18:40' },
  { item_name: 'Mac & Cheese Base', channel: 'In-Store POS', units_sold: 40, gross_sales: 280.00, discount_amount: 0, platform_commission: 0, timestamp: '13:10' },
  { item_name: 'Triple Chocolate Brownie', channel: 'Deliveroo', units_sold: 22, gross_sales: 110.00, discount_amount: 12.00, platform_commission: 27.44, timestamp: '19:30' }
];

const sampleInventory = [
  { ingredient_name: 'Cookie Dough Base', actual_waste_qty: 4.5, unit_cost: 6.20 },
  { ingredient_name: 'Comelle Ice Cream Mix', actual_waste_qty: 2.0, unit_cost: 3.80 },
  { ingredient_name: 'Belgian Milk Chocolate Chips', actual_waste_qty: 1.2, unit_cost: 8.50 }
];

const sampleOps = [
  { prep_time_minutes: 11, rating_score: 5, order_time: '12:30' },
  { prep_time_minutes: 19, rating_score: 4, order_time: '18:40' },
  { prep_time_minutes: 21, rating_score: 3, order_time: '19:15' }
];

console.log('--- 1. Testing Analytics Engine Analysis ---');
const analysis = FranchiseAnalytics.analyzeDailyPerformance(sampleSales, sampleInventory, sampleOps, []);

console.log(`Gross Revenue: £${analysis.gross_sales}`);
console.log(`Net Profit: £${analysis.net_profit} (Margin: ${analysis.net_margin_pct}%)`);
console.log(`Food Waste Cost: £${analysis.waste_cost}`);
console.log(`Commissions Paid: £${analysis.commissions}`);

console.log('\n--- 2. Channel Profitability Breakdown ---');
console.table(analysis.channel_metrics);

console.log('\n--- 3. BCG Menu Matrix Classifications ---');
console.table(analysis.menu_matrix.map(m => ({
  'Item': m.item_name,
  'Units Sold': m.units_sold,
  'Unit Margin': `£${m.unit_margin.toFixed(2)}`,
  'BCG Category': m.category
})));

console.log('\n--- 4. Executive AI Synthesis ---');
console.log('Top 3 Strengths:', analysis.insights.top_3_strengths);
console.log('Top 3 Leaks:', analysis.insights.top_3_leaks);
console.log('Next Steps:', analysis.insights.recommended_next_steps);

console.log('\n--- 5. Testing Chunked CSV Stream Ingestion ---');
const rawCSV = `Date,Platform,Item Name,Qty,Gross,Discounts\n2026-08-31,Deliveroo,Signature Cookie Dough,10,80.00,5.00\n2026-08-31,POS,Mac & Cheese Base,5,35.00,0.00`;

FranchiseAnalytics.parseChunkedCSV(rawCSV, (row, schema, idx) => {
  console.log(`Row #${idx} parsed [${schema.type}]:`, row['Item Name'], row['Gross']);
}, (schema, count) => {
  console.log(`Stream complete! Total rows: ${count}`);
});
