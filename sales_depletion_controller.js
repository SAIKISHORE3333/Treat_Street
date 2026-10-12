/**
 * Treat Street - Two-Stream Sales Depletion Controller
 * Architecture:
 * - STREAM 1: Direct-Serve Depletion (Drinks, Bottled Goods, Retail) -> Directly deducts from Theoretical Stock Pot Monitor
 * - STREAM 2: Production Batch Depletion (Waffles, Cookie Dough, Chicken, Sauces) -> FIFO portions deducted from Active Production Batches
 * 
 * Powered by ALAIYA Engine
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SalesDepletionController = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  // Storage Keys
  const STORAGE_KEYS = {
    MENU_ITEMS: 'ts_menu_items',
    STOCK_LEVELS: 'ts_stock_levels',
    PRODUCTION_LOGS: 'ts_production_logs',
    DEPLETION_LOGS: 'ts_sales_depletion_logs',
    MIN_STOCK_LEVELS: 'ts_min_stock_levels',
    MAX_STOCK_LEVELS: 'ts_max_stock_levels',
    RECIPE_SOPS: 'recipeSOPs'
  };

  // Seed Catalog of Treat Street Menu Items
  const DEFAULT_MENU_ITEMS = [
    // Stream 1: Direct-Serve (Drinks, Bottled Goods, Retail - Direct Stock Pot)
    {
      sku_code: "158080",
      name: "Coca Cola Classic Can 330ml",
      depletion_stream: "Direct_Stock",
      target_stock_id: 130, // Catalog ID 130
      target_prep_id: null,
      portions_per_sale: 1.0,
      category: "Beverages & Retail"
    },
    {
      sku_code: "158081",
      name: "Fanta Orange Can 330ml",
      depletion_stream: "Direct_Stock",
      target_stock_id: 131, // Catalog ID 131
      target_prep_id: null,
      portions_per_sale: 1.0,
      category: "Beverages & Retail"
    },
    {
      sku_code: "158082",
      name: "Fanta Lemon Can 330ml",
      depletion_stream: "Direct_Stock",
      target_stock_id: 132, // Catalog ID 132
      target_prep_id: null,
      portions_per_sale: 1.0,
      category: "Beverages & Retail"
    },
    {
      sku_code: "158083",
      name: "Sprite Zero Can 330ml",
      depletion_stream: "Direct_Stock",
      target_stock_id: 133, // Catalog ID 133
      target_prep_id: null,
      portions_per_sale: 1.0,
      category: "Beverages & Retail"
    },
    {
      sku_code: "158084",
      name: "Highland Spring Still Water 500ml",
      depletion_stream: "Direct_Stock",
      target_stock_id: 49, // Catalog ID 49
      target_prep_id: null,
      portions_per_sale: 1.0,
      category: "Beverages & Retail"
    },
    {
      sku_code: "158085",
      name: "Highland Spring Sparkling Water 500ml",
      depletion_stream: "Direct_Stock",
      target_stock_id: 48, // Catalog ID 48
      target_prep_id: null,
      portions_per_sale: 1.0,
      category: "Beverages & Retail"
    },
    {
      sku_code: "158086",
      name: "San Pellegrino Sparkling Water 750ml",
      depletion_stream: "Direct_Stock",
      target_stock_id: 94, // Catalog ID 94
      target_prep_id: null,
      portions_per_sale: 1.0,
      category: "Beverages & Retail"
    },
    {
      sku_code: "158087",
      name: "Tropicana Orange Juice 850ml",
      depletion_stream: "Direct_Stock",
      target_stock_id: 111, // Catalog ID 111
      target_prep_id: null,
      portions_per_sale: 1.0,
      category: "Beverages & Retail"
    },
    {
      sku_code: "158088",
      name: "Monster Energy Drink 500ml",
      depletion_stream: "Direct_Stock",
      target_stock_id: 72, // Catalog ID 72
      target_prep_id: null,
      portions_per_sale: 1.0,
      category: "Beverages & Retail"
    },
    {
      sku_code: "158089",
      name: "Red Bull Energy Drink 250ml",
      depletion_stream: "Direct_Stock",
      target_stock_id: 86, // Catalog ID 86
      target_prep_id: null,
      portions_per_sale: 1.0,
      category: "Beverages & Retail"
    },
    {
      sku_code: "158090",
      name: "Takeaway Biscoff Crumble Bag",
      depletion_stream: "Direct_Stock",
      target_stock_id: 5, // Catalog ID 5: Biscoff Biscuit Crumbs 750g
      target_prep_id: null,
      portions_per_sale: 1.0,
      category: "Retail Snacks"
    },

    // Stream 2: Production Batches (Kitchen Batches & Sub-Recipes - FIFO Active Batch Portions)
    {
      sku_code: "211010",
      name: "Signature Warm Cookie Dough Skillet",
      depletion_stream: "Production_Batch",
      target_stock_id: null,
      target_prep_id: "sop-sub-1", // Signature Cookie Dough Base
      portions_per_sale: 1.0,
      category: "Cookie Doughs"
    },
    {
      sku_code: "211011",
      name: "White Choc & Raspberry Cookie Dough",
      depletion_stream: "Production_Batch",
      target_stock_id: null,
      target_prep_id: "sop-sub-1", // Signature Cookie Dough Base
      portions_per_sale: 1.0,
      category: "Cookie Doughs"
    },
    {
      sku_code: "211012",
      name: "Triple Chocolate Brownie Slice",
      depletion_stream: "Production_Batch",
      target_stock_id: null,
      target_prep_id: "sop-sub-2", // Triple Chocolate Brownie Batter
      portions_per_sale: 1.0,
      category: "Brownies & Bakes"
    },
    {
      sku_code: "211013",
      name: "Belgian Liege Waffle - Banoffee",
      depletion_stream: "Production_Batch",
      target_stock_id: null,
      target_prep_id: "sop-sub-waffle", // Liege Waffle Base / Dough Puck
      portions_per_sale: 1.0,
      category: "Waffles"
    },
    {
      sku_code: "211014",
      name: "Belgian Liege Waffle - Biscofia",
      depletion_stream: "Production_Batch",
      target_stock_id: null,
      target_prep_id: "sop-sub-waffle", // Liege Waffle Base
      portions_per_sale: 1.0,
      category: "Waffles"
    },
    {
      sku_code: "211015",
      name: "Belgian Liege Waffle - Twist It, Dunk It",
      depletion_stream: "Production_Batch",
      target_stock_id: null,
      target_prep_id: "sop-sub-waffle", // Liege Waffle Base
      portions_per_sale: 1.0,
      category: "Waffles"
    },
    {
      sku_code: "211016",
      name: "Mac & Cheese Skillet",
      depletion_stream: "Production_Batch",
      target_stock_id: null,
      target_prep_id: "sop-sub-3", // Mac & Cheese Base
      portions_per_sale: 1.0,
      category: "Hot Savoury"
    },
    {
      sku_code: "211017",
      name: "Crispy Buttermilk Fried Chicken Strips (4pc)",
      depletion_stream: "Production_Batch",
      target_stock_id: null,
      target_prep_id: "sop-sub-chicken", // Fried Chicken Marinade & Prep
      portions_per_sale: 1.0,
      category: "Hot Savoury"
    },
    {
      sku_code: "211018",
      name: "Warm Belgian Milk Chocolate Sauce (Dipping Pot)",
      depletion_stream: "Production_Batch",
      target_stock_id: null,
      target_prep_id: "sop-sub-sauce", // Warm Prep Sauce
      portions_per_sale: 1.0,
      category: "Prep Sauces"
    }
  ];

  // Default Fallback Sub-Recipe Details
  const DEFAULT_SUB_RECIPES = [
    {
      id: "sop-sub-1",
      title: "Signature Cookie Dough Base",
      recipeType: "Sub-Recipe",
      yield: "10 Portions (1.2 kg)",
      portions: 10,
      shelfLife: "5 Days"
    },
    {
      id: "sop-sub-2",
      title: "Triple Chocolate Brownie Batter",
      recipeType: "Sub-Recipe",
      yield: "1 Tray (12 Slices)",
      portions: 12,
      shelfLife: "4 Days"
    },
    {
      id: "sop-sub-3",
      title: "Mac & Cheese Base",
      recipeType: "Sub-Recipe",
      yield: "2 Litres (8 Portions)",
      portions: 8,
      shelfLife: "3 Days"
    },
    {
      id: "sop-sub-waffle",
      title: "Liege Waffle Base",
      recipeType: "Sub-Recipe",
      yield: "20 Waffle Pucks",
      portions: 20,
      shelfLife: "3 Days"
    },
    {
      id: "sop-sub-chicken",
      title: "Crispy Fried Chicken Marinade & Prep",
      recipeType: "Sub-Recipe",
      yield: "15 Portions (60 Strips)",
      portions: 15,
      shelfLife: "2 Days"
    },
    {
      id: "sop-sub-sauce",
      title: "Warm Belgian Chocolate Sauce Prep",
      recipeType: "Sub-Recipe",
      yield: "25 Dipping Pots",
      portions: 25,
      shelfLife: "4 Days"
    }
  ];

  // =========================================================================
  // CORE CONTROLLER OBJECT
  // =========================================================================
  const SalesDepletionController = {
    // -----------------------------------------------------------------------
    // 1. DATA ACCESS & INITIALIZATION
    // -----------------------------------------------------------------------
    getMenuItems() {
      try {
        if (typeof localStorage !== 'undefined') {
          const stored = localStorage.getItem(STORAGE_KEYS.MENU_ITEMS);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
          }
        }
      } catch (e) {}
      // Initialize with default seeds
      this.saveMenuItems(DEFAULT_MENU_ITEMS);
      return DEFAULT_MENU_ITEMS;
    },

    saveMenuItems(items) {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(items));
        }
      } catch (e) {}
    },

    getStockLevels() {
      try {
        if (typeof localStorage !== 'undefined') {
          const stored = localStorage.getItem(STORAGE_KEYS.STOCK_LEVELS);
          return stored ? JSON.parse(stored) : {};
        }
      } catch (e) {}
      return {};
    },

    saveStockLevels(levels) {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.STOCK_LEVELS, JSON.stringify(levels));
        }
      } catch (e) {}
    },

    getProductionBatches() {
      try {
        if (typeof localStorage !== 'undefined') {
          const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTION_LOGS);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
              // Strip legacy simulated mocks so real logs are clean
              const realBatches = parsed.filter(b => b && b.log_id !== 'BATCH-260914-101' && b.log_id !== 'BATCH-260915-204');
              return this.healAndNormalizeBatches(realBatches);
            }
          }
        }
      } catch (e) {}
      return [];
    },

    saveProductionBatches(batches) {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.PRODUCTION_LOGS, JSON.stringify(batches));
        }
      } catch (e) {}
    },

    getSalesDepletionLogs() {
      try {
        if (typeof localStorage !== 'undefined') {
          const stored = localStorage.getItem(STORAGE_KEYS.DEPLETION_LOGS);
          return stored ? JSON.parse(stored) : [];
        }
      } catch (e) {}
      return [];
    },

    saveSalesDepletionLogs(logs) {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.DEPLETION_LOGS, JSON.stringify(logs));
        }
      } catch (e) {}
    },

    getMinStockLevels() {
      try {
        if (typeof localStorage !== 'undefined') {
          const stored = localStorage.getItem(STORAGE_KEYS.MIN_STOCK_LEVELS);
          return stored ? JSON.parse(stored) : {};
        }
      } catch (e) {}
      return {};
    },

    getMaxStockLevels() {
      try {
        if (typeof localStorage !== 'undefined') {
          const stored = localStorage.getItem(STORAGE_KEYS.MAX_STOCK_LEVELS);
          return stored ? JSON.parse(stored) : {};
        }
      } catch (e) {}
      return {};
    },

    getSubRecipes() {
      let recipes = [];
      try {
        if (typeof localStorage !== 'undefined') {
          const stored = localStorage.getItem(STORAGE_KEYS.RECIPE_SOPS);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              recipes = parsed;
            }
          }
        }
      } catch (e) {}

      // Merge with default sub-recipes
      const all = [...recipes];
      DEFAULT_SUB_RECIPES.forEach(def => {
        if (!all.some(r => r.id === def.id || (r.title && r.title.toLowerCase() === def.title.toLowerCase()))) {
          all.push(def);
        }
      });
      return all;
    },

    // -----------------------------------------------------------------------
    // 2. BATCH HEALING & YIELD PORTION PARSING
    // -----------------------------------------------------------------------
    parseYieldPortions(yieldStr, batchesProduced = 1) {
      batchesProduced = parseFloat(batchesProduced) || 1;
      if (!yieldStr) return 1 * batchesProduced;

      const str = String(yieldStr).toLowerCase();
      // Look for matches like "10 portions", "12 slices", "20 pucks", "8 servings", "60"
      const match = str.match(/(\d+(?:\.\d+)?)\s*(?:portion|slice|puck|piece|pot|unit|serving|dish|strips)?/i);
      if (match) {
        const basePortions = parseFloat(match[1]);
        if (!isNaN(basePortions) && basePortions > 0) {
          return Math.round(basePortions * batchesProduced);
        }
      }
      return Math.round(1 * batchesProduced);
    },

    healAndNormalizeBatches(batches) {
      let modified = false;
      const subRecipes = this.getSubRecipes();

      const normalized = batches.map(b => {
        const batch = { ...b };
        // Ensure standard keys
        if (!batch.batch_id && batch.log_id) batch.batch_id = batch.log_id;
        if (!batch.log_id && batch.batch_id) batch.log_id = batch.batch_id;

        const batchesCount = parseFloat(batch.batches_produced) || 1;

        // Resolve prep_id if missing
        if (!batch.prep_id) {
          batch.prep_id = batch.recipe_id || null;
          if (!batch.prep_id && batch.recipe_name) {
            const matchedSub = subRecipes.find(s => 
              s.title && s.title.toLowerCase().trim() === batch.recipe_name.toLowerCase().trim()
            );
            if (matchedSub) batch.prep_id = matchedSub.id;
          }
        }

        // Calculate initial_yield_portions if missing
        if (batch.initial_yield_portions === undefined || isNaN(batch.initial_yield_portions)) {
          let yieldPortions = 0;
          if (batch.prep_id) {
            const sub = subRecipes.find(s => s.id === batch.prep_id);
            if (sub && sub.portions) yieldPortions = sub.portions * batchesCount;
            else if (sub && sub.yield) yieldPortions = this.parseYieldPortions(sub.yield, batchesCount);
          }
          if (yieldPortions === 0 && batch.yield_output) {
            yieldPortions = this.parseYieldPortions(batch.yield_output, 1);
          }
          if (yieldPortions === 0) {
            yieldPortions = 10 * batchesCount; // reasonable default
          }
          batch.initial_yield_portions = yieldPortions;
          modified = true;
        }

        // Calculate remaining_portions if missing
        if (batch.remaining_portions === undefined || isNaN(batch.remaining_portions)) {
          if (batch.status === 'Depleted') {
            batch.remaining_portions = 0;
          } else {
            batch.remaining_portions = batch.initial_yield_portions;
          }
          modified = true;
        }

        // Standardize status: 'Active' | 'Depleted' | 'Expired'
        const now = new Date();
        const useBy = batch.use_by_date ? new Date(batch.use_by_date) : null;
        if (useBy && useBy < now) {
          batch.status = 'Expired';
        } else if (batch.remaining_portions <= 0 && batch.status !== 'Active') {
          batch.status = 'Depleted';
        } else if (!batch.status) {
          batch.status = batch.remaining_portions > 0 ? 'Active' : 'Depleted';
          modified = true;
        }

        if (!batch.created_at) batch.created_at = batch.timestamp || new Date().toISOString();
        if (!batch.production_date) batch.production_date = batch.prep_date || new Date().toISOString().split('T')[0];

        return batch;
      });

      if (modified && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.PRODUCTION_LOGS, JSON.stringify(normalized));
      }
      return normalized;
    },

    // -----------------------------------------------------------------------
    // 3. BATCH CREATION (Invoked when chef logs production)
    // -----------------------------------------------------------------------
    createActiveProductionBatch(params) {
      const {
        batch_id,
        recipe_id,
        recipe_title,
        recipe_type = 'Sub-Recipe',
        batches_produced = 1,
        yield_output,
        prep_date,
        use_by_date,
        staff_name = 'Kitchen Staff',
        core_temp = 'Normal',
        storage_condition = 'Refrigerated',
        total_cost = '0.00',
        deducted_ingredients = []
      } = params;

      const batchesCount = parseFloat(batches_produced) || 1;
      const subRecipes = this.getSubRecipes();
      const matchedSub = subRecipes.find(s => s.id === recipe_id || (s.title && s.title.toLowerCase() === (recipe_title || '').toLowerCase()));

      let initialPortions = 0;
      if (matchedSub && matchedSub.portions) {
        initialPortions = matchedSub.portions * batchesCount;
      } else {
        initialPortions = this.parseYieldPortions(yield_output || (matchedSub?.yield), batchesCount);
      }
      if (initialPortions <= 0) initialPortions = Math.round(10 * batchesCount);

      const newBatch = {
        batch_id: batch_id,
        log_id: batch_id,
        prep_id: recipe_id || (matchedSub?.id) || 'sop-sub-custom',
        recipe_id: recipe_id || (matchedSub?.id) || 'sop-sub-custom',
        recipe_name: recipe_title || (matchedSub?.title) || 'Kitchen Production Batch',
        recipe_type: recipe_type,
        batches_produced: batchesCount,
        yield_output: yield_output || `${batchesCount}x [${initialPortions} portions]`,
        initial_yield_portions: initialPortions,
        remaining_portions: initialPortions,
        status: 'Active',
        prep_date: prep_date || new Date().toISOString().split('T')[0],
        production_date: prep_date || new Date().toISOString().split('T')[0],
        use_by_date: use_by_date,
        created_at: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        staff_name: staff_name,
        core_temp: core_temp,
        storage_condition: storage_condition,
        total_cost: total_cost,
        inventory_depleted: true,
        depleted_at: new Date().toISOString(),
        deducted_ingredients: deducted_ingredients
      };

      const existingBatches = this.getProductionBatches();
      existingBatches.unshift(newBatch);
      this.saveProductionBatches(existingBatches);

      this.notifyStateChange({ type: 'BATCH_CREATED', batch: newBatch });
      return newBatch;
    },

    // -----------------------------------------------------------------------
    // 4. POS SALES REPORT PARSER (CSV & EXCEL)
    // -----------------------------------------------------------------------
    parseSalesTextOrRows(text) {
      if (!text || typeof text !== 'string') return [];
      const lines = [];
      let row = [];
      let inQuotes = false;
      let currVal = '';
      const cleanText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

      for (let i = 0; i < cleanText.length; i++) {
        const c = cleanText[i];
        const nextC = cleanText[i + 1];

        if (c === '"' || c === "'") {
          if (inQuotes && nextC === c) {
            currVal += c;
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if ((c === ',' || c === '\t') && !inQuotes) {
          row.push(currVal.trim());
          currVal = '';
        } else if (c === '\n' && !inQuotes) {
          row.push(currVal.trim());
          if (row.some(val => val !== '')) lines.push(row);
          row = [];
          currVal = '';
        } else {
          currVal += c;
        }
      }
      if (currVal !== '' || row.length > 0) {
        row.push(currVal.trim());
        if (row.some(val => val !== '')) lines.push(row);
      }
      return lines;
    },

    parsePOSReport(fileContent, filename = '') {
      let rows = [];

      // If array of arrays (e.g. from SheetJS XLSX)
      if (Array.isArray(fileContent)) {
        rows = fileContent;
      } else if (typeof fileContent === 'string') {
        rows = this.parseSalesTextOrRows(fileContent);
      }

      if (rows.length < 2) {
        return { items: [], filename, rowCount: 0 };
      }

      const headers = rows[0].map(h => (h || '').toString().toLowerCase().trim());

      // Column mapping heuristics
      let skuIdx = headers.findIndex(h => h === 'sku' || h === 'sku_code' || h === 'barcode' || h === 'item code' || h === 'code');
      let nameIdx = headers.findIndex(h => h === 'item' || h === 'item name' || h === 'description' || h === 'product' || h === 'product name' || h === 'name');
      let qtyIdx = headers.findIndex(h => h === 'qty' || h === 'quantity' || h === 'qty sold' || h === 'units sold' || h === 'count');
      let priceIdx = headers.findIndex(h => h.includes('gross') || h.includes('sales') || h.includes('net') || h.includes('total') || h.includes('price'));

      if (skuIdx === -1) {
        // Fallback: check headers containing 'sku' or 'code' or 'ref'
        skuIdx = headers.findIndex(h => h.includes('sku') || h.includes('barcode') || h.includes('plu'));
      }
      if (nameIdx === -1) {
        nameIdx = headers.findIndex(h => h.includes('item') || h.includes('product') || h.includes('desc') || h.includes('name'));
      }
      if (qtyIdx === -1) {
        qtyIdx = headers.findIndex(h => h.includes('qty') || h.includes('quantity') || h.includes('sold') || h.includes('units'));
      }

      // Default safe indices if not found
      if (skuIdx === -1) skuIdx = 0;
      if (nameIdx === -1) nameIdx = 1;
      if (qtyIdx === -1) qtyIdx = 2;

      const items = [];
      const menuItems = this.getMenuItems();

      for (let i = 1; i < rows.length; i++) {
        const r = rows[i];
        if (!r || r.length === 0) continue;

        let rawSku = (r[skuIdx] || '').toString().trim();
        let rawName = (r[nameIdx] || '').toString().trim();
        const rawQtyStr = (r[qtyIdx] || '1').toString().replace(/[^0-9.-]+/g, '');
        const qtySold = Math.max(0, parseFloat(rawQtyStr) || 1);

        let grossSales = 0;
        if (priceIdx !== -1 && r[priceIdx]) {
          const p = parseFloat(r[priceIdx].toString().replace(/[^0-9.-]+/g, ''));
          if (!isNaN(p)) grossSales = p;
        }

        // Skip totals / blank summary rows
        if (rawName.toLowerCase() === 'total' || rawName.toLowerCase() === 'summary' || (!rawSku && !rawName)) {
          continue;
        }

        // Auto-match against MenuItems
        const matchedMenu = this.matchMenuItem(rawSku, rawName, menuItems);

        items.push({
          raw_sku: rawSku || (matchedMenu ? matchedMenu.sku_code : `SKU-${i}`),
          raw_name: rawName || (matchedMenu ? matchedMenu.name : `Item #${i}`),
          qty_sold: qtySold,
          gross_sales: grossSales,
          matched_menu_item: matchedMenu,
          row_index: i
        });
      }

      return {
        items,
        filename,
        rowCount: items.length
      };
    },

    // -----------------------------------------------------------------------
    // 5. MENU ITEM CLASSIFICATION & MATCHING
    // -----------------------------------------------------------------------
    matchMenuItem(rawSku, rawName, menuItems) {
      if (!menuItems) menuItems = this.getMenuItems();

      const cleanSku = (rawSku || '').trim();
      const normName = (rawName || '').toLowerCase().trim();

      // 1. Exact SKU match
      if (cleanSku) {
        const bySku = menuItems.find(m => m.sku_code && m.sku_code.trim() === cleanSku);
        if (bySku) return bySku;
      }

      // 2. Exact or partial Name match
      if (normName) {
        const byName = menuItems.find(m => m.name && m.name.toLowerCase().trim() === normName);
        if (byName) return byName;

        const bySubstr = menuItems.find(m => {
          const mName = m.name.toLowerCase();
          return normName.includes(mName) || mName.includes(normName);
        });
        if (bySubstr) return bySubstr;
      }

      // 3. Heuristic classification based on keyword
      if (normName) {
        // Stream 1 keywords: direct drinks and packaged goods
        if (
          normName.includes('coke') || normName.includes('cola') || normName.includes('fanta') ||
          normName.includes('sprite') || normName.includes('water') || normName.includes('juice') ||
          normName.includes('monster') || normName.includes('red bull') || normName.includes('crumble bag') ||
          normName.includes('can') || normName.includes('bottle')
        ) {
          return {
            sku_code: cleanSku || `DS-${Date.now().toString().slice(-4)}`,
            name: rawName,
            depletion_stream: 'Direct_Stock',
            target_stock_id: 130, // Default to soda/beverage
            target_prep_id: null,
            portions_per_sale: 1.0,
            is_inferred: true
          };
        }

        // Stream 2 keywords: kitchen prep batches
        if (
          normName.includes('cookie') || normName.includes('dough') || normName.includes('waffle') ||
          normName.includes('brownie') || normName.includes('chicken') || normName.includes('mac') ||
          normName.includes('sauce') || normName.includes('skillet') || normName.includes('pancake') ||
          normName.includes('crepe')
        ) {
          let prepId = 'sop-sub-1';
          if (normName.includes('waffle')) prepId = 'sop-sub-waffle';
          else if (normName.includes('brownie')) prepId = 'sop-sub-2';
          else if (normName.includes('mac')) prepId = 'sop-sub-3';
          else if (normName.includes('chicken')) prepId = 'sop-sub-chicken';
          else if (normName.includes('sauce')) prepId = 'sop-sub-sauce';

          return {
            sku_code: cleanSku || `PB-${Date.now().toString().slice(-4)}`,
            name: rawName,
            depletion_stream: 'Production_Batch',
            target_stock_id: null,
            target_prep_id: prepId,
            portions_per_sale: 1.0,
            is_inferred: true
          };
        }
      }

      return null;
    },

    // -----------------------------------------------------------------------
    // 6. TWO-STREAM PREVIEW CALCULATION (CORE DEPLETION LOGIC)
    // -----------------------------------------------------------------------
    calculateTwoStreamDepletionPreview(parsedReport, catalog = []) {
      const items = parsedReport?.items || [];
      const menuItems = this.getMenuItems();
      const currentStockLevels = this.getStockLevels();
      const activeBatches = this.getProductionBatches();
      const minStockLevels = this.getMinStockLevels();
      const maxStockLevels = this.getMaxStockLevels();
      const subRecipes = this.getSubRecipes();

      const directPotMap = new Map(); // target_stock_id -> { item, pot, qty_sold, current_level, new_level, alarms }
      const batchPrepMap = new Map(); // target_prep_id -> { prep_id, prep_title, portions_demanded, items: [] }
      const unmappedItems = [];

      // 1. Classify items into Stream 1 or Stream 2
      items.forEach(item => {
        let menu = item.matched_menu_item;
        if (!menu) {
          menu = this.matchMenuItem(item.raw_sku, item.raw_name, menuItems);
        }

        if (!menu) {
          unmappedItems.push(item);
          return;
        }

        const soldQty = item.qty_sold;
        const portions = soldQty * (menu.portions_per_sale || 1.0);

        if (menu.depletion_stream === 'Direct_Stock') {
          const stockId = menu.target_stock_id;
          if (!directPotMap.has(stockId)) {
            const catalogItem = catalog.find(c => String(c.id) === String(stockId)) || {
              id: stockId,
              name: menu.name,
              category: 'Direct Retail'
            };
            const currentLevel = currentStockLevels[stockId] !== undefined ? parseFloat(currentStockLevels[stockId]) : 0;
            const minAlarm = minStockLevels[stockId] !== undefined ? parseFloat(minStockLevels[stockId]) : 2.0;
            const maxCap = maxStockLevels[stockId] !== undefined ? parseFloat(maxStockLevels[stockId]) : 12.0;
            const moderateThreshold = parseFloat((minAlarm + (maxCap - minAlarm) * 0.4).toFixed(1));

            directPotMap.set(stockId, {
              stock_id: stockId,
              item_name: catalogItem.name || menu.name,
              sku_code: menu.sku_code,
              category: catalogItem.category || 'Retail',
              quantity_sold: 0,
              current_pot_level: currentLevel,
              min_alarm: minAlarm,
              moderate_level: moderateThreshold,
              max_capacity: maxCap,
              sources: []
            });
          }

          const entry = directPotMap.get(stockId);
          entry.quantity_sold += portions;
          entry.sources.push({ sku: menu.sku_code, name: menu.name, sold: soldQty });

        } else if (menu.depletion_stream === 'Production_Batch') {
          const prepId = menu.target_prep_id || 'sop-sub-1';
          if (!batchPrepMap.has(prepId)) {
            const sub = subRecipes.find(s => s.id === prepId) || { id: prepId, title: menu.name };
            batchPrepMap.set(prepId, {
              prep_id: prepId,
              prep_title: sub.title || menu.name,
              portions_demanded: 0,
              items: []
            });
          }

          const prepEntry = batchPrepMap.get(prepId);
          prepEntry.portions_demanded += portions;
          prepEntry.items.push({
            sku: menu.sku_code,
            name: menu.name,
            qty_sold: soldQty,
            portions: portions
          });
        }
      });

      // 2. Process Stream 1 Direct Pot Calculations & Alarm Triggers
      const directPotDeductions = [];
      const reorderAlarms = [];

      directPotMap.forEach((entry, stockId) => {
        const newPotLevel = Math.max(0, parseFloat((entry.current_pot_level - entry.quantity_sold).toFixed(2)));
        let alarmState = 'NORMAL';
        let alarmMessage = 'Stock healthy';

        if (newPotLevel <= entry.min_alarm) {
          alarmState = 'MIN_ALARM';
          alarmMessage = `CRITICAL MIN ALARM: Level (${newPotLevel}) is below threshold (${entry.min_alarm})! Immediate Reorder Required.`;
          reorderAlarms.push({
            type: 'MIN_ALARM',
            stock_id: stockId,
            item_name: entry.item_name,
            current_level: entry.current_pot_level,
            deducted: entry.quantity_sold,
            projected_level: newPotLevel,
            threshold: entry.min_alarm,
            message: alarmMessage
          });
        } else if (newPotLevel <= entry.moderate_level) {
          alarmState = 'MODERATE_LEVEL';
          alarmMessage = `MODERATE WARNING: Level (${newPotLevel}) has fallen below moderate reorder buffer (${entry.moderate_level}).`;
          reorderAlarms.push({
            type: 'MODERATE_LEVEL',
            stock_id: stockId,
            item_name: entry.item_name,
            current_level: entry.current_pot_level,
            deducted: entry.quantity_sold,
            projected_level: newPotLevel,
            threshold: entry.moderate_level,
            message: alarmMessage
          });
        }

        directPotDeductions.push({
          ...entry,
          projected_pot_level: newPotLevel,
          alarm_state: alarmState,
          alarm_message: alarmMessage
        });
      });

      // 3. Process Stream 2 Production Batch FIFO Depletions
      const batchDeductions = [];
      const unloggedBatchWarnings = [];

      // Clone batches for simulation
      const simulatedBatches = JSON.parse(JSON.stringify(activeBatches));

      batchPrepMap.forEach((prepData, prepId) => {
        let remainingNeeded = prepData.portions_demanded;

        // Query active batches for this prep ID ordered by production_date ASC (FIFO)
        const candidateBatches = simulatedBatches.filter(b => 
          (b.prep_id === prepId || b.recipe_id === prepId || (b.recipe_name && b.recipe_name.toLowerCase() === prepData.prep_title.toLowerCase())) &&
          (b.status === 'Active' || b.remaining_portions > 0)
        );

        // Sort FIFO: oldest production_date / created_at first
        candidateBatches.sort((a, b) => {
          const dateA = new Date(a.production_date || a.created_at || 0);
          const dateB = new Date(b.production_date || b.created_at || 0);
          return dateA - dateB;
        });

        const batchSteps = [];

        for (const batch of candidateBatches) {
          if (remainingNeeded <= 0) break;
          const currentRemaining = parseFloat(batch.remaining_portions) || 0;
          if (currentRemaining <= 0) continue;

          const toDeduct = Math.min(currentRemaining, remainingNeeded);
          const newRemaining = parseFloat((currentRemaining - toDeduct).toFixed(1));
          remainingNeeded = parseFloat((remainingNeeded - toDeduct).toFixed(1));

          const newStatus = newRemaining === 0 ? 'Depleted' : 'Active';

          batchSteps.push({
            batch_id: batch.batch_id || batch.log_id,
            prep_id: prepId,
            recipe_name: batch.recipe_name,
            production_date: batch.production_date,
            initial_yield: batch.initial_yield_portions,
            remaining_before: currentRemaining,
            deducted: toDeduct,
            remaining_after: newRemaining,
            new_status: newStatus,
            is_depleted: newRemaining === 0
          });

          // Update simulated batch
          batch.remaining_portions = newRemaining;
          batch.status = newStatus;
        }

        // Check if active batches were insufficient
        if (remainingNeeded > 0) {
          // Total active batches are insufficient for the quantity sold!
          // Allow remaining_portions to go negative and flag an "Unlogged Batch Warning"
          const shortage = remainingNeeded;
          let overflowBatchId = null;

          if (candidateBatches.length > 0) {
            // Apply negative portions to the latest batch
            const lastBatch = candidateBatches[candidateBatches.length - 1];
            overflowBatchId = lastBatch.batch_id || lastBatch.log_id;
            const currentRem = parseFloat(lastBatch.remaining_portions) || 0;
            const negRemaining = parseFloat((currentRem - shortage).toFixed(1));
            lastBatch.remaining_portions = negRemaining;
            
            // Record overflow in steps
            batchSteps.push({
              batch_id: overflowBatchId,
              prep_id: prepId,
              recipe_name: lastBatch.recipe_name,
              production_date: lastBatch.production_date,
              initial_yield: lastBatch.initial_yield_portions,
              remaining_before: currentRem,
              deducted: shortage,
              remaining_after: negRemaining,
              new_status: 'Active (Negative Overrun)',
              is_unlogged_overrun: true
            });
          } else {
            // No active batches at all were logged!
            overflowBatchId = `UNLOGGED-${prepId}`;
            batchSteps.push({
              batch_id: overflowBatchId,
              prep_id: prepId,
              recipe_name: prepData.prep_title,
              production_date: 'N/A',
              initial_yield: 0,
              remaining_before: 0,
              deducted: shortage,
              remaining_after: -shortage,
              new_status: 'Unlogged Batch Overrun',
              is_unlogged_overrun: true
            });
          }

          unloggedBatchWarnings.push({
            prep_id: prepId,
            prep_title: prepData.prep_title,
            portions_demanded: prepData.portions_demanded,
            portions_shortage: shortage,
            assigned_batch_id: overflowBatchId,
            message: `⚠️ Unlogged Batch Warning: Sold ${prepData.portions_demanded} portions of '${prepData.prep_title}', but active logged batches only had ${prepData.portions_demanded - shortage} portions available. Kitchen logged yield was exceeded by ${shortage} portions. Remaining portions have been adjusted negatively.`
          });
        }

        batchDeductions.push({
          prep_id: prepId,
          prep_title: prepData.prep_title,
          total_portions_demanded: prepData.portions_demanded,
          menu_items_sold: prepData.items,
          fifo_batch_steps: batchSteps,
          has_warning: remainingNeeded > 0
        });
      });

      return {
        timestamp: new Date().toISOString(),
        direct_pot_deductions: directPotDeductions,
        batch_deductions: batchDeductions,
        reorder_alarms: reorderAlarms,
        unlogged_batch_warnings: unloggedBatchWarnings,
        unmapped_items: unmappedItems,
        kpis: {
          total_lines_analyzed: items.length,
          direct_items_count: directPotDeductions.length,
          batches_depleted_count: batchDeductions.reduce((acc, b) => acc + b.fifo_batch_steps.length, 0),
          reorder_alarms_count: reorderAlarms.length,
          unlogged_warnings_count: unloggedBatchWarnings.length,
          unmapped_count: unmappedItems.length
        }
      };
    },

    // -----------------------------------------------------------------------
    // 7. EXECUTE & COMMIT DEPLETIONS
    // -----------------------------------------------------------------------
    async executeDepletions(previewResult, supabaseClient = null) {
      if (!previewResult) throw new Error("No depletion preview provided to execute.");

      const stockLevels = this.getStockLevels();
      const batches = this.getProductionBatches();
      const depletionLogs = this.getSalesDepletionLogs();
      const runId = `DEP-RUN-${Date.now()}`;
      const now = new Date().toISOString();

      // 1. Apply Direct Pot Deductions
      const directRecords = [];
      previewResult.direct_pot_deductions.forEach(direct => {
        const id = direct.stock_id;
        const current = stockLevels[id] !== undefined ? parseFloat(stockLevels[id]) : 0;
        const newLevel = Math.max(0, parseFloat((current - direct.quantity_sold).toFixed(2)));
        stockLevels[id] = newLevel;

        const logEntry = {
          sales_record_id: runId,
          sku_code: direct.sku_code || `DIRECT-${id}`,
          qty_sold: direct.quantity_sold,
          depleted_from: 'StockPot',
          reference_id: String(id),
          item_name: direct.item_name,
          previous_level: current,
          new_level: newLevel,
          timestamp: now
        };
        depletionLogs.unshift(logEntry);
        directRecords.push(logEntry);
      });

      // 2. Apply Production Batch Deductions (FIFO updates)
      const batchRecords = [];
      previewResult.batch_deductions.forEach(prepGroup => {
        prepGroup.fifo_batch_steps.forEach(step => {
          const targetBatch = batches.find(b => (b.batch_id === step.batch_id || b.log_id === step.batch_id));
          if (targetBatch) {
            targetBatch.remaining_portions = step.remaining_after;
            if (step.remaining_after === 0) {
              targetBatch.status = 'Depleted';
            } else if (step.remaining_after < 0) {
              targetBatch.status = 'Active'; // Keep active to show negative overrun warning
            }
          }

          const logEntry = {
            sales_record_id: runId,
            sku_code: prepGroup.prep_id,
            qty_sold: step.deducted,
            depleted_from: 'ProductionBatch',
            reference_id: step.batch_id,
            recipe_name: step.recipe_name,
            previous_portions: step.remaining_before,
            new_portions: step.remaining_after,
            status: step.new_status,
            timestamp: now
          };
          depletionLogs.unshift(logEntry);
          batchRecords.push(logEntry);
        });
      });

      // 3. Persist State
      this.saveStockLevels(stockLevels);
      this.saveProductionBatches(batches);
      this.saveSalesDepletionLogs(depletionLogs);

      // 4. Supabase Sync (if connected)
      if (supabaseClient) {
        try {
          const rowsToInsert = [...directRecords, ...batchRecords].map(r => ({
            sales_record_id: r.sales_record_id,
            sku_code: r.sku_code,
            qty_sold: r.qty_sold,
            depleted_from: r.depleted_from,
            reference_id: r.reference_id,
            timestamp: r.timestamp
          }));
          await supabaseClient.from('sales_depletion_logs').insert(rowsToInsert);
        } catch (e) {
          console.warn("Supabase sales depletion logs sync warning:", e);
        }
      }

      const executionSummary = {
        run_id: runId,
        timestamp: now,
        direct_pots_updated: directRecords.length,
        batches_updated: batchRecords.length,
        alarms_triggered: previewResult.reorder_alarms,
        unlogged_warnings: previewResult.unlogged_batch_warnings
      };

      this.notifyStateChange({
        type: 'DEPLETION_EXECUTED',
        summary: executionSummary
      });

      return executionSummary;
    },

    // -----------------------------------------------------------------------
    // 8. SAMPLE POS SALES REPORT GENERATOR
    // -----------------------------------------------------------------------
    generateSamplePOSReportCSV() {
      const header = "SKU,Item Name,Category,Qty Sold,Net Sales (£),Gross Sales (£)\n";
      const rows = [
        // Direct-Serve Sodas & Bottled Items (Stream 1)
        "158080,Coca Cola Classic Can 330ml,Beverages,24,36.00,43.20",
        "158081,Fanta Orange Can 330ml,Beverages,15,22.50,27.00",
        "158083,Sprite Zero Can 330ml,Beverages,12,18.00,21.60",
        "158084,Highland Spring Still Water 500ml,Beverages,18,21.60,25.92",
        "158086,San Pellegrino Sparkling Water 750ml,Beverages,6,15.00,18.00",
        "158090,Takeaway Biscoff Crumble Bag,Retail,8,24.00,28.80",
        
        // Kitchen Production Batches (Stream 2)
        "211010,Signature Warm Cookie Dough Skillet,Desserts,18,126.00,151.20",
        "211012,Triple Chocolate Brownie Slice,Bakery,14,84.00,100.80",
        "211013,Belgian Liege Waffle - Banoffee,Waffles,16,112.00,134.40",
        "211014,Belgian Liege Waffle - Biscofia,Waffles,12,84.00,100.80",
        "211016,Mac & Cheese Skillet,Hot Savoury,10,75.00,90.00",
        "211017,Crispy Buttermilk Fried Chicken Strips (4pc),Hot Savoury,12,96.00,115.20",
        "211018,Warm Belgian Milk Chocolate Sauce (Dipping Pot),Sauces,20,30.00,36.00"
      ];
      return header + rows.join("\n");
    },

    // -----------------------------------------------------------------------
    // 9. EVENT NOTIFICATION SYSTEM
    // -----------------------------------------------------------------------
    notifyStateChange(detail) {
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
        const ev = new CustomEvent('treat_street:depletion_processed', { detail });
        window.dispatchEvent(ev);
      }
    }
  };

  return SalesDepletionController;
}));
