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
      category: 'Waffles & Crepes',
      yield: 1,
      ingredients: [
        { name: 'Liege Waffle Base', quantity: 1, unit: 'unit' },
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
      title: '1 Scoop Gelato',
      category: 'Gelato & Sorbet',
      yield: 1,
      ingredients: [
        { name: 'Artisan Gelato Tub Base', quantity: 0.1, unit: 'unit' },
        { name: 'Waffle Cone Deluxe', quantity: 1, unit: 'unit' }
      ]
    },
    {
      id: 'sop-gelato-2-scoop',
      title: '2 Scoop Gelato',
      category: 'Gelato & Sorbet',
      yield: 1,
      ingredients: [
        { name: 'Artisan Gelato Tub Base', quantity: 0.2, unit: 'unit' },
        { name: 'Waffle Cone Deluxe', quantity: 1, unit: 'unit' }
      ]
    },
    {
      id: 'sop-gelato-3-scoop',
      title: '3 Scoop Gelato',
      category: 'Gelato & Sorbet',
      yield: 1,
      ingredients: [
        { name: 'Artisan Gelato Tub Base', quantity: 0.3, unit: 'unit' },
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
    { external_name: 'Vanilla Scoop', recipe_name: '1 Scoop Gelato', channel: 'Square' },
    { external_name: 'Bubblegum Gelato 1x', recipe_name: '1 Scoop Gelato', channel: 'Square' },
    { external_name: '1 Scoop', recipe_name: '1 Scoop Gelato', channel: 'Square' },
    { external_name: '1 Scoop', recipe_name: '1 Scoop Gelato', channel: 'Square POS (In-Store)' },
    { external_name: '1 Scoop', recipe_name: '1 Scoop Gelato', channel: 'ALL' },
    { external_name: '1 Scoop Gelato', recipe_name: '1 Scoop Gelato', channel: 'ALL' },
    { external_name: '2 Scoop', recipe_name: '2 Scoop Gelato', channel: 'ALL' },
    { external_name: '2 Scoop Gelato', recipe_name: '2 Scoop Gelato', channel: 'ALL' },
    { external_name: '3 Scoop', recipe_name: '3 Scoop Gelato', channel: 'ALL' },
    { external_name: '3 Scoop Gelato', recipe_name: '3 Scoop Gelato', channel: 'ALL' },

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
    { external_name: 'DELIV - American Pancakes', recipe_name: 'Twist it, Lick it, Dunk it', channel: 'Deliveroo' },
    { external_name: 'DELIV - Fluffy Pancake Stack', recipe_name: 'Twist it, Lick it, Dunk it', channel: 'Deliveroo' },
    { external_name: 'American Pancakes', recipe_name: 'Twist it, Lick it, Dunk it', channel: 'ALL' },
    { external_name: 'Pancake Stack', recipe_name: 'Twist it, Lick it, Dunk it', channel: 'ALL' },
    { external_name: 'Pancakes', recipe_name: 'Twist it, Lick it, Dunk it', channel: 'ALL' },
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
    // Master SOP Recipes Dynamic Synchronization
    // -----------------------------------------------------------
    getMasterRecipes() {
      let recipes = [];
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const stored = localStorage.getItem('recipeSOPs');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              recipes = parsed;
            }
          }
        }
      } catch (e) {
        console.warn("Failed reading recipeSOPs from localStorage:", e);
      }

      // If empty, fallback to MASTER_SOP_RECIPES and seed into localStorage
      // so SOP.html, recipe_sop_manager.html, and sales_ledger.html stay perfectly synced!
      if (recipes.length === 0) {
        recipes = MASTER_SOP_RECIPES;
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('recipeSOPs', JSON.stringify(MASTER_SOP_RECIPES));
          }
        } catch (e) {}
      }
      return recipes;
    },

    syncWithSOP() {
      const recipes = this.getMasterRecipes();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('treatstreet:sop_synced', { detail: { count: recipes.length } }));
      }
      return recipes;
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

    cleanNumber(val, defaultVal = 0.0) {
      if (val === null || val === undefined) return defaultVal;
      if (typeof val === 'number') return isNaN(val) ? defaultVal : val;
      let str = val.toString().trim();
      // Strip outer quotes and spaces
      str = str.replace(/^["']+|["']+$/g, '').trim();
      if (!str) return defaultVal;

      // Handle accounting negative formats: -£10.00, £-10.00, (£10.00), £(10.00), -10.00, (10.00)
      const isNegative = str.includes('-') || (str.includes('(') && str.includes(')'));

      // Strip currency symbols ('£', '$', '€'), commas (thousands separator), quotes, parens, and non-numeric chars except dot
      const clean = str.replace(/[£$€,\s"'\(\)\-]/g, '');
      if (!clean) return defaultVal;
      const num = parseFloat(clean);
      if (isNaN(num)) return defaultVal;
      return isNegative ? -num : num;
    },

    cleanInteger(val, defaultVal = 0) {
      const num = this.cleanNumber(val, defaultVal);
      if (isNaN(num)) return defaultVal;
      return Math.round(num);
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
    // Universal Text & Encoding Buffer Decoder (UTF-16 LE / UTF-8)
    // -----------------------------------------------------------
    decodeTextBuffer(buffer) {
      if (!buffer) return '';
      if (typeof buffer === 'string') {
        // Strip BOM and null characters if naive decoding happened upstream
        return buffer.replace(/^\uFEFF/, '').replace(/\u0000/g, '');
      }

      let bytes;
      if (buffer instanceof Uint8Array) {
        bytes = buffer;
      } else if (typeof Buffer !== 'undefined' && Buffer.isBuffer(buffer)) {
        bytes = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
      } else if (buffer instanceof ArrayBuffer) {
        bytes = new Uint8Array(buffer);
      } else if (buffer.buffer instanceof ArrayBuffer) {
        bytes = new Uint8Array(buffer.buffer);
      } else {
        return String(buffer).replace(/^\uFEFF/, '').replace(/\u0000/g, '');
      }

      if (bytes.length === 0) return '';

      // 1. Explicit Byte Order Mark (BOM) Checks
      // UTF-16 LE BOM: 0xFF, 0xFE
      if (bytes.length >= 2 && bytes[0] === 0xFF && bytes[1] === 0xFE) {
        try {
          return new TextDecoder('utf-16le').decode(bytes.subarray(2)).replace(/\u0000/g, '');
        } catch (e) {}
      }
      // UTF-16 BE BOM: 0xFE, 0xFF
      if (bytes.length >= 2 && bytes[0] === 0xFE && bytes[1] === 0xFF) {
        try {
          return new TextDecoder('utf-16be').decode(bytes.subarray(2)).replace(/\u0000/g, '');
        } catch (e) {}
      }
      // UTF-8 BOM: 0xEF, 0xBB, 0xBF
      if (bytes.length >= 3 && bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF) {
        try {
          return new TextDecoder('utf-8').decode(bytes.subarray(3)).replace(/^\uFEFF/, '');
        } catch (e) {}
      }

      // 2. Dynamic trial across candidate encodings: ['utf-16', 'utf-16-le', 'utf-8-sig', 'utf-8']
      const encodings = ['utf-16', 'utf-16-le', 'utf-8-sig', 'utf-8'];
      let bestCandidate = '';
      let bestScore = -Infinity;

      for (const enc of encodings) {
        try {
          let decoded = '';
          if (enc === 'utf-16' || enc === 'utf-16-le') {
            decoded = new TextDecoder('utf-16le').decode(bytes);
          } else if (enc === 'utf-8-sig') {
            decoded = new TextDecoder('utf-8').decode(bytes).replace(/^\uFEFF/, '');
          } else {
            decoded = new TextDecoder('utf-8').decode(bytes);
          }
          if (!decoded) continue;

          // Score candidate based on formatting:
          // penalize null bytes and replacement chars \uFFFD
          const nullCount = (decoded.match(/\u0000/g) || []).length;
          const replCount = (decoded.match(/\uFFFD/g) || []).length;
          const hasTabs = decoded.includes('\t');
          const hasCommas = decoded.includes(',');
          const hasNewlines = decoded.includes('\n') || decoded.includes('\r');
          const sample = decoded.slice(0, 500).toLowerCase();
          const hasKnownWords = (sample.includes('item') || sample.includes('sales') || sample.includes('gross') || sample.includes('net') || sample.includes('units') || sample.includes('category') || sample.includes('date'));

          let score = 0;
          if (hasNewlines) score += 10;
          if (hasTabs) score += 20;
          if (hasCommas) score += 15;
          if (hasKnownWords) score += 50;
          score -= nullCount * 2;
          score -= replCount * 5;

          if (score > bestScore) {
            bestScore = score;
            bestCandidate = decoded.replace(/\u0000/g, '');
          }
        } catch (err) {}
      }

      if (bestCandidate) {
        return bestCandidate;
      }

      // Fallback to UTF-8 or latin1
      try {
        return new TextDecoder('utf-8').decode(bytes);
      } catch (e) {
        try {
          return new TextDecoder('latin1').decode(bytes);
        } catch (e2) {
          return String.fromCharCode.apply(null, bytes);
        }
      }
    },

    // -----------------------------------------------------------
    // Delimited (CSV/TSV) Parser with Format & Quote Sanitization
    // -----------------------------------------------------------
    parseDelimited(text) {
      if (!text || (typeof text !== 'string' && !(text instanceof ArrayBuffer) && !(typeof Buffer !== 'undefined' && Buffer.isBuffer(text)))) {
        return [];
      }

      let cleanText = typeof text === 'string' ? text : this.decodeTextBuffer(text);
      cleanText = cleanText.replace(/^\uFEFF/, '').replace(/\u0000/g, '');
      cleanText = cleanText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      if (cleanText.includes('\\t') && !cleanText.includes('\t')) {
        cleanText = cleanText.replace(/\\t/g, '\t');
      }
      const lines = cleanText.split('\n');
      const result = [];

      // Helper function to split a line safely respecting quotes
      const splitByDelim = (line, delim) => {
        const row = [];
        let curr = '';
        let inQuotes = false;
        for (let j = 0; j < line.length; j++) {
          const c = line[j];
          const next = line[j + 1];

          if (c === '"') {
            if (inQuotes && next === '"') {
              curr += '"';
              j++;
            } else {
              inQuotes = !inQuotes;
            }
          } else if (c === delim && !inQuotes) {
            row.push(curr.trim().replace(/^["']+|["']+$/g, '').trim());
            curr = '';
          } else {
            curr += c;
          }
        }
        row.push(curr.trim().replace(/^["']+|["']+$/g, '').trim());
        return row;
      };

      // Test delimiters dynamically: try tab ('\t') first; if column count <= 1, fallback to comma (',')
      const firstLine = lines.find(l => l && l.trim()) || '';
      let defaultDelimiter = ',';
      if (firstLine) {
        const tabCols = splitByDelim(firstLine, '\t');
        if (tabCols.length > 1) {
          defaultDelimiter = '\t';
        } else {
          const commaCols = splitByDelim(firstLine, ',');
          if (commaCols.length > 1) {
            defaultDelimiter = ',';
          } else if (firstLine.includes(';') && !firstLine.includes(',')) {
            defaultDelimiter = ';';
          } else if (firstLine.includes('|')) {
            defaultDelimiter = '|';
          } else {
            defaultDelimiter = ',';
          }
        }
      }

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line || !line.trim()) continue;

        const row = splitByDelim(line, defaultDelimiter);
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
    // PDF Ingestion (PDF.js + Robust Text Stream Scanner)
    // -----------------------------------------------------------
    async parsePdfArrayBuffer(arrayBuffer, filename = '') {
      let extractedLines = [];

      // 1. Try PDF.js if loaded in browser
      if (typeof window !== 'undefined' && window.pdfjsLib) {
        try {
          const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
          const pdfDoc = await loadingTask.promise;

          for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            const page = await pdfDoc.getPage(pageNum);
            const textContent = await page.getTextContent();
            
            // Cluster items by vertical Y position (within 4px)
            const yMap = new Map();
            for (const item of textContent.items) {
              const str = (item.str || '').trim();
              if (!str) continue;
              const y = Math.round((item.transform[5] || 0) / 4) * 4;
              const x = item.transform[4] || 0;
              if (!yMap.has(y)) yMap.set(y, []);
              yMap.get(y).push({ x, str });
            }

            // Sort descending Y (top of page first)
            const sortedYs = Array.from(yMap.keys()).sort((a, b) => b - a);
            for (const y of sortedYs) {
              // Sort line left-to-right
              const line = yMap.get(y).sort((a, b) => a.x - b.x);
              extractedLines.push(line.map(i => i.str).join('\t'));
            }
          }
        } catch (e) {
          console.warn("PDF.js parse error:", e);
        }
      }

      // 2. Binary text stream fallback
      if (extractedLines.length === 0) {
        try {
          const decoder = new TextDecoder('latin1');
          const raw = decoder.decode(arrayBuffer);
          const matches = raw.match(/\(([^()]{2,})\)[\s]*Tj/g) || raw.match(/\[([^\[\]]+)\][\s]*TJ/g);
          if (matches) {
            extractedLines = matches.map(m => m.replace(/^[(\[]|[)\]]\s*T[jJ]$/g, '').replace(/\\([()\\])/g, '$1'));
          }
        } catch (e) {}
      }

      const fullText = extractedLines.join('\n');
      return this.parseUniversalFile(fullText, filename);
    },

    // -----------------------------------------------------------
    // 4 Channel Schema Adapters
    // -----------------------------------------------------------
    detectChannel(headers, filename = '') {
      const lower = headers.map(h => (h || '').toString().toLowerCase().trim().replace(/[\s_-]+/g, ' '));
      const lowerFile = (filename || '').toLowerCase();
      const allText = lower.join(' ');

      // 1. Square POS Primary Header Signature Check
      // If headers contain ['Item Name', 'Product Sales', 'Net Sales', 'Units Sold'],
      // tag the channel as "Square POS (In-Store)", NOT Deliveroo.
      const hasItemNameSig = lower.some(h => h === 'item name' || h.includes('item name'));
      const hasProductSalesSig = lower.some(h => h === 'product sales' || h.includes('product sales'));
      const hasNetSalesSig = lower.some(h => h === 'net sales' || h.includes('net sales'));
      const hasUnitsSoldSig = lower.some(h => h === 'units sold' || h.includes('units sold') || h === 'items sold' || h.includes('items sold'));

      if (hasItemNameSig && hasProductSalesSig && hasNetSalesSig && hasUnitsSoldSig) {
        return 'Square POS (In-Store)';
      }

      // Check transaction-level Square export headers
      if (
        lowerFile.includes('square') || lowerFile.includes('pos') || lowerFile.includes('till') ||
        lower.some(h => h.includes('square')) ||
        lower.some(h => h.includes('modifiers applied')) ||
        lower.some(h => h.includes('price point name')) ||
        lower.some(h => h.includes('transaction id'))
      ) {
        return 'Square POS (In-Store)';
      }

      // 2. Deliveroo Detection
      // Matches filename, literal deliveroo header, or typical Deliveroo export column combinations
      const hasOrderId = lower.some(h => h.includes('order id') || h === 'order_id' || h === 'orderid');
      const hasItemName = lower.some(h => h.includes('item name') || h === 'item' || h === 'menu item' || h.includes('dish'));
      const hasDeliverooSpecific = lower.some(h => 
        h.includes('deliveroo') || 
        h === 'item gross' || 
        h.includes('customisation') || 
        h.includes('customization') || 
        h.includes('rider tip') || 
        h.includes('order placement')
      );

      if (
        lowerFile.includes('deliveroo') ||
        lower.some(h => h.includes('deliveroo')) ||
        (hasOrderId && hasDeliverooSpecific) ||
        (hasOrderId && hasItemName && lower.some(h => h.includes('commission') || h.includes('fee') || h.includes('gross') || h.includes('payout')))
      ) {
        return 'Deliveroo';
      }

      // 3. Uber Eats Detection
      if (
        lowerFile.includes('uber') || lowerFile.includes('ubereats') ||
        lower.some(h => h.includes('uber')) ||
        lower.some(h => h.includes('items quantity')) ||
        (lower.some(h => h.includes('order number') || h === 'order_number') && lower.some(h => h.includes('customisations') || h.includes('customizations') || h.includes('restaurant payout')))
      ) {
        return 'Uber Eats';
      }

      // 4. Just Eat Detection
      if (
        lowerFile.includes('just eat') || lowerFile.includes('justeat') ||
        lower.some(h => h.includes('just eat') || h.includes('justeat')) ||
        lower.some(h => h.includes('restaurant reference')) ||
        (lower.some(h => h.includes('sub total') || h.includes('sub_total')) && lower.some(h => h.includes('commission charge')))
      ) {
        return 'Just Eat';
      }

      // Fallback detection
      if (lower.some(h => h.includes('channel') || h.includes('pos'))) return 'Square POS (In-Store)';
      return 'Generic / Auto-Detected';
    },

    adaptChannelRow(rowObj, channel) {
      // Normalizes a row into a standardized transaction
      const normalized = {
        date: '',
        time: '',
        channel: channel,
        raw_name: '',
        sku: '',
        quantity: 0,
        gross_sales: 0,
        commission: 0,
        net_payout: 0,
        discounts: 0,
        tax: 0,
        refunds: 0,
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

      // Order Status / Cancellation Filter
      const statusStr = (findKey(['order_status', 'status', 'event_type', 'item_status', 'state', 'transaction_status']) || '').toLowerCase();
      if (statusStr.includes('cancel') || statusStr.includes('void') || statusStr.includes('fail') || statusStr.includes('reject')) {
        normalized.is_cancelled = true;
      }

      const isSquareChannel = channel === 'Square' || channel === 'Square POS (In-Store)' || (channel && channel.toLowerCase().includes('square'));

      if (isSquareChannel) {
        normalized.channel = 'Square';
        normalized.date = this.normalizeDate(findKey(['date', 'created_at', 'day']));
        normalized.time = findKey(['time', 'hour']) || '12:00:00';
        normalized.raw_name = (findKey(['item_name', 'item', 'description', 'product_name', 'product']) || '').trim();

        // Parse quantity columns ['Units Sold', 'Items Sold'] strictly as integers.
        // If 'Units Sold' is missing or 0, fallback to 'Items Sold'.
        const rawUnitsSold = findKey(['units_sold', 'units']);
        let qty = (rawUnitsSold !== null && rawUnitsSold !== undefined && rawUnitsSold !== '') ? this.cleanInteger(rawUnitsSold, 0) : 0;
        if (qty === 0) {
          const rawItemsSold = findKey(['items_sold', 'items', 'qty', 'quantity', 'count', 'items_quantity']);
          if (rawItemsSold !== null && rawItemsSold !== undefined && rawItemsSold !== '') {
            qty = this.cleanInteger(rawItemsSold, 0);
          }
        }
        normalized.quantity = qty;

        // Financial columns sanitization: ['Product Sales', 'Net Sales', 'Gross Sales', 'Discounts & Comps', 'Tax', 'Refunds']
        const rawProductSales = this.cleanNumber(findKey(['product_sales', 'product_sales_amount', 'item_sales']), 0.0);
        const rawGrossSales = this.cleanNumber(findKey(['gross_sales', 'total_sales', 'gross', 'sales', 'price']), 0.0);
        normalized.gross_sales = rawGrossSales > 0 ? rawGrossSales : (rawProductSales > 0 ? rawProductSales : 0.0);

        normalized.discounts = Math.abs(this.cleanNumber(findKey(['discounts_comps', 'discounts_and_comps', 'discounts', 'discount', 'comps', 'discounts___comps', 'promo']), 0.0));
        normalized.commission = Math.abs(this.cleanNumber(findKey(['commission', 'fee', 'charge']), 0.0));
        normalized.tax = this.cleanNumber(findKey(['tax', 'taxes', 'vat']), 0.0);
        normalized.refunds = this.cleanNumber(findKey(['refunds', 'refund', 'returns']), 0.0);

        const explicitNet = findKey(['net_sales', 'net_sales_amount', 'net_payout', 'net', 'net_total']);
        if (explicitNet !== null && explicitNet !== undefined && explicitNet !== '') {
          normalized.net_payout = this.cleanNumber(explicitNet, 0.0);
        } else {
          normalized.net_payout = Math.max(0.0, normalized.gross_sales - normalized.discounts - normalized.commission);
        }
      } else if (channel === 'Uber Eats') {
        normalized.date = this.normalizeDate(findKey(['order_date', 'date', 'time']));
        normalized.time = findKey(['order_time', 'time']) || '12:00:00';
        normalized.raw_name = (findKey(['item_name', 'menu_item', 'item', 'product_name', 'product', 'item_description']) || '').trim();
        normalized.gross_sales = this.cleanNumber(findKey(['gross_sales', 'item_price', 'sales', 'price']), 0);
        const rawQty = findKey(['items_quantity', 'quantity', 'qty', 'count', 'item_quantity', 'units']);
        normalized.quantity = (rawQty !== null && rawQty !== undefined && rawQty !== '') ? this.cleanNumber(rawQty, 0) : (normalized.gross_sales > 0 ? 1 : 0);
        normalized.discounts = Math.abs(this.cleanNumber(findKey(['promo', 'discount', 'voucher']), 0));
        normalized.commission = Math.abs(this.cleanNumber(findKey(['marketplace_fee', 'commission', 'service_fee', 'fee']), normalized.gross_sales * 0.30));
        normalized.net_payout = this.cleanNumber(findKey(['net_payout', 'net_sales', 'payout', 'net']), normalized.gross_sales - normalized.commission - normalized.discounts);
      } else if (channel === 'Just Eat') {
        normalized.date = this.normalizeDate(findKey(['date', 'order_date', 'time']));
        normalized.time = findKey(['order_time', 'time']) || '12:00:00';
        normalized.raw_name = (findKey(['product_name', 'item_name', 'item', 'product']) || '').trim();
        normalized.gross_sales = this.cleanNumber(findKey(['sub_total', 'item_price', 'gross_sales', 'price', 'gross']), 0);
        const rawQty = findKey(['quantity', 'qty', 'count', 'item_quantity']);
        normalized.quantity = (rawQty !== null && rawQty !== undefined && rawQty !== '') ? this.cleanNumber(rawQty, 0) : (normalized.gross_sales > 0 ? 1 : 0);
        normalized.discounts = Math.abs(this.cleanNumber(findKey(['discount', 'voucher', 'promo']), 0));
        normalized.commission = Math.abs(this.cleanNumber(findKey(['commission_charge', 'commission', 'just_eat_fee', 'fee']), normalized.gross_sales * 0.28));
        normalized.net_payout = this.cleanNumber(findKey(['net_payout', 'net_amount', 'net']), normalized.gross_sales - normalized.commission - normalized.discounts);
      } else if (channel === 'Deliveroo') {
        normalized.date = this.normalizeDate(findKey(['order_date', 'date', 'order_placement_date', 'timestamp', 'time', 'day']));
        normalized.time = findKey(['order_time', 'time', 'order_placement_time']) || '12:00:00';
        normalized.raw_name = (findKey(['item_name', 'item', 'menu_item', 'product_name', 'product', 'dish', 'item_description', 'item_sold', 'dish_name', 'name']) || '').trim();
        normalized.gross_sales = this.cleanNumber(findKey(['item_gross', 'gross_sales', 'gross', 'price', 'total', 'item_price', 'item_total', 'base_price', 'sub_total', 'subtotal', 'line_total', 'amount']), 0);
        const rawQty = findKey(['quantity', 'qty', 'count', 'item_quantity', 'item_count', 'items_count', 'units', 'units_sold', 'items_quantity', 'items']);
        normalized.quantity = (rawQty !== null && rawQty !== undefined && rawQty !== '') ? this.cleanNumber(rawQty, 0) : (normalized.gross_sales > 0 ? 1 : 0);
        normalized.discounts = Math.abs(this.cleanNumber(findKey(['discount', 'customer_discount', 'promo', 'promotion', 'voucher']), 0));
        normalized.commission = Math.abs(this.cleanNumber(findKey(['commission', 'deliveroo_fee', 'fee', 'service_fee']), normalized.gross_sales * 0.32));
        normalized.net_payout = this.cleanNumber(findKey(['net_payout', 'net_sales', 'net', 'payout', 'restaurant_payout']), normalized.gross_sales - normalized.commission - normalized.discounts);
      } else {
        // Generic
        normalized.date = this.normalizeDate(findKey(['date', 'time', 'day']));
        normalized.time = findKey(['time']) || '12:00:00';
        normalized.raw_name = (findKey(['item_name', 'item', 'menu_item', 'product_name', 'product', 'dish', 'description', 'name']) || '').trim();
        normalized.gross_sales = this.cleanNumber(findKey(['gross_sales', 'gross', 'sales', 'price', 'total', 'amount', 'item_price']), 0);
        const rawQty = findKey(['qty', 'quantity', 'count', 'units', 'item_quantity', 'items']);
        normalized.quantity = (rawQty !== null && rawQty !== undefined && rawQty !== '') ? this.cleanNumber(rawQty, 0) : (normalized.gross_sales > 0 ? 1 : 0);
        normalized.discounts = Math.abs(this.cleanNumber(findKey(['discounts', 'discount', 'promo']), 0));
        normalized.commission = Math.abs(this.cleanNumber(findKey(['commission', 'fee']), normalized.gross_sales * 0.25));
        normalized.net_payout = this.cleanNumber(findKey(['net_payout', 'net', 'payout']), normalized.gross_sales - normalized.commission - normalized.discounts);
      }

      // Universal metadata extraction (modifiers applied, category, variation/size, notes)
      // Supports Deliveroo UK 'customisations' (with 's') as well as standard 'modifiers', 'options', and 'choices'
      const rawModifiers = (findKey([
        'customisations', 'customisation', 'customizations', 'customization',
        'modifiers_applied', 'modifiers', 'modifier',
        'options', 'item_options', 'options_applied', 'option_choices', 'choices',
        'selected_options', 'toppings', 'item_details', 'attributes', 'add_ons', 'addons'
      ]) || '').trim();
      const rawCategory = (findKey([
        'category', 'category_name', 'item_category', 'menu_category',
        'department', 'section', 'menu_section'
      ]) || '').trim();
      const rawVariation = (findKey([
        'price_point_name', 'variation', 'size', 'option', 'variant', 'portion'
      ]) || '').trim();
      const rawNotes = (findKey([
        'notes', 'note', 'details', 'special_instructions', 'item_notes', 'customer_note', 'instructions'
      ]) || '').trim();

      const rawSku = (findKey(['sku', 'item_sku', 'product_sku', 'barcode', 'item_code', 'plu']) || '').trim();

      normalized.sku = rawSku;
      normalized.modifiers = rawModifiers;
      normalized.category = rawCategory;
      normalized.variation = rawVariation;
      normalized.notes = rawNotes;

      // Cleanup (preserve 0.00 net sales for legitimately 100% discounted items)
      if (normalized.net_payout <= 0 && normalized.gross_sales > 0 && normalized.discounts <= 0 && normalized.commission <= 0) {
        normalized.net_payout = Math.max(0, normalized.gross_sales - normalized.commission - normalized.discounts);
      }

      return normalized;
    },

    // -----------------------------------------------------------
    // 4b. Parent-Modifier Context Binding & Base Keyword Scanner
    // -----------------------------------------------------------
    isModifierCategory(cat) {
      if (!cat) return false;
      const c = cat.toString().toLowerCase().trim();
      return (
        c === 'modifiers' ||
        c === 'modifier' ||
        c === 'item modifiers' ||
        c === 'item modifier' ||
        c === 'options' ||
        c === 'customisations' ||
        c === 'customizations'
      );
    },

    detectBaseModifierKeyword(text) {
      if (!text) return null;
      const lower = text.toString().toLowerCase().trim();
      // Detect base modifiers from the keyword list: ['Waffle', 'Pancake', 'Cheesecake', 'Cookie Dough', 'Liege Waffle']
      if (lower.includes('liege waffle')) return 'Liege Waffle';
      if (/\bwaffles?\b/i.test(lower)) return 'Waffle';
      if (/\bpancakes?\b|\bhotcakes?\b/i.test(lower)) return 'Pancake';
      if (/\bcheesecakes?\b/i.test(lower)) return 'Cheesecake';
      if (/\bcookie[\s-]*doughs?\b/i.test(lower) || lower.includes('cookiedough')) return 'Cookie Dough';
      return null;
    },

    detectBasesFromModifierString(modStr, parentQty = 1) {
      if (!modStr) return [];
      const str = modStr.toString();
      const detected = [];

      const hasWaffle = /\bwaffles?\b/i.test(str);
      const hasPancake = /\bpancakes?\b|\bhotcakes?\b/i.test(str);
      const hasCheesecake = /\bcheesecakes?\b/i.test(str);
      const hasCookieDough = /\bcookie[\s-]*doughs?\b/i.test(str) || /cookiedough/i.test(str);
      const hasLiege = /liege waffle/i.test(str);

      // Multi-unit parent orders (e.g., "Buenos Dias", Quantity: 2):
      // If modifiers indicate 1 Waffle and 1 Pancake:
      if (parentQty >= 2 && hasWaffle && hasPancake) {
        const half = Math.floor(parentQty / 2);
        const remainder = parentQty - half;
        detected.push({ base: 'Waffle', qty: half, raw: 'Waffle' });
        detected.push({ base: 'Pancake', qty: remainder, raw: 'Pancake' });
        return detected;
      }

      if (hasLiege) {
        detected.push({ base: 'Liege Waffle', qty: parentQty, raw: 'Liege Waffle' });
      } else if (hasWaffle) {
        detected.push({ base: 'Waffle', qty: parentQty, raw: 'Waffle' });
      } else if (hasPancake) {
        detected.push({ base: 'Pancake', qty: parentQty, raw: 'Pancake' });
      } else if (hasCheesecake) {
        detected.push({ base: 'Cheesecake', qty: parentQty, raw: 'Cheesecake' });
      } else if (hasCookieDough) {
        detected.push({ base: 'Cookie Dough', qty: parentQty, raw: 'Cookie Dough' });
      }

      return detected;
    },

    cleanBaseName(name) {
      if (!name) return 'Unnamed Product';
      return name.replace(/\s*\((Waffle|Pancake|Cheesecake|Cookie Dough|Liege Waffle|Croffle|Crepe|Pancakes)\)\s*$/i, '').trim();
    },

    detectInherentTitleBase(name) {
      if (!name) return null;
      const lower = name.toLowerCase();
      // Exclude ambiguous combo parent items that require modifier context
      if (
        lower.includes('buenos dias') ||
        lower.includes('buenos días') ||
        lower.includes('mulah green') ||
        lower.includes('strawberry fields') ||
        lower.includes('twist it')
      ) {
        return null;
      }
      if (lower.includes('cheesecake')) return 'Cheesecake';
      if (lower.includes('cookie dough') || lower.includes('cookiedough')) return 'Cookie Dough';
      if (/\bpancakes?\b/i.test(lower)) return 'Pancake';
      if (/\bwaffles?\b/i.test(lower)) return 'Waffle';
      if (lower.includes('croffle')) return 'Croffle';
      if (lower.includes('crepe') || lower.includes('crêpe')) return 'Crepe';
      return null;
    },

    standardizeInherentTitleName(name, inherentBase) {
      if (!name) return 'Unnamed Product';
      // For items that inherently include the base in their title:
      // Preserve name as-is or standardize as "Biscoff (Cheesecake)", "Triple Choc (Cookie Dough)"
      if (/biscoff.*loaded.*cheesecake/i.test(name)) return 'Biscoff (Cheesecake)';
      if (/triple choc.*cookie\s*dough/i.test(name)) return 'Triple Choc (Cookie Dough)';
      return name;
    },

    getBaseUsedLabel(baseType, disambiguatedName = '') {
      const norm = `${baseType || ''} ${disambiguatedName || ''}`.toLowerCase();
      if (norm.includes('cheesecake') || norm.includes('(cheesecake)')) return 'Cheesecake Slice';
      if (norm.includes('cookie dough') || norm.includes('cookiedough') || norm.includes('(cookie dough)')) return 'Cookie Dough Puck';
      if (norm.includes('pancake') || norm.includes('(pancake)')) return 'Pancake Batter Portion';
      if (norm.includes('liege waffle') || norm.includes('(liege waffle)') || norm.includes('liege')) return 'Liege Waffle Base';
      if (norm.includes('waffle') || norm.includes('(waffle)')) return 'Waffle Batter Portion';
      if (norm.includes('croffle') || norm.includes('(croffle)')) return 'Croissant Dough Piece';
      if (norm.includes('crepe') || norm.includes('(crepe)')) return 'Crepe Batter Portion';
      if (norm.includes('savoury') || norm.includes('burger')) return 'Brioche Bun & Patty';
      if (norm.includes('shake')) return 'Shake Mix Portion';
      if (norm.includes('gelato') || norm.includes('scoop')) return 'Gelato Scoop Portion';
      return 'General Portion';
    },

    isValidSaleItem(item) {
      if (!item || !item.raw_name) return false;
      const nameLower = item.raw_name.toLowerCase().trim();
      if (
        nameLower === 'total' ||
        nameLower === 'summary' ||
        nameLower === 'subtotal' ||
        nameLower === 'no side' ||
        nameLower === 'no extras' ||
        nameLower === 'no extra' ||
        nameLower.startsWith('no side') ||
        nameLower.includes('bag fee') ||
        nameLower.includes('carrier bag') ||
        nameLower.includes('delivery fee') ||
        nameLower.includes('courier tip') ||
        nameLower.includes('driver tip') ||
        nameLower.includes('restaurant tip') ||
        nameLower.includes('service fee') ||
        nameLower.includes('cutlery') ||
        nameLower.includes('napkins')
      ) {
        return false;
      }
      if (item.gross_sales <= 0 && item.discounts <= 0) {
        return false;
      }
      return true;
    },

    flushParentItem(parent) {
      if (!parent || !parent.adapted) return [];
      const parentName = (parent.current_parent_item || parent.adapted.raw_name || '').trim();
      const parentQty = parent.parent_quantity > 0 ? parent.parent_quantity : (parent.adapted.quantity || 1);
      let detectedBases = [...(parent.detected_base_modifiers || [])];

      // If no sequential modifier rows were attached, inspect inline modifiers string
      if (detectedBases.length === 0 && parent.adapted.modifiers) {
        const inlineDetected = this.detectBasesFromModifierString(parent.adapted.modifiers, parentQty);
        if (inlineDetected.length > 0) {
          detectedBases = inlineDetected;
        }
      }

      // Check if parent item inherently includes base in title
      const inherentBase = this.detectInherentTitleBase(parentName);
      if (inherentBase) {
        const standardizedName = this.standardizeInherentTitleName(parentName, inherentBase);
        const baseUsed = this.getBaseUsedLabel(inherentBase, standardizedName);
        const depleteBatch = this.getDepleteBatchForBase(inherentBase);
        return [{
          ...parent.adapted,
          raw_name: standardizedName,
          master_item_name: standardizedName,
          item_name: standardizedName,
          quantity: parentQty,
          base_type: inherentBase,
          base_used: baseUsed,
          deplete_batch: depleteBatch,
          modifiers: parent.adapted.modifiers || inherentBase,
          source_filename: parent.source_filename,
          row_index: parent.row_index
        }];
      }

      // If bases detected from modifiers (Sequential Order Parsing & Line-Item Splitting)
      if (detectedBases.length > 0) {
        const totalBaseUnits = detectedBases.reduce((sum, b) => sum + (b.qty || 1), 0);
        const uniqueBases = [...new Set(detectedBases.map(b => b.base))];

        // Multi-unit parent orders (e.g., "Buenos Dias", Quantity: 2):
        // If modifiers indicate 1 Waffle and 1 Pancake:
        // Generate two distinct output lines:
        // 1. "Buenos Dias (Waffle)" -> Qty: 1
        // 2. "Buenos Dias (Pancake)" -> Qty: 1
        if (uniqueBases.length > 1) {
          const splitLines = [];
          const baseGroups = {};
          detectedBases.forEach(b => {
            baseGroups[b.base] = (baseGroups[b.base] || 0) + (b.qty || 1);
          });

          for (const base of Object.keys(baseGroups)) {
            const bQty = baseGroups[base];
            const ratio = bQty / (totalBaseUnits || parentQty);
            const cleanName = this.cleanBaseName(parentName);
            const disambiguatedName = `${cleanName} (${base})`;
            const baseUsed = this.getBaseUsedLabel(base, disambiguatedName);
            const depleteBatch = this.getDepleteBatchForBase(base);
            const baseNet = parent.adapted.net_sales !== undefined ? parent.adapted.net_sales : (parent.adapted.net_payout !== undefined ? parent.adapted.net_payout : parent.adapted.gross_sales);

            splitLines.push({
              ...parent.adapted,
              raw_name: disambiguatedName,
              master_item_name: disambiguatedName,
              item_name: disambiguatedName,
              quantity: bQty,
              gross_sales: parseFloat((parent.adapted.gross_sales * ratio).toFixed(2)),
              net_sales: parseFloat((baseNet * ratio).toFixed(2)),
              net_payout: parseFloat((parent.adapted.net_payout * ratio).toFixed(2)),
              commission: parseFloat((parent.adapted.commission * ratio).toFixed(2)),
              discounts: parseFloat((parent.adapted.discounts * ratio).toFixed(2)),
              tax: parseFloat((parent.adapted.tax * ratio).toFixed(2)),
              base_type: base,
              base_used: baseUsed,
              deplete_batch: depleteBatch,
              modifiers: base,
              source_filename: parent.source_filename,
              row_index: parent.row_index
            });
          }
          return splitLines;
        } else {
          // Single base detected across all units (e.g., "Mulah Green" with "Pancake" -> "Mulah Green (Pancake)")
          const base = uniqueBases[0];
          const cleanName = this.cleanBaseName(parentName);
          const disambiguatedName = `${cleanName} (${base})`;
          const baseUsed = this.getBaseUsedLabel(base, disambiguatedName);
          const depleteBatch = this.getDepleteBatchForBase(base);

          return [{
            ...parent.adapted,
            raw_name: disambiguatedName,
            master_item_name: disambiguatedName,
            item_name: disambiguatedName,
            quantity: parentQty,
            base_type: base,
            base_used: baseUsed,
            deplete_batch: depleteBatch,
            modifiers: base,
            source_filename: parent.source_filename,
            row_index: parent.row_index
          }];
        }
      }

      // No base modifiers detected: preserve parent order
      return [{
        ...parent.adapted,
        raw_name: parentName,
        master_item_name: parentName,
        item_name: parentName,
        quantity: parentQty,
        source_filename: parent.source_filename,
        row_index: parent.row_index
      }];
    },

    bindParentModifiers(rows) {
      if (!Array.isArray(rows) || rows.length === 0) return [];
      
      // If rows are already transaction objects
      const items = [];
      let currentParent = null;

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (!row) continue;

        const cat = (row.category || row.Category || '').toString().trim();
        const isModifier = this.isModifierCategory(cat);

        if (isModifier) {
          if (currentParent) {
            currentParent.parent_modifiers.push(row);
            const modName = (row.item || row.Item || row.item_name || row.Item_Name || row.raw_name || '').toString().trim();
            const modQty = this.cleanInteger(row.quantity || row.Quantity || row.qty || row.Qty || 1);
            const baseKeyword = this.detectBaseModifierKeyword(modName);
            if (baseKeyword) {
              currentParent.detected_base_modifiers.push({
                base: baseKeyword,
                qty: modQty,
                raw: modName
              });
            }
            if (currentParent.adapted.modifiers) {
              currentParent.adapted.modifiers += `, ${modName}`;
            } else {
              currentParent.adapted.modifiers = modName;
            }
          }
          continue;
        }

        // Non-modifier row: flush previous parent
        if (currentParent) {
          const flushed = this.flushParentItem(currentParent);
          for (const item of flushed) {
            if (this.isValidSaleItem(item)) items.push(item);
          }
          currentParent = null;
        }

        const adapted = row.raw_name ? row : this.adaptChannelRow(row, row.channel || 'Square POS (In-Store)');
        if (adapted.is_cancelled || !this.isValidSaleItem(adapted)) continue;

        const pName = (row.item_name || row.Item_Name || row.item || row.Item || adapted.raw_name || '').toString().trim();
        const pQty = adapted.quantity > 0 ? adapted.quantity : this.cleanInteger(row.quantity || row.Quantity || row.qty || row.Qty || 1);

        currentParent = {
          current_parent_item: pName,
          parent_quantity: pQty,
          parent_modifiers: [],
          detected_base_modifiers: [],
          adapted: {
            ...adapted,
            quantity: pQty
          },
          source_filename: row.source_filename || 'manual',
          row_index: i
        };
      }

      if (currentParent) {
        const flushed = this.flushParentItem(currentParent);
        for (const item of flushed) {
          if (this.isValidSaleItem(item)) items.push(item);
        }
      }

      return items;
    },

    parseUniversalFile(fileData, filename = '') {
      let rawGrid = [];
      const lowerFilename = (filename || '').toLowerCase();

      if (lowerFilename.endsWith('.xlsx') || lowerFilename.endsWith('.xls')) {
        rawGrid = this.parseExcelArrayBuffer(fileData);
      } else if (typeof fileData === 'string') {
        rawGrid = this.parseDelimited(fileData);
      } else if (fileData instanceof ArrayBuffer || (typeof Buffer !== 'undefined' && Buffer.isBuffer(fileData)) || fileData instanceof Uint8Array) {
        // First try text decoding (detecting UTF-16LE or UTF-8 CSV/TSV)
        try {
          const decoded = this.decodeTextBuffer(fileData);
          rawGrid = this.parseDelimited(decoded);
        } catch (e) {
          rawGrid = [];
        }
        if (!rawGrid || rawGrid.length < 2) {
          try {
            rawGrid = this.parseExcelArrayBuffer(fileData);
          } catch (e2) {}
        }
      } else if (Array.isArray(fileData)) {
        if (fileData.length > 0 && !Array.isArray(fileData[0]) && typeof fileData[0] === 'object') {
          const keys = Object.keys(fileData[0]);
          rawGrid = [keys, ...fileData.map(obj => keys.map(k => obj[k]))];
        } else {
          rawGrid = fileData;
        }
      }

      if (rawGrid.length < 2) {
        return { channel: 'Unknown', filename, items: [], transactions: [], rawRowsCount: 0 };
      }

      const headers = rawGrid[0].map(h => (h || '').toString().trim());
      const channel = this.detectChannel(headers, filename);
      const items = [];

      // Sequential Order Parsing & Context Binding
      let currentParent = null;

      for (let i = 1; i < rawGrid.length; i++) {
        const row = rawGrid[i];
        if (!row || row.length === 0) continue;

        const rowObj = {};
        for (let c = 0; c < headers.length; c++) {
          rowObj[headers[c]] = row[c] !== undefined ? row[c].toString().trim() : '';
        }

        const adapted = this.adaptChannelRow(rowObj, channel);
        
        // Skip cancelled / refunded / voided transactions
        if (adapted.is_cancelled) {
          continue;
        }

        const rawCat = (rowObj['Category'] || rowObj['category'] || adapted.category || '').toString().trim();
        const isModifier = this.isModifierCategory(rawCat);

        if (isModifier) {
          // When subsequent rows with Category == 'Modifiers' appear:
          // Attach these rows as modifiers belonging directly to current_parent_item.
          if (currentParent) {
            currentParent.parent_modifiers.push(rowObj);
            const modName = (rowObj['Item'] || rowObj['Item Name'] || rowObj['Item_Name'] || adapted.raw_name || '').trim();
            const modQty = adapted.quantity > 0 ? adapted.quantity : this.cleanInteger(rowObj['Qty'] || rowObj['Quantity'] || rowObj['Units Sold'] || rowObj['Items Sold'] || 1);
            const baseKeyword = this.detectBaseModifierKeyword(modName);
            if (baseKeyword) {
              // Associate detected base modifier directly with parent item
              currentParent.detected_base_modifiers.push({
                base: baseKeyword,
                qty: modQty,
                raw: modName
              });
            }
            if (currentParent.adapted.modifiers) {
              currentParent.adapted.modifiers += `, ${modName}`;
            } else {
              currentParent.adapted.modifiers = modName;
            }
          }
          // Standalone modifier rows must not clutter output sales table
          continue;
        }

        // When a row with Category != 'Modifiers' is encountered:
        // Flush previous parent if exists
        if (currentParent) {
          const flushed = this.flushParentItem(currentParent);
          for (const fItem of flushed) {
            if (this.isValidSaleItem(fItem)) {
              items.push(fItem);
            }
          }
          currentParent = null;
        }

        if (!this.isValidSaleItem(adapted)) {
          continue;
        }

        // Set this item as current_parent_item = row.Item_Name
        // Track parent_quantity = row.Quantity
        // Initialize an array: parent_modifiers = []
        const parentItemName = (rowObj['Item'] || rowObj['Item Name'] || rowObj['Item_Name'] || adapted.raw_name || '').trim();
        const parentQuantity = adapted.quantity > 0 ? adapted.quantity : this.cleanInteger(rowObj['Qty'] || rowObj['Quantity'] || rowObj['Units Sold'] || rowObj['Items Sold'] || 1);

        currentParent = {
          current_parent_item: parentItemName,
          parent_quantity: parentQuantity,
          parent_modifiers: [],
          detected_base_modifiers: [],
          adapted: {
            ...adapted,
            quantity: parentQuantity,
            source_filename: filename,
            row_index: i
          },
          source_filename: filename,
          row_index: i
        };
      }

      // Flush final parent at end of file
      if (currentParent) {
        const flushed = this.flushParentItem(currentParent);
        for (const fItem of flushed) {
          if (this.isValidSaleItem(fItem)) {
            items.push(fItem);
          }
        }
      }

      return {
        channel,
        filename,
        headers,
        items,
        transactions: items,
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

      // 3. Strict High-Confidence Match ONLY (Prevents wild false positives on single words like 'chocolate', 'dubai', 'shake', 'waffle')
      const rawNumbers = (normRaw.match(/\d+/g) || []).sort().join(',');
      const rawTokens = normRaw.split(' ').filter(t => t.length > 1 || /\d/.test(t));
      if (rawTokens.length >= 2) {
        for (const r of recipes) {
          const rNorm = this.normalizeText(r.title || r.name);
          const rNumbers = (rNorm.match(/\d+/g) || []).sort().join(',');
          // If numbers are present in either string, they MUST match exactly
          if (rawNumbers !== rNumbers) {
            continue;
          }

          const rTokens = rNorm.split(' ').filter(t => t.length > 1 || /\d/.test(t));
          if (rTokens.length >= 2) {
            const intersection = rawTokens.filter(t => rTokens.includes(t));
            const union = new Set([...rawTokens, ...rTokens]);
            const jaccard = intersection.length / union.size;
            // Only match if token overlap is 85% or higher
            if (jaccard >= 0.85) {
              return {
                status: 'MATCHED',
                master_name: r.title || r.name,
                recipe_obj: r,
                match_type: 'HIGH_CONFIDENCE_SOP'
              };
            }
          }
        }
      }

      // If not strictly matched, return UNMAPPED so it keeps its exact raw name without hallucinating numbers
      return {
        status: 'UNMAPPED',
        master_name: null,
        recipe_obj: null,
        match_type: null
      };
    },

    // -----------------------------------------------------------
    // Master Recipe Base Definitions & 3-Tier Lookup Registry
    // -----------------------------------------------------------
    MASTER_ITEM_REGISTRY: {
      "Y650451": { name: "EL Fudgee", base_type: "Cheesecake", deplete_batch: "Cheesecake_Base_Slice", qty: 1 },
      "EL Fudgee": { base_type: "Cheesecake", deplete_batch: "Cheesecake_Base_Slice", qty: 1 },
      "4763263": { name: "Twist it, Lick it, Dunk it", base_type: "Liege Waffle", deplete_batch: "Liege Waffle Base", qty: 1 },
      "Twist it, Lick it, Dunk it": { base_type: "Liege Waffle", deplete_batch: "Liege Waffle Base", qty: 1 },
      "264776Y": { name: "My, Oh My Cherry Pie", base_type: "Waffle", deplete_batch: "Waffle_Batter_Portion", qty: 1 },
      "My, Oh My Cherry Pie": { base_type: "Waffle", deplete_batch: "Waffle_Batter_Portion", qty: 1 }
    },

    getCustomBaseMappings() {
      try {
        if (typeof localStorage !== 'undefined') {
          const stored = localStorage.getItem('ts_custom_base_mappings');
          if (stored) return JSON.parse(stored);
        }
      } catch (e) {}
      return this._memoryCustomBaseMappings || {};
    },

    setCustomBaseMapping(identifier, baseType, rawName = '') {
      if (!identifier || !baseType) return;
      if (!this._memoryCustomBaseMappings) this._memoryCustomBaseMappings = {};
      
      const mappings = this.getCustomBaseMappings();
      const cleanId = String(identifier).trim().toUpperCase();
      mappings[cleanId] = baseType;
      mappings[String(identifier).trim()] = baseType;
      this._memoryCustomBaseMappings[cleanId] = baseType;
      this._memoryCustomBaseMappings[String(identifier).trim()] = baseType;

      if (rawName) {
        const cleanName = String(rawName).trim();
        mappings[cleanName] = baseType;
        this._memoryCustomBaseMappings[cleanName] = baseType;
        const norm = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '');
        mappings[norm] = baseType;
        this._memoryCustomBaseMappings[norm] = baseType;
      }

      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('ts_custom_base_mappings', JSON.stringify(mappings));
        }
      } catch (e) {}
    },

    clearCustomBaseMappings() {
      this._memoryCustomBaseMappings = {};
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('ts_custom_base_mappings');
        }
      } catch (e) {}
    },

    getDepleteBatchForBase(baseType) {
      const norm = (baseType || '').toLowerCase();
      if (norm.includes('cheesecake')) return 'Cheesecake_Base_Slice';
      if (norm.includes('cookie dough') || norm.includes('cookiedough')) return 'Cookie_Dough_Puck';
      if (norm.includes('pancake')) return 'Pancake_Batter_Portion';
      if (norm.includes('croffle')) return 'Croissant_Dough_Piece';
      if (norm.includes('crepe')) return 'Crepe_Batter_Portion';
      if (norm.includes('waffle')) return 'Waffle_Batter_Portion';
      return 'General_Base_Portion';
    },

    // -----------------------------------------------------------
    // Dual-Base Ambiguity & Kitchen Production Logs Helpers
    // -----------------------------------------------------------
    isDualBaseCategory(category = '') {
      const normCat = (category || '').toLowerCase().trim();
      return (
        normCat.includes('waffles, pancakes, cookie doughs, cheesecakes') ||
        normCat.includes('waffles and pancakes') ||
        normCat.includes('waffles & pancakes') ||
        normCat.includes('pancakes and waffles') ||
        normCat.includes('pancakes & waffles') ||
        (normCat.includes('waffle') && normCat.includes('pancake'))
      );
    },

    isDedicatedNonComboBase(rawName = '', category = '') {
      const normName = (rawName || '').toLowerCase().trim();
      return /cheesecake|fudgee|cookie\s*dough|cookiedough|brownie|croffle|croissant|crepe|crêpe|burger|fries|chicken|tenders|wings|shake|smoothie|frappe|gelato|sorbet|sundae|water|coke|cola|fanta|sprite/i.test(normName);
    },

    hasExplicitWaffleOrPancakeInName(rawName = '') {
      const normName = (rawName || '').toLowerCase().trim();
      const hasWaffle = /\bwaffles?\b/i.test(normName);
      const hasPancake = /\bpancakes?\b|\bhotcakes?\b/i.test(normName);
      if (hasWaffle && !hasPancake) return 'WAFFLE';
      if (hasPancake && !hasWaffle) return 'PANCAKE';
      return null;
    },

    getDailyBaseReconciliations() {
      try {
        if (typeof localStorage !== 'undefined') {
          const stored = localStorage.getItem('ts_daily_sales_ledger_reconciliations') || localStorage.getItem('ts_daily_base_reconciliations');
          if (stored) return JSON.parse(stored);
        }
      } catch (e) {}
      return this._memoryDailyBaseReconciliations || {};
    },

    saveDailyBaseReconciliations(recs) {
      this._memoryDailyBaseReconciliations = recs;
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('ts_daily_sales_ledger_reconciliations', JSON.stringify(recs));
          localStorage.setItem('ts_daily_base_reconciliations', JSON.stringify(recs));
        }
      } catch (e) {}
    },

    getKitchenProductionLogs() {
      try {
        if (typeof localStorage !== 'undefined') {
          const stored = localStorage.getItem('ts_kitchen_production_logs');
          if (stored) return JSON.parse(stored);
        }
      } catch (e) {}
      return this._memoryKitchenProductionLogs || [];
    },

    saveKitchenProductionLogs(logs) {
      this._memoryKitchenProductionLogs = logs;
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('ts_kitchen_production_logs', JSON.stringify(logs));
        }
      } catch (e) {}
    },

    executeDailyBaseReconciliation(payload = {}) {
      const reportingDate = payload.reportingDate || 'ALL';
      const waffles = parseInt(payload.waffles, 10) || 0;
      const pancakes = parseInt(payload.pancakes, 10) || 0;
      const totalDualUnits = parseInt(payload.totalDualUnits, 10) || (waffles + pancakes);
      const channelSummary = payload.channelSummary || 'All Platforms';
      const confirmedByUser = payload.confirmedByUser || 'Store Manager';
      const totalWafflesOverall = (payload.totalWafflesOverall !== undefined) ? payload.totalWafflesOverall : waffles;
      const totalPancakesOverall = (payload.totalPancakesOverall !== undefined) ? payload.totalPancakesOverall : pancakes;
      const timestamp = new Date().toISOString();

      // 1. Save to daily base reconciliations
      const reconciliations = this.getDailyBaseReconciliations();
      const recRecord = {
        date: reportingDate,
        channel_summary: channelSummary,
        total_waffles_sold: totalWafflesOverall,
        total_pancakes_sold: totalPancakesOverall,
        split_waffles: waffles,
        split_pancakes: pancakes,
        total_dual_units: totalDualUnits,
        confirmed_by_user: confirmedByUser,
        confirmed_at: timestamp
      };
      reconciliations[reportingDate] = recRecord;
      reconciliations['LATEST'] = recRecord;
      this.saveDailyBaseReconciliations(reconciliations);

      // 2. Save to Kitchen Production Logs (ts_kitchen_production_logs)
      const kitchenLogs = this.getKitchenProductionLogs();
      const kplEntry = {
        id: 'KPL-' + Date.now(),
        date: reportingDate,
        timestamp: timestamp,
        action: 'DAILY_BASE_RECONCILIATION_DEPLETION',
        channel_summary: channelSummary,
        total_dual_base_units: totalDualUnits,
        waffles_depleted: waffles,
        pancakes_depleted: pancakes,
        depleted_batches: [
          { batch: 'Waffle_Batter_Portion', portions: waffles, description: 'Waffle Batter / Prepped Waffles' },
          { batch: 'Pancake_Batter_Portion', portions: pancakes, description: 'Pancake Batter' },
          { batch: 'Topping_Sauce_Portions', portions: totalDualUnits, description: 'Associated Toppings' },
          { batch: 'Packaging_Containers_Boxes', portions: totalDualUnits, description: 'Packaging & Containers' }
        ],
        confirmed_by_user: confirmedByUser,
        status: 'CONFIRMED'
      };
      kitchenLogs.unshift(kplEntry);
      this.saveKitchenProductionLogs(kitchenLogs);

      // 3. Deplete physical stock if available in localStorage
      const stock = this.getOnHandStock();
      if (stock['Waffle_Batter_Portion'] !== undefined) {
        stock['Waffle_Batter_Portion'] = Math.max(0, parseFloat((stock['Waffle_Batter_Portion'] - waffles).toFixed(2)));
      }
      if (stock['Pancake_Batter_Portion'] !== undefined) {
        stock['Pancake_Batter_Portion'] = Math.max(0, parseFloat((stock['Pancake_Batter_Portion'] - pancakes).toFixed(2)));
      }
      const storageKey = this.isDemoMode ? 'ts_demo_stock_levels' : 'ts_stock_levels';
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(storageKey, JSON.stringify(stock));
        }
      } catch (e) {}

      return {
        success: true,
        reconciliation: recRecord,
        kitchenLog: kplEntry
      };
    },

    lookupRegistry(sku = '', rawName = '') {
      const custom = this.getCustomBaseMappings();
      const cleanSku = (sku || '').trim().toUpperCase();
      const cleanName = (rawName || '').trim();
      const normName = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '');

      // Check manager custom overrides first
      if (cleanSku && custom[cleanSku]) {
        const b = custom[cleanSku];
        return { name: cleanName, base_type: b, deplete_batch: this.getDepleteBatchForBase(b), qty: 1, source: 'CUSTOM_OVERRIDE_SKU' };
      }
      if (cleanName && custom[cleanName]) {
        const b = custom[cleanName];
        return { name: cleanName, base_type: b, deplete_batch: this.getDepleteBatchForBase(b), qty: 1, source: 'CUSTOM_OVERRIDE_NAME' };
      }
      if (normName && custom[normName]) {
        const b = custom[normName];
        return { name: cleanName, base_type: b, deplete_batch: this.getDepleteBatchForBase(b), qty: 1, source: 'CUSTOM_OVERRIDE_NORM_NAME' };
      }

      // Tier 1 (Highest Priority - SKU Match)
      if (cleanSku) {
        if (this.MASTER_ITEM_REGISTRY[cleanSku]) {
          return { ...this.MASTER_ITEM_REGISTRY[cleanSku], source: 'TIER1_SKU' };
        }
        for (const [k, val] of Object.entries(this.MASTER_ITEM_REGISTRY)) {
          if (k.trim().toUpperCase() === cleanSku) {
            return { ...val, source: 'TIER1_SKU' };
          }
        }
      }

      // Tier 2 (Name Match)
      if (cleanName) {
        if (this.MASTER_ITEM_REGISTRY[cleanName]) {
          return { ...this.MASTER_ITEM_REGISTRY[cleanName], source: 'TIER2_NAME' };
        }
        for (const [k, val] of Object.entries(this.MASTER_ITEM_REGISTRY)) {
          const kNorm = k.toLowerCase().replace(/[^a-z0-9]/g, '');
          const valNameNorm = (val.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          if (kNorm === normName || valNameNorm === normName) {
            return { ...val, source: 'TIER2_NAME' };
          }
        }
      }

      return null;
    },

    formatBaseTypeInfo(baseType, depleteBatch = '', qty = 1, tier = '') {
      const b = (baseType || '').trim();
      const norm = b.toLowerCase();

      if (norm === 'cheesecake') {
        return { type: 'CHEESECAKE', label: 'Cheesecake', plural: 'Cheesecakes', icon: '🍰', badge: '🍰 Cheesecake', deplete_batch: depleteBatch || 'Cheesecake_Base_Slice', deplete_qty: qty, tier: tier };
      }
      if (norm === 'liege waffle' || norm.includes('liege')) {
        return { type: 'WAFFLE', label: 'Liege Waffle', plural: 'Liege Waffles', icon: '🧇', badge: '🧇 Liege Waffle', deplete_batch: depleteBatch || 'Liege Waffle Base', deplete_qty: qty, tier: tier };
      }
      if (norm === 'waffle') {
        return { type: 'WAFFLE', label: 'Waffle', plural: 'Waffles', icon: '🧇', badge: '🧇 Waffle', deplete_batch: depleteBatch || 'Waffle_Batter_Portion', deplete_qty: qty, tier: tier };
      }
      if (norm === 'cookie dough' || norm === 'cookiedough') {
        return { type: 'COOKIE_DOUGH', label: 'Cookie Dough', plural: 'Cookie Doughs', icon: '🍪', badge: '🍪 Cookie Dough', deplete_batch: depleteBatch || 'Cookie_Dough_Puck', deplete_qty: qty, tier: tier };
      }
      if (norm === 'pancake') {
        return { type: 'PANCAKE', label: 'Pancake', plural: 'Pancakes', icon: '🥞', badge: '🥞 Pancake', deplete_batch: depleteBatch || 'Pancake_Batter_Portion', deplete_qty: qty, tier: tier };
      }
      if (norm === 'croffle') {
        return { type: 'CROFFLE', label: 'Croffle', plural: 'Croffles', icon: '🥐', badge: '🥐 Croffle', deplete_batch: depleteBatch || 'Croissant_Dough_Piece', deplete_qty: qty, tier: tier };
      }
      if (norm === 'crepe' || norm === 'crêpe') {
        return { type: 'CREPE', label: 'Crepe', plural: 'Crepes', icon: '🥞', badge: '🥞 Crepe', deplete_batch: depleteBatch || 'Crepe_Batter_Portion', deplete_qty: qty, tier: tier };
      }
      if (norm.includes('savoury') || norm.includes('burger')) {
        return { type: 'SAVOURY_BURGER', label: 'Savoury Mains & Sides', plural: 'Savoury Mains & Sides', icon: '🍔', badge: '🍔 Savoury Mains & Sides', deplete_batch: depleteBatch || 'Savoury_Portion', deplete_qty: qty, tier: tier };
      }
      if (norm.includes('shake') || norm.includes('smoothie')) {
        return { type: 'MILKSHAKE', label: 'Beverages & Shakes', plural: 'Beverages & Shakes', icon: '🥤', badge: '🥤 Beverages & Shakes', deplete_batch: depleteBatch || 'Shake_Mix_Portion', deplete_qty: qty, tier: tier };
      }
      if (norm.includes('gelato') || norm.includes('scoop') || norm.includes('sorbet')) {
        return { type: 'GELATO_SUNDAE', label: 'Ice Cream / Scoops', plural: 'Ice Cream / Scoops', icon: '🍨', badge: '🍨 Ice Cream / Scoops', deplete_batch: depleteBatch || 'Gelato_Scoop_Portion', deplete_qty: qty, tier: tier };
      }
      if (norm === 'unresolved_base') {
        return { type: 'UNRESOLVED_BASE', label: 'Unresolved Base', plural: 'Unresolved Bases', icon: '❓', badge: '❓ Unresolved Base', deplete_batch: '', deplete_qty: 0, is_unresolved: true, tier: tier };
      }
      if (norm === 'dual_base_combo') {
        return {
          type: 'DUAL_BASE_COMBO',
          label: 'Waffles & Pancakes Combo',
          plural: 'Waffles & Pancakes Combos',
          icon: '🧇🥞',
          badge: '🧇🥞 Waffle & Pancake',
          deplete_batch: '',
          deplete_qty: 0,
          is_dual_base_combo: true,
          tier: tier || 'DUAL_BASE_AMBIGUOUS'
        };
      }

      return { type: 'OTHER', label: b || 'General Menu', plural: (b || 'General Item') + 's', icon: '🍽️', badge: `🍽️ ${b || 'General'}`, deplete_batch: depleteBatch, deplete_qty: qty, tier: tier };
    },

    // -----------------------------------------------------------
    // Fuzzy Category & Sub-Category Normalization
    // -----------------------------------------------------------
    normalizeAuditCategory(category = '', rawName = '', sku = '', mainType = '') {
      const cat = (category || '').toLowerCase().trim();
      const name = (rawName || '').toLowerCase().trim();

      // 1. Direct resolution from identified mainType (Tier 1 & Tier 2 override)
      if (mainType === 'CHEESECAKE') return 'Cheesecakes';
      if (mainType === 'SAVOURY_BURGER') return 'Savoury Mains & Sides';
      if (mainType === 'MILKSHAKE') return 'Beverages & Shakes';
      if (mainType === 'GELATO_SUNDAE') return 'Scoops / Ice Cream';
      if (mainType === 'UNRESOLVED_BASE') return 'Unresolved Recipe Base';
      if (mainType === 'WAFFLE' || mainType === 'PANCAKE' || mainType === 'COOKIE_DOUGH' || mainType === 'CROFFLE' || mainType === 'CREPE' || mainType === 'DUAL_BASE_COMBO') {
        return 'Desserts/Waffles Audit';
      }

      // 2. Registry match if sku or name provided
      const reg = this.lookupRegistry ? this.lookupRegistry(sku, rawName) : null;
      if (reg && reg.base_type) {
        if (reg.base_type === 'Cheesecake') return 'Cheesecakes';
        if (reg.base_type === 'Savoury Mains & Sides') return 'Savoury Mains & Sides';
        if (reg.base_type === 'Beverages & Shakes') return 'Beverages & Shakes';
        if (reg.base_type === 'Ice Cream / Scoops') return 'Scoops / Ice Cream';
        return 'Desserts/Waffles Audit';
      }

      // 3. Explicit Name Checks
      if (name.includes('cheesecake') || name.includes('fudgee')) return 'Cheesecakes';
      if (name.includes('burger') || name.includes('fries') || name.includes('side ting') || name.includes('bloc prty') || name.includes('cajun') || name.includes('tender') || name.includes('wing')) {
        return 'Savoury Mains & Sides';
      }
      if (name.includes('shake') || name.includes('smoothie') || name.includes('water') || name.includes('coke') || name.includes('fanta') || name.includes('sprite') || name.includes('cola')) {
        return 'Beverages & Shakes';
      }
      if (name.includes('scoop') || name.includes('gelato') || name.includes('sorbet') || name.includes('sundae')) {
        return 'Scoops / Ice Cream';
      }

      // 4. Desserts / Waffles audit segment
      if (
        cat.includes('waffles, pancakes, cookie doughs, cheesecakes') ||
        cat.includes('desserts/waffles audit') ||
        cat.includes('dessert/waffle') ||
        cat.includes('waffle') ||
        cat.includes('cookie dough') ||
        cat.includes('cheesecake') ||
        cat.includes('croffle') ||
        cat.includes('pancake') ||
        cat.includes('crepe') ||
        cat.includes('dessert')
      ) {
        if (cat.includes('cheesecake') && !cat.includes('waffle')) return 'Cheesecakes';
        return 'Desserts/Waffles Audit';
      }

      // 5. Savoury Mains & Sides
      if (
        cat.includes('burger') || cat.includes('fully funked fries') || cat.includes('side ting') || cat.includes('bloc prty') ||
        cat.includes('savoury mains & sides') || cat.includes('fries') || cat.includes('savoury') || cat.includes('savory') || cat.includes('chicken')
      ) {
        return 'Savoury Mains & Sides';
      }

      // 6. Beverages & Shakes
      if (
        cat.includes('candy bar shakes') || cat.includes('milkshakes') || cat.includes('milkshake') ||
        cat.includes('beverages & shakes') || cat.includes('shake') || cat.includes('smoothie') ||
        cat.includes('drink') || cat.includes('beverage')
      ) {
        return 'Beverages & Shakes';
      }

      // 7. Scoops / Ice Cream
      if (
        cat.includes('gelato & sorbet scoops') || cat.includes('scoops / ice cream') || cat.includes('ice cream / scoops') ||
        cat.includes('gelato') || cat.includes('sorbet') || cat.includes('scoop') || cat.includes('ice cream') || cat.includes('sundae')
      ) {
        return 'Scoops / Ice Cream';
      }

      return category || 'Desserts & Mains';
    },

    // -----------------------------------------------------------
    // 5b. Smart Mains & Dessert Base Classification Engine (3-Tier Priority)
    // -----------------------------------------------------------
    detectMainBase(rawName = '', modifiers = '', category = '', variation = '', notes = '', recipeObj = null, sku = '') {
      const normMod = (modifiers || '').toLowerCase();
      const normName = (rawName || '').toLowerCase();
      const normCat = (category || '').toLowerCase();
      const normVar = (variation || '').toLowerCase();
      const normNotes = (notes || '').toLowerCase();
      const cleanSku = (sku || '').trim().toUpperCase();

      // Check if disambiguated label in parentheses is already in rawName
      if (/\(pancakes?\)/i.test(normName)) {
        return this.formatBaseTypeInfo('Pancake', 'Pancake_Batter_Portion', 1, 'DISAMBIGUATED_LABEL_PANCAKE');
      }
      if (/\(waffles?\)/i.test(normName) || /\(liege waffle\)/i.test(normName)) {
        return this.formatBaseTypeInfo('Waffle', 'Waffle_Batter_Portion', 1, 'DISAMBIGUATED_LABEL_WAFFLE');
      }
      if (/\(cheesecakes?\)/i.test(normName)) {
        return this.formatBaseTypeInfo('Cheesecake', 'Cheesecake_Base_Slice', 1, 'DISAMBIGUATED_LABEL_CHEESECAKE');
      }
      if (/\(cookie[\s-]*doughs?\)/i.test(normName)) {
        return this.formatBaseTypeInfo('Cookie Dough', 'Cookie_Dough_Puck', 1, 'DISAMBIGUATED_LABEL_COOKIE_DOUGH');
      }

      // Check manager custom overrides first
      const customOverrides = this.getCustomBaseMappings();
      if (cleanSku && customOverrides[cleanSku]) {
        const b = customOverrides[cleanSku];
        return this.formatBaseTypeInfo(b, this.getDepleteBatchForBase(b), 1, 'CUSTOM_OVERRIDE_SKU');
      }
      if (rawName && customOverrides[rawName.trim()]) {
        const b = customOverrides[rawName.trim()];
        return this.formatBaseTypeInfo(b, this.getDepleteBatchForBase(b), 1, 'CUSTOM_OVERRIDE_NAME');
      }

      // Check if item belongs to dual-base categories (e.g. "Waffles, Pancakes, Cookie Doughs, Cheesecakes" or "Waffles and Pancakes")
      if (this.isDualBaseCategory(category)) {
        // Exclude dedicated non-combo bases via regex (e.g. Cheesecake, Cookie Dough, Brownie, Croffle, etc.)
        if (this.isDedicatedNonComboBase(rawName, category)) {
          if (normName.includes('cheesecake') || normName.includes('fudgee')) {
            return this.formatBaseTypeInfo('Cheesecake', 'Cheesecake_Base_Slice', 1, 'TIER_1_DEDICATED');
          }
          if (normName.includes('cookie dough') || normName.includes('cookiedough')) {
            return this.formatBaseTypeInfo('Cookie Dough', 'Cookie_Dough_Puck', 1, 'TIER_1_DEDICATED');
          }
          if (normName.includes('croffle') || normName.includes('croissant')) {
            return this.formatBaseTypeInfo('Croffle', 'Croissant_Dough_Piece', 1, 'TIER_1_DEDICATED');
          }
          if (normName.includes('crepe') || normName.includes('crêpe')) {
            return this.formatBaseTypeInfo('Crepe', 'Crepe_Batter_Portion', 1, 'TIER_1_DEDICATED');
          }
        }

        // Check if row SKU matches a dedicated base in MASTER_ITEM_REGISTRY (e.g. EL Fudgee -> Cheesecake, Twist it -> Liege Waffle)
        if (cleanSku && this.MASTER_ITEM_REGISTRY[cleanSku]) {
          const regItem = this.MASTER_ITEM_REGISTRY[cleanSku];
          if (regItem.base_type === 'Cheesecake' || regItem.base_type === 'Cookie Dough' || regItem.base_type === 'Liege Waffle' || regItem.base_type === 'Waffle') {
            return this.formatBaseTypeInfo(regItem.base_type, regItem.deplete_batch, regItem.qty || 1, 'TIER_1_SKU');
          }
        }

        // Check if item name explicitly distinguishes Waffle vs Pancake
        const explicitNameBase = this.hasExplicitWaffleOrPancakeInName(rawName);
        if (explicitNameBase === 'WAFFLE') {
          return this.formatBaseTypeInfo('Waffle', 'Waffle_Batter_Portion', 1, 'EXPLICIT_NAME_WAFFLE');
        }
        if (explicitNameBase === 'PANCAKE') {
          return this.formatBaseTypeInfo('Pancake', 'Pancake_Batter_Portion', 1, 'EXPLICIT_NAME_PANCAKE');
        }

        // Check customer modifiers / variations for explicit base keywords
        const allModText = `${normMod} ${normVar} ${normNotes}`.toLowerCase();
        if (allModText.includes('cheesecake')) {
          return this.formatBaseTypeInfo('Cheesecake', 'Cheesecake_Base_Slice', 1, 'EXPLICIT_MODIFIER_CHEESECAKE');
        }
        if (allModText.includes('cookie dough') || allModText.includes('cookiedough')) {
          return this.formatBaseTypeInfo('Cookie Dough', 'Cookie_Dough_Puck', 1, 'EXPLICIT_MODIFIER_COOKIE_DOUGH');
        }
        if (/\bwaffles?\b/i.test(allModText) && !/\bpancakes?\b/i.test(allModText)) {
          return this.formatBaseTypeInfo('Waffle', 'Waffle_Batter_Portion', 1, 'EXPLICIT_MODIFIER_WAFFLE');
        }
        if (/\bpancakes?\b|\bhotcakes?\b/i.test(allModText) && !/\bwaffles?\b/i.test(allModText)) {
          return this.formatBaseTypeInfo('Pancake', 'Pancake_Batter_Portion', 1, 'EXPLICIT_MODIFIER_PANCAKE');
        }

        // If base is NOT explicitly distinguished in item name (e.g. 'Buenos Días', 'Strawberry Fields', 'Mulah Green'):
        // It is an Ambiguous Dual-Base Combo Item!
        return {
          type: 'DUAL_BASE_COMBO',
          label: 'Waffles & Pancakes Combo',
          plural: 'Waffles & Pancakes Combos',
          icon: '🧇🥞',
          badge: '🧇🥞 Waffle & Pancake',
          deplete_batch: '',
          deplete_qty: 0,
          is_dual_base_combo: true,
          tier: 'DUAL_BASE_AMBIGUOUS'
        };
      }

      // =========================================================
      // TIER 1 (Highest Priority - SKU Match)
      // Match row SKU against Master Recipe Catalog / MASTER_ITEM_REGISTRY
      // =========================================================
      if (cleanSku) {
        const skuMatch = this.lookupRegistry(cleanSku, '');
        if (skuMatch && skuMatch.base_type) {
          return this.formatBaseTypeInfo(skuMatch.base_type, skuMatch.deplete_batch, skuMatch.qty || 1, 'TIER_1_SKU');
        }
      }

      // =========================================================
      // TIER 2 (Name Match)
      // Match normalized Item Name against internal recipe definitions
      // =========================================================
      if (rawName && rawName.trim()) {
        const nameMatch = this.lookupRegistry('', rawName);
        if (nameMatch && nameMatch.base_type) {
          return this.formatBaseTypeInfo(nameMatch.base_type, nameMatch.deplete_batch, nameMatch.qty || 1, 'TIER_2_NAME');
        }
      }

      // Tier 2b: Check Linked SOP Recipe ingredients
      if (recipeObj && Array.isArray(recipeObj.ingredients)) {
        const ingNames = recipeObj.ingredients.map(i => (i.name || '').toLowerCase()).join(' ');
        if (ingNames.includes('cheesecake')) return this.formatBaseTypeInfo('Cheesecake', 'Cheesecake_Base_Slice', 1, 'TIER_2_RECIPE');
        if (ingNames.includes('pancake')) return this.formatBaseTypeInfo('Pancake', 'Pancake_Batter_Portion', 1, 'TIER_2_RECIPE');
        if (ingNames.includes('waffle')) return this.formatBaseTypeInfo('Waffle', 'Waffle_Batter_Portion', 1, 'TIER_2_RECIPE');
        if (ingNames.includes('cookie dough')) return this.formatBaseTypeInfo('Cookie Dough', 'Cookie_Dough_Puck', 1, 'TIER_2_RECIPE');
        if (ingNames.includes('croffle') || ingNames.includes('croissant')) return this.formatBaseTypeInfo('Croffle', 'Croissant_Dough_Piece', 1, 'TIER_2_RECIPE');
        if (ingNames.includes('brioche') || ingNames.includes('patty') || ingNames.includes('fries')) return this.formatBaseTypeInfo('Savoury Mains & Sides', 'Savoury_Portion', 1, 'TIER_2_RECIPE');
        if (ingNames.includes('milk') && ingNames.includes('mix')) return this.formatBaseTypeInfo('Beverages & Shakes', 'Shake_Mix_Portion', 1, 'TIER_2_RECIPE');
      }

      // Tier 2c: Explicit Item Name & Customer Modifier Keywords
      const allModText = `${normMod} ${normVar} ${normNotes}`.toLowerCase();
      if (allModText.includes('cheesecake')) return this.formatBaseTypeInfo('Cheesecake', 'Cheesecake_Base_Slice', 1, 'TIER_2_MODIFIER');
      if (allModText.includes('pancake') || allModText.includes('pancakes') || allModText.includes('american pancake') || allModText.includes('hotcake')) return this.formatBaseTypeInfo('Pancake', 'Pancake_Batter_Portion', 1, 'TIER_2_MODIFIER');
      if (allModText.includes('croffle') || allModText.includes('croissant waffle')) return this.formatBaseTypeInfo('Croffle', 'Croissant_Dough_Piece', 1, 'TIER_2_MODIFIER');
      if (allModText.includes('cookie dough') || allModText.includes('cookiedough') || allModText.includes('cookie-dough')) return this.formatBaseTypeInfo('Cookie Dough', 'Cookie_Dough_Puck', 1, 'TIER_2_MODIFIER');
      if (allModText.includes('liege waffle') || allModText.includes('belgian waffle') || allModText.includes('bubble waffle') || allModText.includes('waffle')) return this.formatBaseTypeInfo('Waffle', 'Waffle_Batter_Portion', 1, 'TIER_2_MODIFIER');
      if (allModText.includes('crepe') || allModText.includes('crêpe')) return this.formatBaseTypeInfo('Crepe', 'Crepe_Batter_Portion', 1, 'TIER_2_MODIFIER');
      if (allModText.includes('brioche bun') || allModText.includes('fries') || allModText.includes('chicken patty')) return this.formatBaseTypeInfo('Savoury Mains & Sides', 'Savoury_Portion', 1, 'TIER_2_MODIFIER');

      // Explicit Item Name Keywords
      if (normName.includes('cheesecake') || normName.includes('fudgee')) return this.formatBaseTypeInfo('Cheesecake', 'Cheesecake_Base_Slice', 1, 'TIER_2_NAME_KEYWORD');
      if (normName.includes('pancake') || normName.includes('hotcake') || normName.includes('pancake stack')) return this.formatBaseTypeInfo('Pancake', 'Pancake_Batter_Portion', 1, 'TIER_2_NAME_KEYWORD');
      if (normName.includes('waffle')) return this.formatBaseTypeInfo('Waffle', 'Waffle_Batter_Portion', 1, 'TIER_2_NAME_KEYWORD');
      if (normName.includes('croffle')) return this.formatBaseTypeInfo('Croffle', 'Croissant_Dough_Piece', 1, 'TIER_2_NAME_KEYWORD');
      if (normName.includes('cookie dough') || normName.includes('cookiedough')) return this.formatBaseTypeInfo('Cookie Dough', 'Cookie_Dough_Puck', 1, 'TIER_2_NAME_KEYWORD');
      if (normName.includes('crepe') || normName.includes('crêpe')) return this.formatBaseTypeInfo('Crepe', 'Crepe_Batter_Portion', 1, 'TIER_2_NAME_KEYWORD');
      if (normName.includes('burger') || normName.includes('chicken') || normName.includes('tenders') || normName.includes('cajun') || normName.includes('wings') || normName.includes('louisiana') || normName.includes('papi chulo') || normName.includes('fries') || normName.includes('chick n') || normName.includes('side ting') || normName.includes('bloc prty')) {
        return this.formatBaseTypeInfo('Savoury Mains & Sides', 'Savoury_Portion', 1, 'TIER_2_NAME_KEYWORD');
      }
      if (normName.includes('shake') || normName.includes('smoothie') || normName.includes('frappe')) return this.formatBaseTypeInfo('Beverages & Shakes', 'Shake_Mix_Portion', 1, 'TIER_2_NAME_KEYWORD');
      if (normName.includes('gelato') || normName.includes('scoop') || normName.includes('sundae') || normName.includes('sorbet')) return this.formatBaseTypeInfo('Ice Cream / Scoops', 'Gelato_Scoop_Portion', 1, 'TIER_2_NAME_KEYWORD');
      if (normName.includes('water') || normName.includes('coke') || normName.includes('cola') || normName.includes('fanta') || normName.includes('sprite') || normName.includes('drink') || normName.includes('tea') || normName.includes('coffee')) {
        return this.formatBaseTypeInfo('General Menu', '', 0, 'TIER_2_NAME_KEYWORD');
      }

      // =========================================================
      // TIER 3 (Fallback - Category Guessing)
      // ONLY use Category keyword guessing if Tier 1 and Tier 2 fail.
      // =========================================================
      // If category is unclassified/unknown or unresolved:
      // Do NOT default to Waffle! Tag it as UNRESOLVED_BASE!
      if (normCat.includes('unresolved') || normCat.includes('unclassified') || normCat.includes('unknown') || normCat.includes('waffles, pancakes, cookie doughs, cheesecakes')) {
        return {
          type: 'UNRESOLVED_BASE',
          label: 'Unresolved Base',
          plural: 'Unresolved Bases',
          icon: '❓',
          badge: '❓ Unresolved Base',
          deplete_batch: '',
          deplete_qty: 0,
          is_unresolved: true,
          tier: 'TIER_3_UNRESOLVED'
        };
      }

      if (normCat.includes('cheesecake')) return this.formatBaseTypeInfo('Cheesecake', 'Cheesecake_Base_Slice', 1, 'TIER_3_CATEGORY');
      if (normCat.includes('burger') || normCat.includes('fully funked fries') || normCat.includes('side ting') || normCat.includes('bloc prty') || normCat.includes('chicken') || normCat.includes('savory') || normCat.includes('savoury')) {
        return this.formatBaseTypeInfo('Savoury Mains & Sides', 'Savoury_Portion', 1, 'TIER_3_CATEGORY');
      }
      if (normCat.includes('candy bar shakes') || normCat.includes('milkshake') || normCat.includes('shake') || normCat.includes('smoothie')) {
        return this.formatBaseTypeInfo('Beverages & Shakes', 'Shake_Mix_Portion', 1, 'TIER_3_CATEGORY');
      }
      if (normCat.includes('gelato & sorbet scoops') || normCat.includes('gelato') || normCat.includes('scoop') || normCat.includes('sorbet') || normCat.includes('sundae')) {
        return this.formatBaseTypeInfo('Ice Cream / Scoops', 'Gelato_Scoop_Portion', 1, 'TIER_3_CATEGORY');
      }
      if (normCat.includes('pancake') && !normCat.includes('waffle')) return this.formatBaseTypeInfo('Pancake', 'Pancake_Batter_Portion', 1, 'TIER_3_CATEGORY');
      if (normCat.includes('waffle') && !normCat.includes('pancake')) return this.formatBaseTypeInfo('Waffle', 'Waffle_Batter_Portion', 1, 'TIER_3_CATEGORY');
      if (normCat.includes('cookie dough')) return this.formatBaseTypeInfo('Cookie Dough', 'Cookie_Dough_Puck', 1, 'TIER_3_CATEGORY');
      if (normCat.includes('croffle')) return this.formatBaseTypeInfo('Croffle', 'Croissant_Dough_Piece', 1, 'TIER_3_CATEGORY');
      if (normCat.includes('crepe')) return this.formatBaseTypeInfo('Crepe', 'Crepe_Batter_Portion', 1, 'TIER_3_CATEGORY');

      return { type: 'OTHER', label: 'General Menu', plural: 'General Items', icon: '🍽️', badge: '🍽️ General', deplete_batch: '', deplete_qty: 0, tier: 'TIER_3_FALLBACK' };
    },

    disambiguateItemName(baseItemName, mainInfo, modifiers = '') {
      if (!baseItemName) return 'Unnamed Product';
      const normName = baseItemName.toLowerCase();
      const normMod = (modifiers || '').toLowerCase();

      // Don't append croffle/waffle suffix to Viral Dubai Chocolate - Kunafa
      if (normName.includes('dubai') || normName.includes('kunafa')) {
        return baseItemName;
      }

      // If already disambiguated with a parenthesized base label, return as-is
      if (/\((Waffle|Pancake|Cheesecake|Cookie Dough|Liege Waffle|Croffle|Crepe|Pancakes)\)\s*$/i.test(baseItemName)) {
        return baseItemName;
      }

      // Explicit registry items or items already properly branded keep clean name if not dual base or unresolved
      if (
        normName.includes('fudgee') ||
        normName.includes('cherry pie') ||
        mainInfo.type === 'UNRESOLVED_BASE' ||
        mainInfo.type === 'DUAL_BASE_COMBO'
      ) {
        return baseItemName;
      }

      // Disambiguate if base item name does NOT already mention the main base
      if (mainInfo.type === 'WAFFLE' && !normName.includes('waffle')) {
        const specificType = (mainInfo.label && mainInfo.label.toLowerCase().includes('liege')) || normMod.includes('liege') ? 'Liege Waffle' : 'Waffle';
        return `${baseItemName} (${specificType})`;
      }
      if (mainInfo.type === 'PANCAKE' && !normName.includes('pancake')) {
        return `${baseItemName} (Pancake)`;
      }
      if (mainInfo.type === 'CHEESECAKE' && !normName.includes('cheesecake')) {
        return `${baseItemName} (Cheesecake)`;
      }
      if (mainInfo.type === 'COOKIE_DOUGH' && !normName.includes('cookie dough') && !normName.includes('cookiedough')) {
        return `${baseItemName} (Cookie Dough)`;
      }
      if (mainInfo.type === 'CROFFLE' && !normName.includes('croffle')) {
        return `${baseItemName} (Croffle)`;
      }
      if (mainInfo.type === 'CREPE' && !normName.includes('crepe') && !normName.includes('crêpe')) {
        return `${baseItemName} (Crepe)`;
      }
      return baseItemName;
    },

    // -----------------------------------------------------------
    // 6. Master Consolidated Sales Dataset Generation
    // -----------------------------------------------------------
    consolidateSales(parsedFiles, options = {}) {
      const reportingDate = options.reportingDate || null; // null means all dates
      const recipes = options.recipes || this.getMasterRecipes();
      const aliases = options.aliases || this.getAliases();

      const ledgerMap = new Map(); // final_item_name -> row
      const unmappedMap = new Map(); // raw_name -> details
      const unresolvedBasesMap = new Map(); // identifier -> unresolved item details
      
      let grandTotalUnits = 0;
      let grandTotalGross = 0;
      let grandTotalCommission = 0;
      let grandTotalNet = 0;
      let grandTotalDiscounts = 0;

      const channelTotals = {
        'Square': { units: 0, gross: 0, commission: 0, net: 0 },
        'Square POS (In-Store)': { units: 0, gross: 0, commission: 0, net: 0 },
        'Uber Eats': { units: 0, gross: 0, commission: 0, net: 0 },
        'Just Eat': { units: 0, gross: 0, commission: 0, net: 0 },
        'Deliveroo': { units: 0, gross: 0, commission: 0, net: 0 }
      };
      channelTotals['Square POS (In-Store)'] = channelTotals['Square'];

      const availableDatesSet = new Set();
      const dualBaseAmbiguousItems = [];
      let totalDualBaseUnits = 0;
      const dualChannelCounts = {
        'Square': 0,
        'Uber Eats': 0,
        'Just Eat': 0,
        'Deliveroo': 0
      };

      let filesList = [];
      if (Array.isArray(parsedFiles)) {
        if (parsedFiles.length > 0 && parsedFiles[0].items) {
          filesList = parsedFiles;
        } else if (parsedFiles.length > 0 && (parsedFiles[0].raw_name || parsedFiles[0].item_name || parsedFiles[0].item)) {
          filesList = [{ filename: 'direct_items', items: parsedFiles }];
        } else {
          filesList = parsedFiles;
        }
      } else if (parsedFiles && parsedFiles.items) {
        filesList = [parsedFiles];
      }

      for (const file of filesList) {
        for (const item of (file.items || [])) {
          if (item.date) availableDatesSet.add(item.date);

          // Date filter
          if (reportingDate && reportingDate !== 'ALL' && item.date && item.date !== reportingDate) {
            continue;
          }

          const match = this.matchToMasterRecipe(item.raw_name, item.channel, recipes, aliases);
          const hasRecipe = (match.status === 'MATCHED');
          const matchedName = hasRecipe ? match.master_name : (item.raw_name || 'Unnamed Product');

          // Detect Main Base (Waffles, Pancakes, Cookie Dough, Croffles, Cheesecakes, etc.)
          const mainInfo = this.detectMainBase(item.raw_name, item.modifiers, item.category, item.variation, item.notes, hasRecipe ? match.recipe_obj : null, item.sku);
          const finalItemName = this.disambiguateItemName(matchedName, mainInfo, item.modifiers);
          const auditCategory = this.normalizeAuditCategory(item.category, item.raw_name, item.sku, mainInfo.type);

          if (!ledgerMap.has(finalItemName)) {
            const formattedCategory = (mainInfo.type === 'CHEESECAKE')
              ? 'Cheesecakes'
              : (auditCategory || (hasRecipe && match.recipe_obj && match.recipe_obj.category ? match.recipe_obj.category : (item.category || 'Desserts & Mains')));

            ledgerMap.set(finalItemName, {
              master_item_name: finalItemName,
              base_product_name: matchedName,
              raw_name: item.raw_name,
              sku: item.sku || '',
              raw_category: item.category || '',
              category: formattedCategory,
              audit_segment: auditCategory,
              main_type: mainInfo.type,
              main_label: mainInfo.label,
              main_plural: mainInfo.plural,
              main_badge: mainInfo.badge,
              main_icon: mainInfo.icon,
              base_used: item.base_used || this.getBaseUsedLabel(mainInfo.type, finalItemName),
              deplete_batch: mainInfo.deplete_batch || item.deplete_batch || this.getDepleteBatchForBase(mainInfo.type),
              deplete_qty: mainInfo.deplete_qty || 1,
              unit_price: 0,
              is_unresolved_base: Boolean(mainInfo.is_unresolved),
              tier_resolution: mainInfo.tier || '',
              modifiers_applied: item.modifiers || '',
              has_sop_recipe: hasRecipe,
              recipe_obj: hasRecipe ? match.recipe_obj : null,
              match_type: hasRecipe ? match.match_type : 'DIRECT_SALES',
              square_units: 0,
              square_gross: 0,
              uber_eats_units: 0,
              uber_eats_gross: 0,
              just_eat_units: 0,
              just_eat_gross: 0,
              deliveroo_units: 0,
              deliveroo_gross: 0,
              total_volume: 0,
              gross_revenue: 0,
              total_commissions: 0,
              net_revenue: 0,
              discounts_total: 0,
              avg_price: 0,
              revenue_contribution_pct: 0,
              units_contribution_pct: 0,
              performance_tier: 'MODERATE', // 'BEST' | 'MODERATE' | 'LEAST'
              channel_share: {
                square_pct: 0,
                uber_pct: 0,
                just_eat_pct: 0,
                deliveroo_pct: 0
              }
            });
          }

          const row = ledgerMap.get(finalItemName);
          const qty = item.quantity;
          const gross = (item.gross_sales || 0);
          const comm = (item.commission || 0);
          const net = (item.net_payout !== undefined && item.net_payout > 0 ? item.net_payout : (item.net_sales !== undefined ? item.net_sales : (item.gross_sales || 0)));
          const disc = (item.discounts || 0);

          row.total_volume += qty;
          row.gross_revenue += gross;
          row.total_commissions += comm;
          row.net_revenue += net;
          row.discounts_total += disc;

          // Track channel-specific metrics
          const isSquareChannel = item.channel === 'Square' || item.channel === 'Square POS (In-Store)' || (item.channel && item.channel.toLowerCase().includes('square'));

          if (isSquareChannel) {
            row.square_units += qty;
            row.square_gross += gross;
            channelTotals['Square'].units += qty;
            channelTotals['Square'].gross += gross;
            channelTotals['Square'].commission += comm;
            channelTotals['Square'].net += net;
          } else if (item.channel === 'Uber Eats') {
            row.uber_eats_units += qty;
            row.uber_eats_gross += gross;
            channelTotals['Uber Eats'].units += qty;
            channelTotals['Uber Eats'].gross += gross;
            channelTotals['Uber Eats'].commission += comm;
            channelTotals['Uber Eats'].net += net;
          } else if (item.channel === 'Just Eat') {
            row.just_eat_units += qty;
            row.just_eat_gross += gross;
            channelTotals['Just Eat'].units += qty;
            channelTotals['Just Eat'].gross += gross;
            channelTotals['Just Eat'].commission += comm;
            channelTotals['Just Eat'].net += net;
          } else if (item.channel === 'Deliveroo') {
            row.deliveroo_units += qty;
            row.deliveroo_gross += gross;
            channelTotals['Deliveroo'].units += qty;
            channelTotals['Deliveroo'].gross += gross;
            channelTotals['Deliveroo'].commission += comm;
            channelTotals['Deliveroo'].net += net;
          }

          grandTotalUnits += qty;
          grandTotalGross += gross;
          grandTotalCommission += comm;
          grandTotalNet += net;
          grandTotalDiscounts += disc;
 
          // Track ambiguous dual-base combo items (e.g. Buenos Días, Strawberry Fields, Mulah Green)
          if (mainInfo.is_dual_base_combo || mainInfo.type === 'DUAL_BASE_COMBO') {
            totalDualBaseUnits += qty;
            const normChannelName = isSquareChannel ? 'Square' : (item.channel === 'Uber Eats' ? 'Uber Eats' : (item.channel === 'Just Eat' ? 'Just Eat' : (item.channel === 'Deliveroo' ? 'Deliveroo' : 'Square')));
            if (dualChannelCounts[normChannelName] !== undefined) {
              dualChannelCounts[normChannelName] += qty;
            } else {
              dualChannelCounts[normChannelName] = qty;
            }
            dualBaseAmbiguousItems.push({
              raw_name: item.raw_name,
              item_name: finalItemName,
              sku: item.sku || '',
              category: item.category || '',
              channel: normChannelName,
              quantity: qty,
              gross_sales: gross,
              date: item.date || ''
            });
          }

          // Track unresolved recipe base items for manager classification alert
          if (mainInfo.is_unresolved) {
            const unresKey = item.sku ? `SKU:${item.sku.trim()}` : `NAME:${this.normalizeText(item.raw_name)}`;
            if (!unresolvedBasesMap.has(unresKey)) {
              unresolvedBasesMap.set(unresKey, {
                identifier: item.sku || item.raw_name,
                sku: item.sku || '',
                raw_name: item.raw_name,
                item_name: finalItemName,
                category: item.category || '',
                channels: new Set(),
                total_volume: 0,
                gross_sales: 0
              });
            }
            const uRec = unresolvedBasesMap.get(unresKey);
            uRec.total_volume += qty;
            uRec.gross_sales += gross;
            uRec.channels.add(item.channel || 'Square');
          }

          // Unmapped Recipe Tracker (Items without SOP recipe link)
          if (!hasRecipe) {
            const key = item.raw_name;
            if (!unmappedMap.has(key)) {
              unmappedMap.set(key, {
                raw_name: item.raw_name,
                category: item.category || '',
                channel: item.channel,
                count: 0,
                sample_revenue: 0,
                source_files: new Set()
              });
            }
            const unres = unmappedMap.get(key);
            unres.count += qty;
            unres.sample_revenue += gross;
            if (item.source_filename) unres.source_files.add(item.source_filename);
          }
        }
      }

      const ledgerRows = Array.from(ledgerMap.values());

      // 1. Sort by Net Revenue descending (True Cash ranking)
      ledgerRows.sort((a, b) => b.net_revenue - a.net_revenue);

      // 2. Compute Revenue Contribution & Performance Tier (Pareto ABC Classification based on Net Revenue)
      let cumulativeNet = 0;
      ledgerRows.forEach(row => {
        row.item_name = row.master_item_name;
        row.quantity = row.total_volume;
        row.net_sales = row.net_revenue;
        row.avg_price = row.total_volume > 0 ? parseFloat((row.gross_revenue / row.total_volume).toFixed(2)) : 0;
        row.unit_price = row.total_volume > 0 ? parseFloat((row.net_revenue / row.total_volume).toFixed(2)) : 0;
        if (!row.base_used || row.base_used === 'General Portion') {
          row.base_used = this.getBaseUsedLabel(row.main_type, row.master_item_name);
        }
        // Item Revenue Share % = (Item Net Sales / Total Store Net Sales) * 100
        row.revenue_contribution_pct = grandTotalNet > 0 ? parseFloat(((row.net_revenue / grandTotalNet) * 100).toFixed(1)) : 0;
        row.units_contribution_pct = grandTotalUnits > 0 ? parseFloat(((row.total_volume / grandTotalUnits) * 100).toFixed(1)) : 0;

        if (row.total_volume > 0) {
          row.channel_share.square_pct = parseFloat(((row.square_units / row.total_volume) * 100).toFixed(1));
          row.channel_share.uber_pct = parseFloat(((row.uber_eats_units / row.total_volume) * 100).toFixed(1));
          row.channel_share.just_eat_pct = parseFloat(((row.just_eat_units / row.total_volume) * 100).toFixed(1));
          row.channel_share.deliveroo_pct = parseFloat(((row.deliveroo_units / row.total_volume) * 100).toFixed(1));
        }

        cumulativeNet += row.net_revenue;
        const cumPct = grandTotalNet > 0 ? (cumulativeNet / grandTotalNet) * 100 : 0;

        // Pareto Tiers based on Net Sales:
        // Top cumulative 60% of sales or contribution >= 8.0% -> BEST PERFORMER
        // 60% - 90% or volume >= 2 or net >= 7.00 -> MODERATE PERFORMER
        // Underperformed: ONLY if total_volume === 1 AND net_revenue < 7.00 -> LEAST PERFORMER
        // Items with 2+ units sold (e.g. Still Water 2 units, 3 Scoop 2 units) are never flagged as LEAST
        if (cumPct <= 60 || row.revenue_contribution_pct >= 8.0) {
          row.performance_tier = 'BEST';
        } else if (row.total_volume >= 2 || row.net_revenue >= 7.00 || cumPct <= 90 || row.revenue_contribution_pct >= 2.5) {
          row.performance_tier = 'MODERATE';
        } else {
          row.performance_tier = 'LEAST';
        }
      });

      // Special fallback if small item count
      if (ledgerRows.length > 0 && !ledgerRows.some(r => r.performance_tier === 'BEST')) {
        ledgerRows[0].performance_tier = 'BEST';
      }

      // 3. Compute Comprehensive Mains & Dessert Bases Velocity Breakdown
      const mainsSummary = {
        'WAFFLE': { type: 'WAFFLE', label: 'Dessert / Waffles', plural: 'Dessert / Waffles', icon: '🧇', badge: '🧇 Dessert / Waffles', units: 0, gross: 0, net: 0, square_units: 0, uber_units: 0, just_eat_units: 0, deliveroo_units: 0, items_count: 0, pct_of_mains: 0 },
        'PANCAKE': { type: 'PANCAKE', label: 'Pancakes', plural: 'Pancakes', icon: '🥞', badge: '🥞 Pancakes', units: 0, gross: 0, net: 0, square_units: 0, uber_units: 0, just_eat_units: 0, deliveroo_units: 0, items_count: 0, pct_of_mains: 0 },
        'COOKIE_DOUGH': { type: 'COOKIE_DOUGH', label: 'Cookie Dough', plural: 'Cookie Doughs', icon: '🍪', badge: '🍪 Cookie Dough', units: 0, gross: 0, net: 0, square_units: 0, uber_units: 0, just_eat_units: 0, deliveroo_units: 0, items_count: 0, pct_of_mains: 0 },
        'CROFFLE': { type: 'CROFFLE', label: 'Croffles', plural: 'Croffles', icon: '🥐', badge: '🥐 Croffles', units: 0, gross: 0, net: 0, square_units: 0, uber_units: 0, just_eat_units: 0, deliveroo_units: 0, items_count: 0, pct_of_mains: 0 },
        'CHEESECAKE': { type: 'CHEESECAKE', label: 'Cheesecakes', plural: 'Cheesecakes', icon: '🍰', badge: '🍰 Cheesecakes', units: 0, gross: 0, net: 0, square_units: 0, uber_units: 0, just_eat_units: 0, deliveroo_units: 0, items_count: 0, pct_of_mains: 0 },
        'CREPE': { type: 'CREPE', label: 'Crepes', plural: 'Crepes', icon: '🥞', badge: '🥞 Crepes', units: 0, gross: 0, net: 0, square_units: 0, uber_units: 0, just_eat_units: 0, deliveroo_units: 0, items_count: 0, pct_of_mains: 0 },
        'SAVOURY_BURGER': { type: 'SAVOURY_BURGER', label: 'Savoury Mains & Sides', plural: 'Savoury Mains & Sides', icon: '🍔', badge: '🍔 Savoury Mains & Sides', units: 0, gross: 0, net: 0, square_units: 0, uber_units: 0, just_eat_units: 0, deliveroo_units: 0, items_count: 0, pct_of_mains: 0 },
        'MILKSHAKE': { type: 'MILKSHAKE', label: 'Beverages & Shakes', plural: 'Beverages & Shakes', icon: '🥤', badge: '🥤 Beverages & Shakes', units: 0, gross: 0, net: 0, square_units: 0, uber_units: 0, just_eat_units: 0, deliveroo_units: 0, items_count: 0, pct_of_mains: 0 },
        'GELATO_SUNDAE': { type: 'GELATO_SUNDAE', label: 'Ice Cream / Scoops', plural: 'Ice Cream / Scoops', icon: '🍨', badge: '🍨 Ice Cream / Scoops', units: 0, gross: 0, net: 0, square_units: 0, uber_units: 0, just_eat_units: 0, deliveroo_units: 0, items_count: 0, pct_of_mains: 0 },
        'BEVERAGE_OTHER': { type: 'BEVERAGE_OTHER', label: 'Other Drinks & Desserts', plural: 'Other Drinks & Desserts', icon: '☕', badge: '☕ Other', units: 0, gross: 0, net: 0, square_units: 0, uber_units: 0, just_eat_units: 0, deliveroo_units: 0, items_count: 0, pct_of_mains: 0 },
        'UNRESOLVED_BASE': { type: 'UNRESOLVED_BASE', label: 'Unresolved Base', plural: 'Unresolved Bases', icon: '❓', badge: '❓ Unresolved Base', units: 0, gross: 0, net: 0, square_units: 0, uber_units: 0, just_eat_units: 0, deliveroo_units: 0, items_count: 0, pct_of_mains: 0 }
      };

      ledgerRows.forEach(row => {
        const t = row.main_type || 'BEVERAGE_OTHER';
        if (!mainsSummary[t]) {
          mainsSummary[t] = {
            type: t,
            label: row.main_label || t,
            plural: (row.main_label || t) + 's',
            icon: row.main_icon || '🍽️',
            badge: row.main_badge || t,
            units: 0,
            gross: 0,
            net: 0,
            square_units: 0,
            uber_units: 0,
            just_eat_units: 0,
            deliveroo_units: 0,
            items_count: 0,
            pct_of_mains: 0
          };
        }
        const m = mainsSummary[t];
        m.units += row.total_volume;
        m.gross += row.gross_revenue;
        m.net += row.net_revenue;
        m.square_units += row.square_units || 0;
        m.uber_units += row.uber_eats_units || 0;
        m.just_eat_units += row.just_eat_units || 0;
        m.deliveroo_units += row.deliveroo_units || 0;
        m.items_count++;
      });

      // 3b. Resolve and apply Daily Base Splitter reconciliation (Waffles vs Pancakes combo allocation)
      const storedReconciliations = this.getDailyBaseReconciliations();
      const targetDateKey = reportingDate || 'ALL';
      const existingRec = options.baseSplit ||
        storedReconciliations[targetDateKey] ||
        (targetDateKey !== 'ALL' ? storedReconciliations['ALL'] : null) ||
        storedReconciliations['LATEST'] ||
        null;

      const isReconciled = totalDualBaseUnits === 0 || Boolean(existingRec && (
        (existingRec.split_waffles !== undefined && existingRec.split_pancakes !== undefined && (parseInt(existingRec.split_waffles, 10) + parseInt(existingRec.split_pancakes, 10) === totalDualBaseUnits)) ||
        (existingRec.waffles !== undefined && existingRec.pancakes !== undefined && (parseInt(existingRec.waffles, 10) + parseInt(existingRec.pancakes, 10) === totalDualBaseUnits))
      ));

      let splitWaffles = 0;
      let splitPancakes = 0;

      if (isReconciled && totalDualBaseUnits > 0 && existingRec) {
        splitWaffles = parseInt(existingRec.split_waffles !== undefined ? existingRec.split_waffles : existingRec.waffles, 10) || 0;
        splitPancakes = parseInt(existingRec.split_pancakes !== undefined ? existingRec.split_pancakes : existingRec.pancakes, 10) || 0;
      }

      // Build channel summary string
      const channelSummaryParts = [];
      ['Square', 'Uber Eats', 'Just Eat', 'Deliveroo'].forEach(ch => {
        if (dualChannelCounts[ch] > 0) {
          channelSummaryParts.push(`${ch}: ${dualChannelCounts[ch]}`);
        }
      });
      const channelSummaryStr = channelSummaryParts.join(', ') || 'All Platforms';

      // Allocate reconciled combo units into Waffles and Pancakes in mainsSummary
      if (isReconciled && totalDualBaseUnits > 0) {
        if (!mainsSummary['WAFFLE']) mainsSummary['WAFFLE'] = { type: 'WAFFLE', label: 'Dessert / Waffles', plural: 'Dessert / Waffles', icon: '🧇', badge: '🧇 Dessert / Waffles', units: 0, gross: 0, net: 0, square_units: 0, uber_units: 0, just_eat_units: 0, deliveroo_units: 0, items_count: 0, pct_of_mains: 0 };
        if (!mainsSummary['PANCAKE']) mainsSummary['PANCAKE'] = { type: 'PANCAKE', label: 'Pancakes', plural: 'Pancakes', icon: '🥞', badge: '🥞 Pancakes', units: 0, gross: 0, net: 0, square_units: 0, uber_units: 0, just_eat_units: 0, deliveroo_units: 0, items_count: 0, pct_of_mains: 0 };

        mainsSummary['WAFFLE'].units += splitWaffles;
        mainsSummary['PANCAKE'].units += splitPancakes;

        const dualGross = dualBaseAmbiguousItems.reduce((s, i) => s + (i.gross_sales || 0), 0);
        const wRatio = splitWaffles / totalDualBaseUnits;
        const pRatio = splitPancakes / totalDualBaseUnits;
        mainsSummary['WAFFLE'].gross += parseFloat((dualGross * wRatio).toFixed(2));
        mainsSummary['PANCAKE'].gross += parseFloat((dualGross * pRatio).toFixed(2));

        // Distribute channels proportionally
        ['Square', 'Uber Eats', 'Just Eat', 'Deliveroo'].forEach(ch => {
          const chCount = dualChannelCounts[ch] || 0;
          if (chCount > 0) {
            const chW = Math.round(chCount * wRatio);
            const chP = chCount - chW;
            if (ch === 'Square') {
              mainsSummary['WAFFLE'].square_units = (mainsSummary['WAFFLE'].square_units || 0) + chW;
              mainsSummary['PANCAKE'].square_units = (mainsSummary['PANCAKE'].square_units || 0) + chP;
            } else if (ch === 'Uber Eats') {
              mainsSummary['WAFFLE'].uber_units = (mainsSummary['WAFFLE'].uber_units || 0) + chW;
              mainsSummary['PANCAKE'].uber_units = (mainsSummary['PANCAKE'].uber_units || 0) + chP;
            } else if (ch === 'Just Eat') {
              mainsSummary['WAFFLE'].just_eat_units = (mainsSummary['WAFFLE'].just_eat_units || 0) + chW;
              mainsSummary['PANCAKE'].just_eat_units = (mainsSummary['PANCAKE'].just_eat_units || 0) + chP;
            } else if (ch === 'Deliveroo') {
              mainsSummary['WAFFLE'].deliveroo_units = (mainsSummary['WAFFLE'].deliveroo_units || 0) + chW;
              mainsSummary['PANCAKE'].deliveroo_units = (mainsSummary['PANCAKE'].deliveroo_units || 0) + chP;
            }
          }
        });
      }

      const dailyBaseSplit = {
        totalDualBaseUnits: totalDualBaseUnits,
        channelSummary: channelSummaryStr,
        channelCounts: dualChannelCounts,
        items: dualBaseAmbiguousItems,
        isReconciled: isReconciled,
        waffles: splitWaffles,
        pancakes: splitPancakes,
        confirmedByUser: existingRec ? (existingRec.confirmed_by_user || 'Store Manager') : null,
        confirmedAt: existingRec ? (existingRec.confirmed_at || null) : null,
        totalWafflesOverall: mainsSummary['WAFFLE'] ? mainsSummary['WAFFLE'].units : 0,
        totalPancakesOverall: mainsSummary['PANCAKE'] ? mainsSummary['PANCAKE'].units : 0
      };

      const coreMainsKeys = ['WAFFLE', 'PANCAKE', 'COOKIE_DOUGH', 'CROFFLE', 'CHEESECAKE', 'CREPE', 'SAVOURY_BURGER'];
      const totalCoreMainsVolume = coreMainsKeys.reduce((sum, k) => sum + (mainsSummary[k] ? mainsSummary[k].units : 0), 0);

      Object.keys(mainsSummary).forEach(k => {
        const m = mainsSummary[k];
        m.pct_of_mains = totalCoreMainsVolume > 0 && coreMainsKeys.includes(k)
          ? parseFloat(((m.units / totalCoreMainsVolume) * 100).toFixed(1))
          : (grandTotalUnits > 0 ? parseFloat(((m.units / grandTotalUnits) * 100).toFixed(1)) : 0);
        
        // Provide standard channels object mapping
        m.channels = {
          Square: m.square_units || 0,
          UberEats: m.uber_units || 0,
          JustEat: m.just_eat_units || 0,
          Deliveroo: m.deliveroo_units || 0
        };
      });

      // Alias mapping so audit segments and base variations all resolve seamlessly
      const aliasKeyPairs = [
        ['waffles', 'WAFFLE'], ['waffle', 'WAFFLE'], ['dessert/waffle', 'WAFFLE'], ['dessert_waffle', 'WAFFLE'], ['dessert / waffle', 'WAFFLE'],
        ['desserts/waffles audit', 'WAFFLE'], ['desserts / waffles audit', 'WAFFLE'], ['dessert/waffles audit', 'WAFFLE'],
        ['pancakes', 'PANCAKE'], ['pancake', 'PANCAKE'],
        ['cookie_dough', 'COOKIE_DOUGH'], ['cookiedough', 'COOKIE_DOUGH'],
        ['croffles', 'CROFFLE'], ['croffle', 'CROFFLE'],
        ['cheesecakes', 'CHEESECAKE'], ['cheesecake', 'CHEESECAKE'],
        ['crepes', 'CREPE'], ['crepe', 'CREPE'],
        ['savoury_burgers', 'SAVOURY_BURGER'], ['savoury_burger', 'SAVOURY_BURGER'], ['burgers', 'SAVOURY_BURGER'],
        ['savoury mains & sides', 'SAVOURY_BURGER'], ['savoury_mains_sides', 'SAVOURY_BURGER'],
        ['milkshakes', 'MILKSHAKE'], ['milkshake', 'MILKSHAKE'],
        ['beverages & shakes', 'MILKSHAKE'], ['beverages_shakes', 'MILKSHAKE'],
        ['gelato_sundaes', 'GELATO_SUNDAE'], ['gelato', 'GELATO_SUNDAE'],
        ['ice cream / scoops', 'GELATO_SUNDAE'], ['ice_cream_scoops', 'GELATO_SUNDAE'],
        ['scoops / ice cream', 'GELATO_SUNDAE'], ['scoops/ice cream', 'GELATO_SUNDAE'],
        ['beverage_other', 'BEVERAGE_OTHER'], ['beverages', 'BEVERAGE_OTHER'],
        ['unresolved_base', 'UNRESOLVED_BASE'], ['unresolved', 'UNRESOLVED_BASE'], ['unresolved bases', 'UNRESOLVED_BASE']
      ];
      aliasKeyPairs.forEach(([alias, sourceKey]) => {
        if (mainsSummary[sourceKey]) {
          mainsSummary[alias] = mainsSummary[sourceKey];
        }
      });

      const unmappedRows = Array.from(unmappedMap.values()).map(u => ({
        ...u,
        source_files: Array.from(u.source_files)
      })).sort((a, b) => b.count - a.count);

      const unresolvedBasesList = Array.from(unresolvedBasesMap.values()).map(u => ({
        ...u,
        channels: Array.from(u.channels)
      })).sort((a, b) => b.total_volume - a.total_volume);

      // Performance analytics & AI Insights
      const analytics = this.generatePerformanceAnalytics(ledgerRows, channelTotals, grandTotalGross, grandTotalNet, grandTotalCommission, grandTotalUnits, mainsSummary, totalCoreMainsVolume);

      return {
        reportingDate: reportingDate || 'ALL',
        availableDates: Array.from(availableDatesSet).sort(),
        masterLedger: ledgerRows,
        mainsSummary,
        totalCoreMainsVolume,
        dailyBaseSplit,
        unmappedQueue: unmappedRows,
        unmappedCount: unmappedRows.length,
        unresolvedBases: unresolvedBasesList,
        unresolvedCount: unresolvedBasesList.length,
        matchedCount: ledgerRows.filter(r => r.has_sop_recipe).length,
        totalItemsCount: ledgerRows.length,
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
    generatePerformanceAnalytics(ledgerRows, channelTotals, grossTotal, netTotal, commissionTotal, unitsTotal, mainsSummary = null, totalCoreMainsVolume = 0) {
      // 1. Classification Groups (Sorted by Net Revenue)
      const bestPerformers = ledgerRows.filter(r => r.performance_tier === 'BEST');
      const moderatePerformers = ledgerRows.filter(r => r.performance_tier === 'MODERATE');
      // Underperformed rule: ONLY Units Sold == 1 AND Net Sales < £7.00. Exclude 2+ units!
      const leastPerformers = ledgerRows.filter(r => r.total_volume === 1 && r.net_revenue < 7.00);

      // Top Volume and Revenue Drivers
      const topRevenuePerformer = ledgerRows[0] || null;
      const topVolumePerformer = [...ledgerRows].sort((a, b) => b.total_volume - a.total_volume)[0] || null;

      // 2. Channel Level Performance (Best, Moderate, Least on each platform)
      const channelRankings = {};
      ['Square', 'Uber Eats', 'Just Eat', 'Deliveroo'].forEach(channel => {
        const fieldUnits = channel === 'Square' ? 'square_units' :
                           channel === 'Uber Eats' ? 'uber_eats_units' :
                           channel === 'Just Eat' ? 'just_eat_units' : 'deliveroo_units';
        const fieldGross = channel === 'Square' ? 'square_gross' :
                           channel === 'Uber Eats' ? 'uber_eats_gross' :
                           channel === 'Just Eat' ? 'just_eat_gross' : 'deliveroo_gross';

        const channelItems = ledgerRows
          .filter(r => (r[fieldUnits] || 0) > 0)
          .map(r => ({
            name: r.master_item_name,
            units: r[fieldUnits],
            gross: r[fieldGross] || 0,
            channel_revenue_share_pct: (channelTotals[channel] && channelTotals[channel].gross > 0) ? parseFloat((( (r[fieldGross] || 0) / channelTotals[channel].gross ) * 100).toFixed(1)) : 0
          }))
          .sort((a, b) => b.gross - a.gross);

        const totalCh = channelItems.length;
        let best = [], moderate = [], least = [];

        if (totalCh <= 2) {
          best = channelItems.slice(0, 1);
          moderate = channelItems.slice(1, 2);
          least = [];
        } else {
          const cut1 = Math.max(1, Math.ceil(totalCh * 0.3));
          const cut2 = Math.max(cut1 + 1, Math.ceil(totalCh * 0.7));
          best = channelItems.slice(0, cut1);
          moderate = channelItems.slice(cut1, cut2);
          least = channelItems.slice(cut2);
        }

        channelRankings[channel] = {
          total_revenue: channelTotals[channel] ? channelTotals[channel].gross : 0,
          total_units: channelTotals[channel] ? channelTotals[channel].units : 0,
          share_of_store_pct: grossTotal > 0 ? parseFloat((( (channelTotals[channel] ? channelTotals[channel].gross : 0) / grossTotal) * 100).toFixed(1)) : 0,
          best_performers: best,
          moderate_performers: moderate,
          least_performers: least
        };
      });

      // 3. Channel Economics
      const channelEconomics = Object.entries(channelTotals).filter(([name]) => name !== 'Square POS (In-Store)').map(([channelName, data]) => {
        const commissionRate = data.gross > 0 ? (data.commission / data.gross) * 100 : 0;
        const revenueShare = grossTotal > 0 ? (data.gross / grossTotal) * 100 : 0;
        return {
          channel: channelName,
          units: data.units,
          gross: data.gross,
          commission: data.commission,
          net: data.net,
          revenue_share_pct: parseFloat(revenueShare.toFixed(1)),
          commission_rate_pct: parseFloat(commissionRate.toFixed(1)),
          take_rate_status: commissionRate > 30 ? 'HIGH_LEAKAGE' : commissionRate > 20 ? 'MODERATE' : 'DIRECT_IN_STORE'
        };
      }).sort((a, b) => b.gross - a.gross);

      // AI Recommendations
      const aiRecommendations = {
        starHighlights: bestPerformers.slice(0, 3).map(i => 
          `🌟 **${i.master_item_name}** generated £${i.net_revenue.toFixed(2)} Net Sales (${i.revenue_contribution_pct}% share) with ${i.total_volume} units.`
        ),
        coreRecommendations: moderatePerformers.slice(0, 3).map(i => 
          `⚡ **${i.master_item_name}** is a steady earner (£${i.net_revenue.toFixed(2)} Net, ${i.total_volume} units). Maintain stock and feature in combo promos.`
        ),
        lowSalesAlerts: leastPerformers.length > 0
          ? leastPerformers.slice(0, 3).map(i => 
              `⚠️ **${i.master_item_name}** underperformed with only ${i.total_volume} unit (£${i.net_revenue.toFixed(2)} Net). Consider revising price, repackaging, or removing from delivery menus.`
            )
          : [
              `✓ **Optimal Menu Performance**: Zero critical underperformers detected. All products maintained 2+ units volume or exceeded £7.00 net sales threshold.`
            ]
      };

      // Mains velocity highlights
      if (mainsSummary) {
        if (mainsSummary['WAFFLE'] && mainsSummary['WAFFLE'].units > 0) {
          aiRecommendations.starHighlights.unshift(
            `🧇 **Waffles Velocity**: Sold ${mainsSummary['WAFFLE'].units} Dessert/Waffles (£${mainsSummary['WAFFLE'].net.toFixed(2)} Net), making up ${mainsSummary['WAFFLE'].pct_of_mains}% of total dessert & savoury mains.`
          );
        }
        if (mainsSummary['PANCAKE'] && mainsSummary['PANCAKE'].units > 0) {
          aiRecommendations.coreRecommendations.unshift(
            `🥞 **Pancakes Velocity**: Sold ${mainsSummary['PANCAKE'].units} Pancakes (£${mainsSummary['PANCAKE'].net.toFixed(2)} Net), making up ${mainsSummary['PANCAKE'].pct_of_mains}% of total dessert & savoury mains.`
          );
        }
      }

      return {
        bestPerformers,
        moderatePerformers,
        leastPerformers,
        topRevenuePerformer,
        topVolumePerformer,
        channelRankings,
        channelEconomics,
        aiRecommendations,
        mainsSummary,
        totalCoreMainsVolume,
        topPerformersOverall: bestPerformers,
        underperformers: leastPerformers,
        topByChannel: {
          square: channelRankings['Square'].best_performers[0] || null,
          uberEats: channelRankings['Uber Eats'].best_performers[0] || null,
          justEat: channelRankings['Just Eat'].best_performers[0] || null,
          deliveroo: channelRankings['Deliveroo'].best_performers[0] || null
        },
        aiExecutiveSummary: {
          top3VolumeDrivers: bestPerformers.slice(0, 3).map(i => ({
            name: i.master_item_name,
            volume: i.total_volume,
            gross: i.gross_revenue,
            net: i.net_revenue,
            dominant_channel: Object.entries({
              'Square': i.square_units,
              'Uber Eats': i.uber_eats_units,
              'Just Eat': i.just_eat_units,
              'Deliveroo': i.deliveroo_units
            }).sort((a, b) => b[1] - a[1])[0][0]
          })),
          underperformingToMonitor: leastPerformers.slice(0, 3).map(i => ({
            name: i.master_item_name,
            volume: i.total_volume,
            gross: i.gross_revenue,
            net: i.net_revenue,
            note: 'Units Sold == 1 and Net Sales < £7.00 threshold.'
          })),
          profitabilityDiscrepancies: [],
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
        'Waffle_Batter_Portion': 30.0,
        'Pancake_Batter_Portion': 25.0,
        'Cheesecake_Base_Slice': 12.0,
        'Cookie_Dough_Puck': 20.0,
        'Topping_Sauce_Portions': 50.0,
        'Packaging_Containers_Boxes': 60.0,
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
        'Cookie_Dough_Puck': 4.0,
        'Belgian Milk Chocolate Chips': 2.0,
        'Liege Waffle Base': 5.0,
        'Waffle_Batter_Portion': 5.0,
        'Pancake_Batter_Portion': 4.0,
        'Topping_Sauce_Portions': 10.0,
        'Packaging_Containers_Boxes': 15.0,
        'Cheesecake_Base_Slice': 3.0,
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

    calculateDepletionAndAlarms(consolidatedMatrix, onHandStock = null, moqMap = null, dailyBaseSplit = null) {
      const stock = onHandStock || this.getOnHandStock();
      const moqs = moqMap || this.getSafetyStockMOQ();

      const consumptionMap = new Map();

      const matrix = Array.isArray(consolidatedMatrix) ? consolidatedMatrix : (consolidatedMatrix && consolidatedMatrix.masterLedger ? consolidatedMatrix.masterLedger : []);
      for (const row of matrix) {
        const totalSold = row.total_volume !== undefined ? row.total_volume : (row.quantity || 0);
        const recipe = row.recipe_obj;

        // Deduct prepped base stock (e.g. Cheesecake_Base_Slice, Waffle_Batter_Portion, Cookie_Dough_Puck)
        let batchName = row.deplete_batch;

        // Requirement 4: Direct Stock Depletion Link
        // Use the disambiguated label inside parentheses to trigger the exact recipe batch:
        // (Pancake) -> Deducts 1 portion from Kitchen Pancake Batter Batch
        // (Waffle) -> Deducts 1 portion from Kitchen Waffle Batter Batch
        // (Cheesecake) -> Deducts 1 slice from Cheesecake inventory
        // (Cookie Dough) -> Deducts 1 puck from Cookie Dough batch
        const itemName = (row.master_item_name || row.raw_name || '').toLowerCase();
        if (itemName.includes('(pancake') || itemName.includes('(pancakes)')) {
          batchName = 'Pancake_Batter_Portion';
        } else if (itemName.includes('(liege waffle)') || itemName.includes('liege waffle')) {
          batchName = 'Liege Waffle Base';
        } else if (itemName.includes('(waffle')) {
          batchName = 'Waffle_Batter_Portion';
        } else if (itemName.includes('(cheesecake')) {
          batchName = 'Cheesecake_Base_Slice';
        } else if (itemName.includes('(cookie dough') || itemName.includes('(cookiedough)')) {
          batchName = 'Cookie_Dough_Puck';
        }

        if (batchName && totalSold > 0) {
          const alreadyInRecipe = recipe && Array.isArray(recipe.ingredients) &&
            recipe.ingredients.some(i => i.name && i.name.toLowerCase() === batchName.toLowerCase());

          if (!alreadyInRecipe) {
            const batchQty = (parseFloat(row.deplete_qty) || 1) * totalSold;
            let unit = 'portion';
            if (batchName === 'Cheesecake_Base_Slice') unit = 'slice';
            else if (batchName === 'Cookie_Dough_Puck') unit = 'puck';
            else if (batchName === 'Liege Waffle Base') unit = 'unit';

            if (!consumptionMap.has(batchName)) {
              consumptionMap.set(batchName, {
                ingredient_name: batchName,
                theoretical_consumption: 0,
                unit: unit,
                dishes_using: new Set()
              });
            }
            const bRec = consumptionMap.get(batchName);
            bRec.theoretical_consumption += batchQty;
            bRec.dishes_using.add(row.master_item_name);
          }
        }

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

      // 1b. Deplete reconciled Daily Base Splitter allocations (Waffles, Pancakes, Toppings, Packaging)
      const splitInfo = dailyBaseSplit || (this.getDailyBaseReconciliations ? this.getDailyBaseReconciliations()['LATEST'] : null);
      if (splitInfo) {
        const wafflesCount = parseInt(splitInfo.split_waffles !== undefined ? splitInfo.split_waffles : splitInfo.waffles, 10) || 0;
        const pancakesCount = parseInt(splitInfo.split_pancakes !== undefined ? splitInfo.split_pancakes : splitInfo.pancakes, 10) || 0;
        const totalComboUnits = (splitInfo.totalDualBaseUnits !== undefined ? splitInfo.totalDualBaseUnits : (wafflesCount + pancakesCount)) || (wafflesCount + pancakesCount);

        if (wafflesCount > 0) {
          if (!consumptionMap.has('Waffle_Batter_Portion')) {
            consumptionMap.set('Waffle_Batter_Portion', {
              ingredient_name: 'Waffle_Batter_Portion',
              theoretical_consumption: 0,
              unit: 'portion',
              dishes_using: new Set()
            });
          }
          const wRec = consumptionMap.get('Waffle_Batter_Portion');
          wRec.theoretical_consumption += wafflesCount;
          wRec.dishes_using.add('Reconciled Waffle Base Split');
        }

        if (pancakesCount > 0) {
          if (!consumptionMap.has('Pancake_Batter_Portion')) {
            consumptionMap.set('Pancake_Batter_Portion', {
              ingredient_name: 'Pancake_Batter_Portion',
              theoretical_consumption: 0,
              unit: 'portion',
              dishes_using: new Set()
            });
          }
          const pRec = consumptionMap.get('Pancake_Batter_Portion');
          pRec.theoretical_consumption += pancakesCount;
          pRec.dishes_using.add('Reconciled Pancake Base Split');
        }

        if (totalComboUnits > 0) {
          if (!consumptionMap.has('Topping_Sauce_Portions')) {
            consumptionMap.set('Topping_Sauce_Portions', {
              ingredient_name: 'Topping_Sauce_Portions',
              theoretical_consumption: 0,
              unit: 'portion',
              dishes_using: new Set()
            });
          }
          const tRec = consumptionMap.get('Topping_Sauce_Portions');
          tRec.theoretical_consumption += totalComboUnits;
          tRec.dishes_using.add('Combo Desserts (Topping Sauce)');

          if (!consumptionMap.has('Packaging_Containers_Boxes')) {
            consumptionMap.set('Packaging_Containers_Boxes', {
              ingredient_name: 'Packaging_Containers_Boxes',
              theoretical_consumption: 0,
              unit: 'unit',
              dishes_using: new Set()
            });
          }
          const bRec = consumptionMap.get('Packaging_Containers_Boxes');
          bRec.theoretical_consumption += totalComboUnits;
          bRec.dishes_using.add('Combo Desserts (Packaging & Boxes)');
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
        let currentUnits = 0;
        if (stock[ingName] !== undefined) {
          currentUnits = typeof stock[ingName] === 'object' && stock[ingName] !== null 
            ? parseFloat(stock[ingName].current_stock || stock[ingName].stock || 0) 
            : parseFloat(stock[ingName]) || 0;
        } else {
          const matchedKey = Object.keys(stock).find(k => k.toLowerCase() === ingName.toLowerCase());
          if (matchedKey) {
            currentUnits = typeof stock[matchedKey] === 'object' && stock[matchedKey] !== null
              ? parseFloat(stock[matchedKey].current_stock || stock[matchedKey].stock || 0)
              : parseFloat(stock[matchedKey]) || 0;
          }
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

      // Build key-indexed depletions lookup map
      const depletions = {};
      depletionLedger.forEach(row => {
        depletions[row.ingredient_name] = {
          quantity_deducted: row.theoretical_consumption,
          current_stock: row.current_on_hand,
          remaining_stock: row.projected_remaining_stock,
          unit: row.unit,
          status: row.status
        };
      });

      // Sort by status (CRITICAL first, then WARNING, then HEALTHY)
      depletionLedger.sort((a, b) => {
        if (a.status === 'CRITICAL_LOW_STOCK_ALARM' && b.status !== 'CRITICAL_LOW_STOCK_ALARM') return -1;
        if (b.status === 'CRITICAL_LOW_STOCK_ALARM' && a.status !== 'CRITICAL_LOW_STOCK_ALARM') return 1;
        return a.projected_remaining_stock - b.projected_remaining_stock;
      });

      return {
        depletionLedger,
        depletions,
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
        [today, '18:40:00', 'DEL-909', '"DELIV - Twist It Dunk It Pancake Stack"', '5', '54.75', '17.52', '0.00', '37.23'].join(','),
        [today, '18:55:00', 'DEL-910', '"American Pancakes - Maple & Berries"', '4', '39.80', '12.74', '0.00', '27.06'].join(','),
        // Include one unmapped mystery item to demonstrate the Unmapped Resolution Queue!
        [today, '19:15:00', 'DEL-908', '"DELIV - Mystery Caramel Churros Craze"', '3', '27.00', '8.64', '0.00', '18.36'].join(',')
      ].join('\n');

      return [
        { filename: 'square_instore_pos.tsv', content: squareContent, channel: 'Square POS (In-Store)' },
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
        'Rank',
        'Product Disambiguated Name',
        'Base Used',
        'Main Base',
        'Category',
        'Performance Tier',
        'Square Units',
        'Uber Eats Units',
        'Just Eat Units',
        'Deliveroo Units',
        'Quantity Sold',
        'Unit Price (£)',
        'Gross Revenue (£)',
        'Revenue Contribution (%)',
        'Platform Commissions (£)',
        'Net Sales (£)',
        'Square Share (%)',
        'Uber Eats Share (%)',
        'Just Eat Share (%)',
        'Deliveroo Share (%)',
        'SOP Status'
      ];

      const rows = [headers];

      (consolidated.masterLedger || []).forEach((item, idx) => {
        rows.push([
          idx + 1,
          item.master_item_name,
          item.base_used || item.main_label || 'General Portion',
          item.main_label || 'General',
          item.category || 'General Menu',
          item.performance_tier,
          item.square_units || 0,
          item.uber_eats_units || 0,
          item.just_eat_units || 0,
          item.deliveroo_units || 0,
          item.total_volume || 0,
          (item.unit_price !== undefined ? item.unit_price : (item.avg_price || 0)).toFixed(2),
          (item.gross_revenue || 0).toFixed(2),
          (item.revenue_contribution_pct || 0) + '%',
          (item.total_commissions || 0).toFixed(2),
          (item.net_revenue || 0).toFixed(2),
          item.channel_share.square_pct + '%',
          item.channel_share.uber_pct + '%',
          item.channel_share.just_eat_pct + '%',
          item.channel_share.deliveroo_pct + '%',
          item.has_sop_recipe ? 'SOP Linked' : 'Sales Tracked'
        ]);
      });

      return rows;
    }
  };

  return SalesEngine;
}));
