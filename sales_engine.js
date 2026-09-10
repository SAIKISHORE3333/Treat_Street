/**
 * Treat Street - Automated Multi-Platform Daily Sales Consolidation Pipeline
 * & Franchise Intelligence Engine (Master Sales & Depletion Ledger)
 * 
 * Powered by ALAIYA Architecture
 * 
 * Channels:
 * 1. Square (In-store POS CSV/Excel)
 * 2. Uber Eats (Delivery aggregator CSV/Excel)
 * 3. Just Eat (Delivery aggregator CSV/Excel)
 * 4. Deliveroo (Delivery aggregator CSV/Excel)
 * 
 * Includes:
 * - Multi-format File Ingestion & Schema Adapters
 * - Universal Transaction Normalization
 * - Alias Matching Dictionary & Unmapped Resolution Queue
 * - Master Consolidated Sales Dataset Generation
 * - Performance Analytics & AI Insights Engine
 * - Theoretical Recipe Stock Depletion & 'CRITICAL_LOW_STOCK_ALARM' Handshake
 * - Strict Isolated Sandbox DEMO MODE protection
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SalesEngine = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  // -------------------------------------------------------------
  // 1. Standard Master SOP Recipe Definitions
  // (Provides portion breakdowns for raw ingredients and prepped batches)
  // -------------------------------------------------------------
  const MASTER_SOP_RECIPES = [
    {
      id: 'sop-cookie-dough',
      title: 'Chocolate Chip Cookie Dough',
      category: 'Desserts',
      yield: 1,
      ingredients: [
        { name: 'Cookie Dough Base', quantity: 120, unit: 'g' },
        { name: 'Belgian Milk Chocolate Chips', quantity: 25, unit: 'g' },
        { name: 'Comelle Ice Cream Mix 1 Litre', quantity: 0.1, unit: 'l' }
      ]
    },
    {
      id: 'sop-banoffee-waffle',
      title: 'Banoffee',
      category: 'Waffles & Crepes',
      yield: 1,
      ingredients: [
        { name: 'Liege Waffle Base', quantity: 1, unit: 'unit' },
        { name: 'Fresh Banana', quantity: 1, unit: 'unit' },
        { name: 'Lotus Biscoff Topping Sauce 1kg', quantity: 40, unit: 'g' },
        { name: 'Whipped Cream Aerosol Can', quantity: 30, unit: 'g' }
      ]
    },
    {
      id: 'sop-biscofia-waffle',
      title: 'Biscofia',
      category: 'Waffles & Crepes',
      yield: 1,
      ingredients: [
        { name: 'Liege Waffle Base', quantity: 1, unit: 'unit' },
        { name: 'Biscoff Biscuit Crumbs 750g', quantity: 30, unit: 'g' },
        { name: 'Lotus Biscoff Topping Sauce 1kg', quantity: 45, unit: 'g' }
      ]
    },
    {
      id: 'sop-twist-lick-dunk',
      title: 'Twist it, Lick it, Dunk it',
      category: 'Pancakes & Waffles',
      yield: 1,
      ingredients: [
        { name: 'American Pancake Mix', quantity: 150, unit: 'g' },
        { name: 'Oreo Crushed Cookie Pieces 400g', quantity: 35, unit: 'g' },
        { name: 'Belgian White Chocolate Sauce', quantity: 35, unit: 'g' },
        { name: 'Comelle Ice Cream Mix 1 Litre', quantity: 0.1, unit: 'l' }
      ]
    },
    {
      id: 'sop-strawberry-field',
      title: 'Strawberry Field',
      category: 'Waffles & Crepes',
      yield: 1,
      ingredients: [
        { name: 'Liege Waffle Base', quantity: 1, unit: 'unit' },
        { name: 'Fresh Strawberries', quantity: 60, unit: 'g' },
        { name: 'Belgian Milk Chocolate Sauce', quantity: 40, unit: 'g' },
        { name: 'Comelle Ice Cream Mix 1 Litre', quantity: 0.1, unit: 'l' }
      ]
    },
    {
      id: 'sop-uncomplicated',
      title: 'Uncomplicated',
      category: 'Waffles & Crepes',
      yield: 1,
      ingredients: [
        { name: 'Liege Waffle Base', quantity: 1, unit: 'unit' },
        { name: 'Maple Flavoured Syrup 1 Litre', quantity: 30, unit: 'ml' },
        { name: 'Comelle Ice Cream Mix 1 Litre', quantity: 0.1, unit: 'l' }
      ]
    },
    {
      id: 'sop-dubai-kunafa',
      title: 'Viral Dubai Chocolate - Kunafa',
      category: 'Specials',
      yield: 1,
      ingredients: [
        { name: 'Kataifi Pastry Dough', quantity: 80, unit: 'g' },
        { name: 'Pistachio Butter Sauce Pure', quantity: 50, unit: 'g' },
        { name: 'Belgian Milk Chocolate Chips', quantity: 60, unit: 'g' },
        { name: 'Ghee Clarified Butter', quantity: 20, unit: 'g' }
      ]
    },
    {
      id: 'sop-gelato-shake',
      title: 'Gelato Shake',
      category: 'Milkshakes',
      yield: 1,
      ingredients: [
        { name: 'Comelle Ice Cream Mix 1 Litre', quantity: 0.25, unit: 'l' },
        { name: 'Semi Skimmed Milk 2 Litre', quantity: 0.15, unit: 'l' },
        { name: 'Flavour Syrup Base', quantity: 30, unit: 'ml' }
      ]
    },
    {
      id: 'sop-white-choc-shake',
      title: 'Luxury White Choc Milkshake',
      category: 'Milkshakes',
      yield: 1,
      ingredients: [
        { name: 'Comelle Ice Cream Mix 1 Litre', quantity: 0.25, unit: 'l' },
        { name: 'Semi Skimmed Milk 2 Litre', quantity: 0.15, unit: 'l' },
        { name: 'Belgian White Chocolate Sauce', quantity: 45, unit: 'g' },
        { name: 'Whipped Cream Aerosol Can', quantity: 20, unit: 'g' }
      ]
    },
    {
      id: 'sop-oreo-shake',
      title: 'Oreo Milkshake',
      category: 'Milkshakes',
      yield: 1,
      ingredients: [
        { name: 'Comelle Ice Cream Mix 1 Litre', quantity: 0.25, unit: 'l' },
        { name: 'Semi Skimmed Milk 2 Litre', quantity: 0.15, unit: 'l' },
        { name: 'Oreo Crushed Cookie Pieces 400g', quantity: 30, unit: 'g' },
        { name: 'Belgian Milk Chocolate Sauce', quantity: 20, unit: 'g' }
      ]
    },
    {
      id: 'sop-gelato-scoop',
      title: '1 Scoop',
      category: 'Gelato',
      yield: 1,
      ingredients: [
        { name: 'Artisan Gelato Tub Base', quantity: 0.1, unit: 'unit' },
        { name: 'Waffle Cone Deluxe', quantity: 1, unit: 'unit' }
      ]
    },
    {
      id: 'sop-ragin-cajuns',
      title: 'Ragin Cajuns',
      category: 'Savory & Chicken',
      yield: 1,
      ingredients: [
        { name: 'Crispy Chicken Tenders 1kg', quantity: 180, unit: 'g' },
        { name: 'Cajun Seasoning Blend', quantity: 15, unit: 'g' },
        { name: 'Chef Larder Fries 2.5kg', quantity: 150, unit: 'g' }
      ]
    },
    {
      id: 'sop-red-wedding',
      title: 'Red Wedding',
      category: 'Savory & Chicken',
      yield: 1,
      ingredients: [
        { name: 'Crispy Chicken Tenders 1kg', quantity: 180, unit: 'g' },
        { name: 'Honey Buffalo Hot Sauce 1L', quantity: 45, unit: 'ml' },
        { name: 'Ranch Dressing Dip', quantity: 30, unit: 'ml' }
      ]
    },
    {
      id: 'sop-louisiana-burger',
      title: 'Louisiana',
      category: 'Burgers',
      yield: 1,
      ingredients: [
        { name: 'Americana Gourmet Brioche Buns 48s', quantity: 1, unit: 'unit' },
        { name: 'Buttermilk Fried Chicken Patty', quantity: 1, unit: 'unit' },
        { name: 'Spicy Slaw Mix', quantity: 40, unit: 'g' },
        { name: 'Chef Larder Fries 2.5kg', quantity: 150, unit: 'g' }
      ]
    },
    {
      id: 'sop-papi-chulo',
      title: 'Papi Chulo',
      category: 'Loaded Fries',
      yield: 1,
      ingredients: [
        { name: 'Chef Larder Fries 2.5kg', quantity: 220, unit: 'g' },
        { name: 'Nacho Warm Cheese Sauce', quantity: 50, unit: 'g' },
        { name: 'Jalapeno Slices in Brine', quantity: 25, unit: 'g' },
        { name: 'Crispy Onions Topping', quantity: 20, unit: 'g' }
      ]
    },
    {
      id: 'sop-uncle-g',
      title: 'Uncle G',
      category: 'Chick n Waffles',
      yield: 1,
      ingredients: [
        { name: 'Liege Waffle Base', quantity: 1, unit: 'unit' },
        { name: 'Crispy Chicken Tenders 1kg', quantity: 180, unit: 'g' },
        { name: 'Tandoori Glaze Sauce', quantity: 40, unit: 'ml' },
        { name: 'Chef Larder Fries 2.5kg', quantity: 150, unit: 'g' }
      ]
    },
    {
      id: 'sop-og-waffle-chicken',
      title: 'OG',
      category: 'Chick n Waffles',
      yield: 1,
      ingredients: [
        { name: 'Liege Waffle Base', quantity: 1, unit: 'unit' },
        { name: 'Crispy Chicken Tenders 1kg', quantity: 180, unit: 'g' },
        { name: 'Maple Flavoured Syrup 1 Litre', quantity: 45, unit: 'ml' },
        { name: 'Chef Larder Fries 2.5kg', quantity: 150, unit: 'g' }
      ]
    },
    {
      id: 'sop-still-water',
      title: 'Still Water',
      category: 'Beverages',
      yield: 1,
      ingredients: [
        { name: 'Harrogate Spring Water 500ml', quantity: 1, unit: 'unit' }
      ]
    },
    {
      id: 'sop-coca-cola',
      title: 'Coca Cola',
      category: 'Beverages',
      yield: 1,
      ingredients: [
        { name: 'Coca Cola Cans 330ml 24s', quantity: 1, unit: 'unit' }
      ]
    },
    {
      id: 'sop-fanta-orange',
      title: 'Fanta Orange',
      category: 'Beverages',
      yield: 1,
      ingredients: [
        { name: 'Fanta Orange Cans 330ml 24s', quantity: 1, unit: 'unit' }
      ]
    }
  ];

  // -------------------------------------------------------------
  // 2. Default Channel Aliases Dictionary
  // (Maps channel specific product strings to Master SOP Recipe names)
  // -------------------------------------------------------------
  const DEFAULT_CHANNEL_ALIASES = [
    // Square / In-Store
    { external_name: 'Cookie dough', recipe_name: 'Chocolate Chip Cookie Dough', channel: 'Square' },
    { external_name: 'Cookie Dough Base', recipe_name: 'Chocolate Chip Cookie Dough', channel: 'Square' },
    { external_name: 'Biscofia Waffle', recipe_name: 'Biscofia', channel: 'Square' },
    { external_name: 'Cajun Chicken Tenders', recipe_name: 'Ragin Cajuns', channel: 'Square' },
    { external_name: 'Oreo Shake Reg', recipe_name: 'Oreo Milkshake', channel: 'Square' },
    { external_name: 'Vanilla Scoop', recipe_name: '1 Scoop', channel: 'Square' },
    { external_name: 'Bubblegum Gelato 1x', recipe_name: '1 Scoop', channel: 'Square' },

    // Uber Eats
    { external_name: 'Uber - Signature Cookie Dough (Warm)', recipe_name: 'Chocolate Chip Cookie Dough', channel: 'Uber Eats' },
    { external_name: 'Warm Choc Chip Cookie Dough', recipe_name: 'Chocolate Chip Cookie Dough', channel: 'Uber Eats' },
    { external_name: 'Biscoff Craze Liege Waffle', recipe_name: 'Biscofia', channel: 'Uber Eats' },
    { external_name: 'Banoffee Dream Belgian Waffle', recipe_name: 'Banoffee', channel: 'Uber Eats' },
    { external_name: 'Dubai Kunafa Crunch Waffle (Viral)', recipe_name: 'Viral Dubai Chocolate - Kunafa', channel: 'Uber Eats' },
    { external_name: 'Kinder & Oreo Stack Pancakes', recipe_name: 'Twist it, Lick it, Dunk it', channel: 'Uber Eats' },
    { external_name: 'Loaded Papi Chulo Cheesy Fries', recipe_name: 'Papi Chulo', channel: 'Uber Eats' },
    { external_name: 'Louisiana Buttermilk Chicken Burger & Fries', recipe_name: 'Louisiana', channel: 'Uber Eats' },
    { external_name: 'Thick Oreo Gelato Shake', recipe_name: 'Oreo Milkshake', channel: 'Uber Eats' },
    { external_name: 'Classic White Choc Luxury Shake', recipe_name: 'Luxury White Choc Milkshake', channel: 'Uber Eats' },
    { external_name: 'Coke 330ml Can', recipe_name: 'Coca Cola', channel: 'Uber Eats' },

    // Just Eat
    { external_name: 'JE_Cookie_Dough_Warm', recipe_name: 'Chocolate Chip Cookie Dough', channel: 'Just Eat' },
    { external_name: 'JE Biscoff Waffle Supreme', recipe_name: 'Biscofia', channel: 'Just Eat' },
    { external_name: 'JE Banoffee Toffee Waffle', recipe_name: 'Banoffee', channel: 'Just Eat' },
    { external_name: 'Strawberry Sensation Waffle', recipe_name: 'Strawberry Field', channel: 'Just Eat' },
    { external_name: 'Dubai Kunafa Chocolate Special', recipe_name: 'Viral Dubai Chocolate - Kunafa', channel: 'Just Eat' },
    { external_name: 'Ragin Cajun Chicken Strip Meal', recipe_name: 'Ragin Cajuns', channel: 'Just Eat' },
    { external_name: 'Honey Buffalo Red Wedding Strips', recipe_name: 'Red Wedding', channel: 'Just Eat' },
    { external_name: 'Louisiana Burger Meal Deal', recipe_name: 'Louisiana', channel: 'Just Eat' },
    { external_name: 'Fanta Can 330ml', recipe_name: 'Fanta Orange', channel: 'Just Eat' },

    // Deliveroo
    { external_name: 'DELIV - Cookie Dough Warm with Gelato', recipe_name: 'Chocolate Chip Cookie Dough', channel: 'Deliveroo' },
    { external_name: 'DELIV - Biscoff Liege Waffle', recipe_name: 'Biscofia', channel: 'Deliveroo' },
    { external_name: 'DELIV - Banoffee Fresh Waffle', recipe_name: 'Banoffee', channel: 'Deliveroo' },
    { external_name: 'DELIV - Twist It Dunk It Pancake Stack', recipe_name: 'Twist it, Lick it, Dunk it', channel: 'Deliveroo' },
    { external_name: 'DELIV - Viral Kunafa Dubai Chocolate Waffle', recipe_name: 'Viral Dubai Chocolate - Kunafa', channel: 'Deliveroo' },
    { external_name: 'DELIV - Louisiana Crispy Chicken Burger', recipe_name: 'Louisiana', channel: 'Deliveroo' },
    { external_name: 'DELIV - Papi Chulo Cheesy Loaded Fries', recipe_name: 'Papi Chulo', channel: 'Deliveroo' },
    { external_name: 'DELIV - Uncle G Tandoori Chicken Waffle', recipe_name: 'Uncle G', channel: 'Deliveroo' },
    { external_name: 'DELIV - Oreo Cream Milkshake', recipe_name: 'Oreo Milkshake', channel: 'Deliveroo' }
  ];

  // -------------------------------------------------------------
  // 3. Engine Core Implementation
  // -------------------------------------------------------------
  const SalesEngine = {
    // Mode: Live Production by default (Deployed), with user-toggleable Sandbox Demo Mode
    get isDemoMode() {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem('ts_sales_ledger_mode') === 'demo';
      }
      return false; // Live Production
    },
    set isDemoMode(val) {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('ts_sales_ledger_mode', val ? 'demo' : 'production');
      }
    },

    // -----------------------------------------------------------
    // Normalizers
    // -----------------------------------------------------------
    normalizeText(str) {
      if (!str || typeof str !== 'string') return '';
      return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\([^)]*\)/g, ' ')
        .replace(/\[[^\]]*\]/g, ' ')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    },

    cleanNumber(val, defaultVal = 0) {
      if (val === null || val === undefined) return defaultVal;
      if (typeof val === 'number') return isNaN(val) ? defaultVal : val;
      let str = val.toString().trim();
      // Handle accounting negative formats: (10.00) or (£10.00)
      const isNegative = str.startsWith('-') || (str.startsWith('(') && str.endsWith(')'));
      const clean = str.replace(/[^0-9.]+/g, '');
      const num = parseFloat(clean);
      if (isNaN(num)) return defaultVal;
      return isNegative ? -num : num;
    },

    normalizeDate(dateStr) {
      if (!dateStr) return new Date().toISOString().split('T')[0];
      const s = dateStr.trim();
      // Matches YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
      // Matches DD/MM/YYYY or DD-MM-YYYY
      const dmy = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
      if (dmy) {
        const day = dmy[1].padStart(2, '0');
        const month = dmy[2].padStart(2, '0');
        const year = dmy[3];
        return `${year}-${month}-${day}`;
      }
      const parsed = new Date(s);
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString().split('T')[0];
      }
      return new Date().toISOString().split('T')[0];
    },

    // -----------------------------------------------------------
    // Delimited (CSV/TSV) Parser
    // -----------------------------------------------------------
    parseDelimited(text) {
      if (!text || typeof text !== 'string') return [];
      const cleanText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      const lines = cleanText.split('\n');
      const result = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line || !line.trim()) continue;

        const row = [];
        let curr = '';
        let inQuotes = false;
        // Determine delimiter by line 0 if possible, or support comma & tab
        const delimiter = line.includes('\t') && !line.includes('","') ? '\t' : ',';

        for (let j = 0; j < line.length; j++) {
          const c = line[j];
          const next = line[j + 1];

          if (c === '"' || c === "'") {
            if (inQuotes && next === c) {
              curr += c;
              j++;
            } else {
              inQuotes = !inQuotes;
            }
          } else if (c === delimiter && !inQuotes) {
            row.push(curr.trim());
            curr = '';
          } else {
            curr += c;
          }
        }
        row.push(curr.trim());
        if (row.some(val => val !== '')) {
          result.push(row);
        }
      }
      return result;
    },

    // -----------------------------------------------------------
    // Excel Ingestion (SheetJS integration)
    // -----------------------------------------------------------
    parseExcelArrayBuffer(buffer) {
      const XLSX = (typeof window !== 'undefined' && window.XLSX) || (typeof require !== 'undefined' && require('xlsx'));
      if (!XLSX) {
        throw new Error("SheetJS (XLSX) library is required to parse Excel spreadsheets.");
      }
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
      return sheetData;
    },

    // -----------------------------------------------------------
    // 4 Channel Schema Adapters
    // -----------------------------------------------------------
    detectChannel(headers, filename = '') {
      const lower = headers.map(h => (h || '').toLowerCase().trim());
      const lowerFile = (filename || '').toLowerCase();

      // 1. Deliveroo
      if (
        lower.some(h => h.includes('deliveroo') || h === 'item gross' || (h.includes('order id') && h.includes('item name'))) ||
        lowerFile.includes('deliveroo')
      ) {
        return 'Deliveroo';
      }

      // 2. Uber Eats
      if (
        lower.some(h => h.includes('uber') || h.includes('items quantity') || h.includes('order number') && h.includes('customisations')) ||
        lowerFile.includes('uber') || lowerFile.includes('ubereats')
      ) {
        return 'Uber Eats';
      }

      // 3. Just Eat
      if (
        lower.some(h => h.includes('just eat') || h.includes('justeat') || h.includes('restaurant reference') || h.includes('product name')) ||
        lowerFile.includes('just eat') || lowerFile.includes('justeat')
      ) {
        return 'Just Eat';
      }

      // 4. Square (In-store POS)
      if (
        lower.some(h => h.includes('square') || h.includes('modifiers applied') || h.includes('price point name') || h.includes('transaction id')) ||
        lowerFile.includes('square') || lowerFile.includes('pos') || lowerFile.includes('till')
      ) {
        return 'Square';
      }

      // Fallback detection
      if (lower.some(h => h.includes('channel') || h.includes('pos'))) return 'Square';
      return 'Generic / Auto-Detected';
    },

    adaptChannelRow(rowObj, channel) {
      // Normalizes a row into a standardized transaction
      const normalized = {
        date: '',
        time: '',
        channel: channel,
        raw_name: '',
        quantity: 1,
        gross_sales: 0,
        commission: 0,
        net_payout: 0,
        discounts: 0,
        currency: 'GBP'
      };

      const keys = Object.keys(rowObj);
      const findKey = (priorityPatterns) => {
        // First pass: exact match
        for (const p of priorityPatterns) {
          for (const k of keys) {
            const lower = k.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/^_+|_+$/g, '');
            if (lower === p) return rowObj[k];
          }
        }
        // Second pass: word boundary / inclusion match
        for (const p of priorityPatterns) {
          for (const k of keys) {
            const lower = k.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/^_+|_+$/g, '');
            if (lower.split('_').includes(p) || lower.startsWith(p + '_') || lower.endsWith('_' + p)) {
              return rowObj[k];
            }
          }
        }
        return null;
      };

      if (channel === 'Square') {
        normalized.date = this.normalizeDate(findKey(['date', 'created_at', 'day']));
        normalized.time = findKey(['time', 'hour']) || '12:00:00';
        normalized.raw_name = (findKey(['item', 'item_name', 'description', 'product_name', 'product']) || '').trim();
        normalized.quantity = this.cleanNumber(findKey(['qty', 'quantity', 'count', 'items_quantity']), 1);
        normalized.discounts = Math.abs(this.cleanNumber(findKey(['discounts', 'discount', 'promo']), 0));
        normalized.gross_sales = this.cleanNumber(findKey(['gross_sales', 'product_sales', 'total_sales', 'sales', 'price']), 0);
        normalized.commission = Math.abs(this.cleanNumber(findKey(['commission', 'fee', 'charge']), 0));
        normalized.net_payout = this.cleanNumber(findKey(['net_sales', 'net']), normalized.gross_sales - normalized.discounts - normalized.commission);
      } else if (channel === 'Uber Eats') {
        normalized.date = this.normalizeDate(findKey(['order_date', 'date', 'time']));
        normalized.time = findKey(['order_time', 'time']) || '12:00:00';
        normalized.raw_name = (findKey(['item_name', 'menu_item', 'item', 'product_name', 'product']) || '').trim();
        normalized.quantity = this.cleanNumber(findKey(['items_quantity', 'quantity', 'qty', 'count']), 1);
        normalized.gross_sales = this.cleanNumber(findKey(['gross_sales', 'item_price', 'sales', 'price']), 0);
        normalized.discounts = Math.abs(this.cleanNumber(findKey(['promo', 'discount', 'voucher']), 0));
        normalized.commission = Math.abs(this.cleanNumber(findKey(['marketplace_fee', 'commission', 'service_fee', 'fee']), normalized.gross_sales * 0.30));
        normalized.net_payout = this.cleanNumber(findKey(['net_payout', 'net_sales', 'payout', 'net']), normalized.gross_sales - normalized.commission - normalized.discounts);
      } else if (channel === 'Just Eat') {
        normalized.date = this.normalizeDate(findKey(['date', 'order_date', 'time']));
        normalized.time = findKey(['order_time', 'time']) || '12:00:00';
        normalized.raw_name = (findKey(['product_name', 'item_name', 'item', 'product']) || '').trim();
        normalized.quantity = this.cleanNumber(findKey(['quantity', 'qty', 'count']), 1);
        normalized.gross_sales = this.cleanNumber(findKey(['sub_total', 'item_price', 'gross_sales', 'price', 'gross']), 0);
        normalized.discounts = Math.abs(this.cleanNumber(findKey(['discount', 'voucher', 'promo']), 0));
        normalized.commission = Math.abs(this.cleanNumber(findKey(['commission_charge', 'commission', 'just_eat_fee', 'fee']), normalized.gross_sales * 0.28));
        normalized.net_payout = this.cleanNumber(findKey(['net_payout', 'net_amount', 'net']), normalized.gross_sales - normalized.commission - normalized.discounts);
      } else if (channel === 'Deliveroo') {
        normalized.date = this.normalizeDate(findKey(['order_date', 'date', 'timestamp', 'time']));
        normalized.time = findKey(['order_time', 'time']) || '12:00:00';
        normalized.raw_name = (findKey(['item_name', 'item', 'product_name', 'dish']) || '').trim();
        normalized.quantity = this.cleanNumber(findKey(['quantity', 'qty', 'count']), 1);
        normalized.gross_sales = this.cleanNumber(findKey(['item_gross', 'gross_sales', 'gross', 'price', 'total']), 0);
        normalized.discounts = Math.abs(this.cleanNumber(findKey(['discount', 'customer_discount']), 0));
        normalized.commission = Math.abs(this.cleanNumber(findKey(['commission', 'deliveroo_fee', 'fee']), normalized.gross_sales * 0.32));
        normalized.net_payout = this.cleanNumber(findKey(['net_payout', 'net_sales', 'net']), normalized.gross_sales - normalized.commission - normalized.discounts);
      } else {
        // Generic
        normalized.date = this.normalizeDate(findKey(['date', 'time', 'day']));
        normalized.time = findKey(['time']) || '12:00:00';
        normalized.raw_name = (findKey(['item_name', 'item', 'product_name', 'product', 'dish', 'description', 'name']) || '').trim();
        normalized.quantity = this.cleanNumber(findKey(['qty', 'quantity', 'count', 'units']), 1);
        normalized.gross_sales = this.cleanNumber(findKey(['gross_sales', 'gross', 'sales', 'price', 'total', 'amount']), 0);
        normalized.discounts = Math.abs(this.cleanNumber(findKey(['discounts', 'discount', 'promo']), 0));
        normalized.commission = Math.abs(this.cleanNumber(findKey(['commission', 'fee']), normalized.gross_sales * 0.25));
        normalized.net_payout = this.cleanNumber(findKey(['net_payout', 'net', 'payout']), normalized.gross_sales - normalized.commission - normalized.discounts);
      }

      // Cleanup
      if (normalized.net_payout <= 0 && normalized.gross_sales > 0) {
        normalized.net_payout = Math.max(0, normalized.gross_sales - normalized.commission - normalized.discounts);
      }

      return normalized;
    },

    parseUniversalFile(fileData, filename = '') {
      let rawGrid = [];
      if (typeof fileData === 'string') {
        rawGrid = this.parseDelimited(fileData);
      } else if (fileData instanceof ArrayBuffer || (typeof Buffer !== 'undefined' && Buffer.isBuffer(fileData))) {
        rawGrid = this.parseExcelArrayBuffer(fileData);
      } else if (Array.isArray(fileData)) {
        rawGrid = fileData;
      }

      if (rawGrid.length < 2) {
        return { channel: 'Unknown', filename, items: [], rawRowsCount: 0 };
      }

      const headers = rawGrid[0].map(h => (h || '').toString().trim());
      const channel = this.detectChannel(headers, filename);
      const items = [];

      for (let i = 1; i < rawGrid.length; i++) {
        const row = rawGrid[i];
        if (!row || row.length === 0) continue;

        const rowObj = {};
        for (let c = 0; c < headers.length; c++) {
          rowObj[headers[c]] = row[c] !== undefined ? row[c].toString().trim() : '';
        }

        const adapted = this.adaptChannelRow(rowObj, channel);
        if (!adapted.raw_name || adapted.raw_name.toLowerCase() === 'total' || adapted.raw_name.toLowerCase() === 'summary') {
          continue;
        }

        items.push({
          ...adapted,
          source_filename: filename,
          row_index: i
        });
      }

      return {
        channel,
        filename,
        headers,
        items,
        rawRowsCount: items.length
      };
    },

    // -----------------------------------------------------------
    // 5. Alias Matching & Resolution Queue
    // -----------------------------------------------------------
    getAliases() {
      // In Sandbox Demo Mode, strictly read from demo storage with fallback to default demo aliases
      if (this.isDemoMode) {
        try {
          const stored = localStorage.getItem('ts_demo_item_aliases');
          if (stored) return JSON.parse(stored);
        } catch (e) {}
        return [...DEFAULT_CHANNEL_ALIASES];
      }

      // In Production Mode, read from production storage
      try {
        const prodStored = localStorage.getItem('ts_item_aliases');
        if (prodStored) return JSON.parse(prodStored);
      } catch (e) {}
      return [...DEFAULT_CHANNEL_ALIASES];
    },

    saveAlias(externalName, recipeName, channel = 'ALL') {
      const aliasRecord = {
        external_name: externalName.trim(),
        normalized_name: this.normalizeText(externalName),
        recipe_name: recipeName.trim(),
        channel: channel.toUpperCase(),
        created_at: new Date().toISOString()
      };

      const storageKey = this.isDemoMode ? 'ts_demo_item_aliases' : 'ts_item_aliases';
      let list = [];
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) list = JSON.parse(stored);
      } catch (e) {}

      // Replace or insert
      const idx = list.findIndex(
        a => a.normalized_name === aliasRecord.normalized_name && (a.channel || 'ALL') === aliasRecord.channel
      );
      if (idx >= 0) {
        list[idx] = aliasRecord;
      } else {
        list.push(aliasRecord);
      }

      try {
        localStorage.setItem(storageKey, JSON.stringify(list));
      } catch (e) {
        console.warn("Failed saving alias:", e);
      }

      return aliasRecord;
    },

    matchToMasterRecipe(rawName, channel, recipes, aliases) {
      const normRaw = this.normalizeText(rawName);
      if (!normRaw) {
        return { status: 'UNMAPPED', master_name: null, recipe_obj: null, match_type: null };
      }

      // 1. Direct match with canonical SOP recipe titles
      const exact = recipes.find(r => this.normalizeText(r.title || r.name) === normRaw);
      if (exact) {
        return {
          status: 'MATCHED',
          master_name: exact.title || exact.name,
          recipe_obj: exact,
          match_type: 'EXACT'
        };
      }

      // 2. Alias dictionary lookup (channel-specific first, then ALL)
      const chUpper = (channel || 'ALL').toUpperCase();
      const channelAlias = aliases.find(
        a => (a.normalized_name === normRaw || this.normalizeText(a.external_name) === normRaw) &&
             (a.channel || 'ALL').toUpperCase() === chUpper
      );
      const globalAlias = aliases.find(
        a => (a.normalized_name === normRaw || this.normalizeText(a.external_name) === normRaw) &&
             (a.channel || 'ALL').toUpperCase() === 'ALL'
      );

      const matchedAlias = channelAlias || globalAlias;
      if (matchedAlias) {
        const matchedRecipe = recipes.find(
          r => this.normalizeText(r.title || r.name) === this.normalizeText(matchedAlias.recipe_name)
        );
        return {
          status: 'MATCHED',
          master_name: matchedAlias.recipe_name,
          recipe_obj: matchedRecipe || null,
          match_type: 'ALIAS'
        };
      }

      // 3. Substring / Token Match Fallback
      for (const r of recipes) {
        const rNorm = this.normalizeText(r.title || r.name);
        if (normRaw.includes(rNorm) || rNorm.includes(normRaw)) {
          return {
            status: 'MATCHED',
            master_name: r.title || r.name,
            recipe_obj: r,
            match_type: 'FUZZY_SOP'
          };
        }
      }

      return {
        status: 'UNMAPPED',
        master_name: null,
        recipe_obj: null,
        match_type: null
      };
    },

    // -----------------------------------------------------------
    // 6. Master Consolidated Sales Dataset Generation
    // -----------------------------------------------------------
    consolidateSales(parsedFiles, options = {}) {
      const reportingDate = options.reportingDate || null; // null means all dates
      const recipes = options.recipes || MASTER_SOP_RECIPES;
      const aliases = options.aliases || this.getAliases();

      const ledgerMap = new Map(); // master_item_name -> row
      const unmappedMap = new Map(); // raw_name -> details
      
      let grandTotalUnits = 0;
      let grandTotalGross = 0;
      let grandTotalCommission = 0;
      let grandTotalNet = 0;
      let grandTotalDiscounts = 0;

      const channelTotals = {
        'Square': { units: 0, gross: 0, commission: 0, net: 0 },
        'Uber Eats': { units: 0, gross: 0, commission: 0, net: 0 },
        'Just Eat': { units: 0, gross: 0, commission: 0, net: 0 },
        'Deliveroo': { units: 0, gross: 0, commission: 0, net: 0 }
      };

      const availableDatesSet = new Set();

      for (const file of parsedFiles) {
        for (const item of file.items) {
          if (item.date) availableDatesSet.add(item.date);

          // Date filter
          if (reportingDate && reportingDate !== 'ALL' && item.date && item.date !== reportingDate) {
            continue;
          }

          const match = this.matchToMasterRecipe(item.raw_name, item.channel, recipes, aliases);

          if (match.status === 'MATCHED') {
            const masterName = match.master_name;
            if (!ledgerMap.has(masterName)) {
              ledgerMap.set(masterName, {
                master_item_name: masterName,
                recipe_obj: match.recipe_obj,
                match_type: match.match_type,
                square_units: 0,
                uber_eats_units: 0,
                just_eat_units: 0,
                deliveroo_units: 0,
                total_volume: 0,
                gross_revenue: 0,
                total_commissions: 0,
                net_revenue: 0,
                discounts_total: 0,
                channel_share: {
                  square_pct: 0,
                  uber_pct: 0,
                  just_eat_pct: 0,
                  deliveroo_pct: 0
                }
              });
            }

            const row = ledgerMap.get(masterName);
            const qty = item.quantity;
            row.total_volume += qty;
            row.gross_revenue += (item.gross_sales || 0);
            row.total_commissions += (item.commission || 0);
            row.net_revenue += (item.net_payout || 0);
            row.discounts_total += (item.discounts || 0);

            // Channel Breakdown
            if (item.channel === 'Square') {
              row.square_units += qty;
              channelTotals['Square'].units += qty;
              channelTotals['Square'].gross += (item.gross_sales || 0);
              channelTotals['Square'].commission += (item.commission || 0);
              channelTotals['Square'].net += (item.net_payout || 0);
            } else if (item.channel === 'Uber Eats') {
              row.uber_eats_units += qty;
              channelTotals['Uber Eats'].units += qty;
              channelTotals['Uber Eats'].gross += (item.gross_sales || 0);
              channelTotals['Uber Eats'].commission += (item.commission || 0);
              channelTotals['Uber Eats'].net += (item.net_payout || 0);
            } else if (item.channel === 'Just Eat') {
              row.just_eat_units += qty;
              channelTotals['Just Eat'].units += qty;
              channelTotals['Just Eat'].gross += (item.gross_sales || 0);
              channelTotals['Just Eat'].commission += (item.commission || 0);
              channelTotals['Just Eat'].net += (item.net_payout || 0);
            } else if (item.channel === 'Deliveroo') {
              row.deliveroo_units += qty;
              channelTotals['Deliveroo'].units += qty;
              channelTotals['Deliveroo'].gross += (item.gross_sales || 0);
              channelTotals['Deliveroo'].commission += (item.commission || 0);
              channelTotals['Deliveroo'].net += (item.net_payout || 0);
            }

            grandTotalUnits += qty;
            grandTotalGross += (item.gross_sales || 0);
            grandTotalCommission += (item.commission || 0);
            grandTotalNet += (item.net_payout || 0);
            grandTotalDiscounts += (item.discounts || 0);
          } else {
            // Unmapped
            const key = this.normalizeText(item.raw_name);
            if (!unmappedMap.has(key)) {
              unmappedMap.set(key, {
                raw_name: item.raw_name,
                normalized_name: key,
                channel: item.channel,
                count: 0,
                sample_revenue: 0,
                source_files: new Set()
              });
            }
            const unres = unmappedMap.get(key);
            unres.count += item.quantity;
            unres.sample_revenue += (item.gross_sales || 0);
            if (item.source_filename) unres.source_files.add(item.source_filename);
          }
        }
      }

      // Calculate channel share percentages
      const ledgerRows = Array.from(ledgerMap.values());
      ledgerRows.forEach(row => {
        if (row.total_volume > 0) {
          row.channel_share.square_pct = parseFloat(((row.square_units / row.total_volume) * 100).toFixed(1));
          row.channel_share.uber_pct = parseFloat(((row.uber_eats_units / row.total_volume) * 100).toFixed(1));
          row.channel_share.just_eat_pct = parseFloat(((row.just_eat_units / row.total_volume) * 100).toFixed(1));
          row.channel_share.deliveroo_pct = parseFloat(((row.deliveroo_units / row.total_volume) * 100).toFixed(1));
        }
      });

      // Sort by total volume descending
      ledgerRows.sort((a, b) => b.total_volume - a.total_volume);

      const unmappedRows = Array.from(unmappedMap.values()).map(u => ({
        ...u,
        source_files: Array.from(u.source_files)
      })).sort((a, b) => b.count - a.count);

      // Performance analytics & AI Insights
      const analytics = this.generatePerformanceAnalytics(ledgerRows, channelTotals, grandTotalGross, grandTotalNet, grandTotalCommission);

      return {
        reportingDate: reportingDate || 'ALL',
        availableDates: Array.from(availableDatesSet).sort(),
        masterLedger: ledgerRows,
        unmappedQueue: unmappedRows,
        unmappedCount: unmappedRows.length,
        matchedCount: ledgerRows.length,
        grandTotals: {
          units: grandTotalUnits,
          gross: grandTotalGross,
          commission: grandTotalCommission,
          net: grandTotalNet,
          discounts: grandTotalDiscounts,
          effective_commission_rate: grandTotalGross > 0 ? parseFloat(((grandTotalCommission / grandTotalGross) * 100).toFixed(1)) : 0
        },
        channelTotals,
        analytics
      };
    },

    // -----------------------------------------------------------
    // 7. Performance Analytics & AI Insights Engine
    // -----------------------------------------------------------
    generatePerformanceAnalytics(ledgerRows, channelTotals, grossTotal, netTotal, commissionTotal) {
      // 1. Menu Item Velocity Ranking
      const topPerformersOverall = [...ledgerRows].slice(0, 5);
      const underperformers = [...ledgerRows]
        .filter(r => r.total_volume > 0)
        .sort((a, b) => a.total_volume - b.total_volume)
        .slice(0, 5);

      // Top Performer by Channel
      const topSquare = [...ledgerRows].sort((a, b) => b.square_units - a.square_units)[0] || null;
      const topUber = [...ledgerRows].sort((a, b) => b.uber_eats_units - a.uber_eats_units)[0] || null;
      const topJustEat = [...ledgerRows].sort((a, b) => b.just_eat_units - a.just_eat_units)[0] || null;
      const topDeliveroo = [...ledgerRows].sort((a, b) => b.deliveroo_units - a.deliveroo_units)[0] || null;

      // 2. Channel Economics & Commission Leakage
      const channelEconomics = Object.entries(channelTotals).map(([channelName, data]) => {
        const commissionRate = data.gross > 0 ? (data.commission / data.gross) * 100 : 0;
        return {
          channel: channelName,
          units: data.units,
          gross: data.gross,
          commission: data.commission,
          net: data.net,
          commission_rate_pct: parseFloat(commissionRate.toFixed(1)),
          take_rate_status: commissionRate > 30 ? 'HIGH_LEAKAGE' : commissionRate > 20 ? 'MODERATE' : 'DIRECT_IN_STORE'
        };
      }).sort((a, b) => b.commission_rate_pct - a.commission_rate_pct);

      const highestLeakageChannel = channelEconomics[0] || null;

      // 3. AI Executive Summary Card
      const top3VolumeDrivers = topPerformersOverall.slice(0, 3).map(i => ({
        name: i.master_item_name,
        volume: i.total_volume,
        gross: i.gross_revenue,
        dominant_channel: Object.entries({
          'Square': i.square_units,
          'Uber Eats': i.uber_eats_units,
          'Just Eat': i.just_eat_units,
          'Deliveroo': i.deliveroo_units
        }).sort((a, b) => b[1] - a[1])[0][0]
      }));

      const underperformingToMonitor = underperformers.slice(0, 3).map(i => ({
        name: i.master_item_name,
        volume: i.total_volume,
        gross: i.gross_revenue,
        note: i.total_volume <= 2 ? 'Near-zero sales velocity. Consider promotional push or combo pairing.' : 'Sub-par volume today.'
      }));

      const profitabilityDiscrepancies = [];
      if (highestLeakageChannel && highestLeakageChannel.channel !== 'Square' && highestLeakageChannel.commission_rate_pct > 25) {
        profitabilityDiscrepancies.push(
          `${highestLeakageChannel.channel} extracts highest commission take at ${highestLeakageChannel.commission_rate_pct}% (£${highestLeakageChannel.commission.toFixed(2)} leakage). In-store Square POS retains 100% of dish list value.`
        );
      }
      if (channelTotals['Deliveroo'].gross > 0 && channelTotals['Uber Eats'].gross > 0) {
        const diff = Math.abs(channelEconomics.find(c => c.channel === 'Deliveroo').commission_rate_pct - channelEconomics.find(c => c.channel === 'Uber Eats').commission_rate_pct);
        if (diff >= 2) {
          profitabilityDiscrepancies.push(
            `Margin spread discrepancy of ${diff.toFixed(1)}% between Uber Eats and Deliveroo. Adjust platform menu pricing parity to protect net margin.`
          );
        }
      }

      return {
        topPerformersOverall,
        underperformers,
        topByChannel: {
          square: topSquare ? { name: topSquare.master_item_name, units: topSquare.square_units } : null,
          uberEats: topUber ? { name: topUber.master_item_name, units: topUber.uber_eats_units } : null,
          justEat: topJustEat ? { name: topJustEat.master_item_name, units: topJustEat.just_eat_units } : null,
          deliveroo: topDeliveroo ? { name: topDeliveroo.master_item_name, units: topDeliveroo.deliveroo_units } : null
        },
        channelEconomics,
        aiExecutiveSummary: {
          top3VolumeDrivers,
          underperformingToMonitor,
          profitabilityDiscrepancies,
          blendedLeakageSummary: `Consolidated Gross Sales: £${grossTotal.toFixed(2)} with £${commissionTotal.toFixed(2)} platform commission deductions, realizing £${netTotal.toFixed(2)} net cash.`
        }
      };
    },

    // -----------------------------------------------------------
    // 8. Stock Depletion & Threshold Alarm Handshake
    // -----------------------------------------------------------
    getOnHandStock() {
      // In Demo Mode, use isolated key 'ts_demo_stock_levels' to prevent disturbing real inventory!
      const storageKey = this.isDemoMode ? 'ts_demo_stock_levels' : 'ts_stock_levels';
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) return JSON.parse(stored);
      } catch (e) {}

      // Default baseline on-hand units if empty (5.0 units standard pot size)
      const baseline = {
        'Liege Waffle Base': 12.0,
        'Cookie Dough Base': 2.5,
        'Belgian Milk Chocolate Chips': 1.8,
        'Comelle Ice Cream Mix 1 Litre': 3.2,
        'Chef Larder Fries 2.5kg': 4.0,
        'Crispy Chicken Tenders 1kg': 3.5,
        'Americana Gourmet Brioche Buns 48s': 2.0,
        'Lotus Biscoff Topping Sauce 1kg': 2.2,
        'Biscoff Biscuit Crumbs 750g': 1.5,
        'Pistachio Butter Sauce Pure': 1.2,
        'Kataifi Pastry Dough': 1.0,
        'Semi Skimmed Milk 2 Litre': 4.0,
        'Oreo Crushed Cookie Pieces 400g': 2.5,
        'Harrogate Spring Water 500ml': 18.0,
        'Coca Cola Cans 330ml 24s': 2.0,
        'Fanta Orange Cans 330ml 24s': 1.0
      };

      if (this.isDemoMode) {
        try { localStorage.setItem('ts_demo_stock_levels', JSON.stringify(baseline)); } catch (e) {}
      }
      return baseline;
    },

    getSafetyStockMOQ() {
      // Reads MOQ thresholds from 'ts_min_stock_levels' or fallback default 2.0 units
      const moqMap = {
        'Cookie Dough Base': 2.0,
        'Belgian Milk Chocolate Chips': 2.0,
        'Liege Waffle Base': 5.0,
        'Comelle Ice Cream Mix 1 Litre': 2.0,
        'Chef Larder Fries 2.5kg': 2.0,
        'Crispy Chicken Tenders 1kg': 2.0,
        'Americana Gourmet Brioche Buns 48s': 2.0,
        'Biscoff Biscuit Crumbs 750g': 2.0,
        'Pistachio Butter Sauce Pure': 2.0,
        'Kataifi Pastry Dough': 2.0,
        'Fanta Orange Cans 330ml 24s': 1.5,
        'Coca Cola Cans 330ml 24s': 1.5
      };

      try {
        const stored = localStorage.getItem('ts_min_stock_levels');
        if (stored) {
          const parsed = JSON.parse(stored);
          Object.keys(parsed).forEach(k => {
            moqMap[k] = parseFloat(parsed[k]) || 2.0;
          });
        }
      } catch (e) {}

      return moqMap;
    },

    calculateDepletionAndAlarms(consolidatedMatrix, onHandStock = null, moqMap = null) {
      const stock = onHandStock || this.getOnHandStock();
      const moqs = moqMap || this.getSafetyStockMOQ();

      const consumptionMap = new Map();

      // 1. Multiply each item's total units by its standard SOP portion breakdown
      for (const row of consolidatedMatrix) {
        const totalSold = row.total_volume;
        const recipe = row.recipe_obj;
        if (!recipe || !Array.isArray(recipe.ingredients) || totalSold <= 0) continue;

        const recipeYield = parseFloat(recipe.yield || 1) || 1;
        const multiplier = totalSold / recipeYield;

        for (const ing of recipe.ingredients) {
          if (!ing || !ing.name) continue;
          const ingName = ing.name.trim();
          const portionQty = (parseFloat(ing.quantity) || 0) * multiplier;
          const unit = ing.unit || 'unit';

          if (portionQty <= 0) continue;

          if (!consumptionMap.has(ingName)) {
            consumptionMap.set(ingName, {
              ingredient_name: ingName,
              theoretical_consumption: 0,
              unit: unit,
              dishes_using: new Set()
            });
          }

          const rec = consumptionMap.get(ingName);
          rec.theoretical_consumption += portionQty;
          rec.dishes_using.add(row.master_item_name);
        }
      }

      // 2. Compute projected remaining stock & detect MOQ / Safety Stock Breaches
      const depletionLedger = [];
      const criticalLowStockAlarms = [];

      // Combine all consumed ingredients and all on-hand ingredients
      const allIngredientNames = new Set([
        ...Array.from(consumptionMap.keys()),
        ...Object.keys(stock)
      ]);

      allIngredientNames.forEach(ingName => {
        const consumedRecord = consumptionMap.get(ingName);
        const consumed = consumedRecord ? consumedRecord.theoretical_consumption : 0;
        const unit = consumedRecord ? consumedRecord.unit : 'unit';
        const dishes = consumedRecord ? Array.from(consumedRecord.dishes_using) : [];

        // Current On-Hand (in units/pots)
        let currentUnits = stock[ingName] !== undefined ? parseFloat(stock[ingName]) : 0;
        // Search by lower-case key if not found directly
        if (stock[ingName] === undefined) {
          const matchedKey = Object.keys(stock).find(k => k.toLowerCase() === ingName.toLowerCase());
          if (matchedKey) currentUnits = parseFloat(stock[matchedKey]) || 0;
        }

        // Convert theoretical consumption (e.g. grams to units if pack is in kg/units)
        // For simple pot accounting: convert grams to kg units if > 100g, or direct units
        let consumedInStockUnits = consumed;
        if (unit.toLowerCase() === 'g') {
          consumedInStockUnits = consumed / 1000; // converted to kg/pot units
        } else if (unit.toLowerCase() === 'ml') {
          consumedInStockUnits = consumed / 1000; // converted to Liters
        }

        const projectedRemaining = parseFloat((currentUnits - consumedInStockUnits).toFixed(2));
        const moq = moqs[ingName] !== undefined ? moqs[ingName] : (moqs[ingName.toLowerCase()] || 2.0);

        const isBreached = projectedRemaining <= moq;
        const suggestedReorder = isBreached
          ? Math.max(1, Math.ceil((moq * 2.5) - projectedRemaining))
          : 0;

        const row = {
          ingredient_name: ingName,
          unit: unit,
          current_on_hand: currentUnits,
          theoretical_consumption: parseFloat(consumed.toFixed(2)),
          consumed_stock_units: parseFloat(consumedInStockUnits.toFixed(2)),
          projected_remaining_stock: projectedRemaining,
          moq_safety_threshold: moq,
          status: isBreached ? 'CRITICAL_LOW_STOCK_ALARM' : (projectedRemaining <= moq * 1.5 ? 'WARNING_LOW' : 'HEALTHY'),
          suggested_reorder_qty: suggestedReorder,
          dishes_involved: dishes
        };

        depletionLedger.push(row);

        if (isBreached) {
          criticalLowStockAlarms.push({
            alert_code: 'CRITICAL_LOW_STOCK_ALARM',
            ingredient_name: ingName,
            current_on_hand: currentUnits,
            projected_remaining: projectedRemaining,
            moq_safety_threshold: moq,
            suggested_reorder_qty: suggestedReorder,
            deficit: parseFloat((moq - projectedRemaining).toFixed(2)),
            dishes_involved: dishes,
            priority: 'HIGH_PRIORITY_KITCHEN_ALERT'
          });
        }
      });

      // Sort by status (CRITICAL first, then WARNING, then HEALTHY)
      depletionLedger.sort((a, b) => {
        if (a.status === 'CRITICAL_LOW_STOCK_ALARM' && b.status !== 'CRITICAL_LOW_STOCK_ALARM') return -1;
        if (b.status === 'CRITICAL_LOW_STOCK_ALARM' && a.status !== 'CRITICAL_LOW_STOCK_ALARM') return 1;
        return a.projected_remaining_stock - b.projected_remaining_stock;
      });

      return {
        depletionLedger,
        criticalLowStockAlarms,
        alarmsCount: criticalLowStockAlarms.length,
        hasCriticalBreaches: criticalLowStockAlarms.length > 0,
        isDemoMode: this.isDemoMode
      };
    },

    // -----------------------------------------------------------
    // 9. Dispatch Event & Sync Handshake
    // -----------------------------------------------------------
    dispatchDepletionHandshake(payload) {
      if (typeof window === 'undefined') return;

      // Event for in-browser cross-component communication
      const eventName = this.isDemoMode ? 'ts:demo-stock-alarm' : 'ts:stock-alarm';
      const event = new CustomEvent(eventName, {
        detail: {
          ...payload,
          demo_mode: this.isDemoMode,
          dispatched_at: new Date().toISOString()
        }
      });
      window.dispatchEvent(event);

      // Save run log
      const runKey = this.isDemoMode ? 'ts_demo_depletion_runs' : 'ts_sales_depletion_runs';
      try {
        let runs = [];
        const existing = localStorage.getItem(runKey);
        if (existing) runs = JSON.parse(existing);
        runs.unshift({
          id: 'DEP-' + Date.now(),
          timestamp: new Date().toISOString(),
          demo_mode: this.isDemoMode,
          alarms_count: payload.alarmsCount || 0,
          grand_totals: payload.grandTotals || {},
          critical_items: (payload.criticalLowStockAlarms || []).map(a => a.ingredient_name)
        });
        localStorage.setItem(runKey, JSON.stringify(runs.slice(0, 30)));
      } catch (e) {}

      console.log(`[SalesEngine] Dispatched ${eventName} (Demo Mode: ${this.isDemoMode})`, payload);
    },

    // -----------------------------------------------------------
    // 10. Demo Mode Realistic Preset Files
    // -----------------------------------------------------------
    generateDemoFiles() {
      const today = new Date().toISOString().split('T')[0];

      // 1. Square POS Report (TSV)
      const squareContent = [
        ['Date', 'Time', 'Category', 'Item', 'Qty', 'Price Point Name', 'SKU', 'Modifiers Applied', 'Product Sales', 'Discounts', 'Net Sales', 'Tax', 'Gross Sales', 'Commission', 'Channel'].join('\t'),
        [today, '13:14:15', 'Desserts', 'Chocolate Chip Cookie Dough', '12.0', 'Regular', 'SKU-CD', 'Soft Serve Gelato', '£96.00', '£0.00', '£96.00', '£0.00', '£96.00', '£0.00', 'Treat Street POS'].join('\t'),
        [today, '14:20:00', 'Waffles & Crepes', 'Biscofia', '10.0', 'Regular', 'SKU-BIS', 'Liege Waffle', '£115.00', '-£5.00', '£110.00', '£0.00', '£115.00', '£0.00', 'Treat Street POS'].join('\t'),
        [today, '15:10:22', 'Waffles & Crepes', 'Banoffee', '8.0', 'Regular', 'SKU-BAN', 'Waffle, Salted Caramel', '£88.00', '£0.00', '£88.00', '£0.00', '£88.00', '£0.00', 'Treat Street POS'].join('\t'),
        [today, '16:05:40', 'Specials', 'Viral Dubai Chocolate - Kunafa', '6.0', 'Regular', 'SKU-DUB', 'Croffle, Sorbet', '£85.50', '£0.00', '£85.50', '£0.00', '£85.50', '£0.00', 'Treat Street POS'].join('\t'),
        [today, '16:45:12', 'Savory & Chicken', 'Louisiana', '7.0', 'Regular', 'SKU-LOU', 'Brioche Bun, Fries', '£91.00', '-£9.10', '£81.90', '£0.00', '£91.00', '£0.00', 'Treat Street POS'].join('\t'),
        [today, '17:15:30', 'Loaded Fries', 'Papi Chulo', '9.0', 'Regular', 'SKU-PAP', 'Jalapeno, Cheese', '£54.00', '£0.00', '£54.00', '£0.00', '£54.00', '£0.00', 'Treat Street POS'].join('\t'),
        [today, '17:30:15', 'Milkshakes', 'Oreo Milkshake', '14.0', 'Regular', 'SKU-OR', 'Whipped Cream', '£100.80', '£0.00', '£100.80', '£0.00', '£100.80', '£0.00', 'Treat Street POS'].join('\t'),
        [today, '18:10:00', 'Beverages', 'Still Water', '15.0', 'Regular', 'SKU-WAT', 'Chilled', '£45.00', '£0.00', '£45.00', '£0.00', '£45.00', '£0.00', 'Treat Street POS'].join('\t')
      ].join('\n');

      // 2. Uber Eats Report (CSV)
      const uberContent = [
        ['Order Date', 'Order Time', 'Item Name', 'Items Quantity', 'Gross Sales', 'Marketplace Fee', 'Promo', 'Net Payout'].join(','),
        [today, '13:45:00', '"Uber - Signature Cookie Dough (Warm)"', '14', '112.00', '33.60', '0.00', '78.40'].join(','),
        [today, '14:30:00', '"Biscoff Craze Liege Waffle"', '11', '126.50', '37.95', '5.00', '83.55'].join(','),
        [today, '15:15:00', '"Dubai Kunafa Crunch Waffle (Viral)"', '8', '114.00', '34.20', '0.00', '79.80'].join(','),
        [today, '16:00:00', '"Thick Oreo Gelato Shake"', '16', '115.20', '34.56', '0.00', '80.64'].join(','),
        [today, '17:20:00', '"Louisiana Buttermilk Chicken Burger & Fries"', '9', '117.00', '35.10', '10.00', '71.90'].join(','),
        [today, '18:00:00', '"Loaded Papi Chulo Cheesy Fries"', '10', '60.00', '18.00', '0.00', '42.00'].join(','),
        [today, '18:30:00', '"Coke 330ml Can"', '12', '36.00', '10.80', '0.00', '25.20'].join(',')
      ].join('\n');

      // 3. Just Eat Report (CSV)
      const justEatContent = [
        ['Date', 'Order Time', 'Restaurant Reference', 'Product Name', 'Quantity', 'Sub Total', 'Commission Charge', 'Discount', 'Net Payout'].join(','),
        [today, '14:10:00', 'JE-TS-401', '"JE_Cookie_Dough_Warm"', '9', '72.00', '20.16', '0.00', '51.84'].join(','),
        [today, '15:00:00', 'JE-TS-402', '"JE Biscoff Waffle Supreme"', '8', '92.00', '25.76', '0.00', '66.24'].join(','),
        [today, '15:45:00', 'JE-TS-403', '"Dubai Kunafa Chocolate Special"', '5', '71.25', '19.95', '0.00', '51.30'].join(','),
        [today, '16:30:00', 'JE-TS-404', '"Strawberry Sensation Waffle"', '7', '77.00', '21.56', '0.00', '55.44'].join(','),
        [today, '17:15:00', 'JE-TS-405', '"Ragin Cajun Chicken Strip Meal"', '6', '39.00', '10.92', '0.00', '28.08'].join(','),
        [today, '18:10:00', 'JE-TS-406', '"Louisiana Burger Meal Deal"', '8', '104.00', '29.12', '0.00', '74.88'].join(','),
        [today, '19:00:00', 'JE-TS-407', '"Fanta Can 330ml"', '10', '30.00', '8.40', '0.00', '21.60'].join(',')
      ].join('\n');

      // 4. Deliveroo Report (CSV)
      const deliverooContent = [
        ['Order Date', 'Order Time', 'Order ID', 'Item Name', 'Quantity', 'Item Gross', 'Commission', 'Discount', 'Net Payout'].join(','),
        [today, '13:50:00', 'DEL-901', '"DELIV - Cookie Dough Warm with Gelato"', '11', '88.00', '28.16', '0.00', '59.84'].join(','),
        [today, '14:40:00', 'DEL-902', '"DELIV - Biscoff Liege Waffle"', '9', '103.50', '33.12', '0.00', '70.38'].join(','),
        [today, '15:30:00', 'DEL-903', '"DELIV - Banoffee Fresh Waffle"', '6', '66.00', '21.12', '0.00', '44.88'].join(','),
        [today, '16:15:00', 'DEL-904', '"DELIV - Viral Kunafa Dubai Chocolate Waffle"', '7', '99.75', '31.92', '0.00', '67.83'].join(','),
        [today, '17:00:00', 'DEL-905', '"DELIV - Louisiana Crispy Chicken Burger"', '6', '78.00', '24.96', '0.00', '53.04'].join(','),
        [today, '17:45:00', 'DEL-906', '"DELIV - Papi Chulo Cheesy Loaded Fries"', '8', '48.00', '15.36', '0.00', '32.64'].join(','),
        [today, '18:25:00', 'DEL-907', '"DELIV - Oreo Cream Milkshake"', '10', '72.00', '23.04', '0.00', '48.96'].join(','),
        // Include one unmapped mystery item to demonstrate the Unmapped Resolution Queue!
        [today, '19:15:00', 'DEL-908', '"DELIV - Mystery Caramel Churros Craze"', '3', '27.00', '8.64', '0.00', '18.36'].join(',')
      ].join('\n');

      return [
        { filename: 'square_instore_pos.tsv', content: squareContent, channel: 'Square' },
        { filename: 'ubereats_daily_sales.csv', content: uberContent, channel: 'Uber Eats' },
        { filename: 'justeat_daily_sales.csv', content: justEatContent, channel: 'Just Eat' },
        { filename: 'deliveroo_daily_sales.csv', content: deliverooContent, channel: 'Deliveroo' }
      ];
    },

    // -----------------------------------------------------------
    // 11. Exporter for Stock Depletion Pipeline
    // -----------------------------------------------------------
    generateMasterExportData(consolidated) {
      const headers = [
        'Master SOP Recipe Item',
        'Square POS Units',
        'Uber Eats Units',
        'Just Eat Units',
        'Deliveroo Units',
        'Total Volume Sold',
        'Gross Revenue (£)',
        'Platform Commissions (£)',
        'Net Revenue Realized (£)',
        'Square Share (%)',
        'Uber Eats Share (%)',
        'Just Eat Share (%)',
        'Deliveroo Share (%)',
        'Match Type'
      ];

      const rows = [headers];

      (consolidated.masterLedger || []).forEach(item => {
        rows.push([
          item.master_item_name,
          item.square_units || 0,
          item.uber_eats_units || 0,
          item.just_eat_units || 0,
          item.deliveroo_units || 0,
          item.total_volume || 0,
          (item.gross_revenue || 0).toFixed(2),
          (item.total_commissions || 0).toFixed(2),
          (item.net_revenue || 0).toFixed(2),
          item.channel_share.square_pct + '%',
          item.channel_share.uber_pct + '%',
          item.channel_share.just_eat_pct + '%',
          item.channel_share.deliveroo_pct + '%',
          item.match_type
        ]);
      });

      return rows;
    }
  };

  return SalesEngine;
}));
