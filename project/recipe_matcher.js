/**
 * Treat Street - Recipe Matcher & Omnichannel Depletion Engine
 * Powered by ALAIYA
 * 
 * Handles:
 * 1. Multi-platform CSV Parsing (Deliveroo, Just Eat, Uber Eats, In-Store POS)
 * 2. Text Normalization
 * 3. Exact Matching & Alias Matching (item_aliases)
 * 4. Unmapped Item Queue (UNRESOLVED_RECIPE)
 * 5. Multi-File Cross-Platform Consolidation Matrix
 * 6. Automated Ingredient Stock Depletion
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.RecipeMatcher = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  const RecipeMatcher = {
    // -------------------------------------------------------------
    // 1. Text Normalization
    // -------------------------------------------------------------
    normalizeText(str) {
      if (!str || typeof str !== 'string') return '';
      return str
        .toLowerCase()
        // Replace accented/diacritic characters
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        // Remove text in parentheses/brackets e.g. "(Standard)", "[Meal Deal]"
        .replace(/\([^)]*\)/g, ' ')
        .replace(/\[[^\]]*\]/g, ' ')
        // Remove special punctuation & symbols
        .replace(/[^a-z0-9\s]/g, ' ')
        // Collapse multiple spaces & trim
        .replace(/\s+/g, ' ')
        .trim();
    },

    // -------------------------------------------------------------
    // 2. CSV Parser (Robust CSV/TSV reader)
    // -------------------------------------------------------------
    parseCSV(text) {
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
            i++; // skip escaped quote
          } else {
            inQuotes = !inQuotes;
          }
        } else if (c === ',' && !inQuotes) {
          row.push(currVal.trim());
          currVal = '';
        } else if (c === '\t' && !inQuotes) {
          row.push(currVal.trim());
          currVal = '';
        } else if (c === '\n' && !inQuotes) {
          row.push(currVal.trim());
          if (row.some(val => val !== '')) {
            lines.push(row);
          }
          row = [];
          currVal = '';
        } else {
          currVal += c;
        }
      }
      if (currVal !== '' || row.length > 0) {
        row.push(currVal.trim());
        if (row.some(val => val !== '')) {
          lines.push(row);
        }
      }
      return lines;
    },

    // -------------------------------------------------------------
    // 3. Platform Detection & Universal Multi-Platform Adapter
    // -------------------------------------------------------------
    detectPlatform(headers, filename = '') {
      const lowerHeaders = headers.map(h => (h || '').toLowerCase());
      const lowerName = (filename || '').toLowerCase();

      // Check Deliveroo
      if (
        lowerHeaders.some(h => h.includes('item gross') || h.includes('order id') && h.includes('item name')) ||
        lowerName.includes('deliveroo')
      ) {
        return 'Deliveroo';
      }

      // Check Just Eat
      if (
        lowerHeaders.some(h => h.includes('product name') || h.includes('restaurant reference') || h.includes('sub total')) ||
        lowerName.includes('just eat') || lowerName.includes('justeat')
      ) {
        return 'Just Eat';
      }

      // Check Uber Eats
      if (
        lowerHeaders.some(h => h.includes('items quantity') || h.includes('order number') && h.includes('customisations')) ||
        lowerName.includes('uber') || lowerName.includes('ubereats')
      ) {
        return 'Uber Eats';
      }

      // Check In-Store POS
      if (
        lowerHeaders.some(h => h.includes('qty sold') || h.includes('net sales') || h.includes('item description')) ||
        lowerName.includes('pos') || lowerName.includes('instore') || lowerName.includes('epos') || lowerName.includes('till')
      ) {
        return 'In-Store POS';
      }

      return 'Generic / Other';
    },

    findColumnIndices(headers, platform) {
      const lower = headers.map(h => (h || '').toLowerCase().trim());
      let nameIdx = -1;
      let qtyIdx = -1;
      let priceIdx = -1;

      // Rule-based matching by detected platform
      if (platform === 'Deliveroo') {
        nameIdx = lower.findIndex(h => h === 'item name' || h === 'item' || h.includes('item name'));
        qtyIdx = lower.findIndex(h => h === 'quantity' || h === 'qty' || h === 'count');
        priceIdx = lower.findIndex(h => h.includes('gross') || h.includes('price') || h.includes('total'));
      } else if (platform === 'Just Eat') {
        nameIdx = lower.findIndex(h => h === 'product name' || h === 'product' || h === 'item' || h.includes('product'));
        qtyIdx = lower.findIndex(h => h === 'quantity' || h === 'count' || h === 'qty');
        priceIdx = lower.findIndex(h => h.includes('price') || h.includes('amount') || h.includes('total'));
      } else if (platform === 'Uber Eats') {
        nameIdx = lower.findIndex(h => h === 'item name' || h === 'item' || h.includes('item'));
        qtyIdx = lower.findIndex(h => h === 'items quantity' || h === 'quantity' || h === 'qty');
        priceIdx = lower.findIndex(h => h.includes('price') || h.includes('sales'));
      } else if (platform === 'In-Store POS') {
        nameIdx = lower.findIndex(h => h === 'description' || h === 'product name' || h === 'item name' || h === 'product' || h === 'item');
        qtyIdx = lower.findIndex(h => h === 'qty sold' || h === 'quantity' || h === 'qty' || h === 'units sold');
        priceIdx = lower.findIndex(h => h.includes('net sales') || h.includes('sales') || h.includes('total'));
      }

      // Smart Fuzzy Fallback if not found
      if (nameIdx === -1) {
        nameIdx = lower.findIndex(h => 
          h.includes('item') || h.includes('product') || h.includes('dish') || 
          h.includes('desc') || h.includes('name') || h.includes('menu')
        );
      }
      if (qtyIdx === -1) {
        qtyIdx = lower.findIndex(h => 
          h.includes('qty') || h.includes('quantity') || h.includes('count') || 
          h.includes('sold') || h.includes('amount') || h.includes('unit')
        );
      }
      if (priceIdx === -1) {
        priceIdx = lower.findIndex(h => h.includes('price') || h.includes('cost') || h.includes('gross') || h.includes('total'));
      }

      return {
        nameIdx: nameIdx !== -1 ? nameIdx : 0,
        qtyIdx: qtyIdx !== -1 ? qtyIdx : 1,
        priceIdx: priceIdx
      };
    },

    parsePlatformCSV(csvText, filename = '', customColMap = null) {
      const parsedRows = this.parseCSV(csvText);
      if (parsedRows.length < 2) return { platform: 'Unknown', items: [], rawHeaders: [] };

      const headers = parsedRows[0];
      const platform = customColMap?.platform || this.detectPlatform(headers, filename);
      const colMap = customColMap || this.findColumnIndices(headers, platform);

      const items = [];

      for (let i = 1; i < parsedRows.length; i++) {
        const row = parsedRows[i];
        if (!row || row.length === 0) continue;

        const rawName = (row[colMap.nameIdx] || '').trim();
        if (!rawName || rawName.toLowerCase() === 'total' || rawName.toLowerCase() === 'summary') continue;

        const rawQty = row[colMap.qtyIdx];
        const parsedQty = parseFloat((rawQty || '1').toString().replace(/[^0-9.-]+/g, ''));
        const quantity = isNaN(parsedQty) || parsedQty <= 0 ? 1 : parsedQty;

        let price = 0;
        if (colMap.priceIdx !== -1 && row[colMap.priceIdx]) {
          const parsedPrice = parseFloat(row[colMap.priceIdx].toString().replace(/[^0-9.-]+/g, ''));
          price = isNaN(parsedPrice) ? 0 : parsedPrice;
        }

        items.push({
          raw_name: rawName,
          quantity: quantity,
          price: price,
          platform: platform,
          source_file: filename,
          row_index: i
        });
      }

      return {
        platform,
        headers,
        items,
        colMap
      };
    },

    // -------------------------------------------------------------
    // 4. Recipe Matching Logic (4-Step Pipeline)
    // -------------------------------------------------------------
    buildRecipeLookup(recipes) {
      const lookup = new Map();
      if (!Array.isArray(recipes)) return lookup;

      for (const recipe of recipes) {
        if (!recipe) continue;
        const title = recipe.title || recipe.name || recipe.recipe_name;
        if (!title) continue;

        const normTitle = this.normalizeText(title);
        lookup.set(normTitle, {
          canonical_name: title,
          recipe_obj: recipe
        });
      }
      return lookup;
    },

    buildAliasLookup(aliases) {
      const lookup = new Map();
      if (!Array.isArray(aliases)) return lookup;

      for (const alias of aliases) {
        if (!alias) continue;
        const ext = alias.normalized_external_name || this.normalizeText(alias.external_name);
        const target = alias.recipe_name;
        const platform = (alias.source_platform || 'ALL').toUpperCase();

        if (ext && target) {
          // Key by platform + normalized name, or global
          lookup.set(`${platform}::${ext}`, target);
          if (platform !== 'ALL' && !lookup.has(`ALL::${ext}`)) {
            lookup.set(`ALL::${ext}`, target);
          }
        }
      }
      return lookup;
    },

    matchItem(rawName, recipeLookup, aliasLookup, platform = 'ALL') {
      const normName = this.normalizeText(rawName);

      if (!normName) {
        return {
          status: 'UNRESOLVED_RECIPE',
          raw_name: rawName,
          matched_recipe_name: null,
          match_type: null,
          platform: platform
        };
      }

      // Step 2: Exact Match against standard recipe names
      if (recipeLookup.has(normName)) {
        const match = recipeLookup.get(normName);
        return {
          status: 'MATCHED',
          raw_name: rawName,
          normalized_name: normName,
          matched_recipe_name: match.canonical_name,
          recipe_obj: match.recipe_obj,
          match_type: 'EXACT',
          platform: platform
        };
      }

      // Step 3: Alias Match in item_aliases
      const platformKey = `${(platform || 'ALL').toUpperCase()}::${normName}`;
      const globalKey = `ALL::${normName}`;

      let targetRecipeName = aliasLookup.get(platformKey) || aliasLookup.get(globalKey);

      if (targetRecipeName) {
        const normTarget = this.normalizeText(targetRecipeName);
        const recipeMatch = recipeLookup.get(normTarget);

        return {
          status: 'MATCHED',
          raw_name: rawName,
          normalized_name: normName,
          matched_recipe_name: targetRecipeName,
          recipe_obj: recipeMatch ? recipeMatch.recipe_obj : null,
          match_type: 'ALIAS',
          platform: platform
        };
      }

      // Step 4: Unmapped Item Queue
      return {
        status: 'UNRESOLVED_RECIPE',
        raw_name: rawName,
        normalized_name: normName,
        matched_recipe_name: null,
        recipe_obj: null,
        match_type: null,
        platform: platform
      };
    },

    // -------------------------------------------------------------
    // 5. Omnichannel Multi-File Consolidation Matrix
    // -------------------------------------------------------------
    consolidateSalesReports(parsedFiles, recipes, aliases) {
      const recipeLookup = this.buildRecipeLookup(recipes);
      const aliasLookup = this.buildAliasLookup(aliases);

      // Structure: canonical_recipe_name -> { deliveroo, just_eat, uber_eats, pos, other, total_qty, total_rev, recipe_obj }
      const matrix = new Map();
      const unresolvedItems = new Map(); // raw_name -> { raw_name, norm_name, platforms: Set, count: number }
      
      let grandTotalUnits = 0;
      let grandTotalRevenue = 0;
      const platformCounts = {
        'Deliveroo': 0,
        'Just Eat': 0,
        'Uber Eats': 0,
        'In-Store POS': 0,
        'Other': 0
      };

      for (const fileData of parsedFiles) {
        for (const item of fileData.items) {
          const matchResult = this.matchItem(item.raw_name, recipeLookup, aliasLookup, item.platform);

          if (matchResult.status === 'MATCHED') {
            const canon = matchResult.matched_recipe_name;
            if (!matrix.has(canon)) {
              matrix.set(canon, {
                recipe_name: canon,
                recipe_obj: matchResult.recipe_obj,
                deliveroo_qty: 0,
                just_eat_qty: 0,
                uber_eats_qty: 0,
                pos_qty: 0,
                other_qty: 0,
                total_qty: 0,
                total_revenue: 0,
                match_type: matchResult.match_type
              });
            }

            const row = matrix.get(canon);
            const qty = item.quantity;
            row.total_qty += qty;
            row.total_revenue += (item.price || 0);

            if (item.platform === 'Deliveroo') {
              row.deliveroo_qty += qty;
              platformCounts['Deliveroo'] += qty;
            } else if (item.platform === 'Just Eat') {
              row.just_eat_qty += qty;
              platformCounts['Just Eat'] += qty;
            } else if (item.platform === 'Uber Eats') {
              row.uber_eats_qty += qty;
              platformCounts['Uber Eats'] += qty;
            } else if (item.platform === 'In-Store POS') {
              row.pos_qty += qty;
              platformCounts['In-Store POS'] += qty;
            } else {
              row.other_qty += qty;
              platformCounts['Other'] += qty;
            }

            grandTotalUnits += qty;
            grandTotalRevenue += (item.price || 0);
          } else {
            // Unresolved
            const key = matchResult.normalized_name || this.normalizeText(item.raw_name);
            if (!unresolvedItems.has(key)) {
              unresolvedItems.set(key, {
                raw_name: item.raw_name,
                normalized_name: key,
                platform: item.platform,
                count: 0,
                source_files: new Set()
              });
            }
            const unres = unresolvedItems.get(key);
            unres.count += item.quantity;
            if (item.source_file) unres.source_files.add(item.source_file);
          }
        }
      }

      // Convert matrix to sorted array (highest volume first)
      const matrixRows = Array.from(matrix.values()).sort((a, b) => b.total_qty - a.total_qty);
      const unresolvedRows = Array.from(unresolvedItems.values()).map(u => ({
        ...u,
        source_files: Array.from(u.source_files)
      }));

      return {
        matrix: matrixRows,
        unresolved: unresolvedRows,
        grandTotalUnits,
        grandTotalRevenue,
        platformCounts,
        resolvedCount: matrixRows.length,
        unresolvedCount: unresolvedRows.length
      };
    },

    // -------------------------------------------------------------
    // 6. Automated Ingredient Stock Depletion Calculator
    // -------------------------------------------------------------
    calculateDepletion(consolidatedMatrix, catalog) {
      // Returns a map of ingredient_id/name -> total quantity to deduct
      const depletionMap = new Map();

      for (const row of consolidatedMatrix) {
        const recipe = row.recipe_obj;
        const totalSold = row.total_qty;

        if (!recipe || !Array.isArray(recipe.ingredients) || totalSold <= 0) continue;

        // Account for recipe yield (default 1 if not specified)
        const yieldVal = parseFloat(recipe.yield || '1') || 1;
        const multiplier = totalSold / yieldVal;

        for (const ing of recipe.ingredients) {
          if (!ing || !ing.name) continue;
          const ingName = ing.name.trim();
          const ingQty = (parseFloat(ing.quantity) || 0) * multiplier;
          const ingUnit = (ing.unit || 'unit').toLowerCase();

          if (ingQty <= 0) continue;

          if (!depletionMap.has(ingName)) {
            depletionMap.set(ingName, {
              ingredient_name: ingName,
              quantity: 0,
              unit: ingUnit,
              estimated_cost: 0
            });
          }

          const record = depletionMap.get(ingName);
          record.quantity += ingQty;
        }
      }

      return Array.from(depletionMap.values());
    },

    // -------------------------------------------------------------
    // 7. Save Alias Mapping (Supabase + LocalStorage)
    // -------------------------------------------------------------
    async saveAliasMapping(supabaseClient, externalName, recipeName, platform = 'ALL') {
      const normExt = this.normalizeText(externalName);
      const aliasRecord = {
        external_name: externalName,
        normalized_external_name: normExt,
        recipe_name: recipeName,
        source_platform: platform.toUpperCase(),
        created_at: new Date().toISOString()
      };

      // Save locally
      try {
        const localAliases = JSON.parse(localStorage.getItem('ts_item_aliases') || '[]');
        const existingIdx = localAliases.findIndex(
          a => a.normalized_external_name === normExt && (a.source_platform || 'ALL') === aliasRecord.source_platform
        );
        if (existingIdx >= 0) {
          localAliases[existingIdx] = aliasRecord;
        } else {
          localAliases.push(aliasRecord);
        }
        localStorage.setItem('ts_item_aliases', JSON.stringify(localAliases));
      } catch (err) {
        console.warn("Local alias save error:", err);
      }

      // Save to Supabase
      if (supabaseClient) {
        try {
          const { error } = await supabaseClient
            .from('item_aliases')
            .upsert([aliasRecord], { onConflict: 'normalized_external_name,source_platform' });
          if (error) throw error;
        } catch (e) {
          console.warn("Supabase alias upsert warning:", e);
        }
      }

      return aliasRecord;
    },

    async loadAliases(supabaseClient) {
      let aliases = [];
      if (supabaseClient) {
        try {
          const { data, error } = await supabaseClient.from('item_aliases').select('*');
          if (!error && Array.isArray(data)) {
            aliases = data;
            localStorage.setItem('ts_item_aliases', JSON.stringify(data));
            return aliases;
          }
        } catch (e) {
          console.warn("Supabase alias load fallback to localStorage:", e);
        }
      }
      try {
        const local = localStorage.getItem('ts_item_aliases');
        if (local) aliases = JSON.parse(local);
      } catch (e) {}
      return aliases;
    }
  };

  return RecipeMatcher;
}));
