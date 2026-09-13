/**
 * test_parent_modifier_binding.js
 * Comprehensive verification for Parent-Modifier Context Binding:
 * 1. Sequential Ingestion Context Scanner (Category == 'Modifiers')
 * 2. Multi-unit parent disambiguation & splitting
 * 3. Master Aggregation output columns (Disambiguated Name, Quantity Sold, Base Used, Unit Price, Net Sales)
 * 4. Exact Stock Depletion Link (Pancake_Batter_Portion, Waffle_Batter_Portion, Cheesecake_Base_Slice, Cookie_Dough_Puck)
 */

const assert = require('assert');
const SalesEngine = require('./sales_engine.js');

console.log('🧪 RUNNING PARENT-MODIFIER CONTEXT BINDING TEST SUITE\n');

// 1. Mock sequential POS rows
const rawRows = [
  // Parent 1: Buenos Dias (Qty 2) followed by 1 Waffle modifier and 1 Pancake modifier
  {
    'Transaction ID': 'TX-101',
    'Date': '2026-09-14',
    'Time': '12:00:00',
    'Category': 'Desserts',
    'Item': 'Buenos Dias',
    'Quantity': '2',
    'Gross Sales': '£18.00',
    'Net Sales': '£15.00',
    'Channel': 'Square POS'
  },
  {
    'Transaction ID': 'TX-101',
    'Date': '2026-09-14',
    'Time': '12:00:00',
    'Category': 'Modifiers',
    'Item': 'Waffle',
    'Quantity': '1',
    'Gross Sales': '£0.00',
    'Net Sales': '£0.00'
  },
  {
    'Transaction ID': 'TX-101',
    'Date': '2026-09-14',
    'Time': '12:00:00',
    'Category': 'Modifiers',
    'Item': 'Pancake',
    'Quantity': '1',
    'Gross Sales': '£0.00',
    'Net Sales': '£0.00'
  },

  // Parent 2: Mulah Green (Qty 1) followed by Pancake modifier
  {
    'Transaction ID': 'TX-102',
    'Date': '2026-09-14',
    'Time': '12:15:00',
    'Category': 'Desserts',
    'Item': 'Mulah Green',
    'Quantity': '1',
    'Gross Sales': '£9.50',
    'Net Sales': '£8.00',
    'Channel': 'Square POS'
  },
  {
    'Transaction ID': 'TX-102',
    'Date': '2026-09-14',
    'Time': '12:15:00',
    'Category': 'Modifiers',
    'Item': 'Pancake',
    'Quantity': '1',
    'Gross Sales': '£0.00',
    'Net Sales': '£0.00'
  },

  // Parent 3: Buenos Dias (Qty 1) followed by Cheesecake modifier
  {
    'Transaction ID': 'TX-103',
    'Date': '2026-09-14',
    'Time': '12:30:00',
    'Category': 'Desserts',
    'Item': 'Buenos Dias',
    'Quantity': '1',
    'Gross Sales': '£9.00',
    'Net Sales': '£7.50',
    'Channel': 'Square POS'
  },
  {
    'Transaction ID': 'TX-103',
    'Date': '2026-09-14',
    'Time': '12:30:00',
    'Category': 'Modifiers',
    'Item': 'Cheesecake',
    'Quantity': '1',
    'Gross Sales': '£0.00',
    'Net Sales': '£0.00'
  },

  // Item 4: Inherent title base Cheesecake
  {
    'Transaction ID': 'TX-104',
    'Date': '2026-09-14',
    'Time': '12:45:00',
    'Category': 'Desserts',
    'Item': 'Biscoff Loaded Cheesecake',
    'Quantity': '1',
    'Gross Sales': '£8.50',
    'Net Sales': '£7.00',
    'Channel': 'Uber Eats'
  },

  // Item 5: Inherent title base Cookie Dough
  {
    'Transaction ID': 'TX-105',
    'Date': '2026-09-14',
    'Time': '13:00:00',
    'Category': 'Desserts',
    'Item': 'Triple Choc Cookie Dough',
    'Quantity': '1',
    'Gross Sales': '£7.50',
    'Net Sales': '£6.50',
    'Channel': 'Deliveroo'
  }
];

// -------------------------------------------------------------
// STEP 1: Test Sequential Ingestion Context Scanner & Disambiguation
// -------------------------------------------------------------
console.log('--- Step 1: Testing Ingestion Context Scanner & Parent-Modifier Binding ---');
const parsed = SalesEngine.parseUniversalFile(rawRows, 'square_csv');
console.log(`Parsed transactions count: ${parsed.transactions.length}`);

// We expect 6 sales items because:
// - TX-101 Buenos Dias (Qty 2) split into 2 items: 1 Waffle, 1 Pancake
// - TX-102 Mulah Green (Qty 1) with 1 Pancake
// - TX-103 Buenos Dias (Qty 1) with 1 Cheesecake
// - TX-104 Biscoff Loaded Cheesecake (Qty 1)
// - TX-105 Triple Choc Cookie Dough (Qty 1)
// Total items = 2 + 1 + 1 + 1 + 1 = 6 items
assert.strictEqual(parsed.transactions.length, 6, 'Expected 6 parsed transaction items');

const itemNames = parsed.transactions.map(t => t.item_name);
console.log('Disambiguated Item Names:', itemNames);

assert(itemNames.includes('Buenos Dias (Waffle)'), 'Missing Buenos Dias (Waffle)');
assert(itemNames.includes('Buenos Dias (Pancake)'), 'Missing Buenos Dias (Pancake)');
assert(itemNames.includes('Mulah Green (Pancake)'), 'Missing Mulah Green (Pancake)');
assert(itemNames.includes('Buenos Dias (Cheesecake)'), 'Missing Buenos Dias (Cheesecake)');
assert(itemNames.some(n => n.includes('Cheesecake')), 'Missing Cheesecake item');
assert(itemNames.some(n => n.includes('Cookie Dough')), 'Missing Cookie Dough item');

// Verify proportional financials for the split Buenos Dias (Qty 2)
const splitWaffle = parsed.transactions.find(t => t.item_name === 'Buenos Dias (Waffle)');
const splitPancake = parsed.transactions.find(t => t.item_name === 'Buenos Dias (Pancake)');
assert.strictEqual(splitWaffle.quantity, 1, 'Split Waffle should have quantity 1');
assert.strictEqual(splitPancake.quantity, 1, 'Split Pancake should have quantity 1');
assert.strictEqual(splitWaffle.gross_sales, 9.00, 'Split Waffle gross should be 9.00 (half of 18)');
assert.strictEqual(splitPancake.gross_sales, 9.00, 'Split Pancake gross should be 9.00 (half of 18)');
assert.strictEqual(splitWaffle.net_sales, 7.50, 'Split Waffle net should be 7.50 (half of 15)');
assert.strictEqual(splitPancake.net_sales, 7.50, 'Split Pancake net should be 7.50 (half of 15)');

console.log('✅ Ingestion Context Scanner & Disambiguated Line-Item Splitting Passed!\n');

// -------------------------------------------------------------
// STEP 2: Test Master Aggregation & Item Sales Output
// -------------------------------------------------------------
console.log('--- Step 2: Testing Aggregation & Master Item Sales Output ---');
const consolidatedResult = SalesEngine.consolidateSales([parsed]);
const consolidated = consolidatedResult.masterLedger;
console.log('Consolidated Count:', consolidated.length);

consolidated.forEach(item => {
  console.log(`- Item: "${item.item_name}" | Base Used: "${item.base_used}" | Qty: ${item.quantity} | Unit Price: £${item.unit_price.toFixed(2)} | Net Sales: £${item.net_sales.toFixed(2)}`);
  assert(item.item_name, 'Item must have a name');
  assert(item.base_used, `Item "${item.item_name}" must have base_used defined`);
  assert(typeof item.quantity === 'number' && item.quantity > 0, 'Item must have valid quantity');
  assert(typeof item.unit_price === 'number', 'Item must have valid unit price');
  assert(typeof item.net_sales === 'number', 'Item must have valid net sales');
});

// Verify export structure
const exportData = SalesEngine.generateMasterExportData(consolidatedResult);
console.log('\nSample Export Headers:');
console.log(exportData[0]);
console.log('\nSample Export Data Row:');
console.log(exportData[1]);

const headers = exportData[0];
assert(headers.includes('Product Disambiguated Name'), 'Missing "Product Disambiguated Name" in export');
assert(headers.includes('Base Used'), 'Missing "Base Used" in export');
assert(headers.includes('Quantity Sold'), 'Missing "Quantity Sold" in export');
assert(headers.includes('Unit Price (£)'), 'Missing "Unit Price (£)" in export');
assert(headers.includes('Net Sales (£)'), 'Missing "Net Sales (£)" in export');

console.log('✅ Aggregation & Master Item Sales Output Passed!\n');

// -------------------------------------------------------------
// STEP 3: Test Direct Stock Depletion Link
// -------------------------------------------------------------
console.log('--- Step 3: Testing Direct Stock Depletion Deductions ---');
const inventoryData = {
  Pancake_Batter_Portion: { current_stock: 50, minimum_stock: 10, unit: 'portion' },
  Waffle_Batter_Portion: { current_stock: 50, minimum_stock: 10, unit: 'portion' },
  Cheesecake_Base_Slice: { current_stock: 30, minimum_stock: 5, unit: 'slice' },
  Cookie_Dough_Puck: { current_stock: 40, minimum_stock: 5, unit: 'puck' }
};

const depletionResult = SalesEngine.calculateDepletionAndAlarms(consolidated, inventoryData);
const deductions = depletionResult.depletions;

console.log('Depletions calculated:');
Object.entries(deductions).forEach(([key, d]) => {
  console.log(`- ${key}: Deducted ${d.quantity_deducted} ${d.unit} (Remaining: ${d.remaining_stock})`);
});

// Expected:
// Pancake: 1 from Buenos Dias (Pancake) + 1 from Mulah Green (Pancake) = 2
assert.strictEqual(deductions['Pancake_Batter_Portion'].quantity_deducted, 2, 'Pancake_Batter_Portion should be deducted by 2');

// Waffle: 1 from Buenos Dias (Waffle) = 1
assert.strictEqual(deductions['Waffle_Batter_Portion'].quantity_deducted, 1, 'Waffle_Batter_Portion should be deducted by 1');

// Cheesecake: 1 from Buenos Dias (Cheesecake) + 1 from Biscoff (Cheesecake) = 2
assert.strictEqual(deductions['Cheesecake_Base_Slice'].quantity_deducted, 2, 'Cheesecake_Base_Slice should be deducted by 2');

// Cookie Dough: 1 from Triple Choc (Cookie Dough) = 1
assert.strictEqual(deductions['Cookie_Dough_Puck'].quantity_deducted, 1, 'Cookie_Dough_Puck should be deducted by 1');

console.log('✅ Direct Stock Depletion Link Passed!\n');

// -------------------------------------------------------------
// STEP 4: Test Multi-unit "Twist It, Lick It, Dunk It" Combo
// -------------------------------------------------------------
console.log('--- Step 4: Testing Multi-unit "Twist It, Lick It, Dunk It" ---');
const comboRows = [
  {
    'Transaction ID': 'TX-201',
    'Date': '2026-09-14',
    'Time': '14:00:00',
    'Category': 'Combos',
    'Item': 'Twist It, Lick It, Dunk It',
    'Quantity': '2',
    'Gross Sales': '£20.00',
    'Net Sales': '£17.00',
    'Channel': 'Square POS'
  },
  {
    'Transaction ID': 'TX-201',
    'Date': '2026-09-14',
    'Time': '14:00:00',
    'Category': 'Modifiers',
    'Item': 'Pancake',
    'Quantity': '1',
    'Gross Sales': '£0.00',
    'Net Sales': '£0.00'
  },
  {
    'Transaction ID': 'TX-201',
    'Date': '2026-09-14',
    'Time': '14:00:00',
    'Category': 'Modifiers',
    'Item': 'Waffle',
    'Quantity': '1',
    'Gross Sales': '£0.00',
    'Net Sales': '£0.00'
  }
];

const comboParsed = SalesEngine.parseUniversalFile(comboRows, 'square_csv');
assert.strictEqual(comboParsed.transactions.length, 2, 'Should split into 2 items');
const comboNames = comboParsed.transactions.map(t => t.item_name);
assert(comboNames.includes('Twist It, Lick It, Dunk It (Pancake)'), 'Expected Twist It, Lick It, Dunk It (Pancake)');
assert(comboNames.includes('Twist It, Lick It, Dunk It (Waffle)'), 'Expected Twist It, Lick It, Dunk It (Waffle)');
console.log('Split combo names:', comboNames);
console.log('✅ Multi-unit "Twist It, Lick It, Dunk It" Combo Passed!\n');

console.log('🎉 ALL TESTS PASSED SUCCESSFULLY! 100% VERIFIED!');
