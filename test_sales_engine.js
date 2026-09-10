const SalesEngine = require('./sales_engine.js');
const assert = require('assert');

console.log('====================================================');
console.log('🧪 TESTING TREAT STREET SALES CONSOLIDATION ENGINE');
console.log('====================================================');

// 1. Generate Demo 4-Platform Files
const demoFiles = SalesEngine.generateDemoFiles();
console.log(`Generated ${demoFiles.length} demo platform files:`);
demoFiles.forEach(f => console.log(` - [${f.channel}] ${f.filename} (${f.content.split('\n').length} lines)`));

// 2. Parse Universal Files
const parsedFiles = demoFiles.map(f => {
  const parsed = SalesEngine.parseUniversalFile(f.content, f.filename);
  console.log(`\nParsed ${f.filename}:`);
  console.log(` - Detected Channel: ${parsed.channel}`);
  console.log(` - Rows Extracted: ${parsed.items.length}`);
  if (f.channel === 'Square') {
    console.log('Sample Square Item:', parsed.items[0]);
  }
  assert.strictEqual(parsed.channel, f.channel, `Channel detection mismatch for ${f.filename}`);
  assert.ok(parsed.items.length > 0, `No items extracted from ${f.filename}`);
  return parsed;
});

// 3. Consolidate Multi-Platform Sales
console.log('\n--- Merging 4-Channel Sales Data into Master Ledger ---');
const consolidated = SalesEngine.consolidateSales(parsedFiles);

console.log(`Reporting Date: ${consolidated.reportingDate}`);
console.log(`Grand Total Units Sold: ${consolidated.grandTotals.units}`);
console.log(`Grand Total Gross Sales: £${consolidated.grandTotals.gross.toFixed(2)}`);
console.log(`Platform Commission Leakage: £${consolidated.grandTotals.commission.toFixed(2)} (${consolidated.grandTotals.effective_commission_rate}%)`);
console.log(`Total Net Revenue Realized: £${consolidated.grandTotals.net.toFixed(2)}`);
console.log(`Master Matched Recipes: ${consolidated.matchedCount}`);
console.log(`Unmapped Items in Resolution Queue: ${consolidated.unmappedCount}`);

assert.ok(consolidated.grandTotals.units > 0, 'Grand total units should be > 0');
assert.ok(consolidated.grandTotals.gross > 0, 'Grand total gross should be > 0');
assert.ok(consolidated.unmappedCount >= 1, 'Should detect at least 1 unmapped item');

// 4. Inspect Unmapped Queue
console.log('\n--- Unmapped Items Resolution Queue ---');
console.table(consolidated.unmappedQueue.map(u => ({
  'Raw External Name': u.raw_name,
  'Channel': u.channel,
  'Units Sold': u.count,
  'Gross Impact': `£${u.sample_revenue.toFixed(2)}`
})));

// 5. Inspect Master Sales Ledger
console.log('\n--- Consolidated Master Sales Ledger (Top 6 Items) ---');
console.table(consolidated.masterLedger.slice(0, 6).map(m => ({
  'Master Recipe Name': m.master_item_name,
  'Square': m.square_units,
  'Uber': m.uber_eats_units,
  'JustEat': m.just_eat_units,
  'Deliveroo': m.deliveroo_units,
  'Total Vol': m.total_volume,
  'Gross (£)': m.gross_revenue.toFixed(2),
  'Comm (£)': m.total_commissions.toFixed(2),
  'Net (£)': m.net_revenue.toFixed(2),
  'Square Share': m.channel_share.square_pct + '%',
  'Uber Share': m.channel_share.uber_pct + '%'
})));

// 6. Inspect Performance Analytics & AI Insights
console.log('\n--- Performance Analytics & AI Insights ---');
console.log('Top Performers Overall:', consolidated.analytics.topPerformersOverall.map(p => `${p.master_item_name} (${p.total_volume} sold)`).join(', '));
console.log('Underperformers:', consolidated.analytics.underperformers.map(p => `${p.master_item_name} (${p.total_volume} sold)`).join(', '));

console.log('\nChannel Economics & Commission Leakage:');
console.table(consolidated.analytics.channelEconomics.map(c => ({
  'Channel': c.channel,
  'Units': c.units,
  'Gross': `£${c.gross.toFixed(2)}`,
  'Commission Leakage': `£${c.commission.toFixed(2)}`,
  'Take Rate': `${c.commission_rate_pct}%`,
  'Status': c.take_rate_status
})));

console.log('\nAI Executive Summary Card:');
console.log('Volume Drivers:', JSON.stringify(consolidated.analytics.aiExecutiveSummary.top3VolumeDrivers, null, 2));
console.log('Underperforming To Monitor:', JSON.stringify(consolidated.analytics.aiExecutiveSummary.underperformingToMonitor, null, 2));
console.log('Profitability Discrepancies:', consolidated.analytics.aiExecutiveSummary.profitabilityDiscrepancies);

// 7. Test Theoretical Stock Depletion & Alarms
console.log('\n--- Downstream Stock Depletion & Alarm Handshake ---');
const depletionResult = SalesEngine.calculateDepletionAndAlarms(consolidated.masterLedger);
console.log(`Critical Low Stock Alarms Triggered: ${depletionResult.alarmsCount}`);

assert.ok(depletionResult.alarmsCount > 0, 'Expected safety stock / MOQ breach alarms');

console.log('\nCRITICAL_LOW_STOCK_ALARM Banners:');
console.table(depletionResult.criticalLowStockAlarms.map(a => ({
  'Ingredient': a.ingredient_name,
  'Current Pot': a.current_on_hand,
  'Projected Post-Sales': a.projected_remaining,
  'MOQ Target': a.moq_safety_threshold,
  'Suggested Reorder': a.suggested_reorder_qty,
  'Status': a.alert_code
})));

// 8. Test Master Export Payload
const exportRows = SalesEngine.generateMasterExportData(consolidated);
console.log(`\nMaster Export Payload generated: ${exportRows.length} rows (including header)`);
assert.strictEqual(exportRows.length, consolidated.masterLedger.length + 1);

console.log('\n✅ ALL AUTOMATED PIPELINE & FRANCHISE INTELLIGENCE TESTS PASSED PERFECTLY!');
