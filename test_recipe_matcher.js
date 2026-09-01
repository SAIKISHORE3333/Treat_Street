const RecipeMatcher = require('./recipe_matcher.js');

const sampleRecipes = [
  {
    id: 'rec_1',
    title: 'Signature Cookie Dough',
    yield: '1',
    ingredients: [
      { name: 'Cookie Dough Base', quantity: '100', unit: 'g' },
      { name: 'Belgian Milk Chocolate Chips', quantity: '20', unit: 'g' },
      { name: 'Comelle Ice Cream Mix 1 Litre', quantity: '0.1', unit: 'l' }
    ]
  },
  {
    id: 'rec_2',
    title: 'Mac & Cheese Base',
    yield: '1',
    ingredients: [
      { name: 'Cooked Pasta', quantity: '200', unit: 'g' },
      { name: 'Nacho cheese', quantity: '50', unit: 'g' }
    ]
  },
  {
    id: 'rec_3',
    title: 'Triple Chocolate Brownie',
    yield: '1',
    ingredients: [
      { name: 'Triple chocolate brownie', quantity: '1', unit: 'unit' }
    ]
  }
];

const sampleAliases = [
  {
    external_name: 'Cookie Dough (Warm)',
    normalized_external_name: RecipeMatcher.normalizeText('Cookie Dough (Warm)'),
    recipe_name: 'Signature Cookie Dough',
    source_platform: 'DELIVEROO'
  },
  {
    external_name: 'Classic Mac N Chz',
    normalized_external_name: RecipeMatcher.normalizeText('Classic Mac N Chz'),
    recipe_name: 'Mac & Cheese Base',
    source_platform: 'ALL'
  }
];

// 1. Deliveroo CSV Sample
const deliverooCSV = `Order ID,Item name,Quantity,Item Gross
DEL-101,"Signature Cookie Dough",3,24.00
DEL-102,"Cookie Dough (Warm)",2,16.00
DEL-103,"New Seasonal Strawberry Crepe",1,8.50`;

// 2. Just Eat CSV Sample
const justEatCSV = `Restaurant Reference,Product Name,Quantity,Sub Total
JE-501,"Classic Mac N Chz",4,32.00
JE-502,"Triple Chocolate Brownie",5,25.00`;

// 3. In-Store POS CSV Sample
const posCSV = `Date,Description,Qty Sold,Net Sales
2026-08-31,"Signature Cookie Dough",10,75.00
2026-08-31,"Mac & Cheese Base",6,45.00
2026-08-31,"Unknown Mystery Shake",2,12.00`;

console.log('--- 1. Parsing Deliveroo CSV ---');
const delivParsed = RecipeMatcher.parsePlatformCSV(deliverooCSV, 'deliveroo_sales_aug.csv');
console.log('Detected Platform:', delivParsed.platform);
console.log('Items parsed:', delivParsed.items.length);

console.log('\n--- 2. Parsing Just Eat CSV ---');
const jeParsed = RecipeMatcher.parsePlatformCSV(justEatCSV, 'just_eat_sales_aug.csv');
console.log('Detected Platform:', jeParsed.platform);
console.log('Items parsed:', jeParsed.items.length);

console.log('\n--- 3. Parsing In-Store POS CSV ---');
const posParsed = RecipeMatcher.parsePlatformCSV(posCSV, 'pos_till_report.csv');
console.log('Detected Platform:', posParsed.platform);
console.log('Items parsed:', posParsed.items.length);

console.log('\n--- 4. Consolidating All 3 Files ---');
const consolidated = RecipeMatcher.consolidateSalesReports([delivParsed, jeParsed, posParsed], sampleRecipes, sampleAliases);

console.log(`Grand Total Units Sold: ${consolidated.grandTotalUnits}`);
console.log(`Grand Total Revenue: £${consolidated.grandTotalRevenue.toFixed(2)}`);
console.log('Platform Breakdown:', consolidated.platformCounts);
console.log('\nConsolidated Menu Matrix:');
console.table(consolidated.matrix.map(m => ({
  'Recipe': m.recipe_name,
  'Deliveroo': m.deliveroo_qty,
  'Just Eat': m.just_eat_qty,
  'POS': m.pos_qty,
  'Total Units': m.total_qty,
  'Total Rev': `£${m.total_revenue.toFixed(2)}`,
  'Match Type': m.match_type
})));

console.log('\nUnmapped Items Queue (UNRESOLVED_RECIPE):');
console.table(consolidated.unresolved);

console.log('\n--- 5. Calculating Total Ingredient Depletion ---');
const depletion = RecipeMatcher.calculateDepletion(consolidated.matrix, []);
console.table(depletion);

console.log('\n--- 6. Test Resolving and Mapping Unmapped Item ---');
sampleAliases.push({
  external_name: 'New Seasonal Strawberry Crepe',
  normalized_external_name: RecipeMatcher.normalizeText('New Seasonal Strawberry Crepe'),
  recipe_name: 'Signature Cookie Dough', // map to cookie dough for test
  source_platform: 'DELIVEROO'
});

const reconsolidated = RecipeMatcher.consolidateSalesReports([delivParsed, jeParsed, posParsed], sampleRecipes, sampleAliases);
console.log(`Unresolved count after mapping: ${reconsolidated.unresolvedCount}`);
console.log('Re-consolidated Menu Matrix:');
console.table(reconsolidated.matrix.map(m => ({
  'Recipe': m.recipe_name,
  'Total Units': m.total_qty,
  'Match Type': m.match_type
})));
