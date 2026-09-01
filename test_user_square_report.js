const FranchiseAnalytics = require('./analytics_engine.js');
const fs = require('fs');

// Create test dataset directly from user's Square POS report
const rawSquareData = `Date\tTime\tCategory\tItem\tQty\tPrice Point Name\tSKU\tModifiers Applied\tProduct Sales\tDiscounts\tNet Sales\tTax\tGross Sales\tTransaction ID\tPayment ID\tDevice Name\tNotes\tDetails\tEvent Type\tLocation\tDining Option\tCustomer ID\tCustomer Name\tUnit\tCount\tCommission\tEmployee\tChannel\tCard Brand\tPAN Suffix
2026-08-31\t17:24:46\tMilkshakes\tGelato Shake\t1.0\tRegular\t367182V\tBubblegum Gelato, Vegan Mint Choc Chip\t£7.00\t-£7.00\t£0.00\t£0.00\t£0.00\tGLRN1\tPAY1\tSquare Register 1350\tNotes\thttps://square\tPayment\tTreat Street\tFor Here\tCUST1\tKyle Major\tea\t1\t£0.00\tEllie Gale\tTreat Street\tVisa\t1111
2026-08-31\t17:24:46\tCandy Bar Shakes\tLuxury White Choc Milkshake\t1.0\tRegular\t656639R\tNo Whipped Cream\t£6.00\t£0.00\t£6.00\t£0.00\t£6.00\tGLRN1\tPAY1\tSquare Register 1350\t\thttps://square\tPayment\tTreat Street\tFor Here\tCUST1\tKyle Major\tea\t1\t£0.00\tEllie Gale\tTreat Street\tVisa\t1111
2026-08-31\t17:24:46\tWaffles, Pancakes, Cookie Doughs, Cheesecakes\tBanoffee\t1.0\tRegular\t316502P\tWaffle, Salted Caramel Gelato\t£11.00\t£0.00\t£11.00\t£0.00\t£11.00\tGLRN1\tPAY1\tSquare Register 1350\twhite choc sauce\thttps://square\tPayment\tTreat Street\tFor Here\tCUST1\tKyle Major\tea\t1\t£0.00\tEllie Gale\tTreat Street\tVisa\t1111
2026-08-31\t17:22:30\tNone\tRagin Cajuns\t1.0\tRegular\tH133205\tNo Side\t£6.50\t£0.00\t£6.50\t£0.00\t£6.50\tTR2\tPAY2\tSquare Terminal 0864\tCajun chicken\thttps://square\tPayment\tTreat Street\tFor Here\t\t\tea\t1\t£0.00\tEllie Gale\tTreat Street\tVisa\t2222
2026-08-31\t17:22:30\tGelato & Sorbet Scoops\t1 Scoop\t1.0\tRegular\t8800416\tBubblegum Gelato\t£3.00\t£0.00\t£3.00\t£0.00\t£3.00\tTR2\tPAY2\tSquare Terminal 0864\t\thttps://square\tPayment\tTreat Street\tFor Here\t\t\tea\t1\t£0.00\tEllie Gale\tTreat Street\tVisa\t2222
2026-08-31\t17:22:30\tGelato & Sorbet Scoops\t1 Scoop\t1.0\tRegular\t8800416\tVanilla Gelato\t£3.00\t£0.00\t£3.00\t£0.00\t£3.00\tTR2\tPAY2\tSquare Terminal 0864\t\thttps://square\tPayment\tTreat Street\tFor Here\t\t\tea\t1\t£0.00\tEllie Gale\tTreat Street\tVisa\t2222
2026-08-31\t17:22:30\tSoft Drinks\tStill Water\t3.0\tregular\t1729046\t\t£9.00\t£0.00\t£9.00\t£0.00\t£9.00\tTR2\tPAY2\tSquare Terminal 0864\t\thttps://square\tPayment\tTreat Street\tFor Here\t\t\tea\t3\t£0.00\tEllie Gale\tTreat Street\tVisa\t2222
2026-08-31\t17:22:07\tWaffles, Pancakes, Cookie Doughs, Cheesecakes\tTwist it, Lick it, Dunk it\t1.0\tRegular\t4763263\tPancakes, Soft Serve\t£11.00\t£0.00\t£11.00\t£0.00\t£11.00\tTR3\tPAY3\tSquare Register 1350\tOreos\thttps://square\tPayment\tTreat Street\t\t\tTom Cowan\tea\t1\t£0.00\t\tTreat Street\tVisa\t8633
2026-08-31\t17:22:07\tGelato & Sorbet Scoops\t1 Scoop\t1.0\tRegular\t8800416\tVanilla Gelato\t£3.00\t£0.00\t£3.00\t£0.00\t£3.00\tTR3\tPAY3\tSquare Register 1350\t\thttps://square\tPayment\tTreat Street\t\t\tTom Cowan\tea\t1\t£0.00\t\tTreat Street\tVisa\t8633
2026-08-31\t17:22:07\tSmoothies\tAvo go go\t1.0\tRegular\t2956861\tNo Extra\t£6.00\t£0.00\t£6.00\t£0.00\t£6.00\tTR3\tPAY3\tSquare Register 1350\tAvocado\thttps://square\tPayment\tTreat Street\t\t\tTom Cowan\tea\t1\t£0.00\t\tTreat Street\tVisa\t8633
2026-08-31\t17:22:07\tSoft Drinks\tStill Water\t1.0\tregular\t1729046\t\t£3.00\t£0.00\t£3.00\t£0.00\t£3.00\tTR3\tPAY3\tSquare Register 1350\t\thttps://square\tPayment\tTreat Street\t\t\tTom Cowan\tea\t1\t£0.00\t\tTreat Street\tVisa\t8633
2026-08-31\t17:21:08\tCreate Your Own\tChocolate Chip Cookie Dough\t1.0\tRegular\t261948N\tSoft Serve\t£8.00\t£0.00\t£8.00\t£0.00\t£8.00\tTR4\tPAY4\tSquare Register 1350\tCookie dough\thttps://square\tPayment\tTreat Street\tFor Here\t\t\tea\t1\t£0.00\tEllie Gale\tTreat Street\tMasterCard\t3344
2026-08-31\t17:21:08\tCreate Your Own\tChocolate Chip Cookie Dough\t1.0\tRegular\t261948N\tChurros Gelato\t£8.95\t£0.00\t£8.95\t£0.00\t£8.95\tTR4\tPAY4\tSquare Register 1350\tChurros\thttps://square\tPayment\tTreat Street\tFor Here\t\t\tea\t1\t£0.00\tEllie Gale\tTreat Street\tMasterCard\t3344
2026-08-31\t17:17:53\tSundaes\tLick it\t1.0\tRegular\tL806898\tNo Whipped Cream\t£11.00\t£0.00\t£11.00\t£0.00\t£11.00\tTR5\tPAY5\tSquare Terminal 0864\tOreo\thttps://square\tPayment\tTreat Street\tFor Here\t\t\tea\t1\t£0.00\tKajus Sabaliauskas\tTreat Street\tVisa\t9763
2026-08-31\t17:11:54\tToday's Specials\tViral Dubai Chocolate - Kunafa\t1.0\tRegular\t7937896\tCroffle, Raspberry Sorbet\t£14.25\t£0.00\t£14.25\t£0.00\t£14.25\tTR6\tPAY6\tSquare Terminal 0864\tExtra tray\thttps://square\tPayment\tTreat Street\tFor Here\t\t\tea\t1\t£0.00\tKajus Sabaliauskas\tTreat Street\tMasterCard\t6769
2026-08-31\t17:11:54\tWaffles, Pancakes, Cookie Doughs, Cheesecakes\tStrawberry Field\t1.0\tRegular\t662644W\tCookie dough, Oreo\t£11.00\t£0.00\t£11.00\t£0.00\t£11.00\tTR6\tPAY6\tSquare Terminal 0864\tStrawberries\thttps://square\tPayment\tTreat Street\tFor Here\t\t\tea\t1\t£0.00\tKajus Sabaliauskas\tTreat Street\tMasterCard\t6769
2026-08-31\t17:11:54\tGelato & Sorbet Scoops\t1 Scoop\t1.0\tRegular\t8800416\tOreo Gelato\t£3.00\t£0.00\t£3.00\t£0.00\t£3.00\tTR6\tPAY6\tSquare Terminal 0864\t\thttps://square\tPayment\tTreat Street\tFor Here\t\t\tea\t1\t£0.00\tKajus Sabaliauskas\tTreat Street\tMasterCard\t6769
2026-08-31\t17:07:51\tWaffles, Pancakes, Cookie Doughs, Cheesecakes\tBiscofia\t1.0\tRegular\t518589X\tLiege Waffle\t£11.50\t£0.00\t£11.50\t£0.00\t£11.50\tTR7\tPAY7\tSquare Terminal 0864\tExtra sauces\thttps://square\tPayment\tTreat Street\tFor Here\t\tZak Chaleif\tea\t1\t£0.00\tKajus Sabaliauskas\tTreat Street\tVisa\t7088
2026-08-31\t17:06:13\tPremium Shakes\tOreo Milkshake\t1.0\tRegular\tL491010\tWhipped Cream\t£7.20\t£0.00\t£7.20\t£0.00\t£7.20\tTR8\tPAY8\tSquare Register 1350\t\thttps://square\tPayment\tTreat Street\tFor Here\t\t\tea\t1\t£0.00\tEllie Gale\tTreat Street\tVisa\t1836
2026-08-31\t17:06:13\tMilkshakes\tGelato Shake\t1.0\tRegular\t367182V\tVanilla Gelato, Vanilla Gelato\t£7.70\t£0.00\t£7.70\t£0.00\t£7.70\tTR8\tPAY8\tSquare Register 1350\t\thttps://square\tPayment\tTreat Street\tFor Here\t\t\tea\t1\t£0.00\tEllie Gale\tTreat Street\tVisa\t1836
2026-08-31\t17:06:13\tMilkshakes\tGelato Shake\t1.0\tRegular\t367182V\tStrawberry Gelato, Vanilla Gelato\t£7.70\t£0.00\t£7.70\t£0.00\t£7.70\tTR8\tPAY8\tSquare Register 1350\t\thttps://square\tPayment\tTreat Street\tFor Here\t\t\tea\t1\t£0.00\tEllie Gale\tTreat Street\tVisa\t1836
2026-08-31\t17:06:13\tWaffles, Pancakes, Cookie Doughs, Cheesecakes\tEL Fudgee\t1.0\tRegular\tY650451\tCheesecake, Whipped Cream\t£10.00\t£0.00\t£10.00\t£0.00\t£10.00\tTR8\tPAY8\tSquare Register 1350\tBrownie\thttps://square\tPayment\tTreat Street\tFor Here\t\t\tea\t1\t£0.00\tEllie Gale\tTreat Street\tVisa\t1836
2026-08-31\t17:02:57\tNone\tRed Wedding\t1.0\tRegular\t934238R\t\t£7.00\t-£1.40\t£5.60\t£0.00\t£5.60\tTR9\tPAY9\tSquare Terminal 0864\tHoney buffalo\thttps://square\tPayment\tTreat Street\tFor Here\t\t\tea\t1\t£0.00\tKajus Sabaliauskas\tTreat Street\tMasterCard\t7237
2026-08-31\t17:02:57\tFully Funked Fries\tPapi Chulo\t1.0\tRegular\t4953168\tNo Extra\t£6.00\t-£1.20\t£4.80\t£0.00\t£4.80\tTR9\tPAY9\tSquare Terminal 0864\tCajun fries\thttps://square\tPayment\tTreat Street\tFor Here\t\t\tea\t1\t£0.00\tKajus Sabaliauskas\tTreat Street\tMasterCard\t7237
2026-08-31\t17:01:08\tWaffles, Pancakes, Cookie Doughs, Cheesecakes\tBiscofia\t1.0\tRegular\t518589X\tCroffle, No Side\t£11.50\t£0.00\t£11.50\t£0.00\t£11.50\tTR10\tPAY10\tSquare Terminal 0864\tBiscoff\thttps://square\tPayment\tTreat Street\t\t\tHassan Mukhtar\tea\t1\t£0.00\t\tTreat Street\tMasterCard\t8945
2026-08-31\t16:00:53\tBurgers\tLouisiana\t2.0\tRegular\tK199704\tBrioche Bun, Plain Fries\t£26.00\t-£5.20\t£20.80\t£0.00\t£20.80\tTR11\tPAY11\tSquare Register 1350\tBurger\thttps://square\tPayment\tTreat Street\tFor Here\t\tTate Hodgson\tea\t2\t£0.00\tTate Hodgson\tTreat Street\tVisa\t3567
2026-08-31\t15:54:44\tNone\t5£ Darts for 30 Minutes\t-2.0\tRegular\t556902Y\t\t-£10.00\t£0.00\t-£10.00\t£0.00\t-£10.00\tTR12\tPAY12\tSquare Terminal 0864\tCancelled Order\thttps://square\tRefund\tTreat Street\t\t\t\t\tea\t-2\t£0.00\t\tTreat Street\t\t
2026-08-31\t15:49:47\tNone\t5£ Darts for 30 Minutes\t2.0\tRegular\t556902Y\t\t£10.00\t£0.00\t£10.00\t£0.00\t£10.00\tTR13\tPAY13\tSquare Terminal 0864\t\thttps://square\tPayment\tTreat Street\tFor Here\t\t\tea\t2\t£0.00\tTate Hodgson\tTreat Street\t\t
2026-08-31\t13:14:15\tToday's Specials\tViral Dubai Chocolate - Kunafa\t1.0\tRegular\t7937896\tCroffle, Raspberry Sorbet\t£14.25\t£0.00\t£14.25\t£0.00\t£14.25\tTR14\tPAY14\tSquare Register 1350\tKunafa\thttps://square\tPayment\tTreat Street\tFor Here\t\t\tea\t1\t£0.00\tNatalia Shakir\tTreat Street\tVisa\t5892
2026-08-31\t13:14:15\tChick n Waffles\tUncle G\t1.0\tRegular\t1361598\tPlain Fries\t£14.50\t£0.00\t£14.50\t£0.00\t£14.50\tTR14\tPAY14\tSquare Register 1350\tTandoori\thttps://square\tPayment\tTreat Street\tFor Here\t\t\tea\t1\t£0.00\tNatalia Shakir\tTreat Street\tVisa\t5892
2026-08-31\t13:14:15\tChick n Waffles\tOG\t1.0\tRegular\t5111244\tCajun Spiced Fries\t£14.00\t£0.00\t£14.00\t£0.00\t£14.00\tTR14\tPAY14\tSquare Register 1350\tMaple syrup\thttps://square\tPayment\tTreat Street\tFor Here\t\t\tea\t1\t£0.00\tNatalia Shakir\tTreat Street\tVisa\t5892
2026-08-31\t13:14:15\tWaffles, Pancakes, Cookie Doughs, Cheesecakes\tUncomplicated\t1.0\tRegular\t1633611\tWaffle, Soft Serve\t£9.50\t£0.00\t£9.50\t£0.00\t£9.50\tTR14\tPAY14\tSquare Register 1350\tMaple\thttps://square\tPayment\tTreat Street\tFor Here\t\t\tea\t1\t£0.00\tNatalia Shakir\tTreat Street\tVisa\t5892
2026-08-31\t13:14:15\tWaffles, Pancakes, Cookie Doughs, Cheesecakes\tBanoffee\t1.0\tRegular\t316502P\tWaffle, Soft Serve\t£11.00\t£0.00\t£11.00\t£0.00\t£11.00\tTR14\tPAY14\tSquare Register 1350\tBanana\thttps://square\tPayment\tTreat Street\tFor Here\t\t\tea\t1\t£0.00\tNatalia Shakir\tTreat Street\tVisa\t5892
2026-08-31\t13:14:15\tSoft Drinks\tCoca Cola\t3.0\tRegular\t587102C\t\t£9.00\t£0.00\t£9.00\t£0.00\t£9.00\tTR14\tPAY14\tSquare Register 1350\t\thttps://square\tPayment\tTreat Street\tFor Here\t\t\tea\t3\t£0.00\tNatalia Shakir\tTreat Street\tVisa\t5892
2026-08-31\t13:14:15\tSoft Drinks\tFanta Orange\t1.0\tRegular\tE467987\t\t£3.00\t£0.00\t£3.00\t£0.00\t£3.00\tTR14\tPAY14\tSquare Register 1350\t\thttps://square\tPayment\tTreat Street\tFor Here\t\t\tea\t1\t£0.00\tNatalia Shakir\tTreat Street\tVisa\t5892`;

console.log('--- Ingesting User Square POS Report ---');
const parsedRows = [];
FranchiseAnalytics.parseChunkedCSV(
  rawSquareData,
  (row) => {
    parsedRows.push(row);
  },
  () => {
    console.log(`Parsed ${parsedRows.length} Square POS transactions.`);
  }
);

const analysis = FranchiseAnalytics.analyzeDailyPerformance(parsedRows, [], [], []);

console.log('\n=============================================');
console.log('REAL EXECUTIVE ANALYSIS OF SQUARE POS REPORT');
console.log('=============================================');
console.log(`Total Orders Processed: ${analysis.total_orders}`);
console.log(`Total Gross Revenue:    £${analysis.gross_sales.toFixed(2)}`);
console.log(`Total Discounts Given:  £${analysis.discounts.toFixed(2)}`);
console.log(`Net Sales (True Cash):  £${analysis.net_sales.toFixed(2)}`);
console.log(`Estimated Food Cost:    £${analysis.food_cost.toFixed(2)}`);
console.log(`Net Operating Profit:   £${analysis.net_profit.toFixed(2)}`);
console.log(`Net Cash Margin:        ${analysis.net_margin_pct}%`);

console.log('\n--- TOP MENU CONTRIBUTORS (BCG MATRIX) ---');
console.table(analysis.menu_matrix.map(m => ({
  'Dish / Item Name': m.item_name,
  'Units Sold': m.units_sold,
  'Gross Revenue': `£${m.gross_revenue.toFixed(2)}`,
  'Unit Cash Margin': `£${m.unit_margin.toFixed(2)}`,
  'BCG Classification': m.category
})));

console.log('\n--- HOURLY DISTRIBUTION ---');
console.table(analysis.hourly_trends.filter(h => h.orders > 0).map(h => ({
  'Time Slot': h.label,
  'Orders Count': h.orders
})));

console.log('\n--- AI STRATEGIC EXECUTIVE INSIGHTS ---');
console.log('STRENGTHS:', analysis.insights.top_3_strengths);
console.log('LEAKS:', analysis.insights.top_3_leaks);
console.log('NEXT ACTIONS:', analysis.insights.recommended_next_steps);
