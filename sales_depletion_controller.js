/**
 * Treat Street - Two-Stream In-Store Sales Depletion Controller
 * 
 * Implements:
 * - STREAM 1: Direct-Serve Stock (Cold Drinks, Bottled Goods, Retail Bags)
 *   Directly subtracts sold quantity from matching stock pot in ts_stock_levels.
 *   current_level = current_level - quantity_sold
 *   Triggers Moderate / Min Alarm alerts if current_level <= min_threshold.
 * 
 * - STREAM 2: Batched Kitchen Production (Waffles, Cookie Dough, Fried Chicken, Prep Sauces)
 *   Deducts finished portions from active batches in ts_production_logs using FIFO (production_date ASC).
 *   DOES NOT touch raw ingredients (flour, eggs, milk, raw chicken).
 *   If remaining_portions <= 0, marks batch as 'Depleted'.
 *   If active batches are insufficient, allows remaining_portions to go negative and sets unlogged_batch_flag: true.
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

  console.log(">>> Sales Depletion Controller v2.4 Loaded Successfully <<<");

  const STORAGE_KEYS = {
    STOCK_LEVELS: 'ts_stock_levels',
    PRODUCTION_LOGS: 'ts_production_logs',
    MIN_STOCK_LEVELS: 'ts_min_stock_levels',
    DEPLETION_LOGS: 'ts_sales_depletion_logs',
    RECIPE_SOPS: 'recipeSOPs'
  };

  const SalesDepletionController = {
    // -------------------------------------------------------------
    // Helper: Safely access LocalStorage
    // -------------------------------------------------------------
    getStorageItem(key, fallback = null) {
      if (typeof localStorage === 'undefined') return fallback;
      try {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : fallback;
      } catch (e) {
        return fallback;
      }
    },

    setStorageItem(key, data) {
      if (typeof localStorage === 'undefined') return;
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        console.warn('Storage set error:', key, e);
      }
    },

    // -------------------------------------------------------------
    // Helper: Text normalization for fuzzy lookup
    // -------------------------------------------------------------
    normalize(str) {
      if (!str || typeof str !== 'string') return '';
      return str
        .toLowerCase()
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\([^)]*\)/g, ' ')
        .replace(/\[[^\]]*\]/g, ' ')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    },

    // -------------------------------------------------------------
    // Helper: Parse or resolve batch portions
    // -------------------------------------------------------------
    getBatchPortionStats(log) {
      if (!log) {
        return { initial_yield: 0, remaining_portions: 0, isOverrun: false, isDepleted: false, status: 'Unknown' };
      }

      let initial = parseFloat(log.initial_yield_portions);
      const batches = parseFloat(log.batches_produced) || 1;

      if (!initial || isNaN(initial)) {
        const yieldStr = (log.yield_output || '').toLowerCase();
        // Look for portion count in yield_output (e.g., "1x [10 portions]", "20 waffle pucks", "12 slices")
        const match = yieldStr.match(/(\d+(?:\.\d+)?)\s*(?:portion|piece|puck|slice|skillet|item|unit|tray)/i) || yieldStr.match(/\[(\d+(?:\.\d+)?)/);
        if (match) {
          initial = parseFloat(match[1]) * (yieldStr.includes('x') ? 1 : batches);
        } else {
          initial = 10 * batches;
        }
      }

      let remaining = log.remaining_portions;
      if (remaining === undefined || remaining === null) {
        remaining = initial;
      } else {
        remaining = parseFloat(remaining);
      }

      const isOverrun = remaining < 0 || !!log.unlogged_batch_flag;
      const isDepleted = remaining === 0 || log.status === 'Depleted';
      const status = isOverrun ? 'Overrun (Unlogged)' : (isDepleted ? 'Depleted' : (log.status || 'Active'));

      return {
        initial_yield: initial,
        remaining_portions: remaining,
        isOverrun,
        isDepleted,
        status
      };
    },

    // -------------------------------------------------------------
    // 1. Classification: Determine Stream 1 vs Stream 2
    // -------------------------------------------------------------
    isBatchedKitchenItem(name, recipeObj, allRecipes = []) {
      const norm = this.normalize(name);

      // Check explicit recipe type if available
      if (recipeObj) {
        if (recipeObj.recipeType === 'Sub-Recipe' || recipeObj.isSubRecipe) return true;
        if (recipeObj.batches_produced || recipeObj.yield) return true;
      }

      // Check allRecipes library
      if (Array.isArray(allRecipes)) {
        const matched = allRecipes.find(r => {
          const rNorm = this.normalize(r.title || r.name);
          return rNorm && (rNorm === norm || norm.includes(rNorm) || rNorm.includes(norm));
        });
        if (matched && (matched.recipeType === 'Sub-Recipe' || matched.isSubRecipe || matched.yield)) {
          return true;
        }
      }

      // Kitchen prep dish keywords (items prepared from batches)
      const batchedKeywords = [
        'waffle', 'cookie dough', 'brownie', 'chicken', 'mac', 'cheese', 'skillet',
        'sauce', 'crepe', 'pancake', 'dough', 'batter', 'marinade', 'crispy', 'chutney', 'sando', 'marinated'
      ];
      if (batchedKeywords.some(kw => norm.includes(kw))) {
        return true;
      }

      return false;
    },

    // -------------------------------------------------------------
    // 2. Stream 1 Matching: Find matching Direct Stock Pot in Catalog
    // -------------------------------------------------------------
    findDirectStockPot(name, catalog = []) {
      const norm = this.normalize(name);
      if (!norm || !Array.isArray(catalog)) return null;

      // Exact match
      let match = catalog.find(c => this.normalize(c.name) === norm);
      if (match) return match;

      // Cleaned match (e.g. "Coca Cola Classic Can 330ml" vs "Coca Cola Classic")
      match = catalog.find(c => {
        const cNorm = this.normalize(c.name);
        return cNorm.includes(norm) || norm.includes(cNorm);
      });
      if (match) return match;

      // Common beverage aliases
      const beverageKeywords = [
        { kw: 'coca cola', catalogMatch: 'Coca Cola Classic' },
        { kw: 'diet coke', catalogMatch: 'Coca Cola Diet' },
        { kw: 'coke zero', catalogMatch: 'Coca Cola Zero' },
        { kw: 'fanta orange', catalogMatch: 'Fanta Orange' },
        { kw: 'fanta lemon', catalogMatch: 'Fanta Lemon' },
        { kw: 'sprite', catalogMatch: 'Sprite Zero' },
        { kw: '7up tropical', catalogMatch: '7up Tropical' },
        { kw: '7up', catalogMatch: '7UP Free' },
        { kw: 'croissant', catalogMatch: 'All butter croissant' },
        { kw: 'almond flour', catalogMatch: 'Almond Flour' },
        { kw: 'ambassador', catalogMatch: 'Ambassador gelato' },
        { kw: 'mozzarella', catalogMatch: 'ASDA Grated Mozzarella 250g' },
        { kw: 'water still', catalogMatch: 'Highland Spring Still Water' },
        { kw: 'water sparkling', catalogMatch: 'Highland Spring Sparkling Water' },
        { kw: 'san pellegrino', catalogMatch: 'San Pellegrino' },
        { kw: 'tropicana', catalogMatch: 'Tropicana Orange Juice' },
        { kw: 'red bull', catalogMatch: 'Red Bull' },
        { kw: 'monster', catalogMatch: 'Monster Energy' },
        { kw: 'biscoff crumble', catalogMatch: 'Biscoff Biscuit Crumbs' }
      ];

      for (const b of beverageKeywords) {
        if (norm.includes(b.kw)) {
          const item = catalog.find(c => c.name.toLowerCase().includes(b.catalogMatch.toLowerCase()));
          if (item) return item;
        }
      }

      return null;
    },

    // -------------------------------------------------------------
    // 3. Stream 2 Matching: Find active batches by FIFO (production_date ASC)
    // -------------------------------------------------------------
    findMatchingActiveBatches(recipeName, prepId, productionLogs = []) {
      const norm = this.normalize(recipeName);
      if (!Array.isArray(productionLogs)) return { activeBatches: [], allMatchedBatches: [] };

      const candidates = productionLogs.filter(log => {
        if (!log) return false;
        // 1. Match by recipe_id or prep_id
        if (prepId && (log.recipe_id === prepId || log.prep_id === prepId)) return true;

        const logNorm = this.normalize(log.recipe_name);
        if (!logNorm) return false;

        // 2. Exact or direct substring match
        if (logNorm === norm || norm.includes(logNorm) || logNorm.includes(norm)) return true;

        // 3. Token-based word intersection
        const normWords = norm.split(' ').filter(w => w.length > 2 && w !== 'the' && w !== 'and');
        const logWords = logNorm.split(' ').filter(w => w.length > 2 && w !== 'the' && w !== 'and');
        const commonWords = normWords.filter(w => logWords.includes(w));

        if (commonWords.length >= 2) return true;
        if (commonWords.length === 1 && ['waffle', 'brownie', 'chicken', 'skillet', 'crepe', 'pancake'].includes(commonWords[0])) return true;

        return false;
      });

      // Filter active (remaining_portions > 0 or not marked depleted)
      const activeBatches = candidates.filter(log => {
        const stats = this.getBatchPortionStats(log);
        return !stats.isDepleted && stats.remaining_portions > 0;
      });

      // Sort FIFO: oldest production_date / timestamp first
      activeBatches.sort((a, b) => {
        const dateA = new Date(a.production_date || a.prep_date || a.timestamp || a.created_at || 0);
        const dateB = new Date(b.production_date || b.prep_date || b.timestamp || b.created_at || 0);
        return dateA - dateB;
      });

      return {
        activeBatches,
        allMatchedBatches: candidates
      };
    },

    // -------------------------------------------------------------
    // 4. CORE TWO-STREAM DEPLETION PROCESSOR
    // -------------------------------------------------------------
    processTwoStreamDepletion(salesEntries, options = {}) {
      const catalog = options.catalog || this.getStorageItem('CATALOG_ITEMS', []);
      const stockLevels = { ...(options.stockLevels || this.getStorageItem(STORAGE_KEYS.STOCK_LEVELS, {})) };
      const productionLogs = [...(options.productionLogs || this.getStorageItem(STORAGE_KEYS.PRODUCTION_LOGS, []))];
      const minStockLevels = options.minStockLevels || this.getStorageItem(STORAGE_KEYS.MIN_STOCK_LEVELS, {});
      const allRecipes = options.subRecipes || this.getStorageItem(STORAGE_KEYS.RECIPE_SOPS, []);

      const directDeductions = [];
      const batchDeductions = [];
      const alarmsTriggered = [];
      const unloggedWarnings = [];

      // Normalize salesEntries: can accept consolidated matrix array or flat report lines
      const itemsToProcess = [];
      if (Array.isArray(salesEntries)) {
        salesEntries.forEach(entry => {
          const name = entry.recipe_name || entry.name || entry.item_name || entry.canonical_name;
          const qty = parseFloat(entry.total_qty || entry.quantity || entry.qty_sold || entry.pos_qty || 0);
          if (name && qty > 0) {
            itemsToProcess.push({
              name: name,
              quantity: qty,
              recipe_obj: entry.recipe_obj || null,
              raw_sku: entry.sku || entry.raw_sku || null,
              entry: entry
            });
          }
        });
      }

      // Process each sold item through the Two-Stream router
      itemsToProcess.forEach(item => {
        const isBatched = this.isBatchedKitchenItem(item.name, item.recipe_obj, allRecipes);

        if (!isBatched) {
          // =========================================================
          // STREAM 1: DIRECT-SERVE STOCK (Cold Drinks, Bottled Goods, Retail)
          // =========================================================
          const matchedPot = this.findDirectStockPot(item.name, catalog);

          if (matchedPot) {
            const potId = String(matchedPot.id);
            const currentLevel = stockLevels[potId] !== undefined ? parseFloat(stockLevels[potId]) : 0;
            const newLevel = Math.max(0, parseFloat((currentLevel - item.quantity).toFixed(2)));
            stockLevels[potId] = newLevel;

            // Check alarm threshold
            const minThreshold = minStockLevels[potId] !== undefined ? parseFloat(minStockLevels[potId]) : 2.0;
            const isAlarm = newLevel <= minThreshold;

            if (isAlarm) {
              alarmsTriggered.push({
                potId,
                name: matchedPot.name,
                currentLevel,
                newLevel,
                minThreshold
              });
            }

            directDeductions.push({
              potId,
              name: matchedPot.name,
              quantityDeducted: item.quantity,
              previousLevel: currentLevel,
              newLevel,
              isAlarm
            });
          }
        } else {
          // =========================================================
          // STREAM 2: BATCHED KITCHEN PRODUCTION (Waffles, Cookie Dough, Chicken, Sauces)
          // =========================================================
          // DO NOT touch raw ingredients!
          let portionsNeeded = item.quantity;
          const { activeBatches, allMatchedBatches } = this.findMatchingActiveBatches(item.name, item.recipe_obj?.id, productionLogs);

          const batchSteps = [];

          for (const batch of activeBatches) {
            if (portionsNeeded <= 0) break;
            const stats = this.getBatchPortionStats(batch);
            if (stats.remaining_portions <= 0) continue;

            const deduct = Math.min(stats.remaining_portions, portionsNeeded);
            const newRemaining = parseFloat((stats.remaining_portions - deduct).toFixed(1));
            portionsNeeded = parseFloat((portionsNeeded - deduct).toFixed(1));

            batch.remaining_portions = newRemaining;
            batch.initial_yield_portions = stats.initial_yield;

            if (newRemaining <= 0) {
              batch.status = 'Depleted';
            }

            batchSteps.push({
              log_id: batch.log_id || batch.batch_id,
              recipe_name: batch.recipe_name,
              deducted: deduct,
              remaining_after: newRemaining,
              status: batch.status
            });
          }

          // If portions sold exceed active batches, apply negative remaining portions & warning
          if (portionsNeeded > 0) {
            const shortage = portionsNeeded;
            let targetBatch = null;

            if (allMatchedBatches.length > 0) {
              // Deduct negatively from latest batch
              targetBatch = allMatchedBatches[allMatchedBatches.length - 1];
              const stats = this.getBatchPortionStats(targetBatch);
              const negRemaining = parseFloat((stats.remaining_portions - shortage).toFixed(1));
              targetBatch.remaining_portions = negRemaining;
              targetBatch.unlogged_batch_flag = true;
              targetBatch.initial_yield_portions = stats.initial_yield;
            } else {
              // Create an unlogged overflow tracking record
              const unloggedRecord = {
                log_id: `UNLOGGED-${Date.now().toString().slice(-4)}`,
                recipe_name: item.name,
                recipe_type: 'Sub-Recipe',
                batches_produced: 1,
                yield_output: `0 Portions (Shortage)`,
                initial_yield_portions: 0,
                remaining_portions: -shortage,
                status: 'Overrun (Unlogged)',
                unlogged_batch_flag: true,
                prep_date: new Date().toISOString().split('T')[0],
                use_by_date: new Date().toISOString().split('T')[0],
                timestamp: new Date().toISOString(),
                staff_name: 'Unlogged Kitchen Prep',
                inventory_depleted: false
              };
              productionLogs.unshift(unloggedRecord);
              targetBatch = unloggedRecord;
            }

            unloggedWarnings.push({
              itemName: item.name,
              demandedPortions: item.quantity,
              shortagePortions: shortage,
              targetBatchId: targetBatch.log_id
            });

            batchSteps.push({
              log_id: targetBatch.log_id,
              recipe_name: targetBatch.recipe_name,
              deducted: shortage,
              remaining_after: targetBatch.remaining_portions,
              status: 'Overrun (Unlogged)'
            });
          }

          batchDeductions.push({
            dishName: item.name,
            totalPortionsDemanded: item.quantity,
            steps: batchSteps,
            hasShortage: portionsNeeded > 0
          });
        }
      });

      // Save state if in browser context
      this.setStorageItem(STORAGE_KEYS.STOCK_LEVELS, stockLevels);
      this.setStorageItem(STORAGE_KEYS.PRODUCTION_LOGS, productionLogs);

      const runId = `DEP-RUN-${Date.now()}`;
      const result = {
        runId,
        timestamp: new Date().toISOString(),
        updatedStockLevels: stockLevels,
        updatedProductionLogs: productionLogs,
        directDeductions,
        batchDeductions,
        alarmsTriggered,
        unloggedWarnings,
        summary: {
          directPotsUpdated: directDeductions.length,
          batchesUpdated: batchDeductions.length,
          alarmsCount: alarmsTriggered.length,
          shortagesCount: unloggedWarnings.length
        }
      };

      // Dispatch event for cross-tab real-time updates
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
        try {
          window.dispatchEvent(new CustomEvent('treat_street:depletion_processed', { detail: result }));
        } catch (e) {}
      }

      return result;
    }
  };

  return SalesDepletionController;
}));
