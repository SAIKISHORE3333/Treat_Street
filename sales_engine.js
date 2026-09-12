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
      let cleanText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      if (cleanText.includes('\\t') && !cleanText.includes('\t')) {
        cleanText = cleanText.replace(/\\t/g, '\t');
      }
      const lines = cleanText.split('\n');
      const result = [];

      // Determine delimiter from first non-empty line
      const firstLine = lines.find(l => l && l.trim()) || '';
      let defaultDelimiter = ',';
      if (firstLine.includes('\t')) defaultDelimiter = '\t';
      else if (firstLine.includes(';') && !firstLine.includes(',')) defaultDelimiter = ';';
      else if (firstLine.includes('|')) defaultDelimiter = '|';

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line || !line.trim()) continue;

        const row = [];
        let curr = '';
        let inQuotes = false;
        const delimiter = (line.includes('\t') && !line.includes('","')) ? '\t' : defaultDelimiter;

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
      const lower = headers.map(h => (h || '').toLowerCase().trim());
      const lowerFile = (filename || '').toLowerCase();
      const allText = lower.join(' ');

      // 1. Deliveroo Detection
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

      // 2. Uber Eats Detection
      if (
        lowerFile.includes('uber') || lowerFile.includes('ubereats') ||
        lower.some(h => h.includes('uber')) ||
        lower.some(h => h.includes('items quantity')) ||
        (lower.some(h => h.includes('order number') || h === 'order_number') && lower.some(h => h.includes('customisations') || h.includes('customizations') || h.includes('restaurant payout')))
      ) {
        return 'Uber Eats';
      }

      // 3. Just Eat Detection
      if (
        lowerFile.includes('just eat') || lowerFile.includes('justeat') ||
        lower.some(h => h.includes('just eat') || h.includes('justeat')) ||
        lower.some(h => h.includes('restaurant reference')) ||
        (lower.some(h => h.includes('sub total') || h.includes('sub_total')) && lower.some(h => h.includes('commission charge')))
      ) {
        return 'Just Eat';
      }

      // 4. Square Detection (In-store POS)
      if (
        lowerFile.includes('square') || lowerFile.includes('pos') || lowerFile.includes('till') ||
        lower.some(h => h.includes('square')) ||
        lower.some(h => h.includes('modifiers applied')) ||
        lower.some(h => h.includes('price point name')) ||
        lower.some(h => h.includes('transaction id'))
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

      // Order Status / Cancellation Filter
      const statusStr = (findKey(['order_status', 'status', 'event_type', 'item_status', 'state', 'transaction_status']) || '').toLowerCase();
      if (statusStr.includes('cancel') || statusStr.includes('void') || statusStr.includes('fail') || statusStr.includes('reject')) {
        normalized.is_cancelled = true;
      }

      if (channel === 'Square') {
        normalized.date = this.normalizeDate(findKey(['date', 'created_at', 'day']));
        normalized.time = findKey(['time', 'hour']) || '12:00:00';
        normalized.raw_name = (findKey(['item', 'item_name', 'description', 'product_name', 'product']) || '').trim();
        const rawQty = findKey(['qty', 'quantity', 'count', 'items_quantity']);
        normalized.gross_sales = this.cleanNumber(findKey(['gross_sales', 'product_sales', 'total_sales', 'sales', 'price']), 0);
        normalized.quantity = (rawQty !== null && rawQty !== undefined && rawQty !== '') ? this.cleanNumber(rawQty, 0) : (normalized.gross_sales > 0 ? 1 : 0);
        normalized.discounts = Math.abs(this.cleanNumber(findKey(['discounts', 'discount', 'promo']), 0));
        normalized.commission = Math.abs(this.cleanNumber(findKey(['commission', 'fee', 'charge']), 0));
        normalized.net_payout = this.cleanNumber(findKey(['net_sales', 'net']), normalized.gross_sales - normalized.discounts - normalized.commission);
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

      normalized.modifiers = rawModifiers;
      normalized.category = rawCategory;
      normalized.variation = rawVariation;
      normalized.notes = rawNotes;

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
        
        // Skip cancelled / refunded / voided transactions
        if (adapted.is_cancelled) {
          continue;
        }

        // Skip non-item summary rows or delivery fee/bag fee/tip rows
        if (!adapted.raw_name) continue;
        const nameLower = adapted.raw_name.toLowerCase().trim();
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
          continue;
        }

        // Filter out zero-revenue modifier / free option choices (e.g. Free base choices like 'Pancake' £0.00, 'No Side' £0.00)
        // Genuine products have gross_sales > 0 (or explicit promo discounts). Free modifier options must not clutter sales!
        if (adapted.gross_sales <= 0 && adapted.discounts <= 0) {
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

      // 3. Strict High-Confidence Match ONLY (Prevents wild false positives on single words like 'chocolate', 'dubai', 'shake', 'waffle')
      const rawTokens = normRaw.split(' ').filter(t => t.length > 2);
      if (rawTokens.length >= 2) {
        for (const r of recipes) {
          const rNorm = this.normalizeText(r.title || r.name);
          const rTokens = rNorm.split(' ').filter(t => t.length > 2);
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
    // 5b. Smart Mains & Dessert Base Classification Engine
    // -----------------------------------------------------------
    detectMainBase(rawName = '', modifiers = '', category = '', variation = '', notes = '', recipeObj = null) {
      const normMod = (modifiers || '').toLowerCase();
      const normName = (rawName || '').toLowerCase();
      const normCat = (category || '').toLowerCase();
      const normVar = (variation || '').toLowerCase();
      const normNotes = (notes || '').toLowerCase();

      // Combined metadata text for modifier & option choices
      const allModText = `${normMod} ${normVar} ${normNotes}`.toLowerCase();

      // Priority 1: Explicit Modifiers / Options / Choices / Variation / Notes
      // (e.g. customer ordered a flavor like "Banoffee" and picked "American Pancakes", "Waffle", "Croffle", etc.)
      if (
        allModText.includes('pancake') || allModText.includes('pancakes') ||
        allModText.includes('american pancake') || allModText.includes('hotcake') ||
        allModText.includes('pancake stack') || allModText.includes('buttermilk pancake')
      ) {
        return { type: 'PANCAKE', label: 'Pancake', plural: 'Pancakes', icon: '🥞', badge: '🥞 Pancake' };
      }
      if (
        allModText.includes('liege waffle') || allModText.includes('belgian waffle') ||
        allModText.includes('bubble waffle') || allModText.includes('waffle')
      ) {
        return { type: 'WAFFLE', label: 'Waffle', plural: 'Waffles', icon: '🧇', badge: '🧇 Waffle' };
      }
      if (allModText.includes('croffle') || allModText.includes('croissant waffle')) {
        return { type: 'CROFFLE', label: 'Croffle', plural: 'Croffles', icon: '🥐', badge: '🥐 Croffle' };
      }
      if (allModText.includes('cookie dough') || allModText.includes('cookiedough') || allModText.includes('cookie-dough')) {
        return { type: 'COOKIE_DOUGH', label: 'Cookie Dough', plural: 'Cookie Doughs', icon: '🍪', badge: '🍪 Cookie Dough' };
      }
      if (allModText.includes('cheesecake')) {
        return { type: 'CHEESECAKE', label: 'Cheesecake', plural: 'Cheesecakes', icon: '🍰', badge: '🍰 Cheesecake' };
      }
      if (allModText.includes('crepe') || allModText.includes('crêpe')) {
        return { type: 'CREPE', label: 'Crepe', plural: 'Crepes', icon: '🥞', badge: '🥞 Crepe' };
      }
      if (allModText.includes('brioche bun') || allModText.includes('fries') || allModText.includes('chicken patty')) {
        return { type: 'SAVOURY_BURGER', label: 'Burger & Savoury', plural: 'Burgers & Savoury', icon: '🍔', badge: '🍔 Savoury Main' };
      }

      // Priority 2: Product Name / Dish Title
      if (normName.includes('pancake') || normName.includes('hotcake') || normName.includes('pancake stack')) {
        return { type: 'PANCAKE', label: 'Pancake', plural: 'Pancakes', icon: '🥞', badge: '🥞 Pancake' };
      }
      if (normName.includes('waffle')) {
        return { type: 'WAFFLE', label: 'Waffle', plural: 'Waffles', icon: '🧇', badge: '🧇 Waffle' };
      }
      if (normName.includes('croffle')) {
        return { type: 'CROFFLE', label: 'Croffle', plural: 'Croffles', icon: '🥐', badge: '🥐 Croffle' };
      }
      if (normName.includes('cookie dough') || normName.includes('cookiedough')) {
        return { type: 'COOKIE_DOUGH', label: 'Cookie Dough', plural: 'Cookie Doughs', icon: '🍪', badge: '🍪 Cookie Dough' };
      }
      if (normName.includes('cheesecake')) {
        return { type: 'CHEESECAKE', label: 'Cheesecake', plural: 'Cheesecakes', icon: '🍰', badge: '🍰 Cheesecake' };
      }
      if (normName.includes('crepe') || normName.includes('crêpe')) {
        return { type: 'CREPE', label: 'Crepe', plural: 'Crepes', icon: '🥞', badge: '🥞 Crepe' };
      }
      if (
        normName.includes('burger') || normName.includes('chicken') || normName.includes('tenders') ||
        normName.includes('cajun') || normName.includes('wings') || normName.includes('louisiana') ||
        normName.includes('papi chulo') || normName.includes('fries') || normName.includes('chick n')
      ) {
        return { type: 'SAVOURY_BURGER', label: 'Burger & Savoury', plural: 'Burgers & Savoury', icon: '🍔', badge: '🍔 Savoury Main' };
      }
      if (normName.includes('shake') || normName.includes('smoothie') || normName.includes('frappe')) {
        return { type: 'MILKSHAKE', label: 'Milkshake', plural: 'Milkshakes', icon: '🥤', badge: '🥤 Milkshake' };
      }
      if (normName.includes('gelato') || normName.includes('scoop') || normName.includes('sundae') || normName.includes('sorbet')) {
        return { type: 'GELATO_SUNDAE', label: 'Gelato & Sundae', plural: 'Gelato & Sundaes', icon: '🍨', badge: '🍨 Gelato' };
      }
      if (
        normName.includes('water') || normName.includes('coke') || normName.includes('cola') ||
        normName.includes('fanta') || normName.includes('sprite') || normName.includes('drink') ||
        normName.includes('tea') || normName.includes('coffee')
      ) {
        return { type: 'BEVERAGE_OTHER', label: 'Drink / Other', plural: 'Drinks & Other', icon: '☕', badge: '☕ Beverage' };
      }

      // Priority 3: Linked SOP Recipe ingredients (evaluated BEFORE ambiguous category strings!)
      if (recipeObj && Array.isArray(recipeObj.ingredients)) {
        const ingNames = recipeObj.ingredients.map(i => (i.name || '').toLowerCase()).join(' ');
        if (ingNames.includes('pancake')) return { type: 'PANCAKE', label: 'Pancake', plural: 'Pancakes', icon: '🥞', badge: '🥞 Pancake' };
        if (ingNames.includes('waffle')) return { type: 'WAFFLE', label: 'Waffle', plural: 'Waffles', icon: '🧇', badge: '🧇 Waffle' };
        if (ingNames.includes('cookie dough')) return { type: 'COOKIE_DOUGH', label: 'Cookie Dough', plural: 'Cookie Doughs', icon: '🍪', badge: '🍪 Cookie Dough' };
        if (ingNames.includes('brioche') || ingNames.includes('patty') || ingNames.includes('fries')) {
          return { type: 'SAVOURY_BURGER', label: 'Burger & Savoury', plural: 'Burgers & Savoury', icon: '🍔', badge: '🍔 Savoury Main' };
        }
        if (ingNames.includes('milk') && ingNames.includes('mix')) return { type: 'MILKSHAKE', label: 'Milkshake', plural: 'Milkshakes', icon: '🥤', badge: '🥤 Milkshake' };
      }

      // Priority 4: Category
      // If category specifically mentions pancake without waffle
      if (normCat.includes('pancake') && !normCat.includes('waffle')) {
        return { type: 'PANCAKE', label: 'Pancake', plural: 'Pancakes', icon: '🥞', badge: '🥞 Pancake' };
      }
      if (normCat.includes('waffle') && !normCat.includes('pancake')) {
        return { type: 'WAFFLE', label: 'Waffle', plural: 'Waffles', icon: '🧇', badge: '🧇 Waffle' };
      }
      // If category contains both or combined (e.g. "Pancakes & Waffles")
      if (normCat.includes('pancake')) {
        return { type: 'PANCAKE', label: 'Pancake', plural: 'Pancakes', icon: '🥞', badge: '🥞 Pancake' };
      }
      if (normCat.includes('waffle') || normCat.includes('chick n waffle')) {
        return { type: 'WAFFLE', label: 'Waffle', plural: 'Waffles', icon: '🧇', badge: '🧇 Waffle' };
      }
      if (normCat.includes('cookie dough')) return { type: 'COOKIE_DOUGH', label: 'Cookie Dough', plural: 'Cookie Doughs', icon: '🍪', badge: '🍪 Cookie Dough' };
      if (normCat.includes('croffle')) return { type: 'CROFFLE', label: 'Croffle', plural: 'Croffles', icon: '🥐', badge: '🥐 Croffle' };
      if (normCat.includes('crepe')) return { type: 'CREPE', label: 'Crepe', plural: 'Crepes', icon: '🥞', badge: '🥞 Crepe' };
      if (normCat.includes('cheesecake')) return { type: 'CHEESECAKE', label: 'Cheesecake', plural: 'Cheesecakes', icon: '🍰', badge: '🍰 Cheesecake' };
      if (normCat.includes('burger') || normCat.includes('chicken') || normCat.includes('savory') || normCat.includes('savoury')) {
        return { type: 'SAVOURY_BURGER', label: 'Burger & Savoury', plural: 'Burgers & Savoury', icon: '🍔', badge: '🍔 Savoury Main' };
      }
      if (normCat.includes('shake') || normCat.includes('smoothie')) return { type: 'MILKSHAKE', label: 'Milkshake', plural: 'Milkshakes', icon: '🥤', badge: '🥤 Milkshake' };
      if (normCat.includes('gelato') || normCat.includes('scoop') || normCat.includes('sundae')) return { type: 'GELATO_SUNDAE', label: 'Gelato & Sundae', plural: 'Gelato & Sundaes', icon: '🍨', badge: '🍨 Gelato' };

      return { type: 'OTHER', label: 'General Menu', plural: 'General Items', icon: '🍽️', badge: '🍽️ General' };
    },

    disambiguateItemName(baseItemName, mainInfo, modifiers = '') {
      if (!baseItemName) return 'Unnamed Product';
      const normName = baseItemName.toLowerCase();
      const normMod = (modifiers || '').toLowerCase();

      // Disambiguate if base item name does NOT already mention the main base
      if (mainInfo.type === 'WAFFLE' && !normName.includes('waffle')) {
        const specificType = normMod.includes('liege') ? 'Liege Waffle' : 'Waffle';
        return `${baseItemName} (${specificType})`;
      }
      if (mainInfo.type === 'PANCAKE' && !normName.includes('pancake')) {
        return `${baseItemName} (Pancakes)`;
      }
      if (mainInfo.type === 'CROFFLE' && !normName.includes('croffle')) {
        return `${baseItemName} (Croffle)`;
      }
      if (mainInfo.type === 'COOKIE_DOUGH' && !normName.includes('cookie dough') && !normName.includes('cookiedough')) {
        return `${baseItemName} (Cookie Dough)`;
      }
      if (mainInfo.type === 'CHEESECAKE' && !normName.includes('cheesecake')) {
        return `${baseItemName} (Cheesecake)`;
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
          const hasRecipe = (match.status === 'MATCHED');
          const matchedName = hasRecipe ? match.master_name : (item.raw_name || 'Unnamed Product');

          // Detect Main Base (Waffles, Pancakes, Cookie Dough, Croffles, Cheesecakes, etc.)
          const mainInfo = this.detectMainBase(item.raw_name, item.modifiers, item.category, item.variation, item.notes, hasRecipe ? match.recipe_obj : null);
          const finalItemName = this.disambiguateItemName(matchedName, mainInfo, item.modifiers);

          if (!ledgerMap.has(finalItemName)) {
            const formattedCategory = (mainInfo.label !== 'General Menu' && mainInfo.label !== 'Other')
              ? mainInfo.label + (hasRecipe && match.recipe_obj && match.recipe_obj.category ? ' • ' + match.recipe_obj.category : (item.category && !item.category.includes(',') ? ' • ' + item.category : ''))
              : (hasRecipe && match.recipe_obj && match.recipe_obj.category ? match.recipe_obj.category : (item.category || 'Desserts & Mains'));

            ledgerMap.set(finalItemName, {
              master_item_name: finalItemName,
              base_product_name: matchedName,
              raw_name: item.raw_name,
              category: formattedCategory,
              main_type: mainInfo.type,
              main_label: mainInfo.label,
              main_plural: mainInfo.plural,
              main_badge: mainInfo.badge,
              main_icon: mainInfo.icon,
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
          const net = (item.net_payout || 0);
          const disc = (item.discounts || 0);

          row.total_volume += qty;
          row.gross_revenue += gross;
          row.total_commissions += comm;
          row.net_revenue += net;
          row.discounts_total += disc;

          // Track channel-specific metrics
          if (item.channel === 'Square') {
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

          // Keep unmapped tracking purely for optional SOP recipe linking (never blocks sales report!)
          if (!hasRecipe) {
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
            unres.count += qty;
            unres.sample_revenue += gross;
            if (item.source_filename) unres.source_files.add(item.source_filename);
          }
        }
      }

      const ledgerRows = Array.from(ledgerMap.values());

      // 1. Sort by gross revenue descending
      ledgerRows.sort((a, b) => b.gross_revenue - a.gross_revenue);

      // 2. Compute Revenue Contribution & Performance Tier (Pareto ABC Classification)
      let cumulativeRevenue = 0;
      ledgerRows.forEach(row => {
        row.avg_price = row.total_volume > 0 ? parseFloat((row.gross_revenue / row.total_volume).toFixed(2)) : 0;
        row.revenue_contribution_pct = grandTotalGross > 0 ? parseFloat(((row.gross_revenue / grandTotalGross) * 100).toFixed(1)) : 0;
        row.units_contribution_pct = grandTotalUnits > 0 ? parseFloat(((row.total_volume / grandTotalUnits) * 100).toFixed(1)) : 0;

        if (row.total_volume > 0) {
          row.channel_share.square_pct = parseFloat(((row.square_units / row.total_volume) * 100).toFixed(1));
          row.channel_share.uber_pct = parseFloat(((row.uber_eats_units / row.total_volume) * 100).toFixed(1));
          row.channel_share.just_eat_pct = parseFloat(((row.just_eat_units / row.total_volume) * 100).toFixed(1));
          row.channel_share.deliveroo_pct = parseFloat(((row.deliveroo_units / row.total_volume) * 100).toFixed(1));
        }

        cumulativeRevenue += row.gross_revenue;
        const cumPct = grandTotalGross > 0 ? (cumulativeRevenue / grandTotalGross) * 100 : 0;

        // Pareto Tiers:
        // Top cumulative 60% of sales -> BEST PERFORMER (Stars / Top Tier)
        // 60% - 90% -> MODERATE PERFORMER (Core / Solid Mid Tier)
        // Bottom 10% (or volume <= 2 or contribution < 1.5%) -> LEAST PERFORMER (Low / Tail)
        if (cumPct <= 60 || row.revenue_contribution_pct >= 8.0) {
          row.performance_tier = 'BEST';
        } else if (cumPct <= 90 || row.revenue_contribution_pct >= 2.5) {
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
        'WAFFLE': { type: 'WAFFLE', label: 'Waffle', plural: 'Waffles', icon: '🧇', badge: '🧇 Waffles', units: 0, gross: 0, net: 0, square_units: 0, uber_units: 0, just_eat_units: 0, deliveroo_units: 0, items_count: 0, pct_of_mains: 0 },
        'PANCAKE': { type: 'PANCAKE', label: 'Pancake', plural: 'Pancakes', icon: '🥞', badge: '🥞 Pancakes', units: 0, gross: 0, net: 0, square_units: 0, uber_units: 0, just_eat_units: 0, deliveroo_units: 0, items_count: 0, pct_of_mains: 0 },
        'COOKIE_DOUGH': { type: 'COOKIE_DOUGH', label: 'Cookie Dough', plural: 'Cookie Doughs', icon: '🍪', badge: '🍪 Cookie Dough', units: 0, gross: 0, net: 0, square_units: 0, uber_units: 0, just_eat_units: 0, deliveroo_units: 0, items_count: 0, pct_of_mains: 0 },
        'CROFFLE': { type: 'CROFFLE', label: 'Croffle', plural: 'Croffles', icon: '🥐', badge: '🥐 Croffles', units: 0, gross: 0, net: 0, square_units: 0, uber_units: 0, just_eat_units: 0, deliveroo_units: 0, items_count: 0, pct_of_mains: 0 },
        'CHEESECAKE': { type: 'CHEESECAKE', label: 'Cheesecake', plural: 'Cheesecakes', icon: '🍰', badge: '🍰 Cheesecakes', units: 0, gross: 0, net: 0, square_units: 0, uber_units: 0, just_eat_units: 0, deliveroo_units: 0, items_count: 0, pct_of_mains: 0 },
        'CREPE': { type: 'CREPE', label: 'Crepe', plural: 'Crepes', icon: '🥞', badge: '🥞 Crepes', units: 0, gross: 0, net: 0, square_units: 0, uber_units: 0, just_eat_units: 0, deliveroo_units: 0, items_count: 0, pct_of_mains: 0 },
        'SAVOURY_BURGER': { type: 'SAVOURY_BURGER', label: 'Burger & Savoury', plural: 'Burgers & Savoury', icon: '🍔', badge: '🍔 Savoury Mains', units: 0, gross: 0, net: 0, square_units: 0, uber_units: 0, just_eat_units: 0, deliveroo_units: 0, items_count: 0, pct_of_mains: 0 },
        'MILKSHAKE': { type: 'MILKSHAKE', label: 'Milkshake', plural: 'Milkshakes', icon: '🥤', badge: '🥤 Milkshakes', units: 0, gross: 0, net: 0, square_units: 0, uber_units: 0, just_eat_units: 0, deliveroo_units: 0, items_count: 0, pct_of_mains: 0 },
        'GELATO_SUNDAE': { type: 'GELATO_SUNDAE', label: 'Gelato & Sundae', plural: 'Gelato & Sundaes', icon: '🍨', badge: '🍨 Gelato & Sundaes', units: 0, gross: 0, net: 0, square_units: 0, uber_units: 0, just_eat_units: 0, deliveroo_units: 0, items_count: 0, pct_of_mains: 0 },
        'BEVERAGE_OTHER': { type: 'BEVERAGE_OTHER', label: 'Drink / Other', plural: 'Drinks & Other', icon: '☕', badge: '☕ Drinks & Other', units: 0, gross: 0, net: 0, square_units: 0, uber_units: 0, just_eat_units: 0, deliveroo_units: 0, items_count: 0, pct_of_mains: 0 }
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

      // Alias mapping so mainsSummary['pancakes'], mainsSummary['pancake'], mainsSummary['waffles'], etc. all resolve seamlessly
      const aliasKeyPairs = [
        ['waffles', 'WAFFLE'], ['waffle', 'WAFFLE'],
        ['pancakes', 'PANCAKE'], ['pancake', 'PANCAKE'],
        ['cookie_dough', 'COOKIE_DOUGH'], ['cookiedough', 'COOKIE_DOUGH'],
        ['croffles', 'CROFFLE'], ['croffle', 'CROFFLE'],
        ['cheesecakes', 'CHEESECAKE'], ['cheesecake', 'CHEESECAKE'],
        ['crepes', 'CREPE'], ['crepe', 'CREPE'],
        ['savoury_burgers', 'SAVOURY_BURGER'], ['savoury_burger', 'SAVOURY_BURGER'], ['burgers', 'SAVOURY_BURGER'],
        ['milkshakes', 'MILKSHAKE'], ['milkshake', 'MILKSHAKE'],
        ['gelato_sundaes', 'GELATO_SUNDAE'], ['gelato', 'GELATO_SUNDAE'],
        ['beverage_other', 'BEVERAGE_OTHER'], ['beverages', 'BEVERAGE_OTHER']
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

      // Performance analytics & AI Insights
      const analytics = this.generatePerformanceAnalytics(ledgerRows, channelTotals, grandTotalGross, grandTotalNet, grandTotalCommission, grandTotalUnits, mainsSummary, totalCoreMainsVolume);

      return {
        reportingDate: reportingDate || 'ALL',
        availableDates: Array.from(availableDatesSet).sort(),
        masterLedger: ledgerRows,
        mainsSummary,
        totalCoreMainsVolume,
        unmappedQueue: unmappedRows,
        unmappedCount: unmappedRows.length,
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
      // 1. Classification Groups
      const bestPerformers = ledgerRows.filter(r => r.performance_tier === 'BEST');
      const moderatePerformers = ledgerRows.filter(r => r.performance_tier === 'MODERATE');
      const leastPerformers = ledgerRows.filter(r => r.performance_tier === 'LEAST');

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
      const channelEconomics = Object.entries(channelTotals).map(([channelName, data]) => {
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
          `🌟 **${i.master_item_name}** generated £${i.gross_revenue.toFixed(2)} (${i.revenue_contribution_pct}% of total sales) with ${i.total_volume} units.`
        ),
        coreRecommendations: moderatePerformers.slice(0, 3).map(i => 
          `⚡ **${i.master_item_name}** is a steady earner (£${i.gross_revenue.toFixed(2)}, ${i.total_volume} units). Maintain stock and feature in combo promos.`
        ),
        lowSalesAlerts: leastPerformers.slice(0, 3).map(i => 
          `⚠️ **${i.master_item_name}** underperformed with only ${i.total_volume} units (£${i.gross_revenue.toFixed(2)}). Consider revising price, repackaging, or removing from delivery menus.`
        )
      };

      // Mains velocity highlights
      if (mainsSummary) {
        if (mainsSummary['WAFFLE'] && mainsSummary['WAFFLE'].units > 0) {
          aiRecommendations.starHighlights.unshift(
            `🧇 **Waffles Velocity**: Sold ${mainsSummary['WAFFLE'].units} Waffles (£${mainsSummary['WAFFLE'].gross.toFixed(2)}), making up ${mainsSummary['WAFFLE'].pct_of_mains}% of total dessert & savoury mains.`
          );
        }
        if (mainsSummary['PANCAKE'] && mainsSummary['PANCAKE'].units > 0) {
          aiRecommendations.coreRecommendations.unshift(
            `🥞 **Pancakes Velocity**: Sold ${mainsSummary['PANCAKE'].units} Pancakes (£${mainsSummary['PANCAKE'].gross.toFixed(2)}), making up ${mainsSummary['PANCAKE'].pct_of_mains}% of total dessert & savoury mains.`
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
            note: i.total_volume <= 2 ? 'Low sales velocity. Consider promotional push or combo pairing.' : 'Sub-par volume.'
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
        [today, '18:40:00', 'DEL-909', '"DELIV - Twist It Dunk It Pancake Stack"', '5', '54.75', '17.52', '0.00', '37.23'].join(','),
        [today, '18:55:00', 'DEL-910', '"American Pancakes - Maple & Berries"', '4', '39.80', '12.74', '0.00', '27.06'].join(','),
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
        'Rank',
        'Product Name',
        'Main Base',
        'Category',
        'Performance Tier',
        'Square Units',
        'Uber Eats Units',
        'Just Eat Units',
        'Deliveroo Units',
        'Total Volume Sold',
        'Avg Unit Price (£)',
        'Gross Revenue (£)',
        'Revenue Contribution (%)',
        'Platform Commissions (£)',
        'Net Revenue Realized (£)',
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
          item.main_label || 'General',
          item.category || 'General Menu',
          item.performance_tier,
          item.square_units || 0,
          item.uber_eats_units || 0,
          item.just_eat_units || 0,
          item.deliveroo_units || 0,
          item.total_volume || 0,
          (item.avg_price || 0).toFixed(2),
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
