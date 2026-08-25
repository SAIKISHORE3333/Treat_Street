const fs = require('fs');
const path = 'd:/TREAT STREET PURCHASE/recipe_sop_manager.html';
let content = fs.readFileSync(path, 'utf8');

let changed = false;

// 1. Add catalog.js
if (!content.includes('catalog.js')) {
    content = content.replace(/<script>/, '<script src="SOP/catalog.js"></script>\n    <script>');
    changed = true;
}

// 2. Yield/Portion Dropdown HTML
const yieldTargetHTML = `<div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">Yield/Portion</label>
                                <input type="text" id="recipeYield" placeholder="e.g., 4 portions" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">
                            </div>`;
                            
const yieldReplacementHTML = `<div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">Yield/Portion</label>
                                <div class="flex gap-2">
                                    <input type="number" id="recipeYieldNum" placeholder="4" class="w-1/2 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">
                                    <select id="recipeYieldUnit" class="w-1/2 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white">
                                        <option value="portions">Portions</option>
                                        <option value="unit">Units</option>
                                        <option value="tbsp">Tbsp</option>
                                        <option value="tsp">Tsp</option>
                                        <option value="ml">ml</option>
                                        <option value="L">L</option>
                                        <option value="g">g</option>
                                        <option value="kg">kg</option>
                                        <option value="oz">oz</option>
                                        <option value="lbs">lbs</option>
                                        <option value="cups">Cups</option>
                                    </select>
                                </div>
                                <input type="hidden" id="recipeYield">
                            </div>`;
                            
if (content.includes(yieldTargetHTML)) {
    content = content.replace(yieldTargetHTML, yieldReplacementHTML);
    changed = true;
}

// 3. Add catalog load & datalist logic to init()
const initTarget = `async init() {
                // Initialize Supabase`;
            
const initReplacement = `catalog: [],
            
            async init() {
                // Load Catalog
                const localCatalog = localStorage.getItem('ts_shared_catalog');
                this.catalog = localCatalog ? JSON.parse(localCatalog) : (window.tsCatalog ? window.tsCatalog : []);
                
                // Build Datalist
                let datalist = document.getElementById('ingredient-catalog-list');
                if (!datalist) {
                    datalist = document.createElement('datalist');
                    datalist.id = 'ingredient-catalog-list';
                    document.body.appendChild(datalist);
                }
                datalist.innerHTML = this.catalog.map(i => \`<option value="\${i.name.replace(/"/g, '&quot;')}">\`).join('');

                // Initialize Supabase`;

if (content.includes(initTarget)) {
    content = content.replace(initTarget, initReplacement);
    changed = true;
}

// 4. Update addIngredientRow to use list & oninput, and change unit to select
const ingNameTarget = `placeholder="Ingredient name..." class="ing-name w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-primary focus:border-primary outline-none"`;
const ingNameReplacement = `placeholder="Search catalog or type custom..." list="ingredient-catalog-list" oninput="app.handleIngredientSelect(this)" class="ing-name w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-primary focus:border-primary outline-none"`;
if (content.includes(ingNameTarget)) {
    content = content.replace(new RegExp(ingNameTarget.replace(/[.*+?^$\\{}()|[\\]\\\\]/g, '\\\\$&'), 'g'), ingNameReplacement);
    changed = true;
}

const ingUnitTarget = `<input type="text" value="\${data.unit}" placeholder="g, ml, pcs" class="ing-unit w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-primary focus:border-primary outline-none">`;
const ingUnitReplacement = `<select class="ing-unit w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-primary focus:border-primary outline-none bg-white">
                            <option value="" \${!data.unit ? 'selected' : ''}>Select Unit</option>
                            <option value="unit" \${data.unit === 'unit' ? 'selected' : ''}>Units</option>
                            <option value="tbsp" \${data.unit === 'tbsp' ? 'selected' : ''}>Tbsp</option>
                            <option value="tsp" \${data.unit === 'tsp' ? 'selected' : ''}>Tsp</option>
                            <option value="ml" \${data.unit === 'ml' ? 'selected' : ''}>ml</option>
                            <option value="L" \${data.unit === 'L' ? 'selected' : ''}>L</option>
                            <option value="g" \${data.unit === 'g' ? 'selected' : ''}>g</option>
                            <option value="kg" \${data.unit === 'kg' ? 'selected' : ''}>kg</option>
                            <option value="oz" \${data.unit === 'oz' ? 'selected' : ''}>oz</option>
                            <option value="lbs" \${data.unit === 'lbs' ? 'selected' : ''}>lbs</option>
                            <option value="cups" \${data.unit === 'cups' ? 'selected' : ''}>Cups</option>
                        </select>`;
if (content.includes(ingUnitTarget)) {
    content = content.replace(new RegExp(ingUnitTarget.replace(/[.*+?^$\\{}()|[\\]\\\\]/g, '\\\\$&'), 'g'), ingUnitReplacement);
    changed = true;
}

// 5. Add handleIngredientSelect function
const handleIngTarget = `async loadData() {`;
const handleIngReplacement = `handleIngredientSelect(input) {
                const val = input.value;
                const item = this.catalog.find(i => i.name === val);
                if (item) {
                    const row = input.closest('tr');
                    const notesInput = row.querySelector('.ing-notes');
                    const unitInput = row.querySelector('.ing-unit');
                    
                    let inferredUnit = 'unit';
                    const sizeStr = (item.size || '').toLowerCase();
                    if (sizeStr.includes('g') || sizeStr.includes('kg')) inferredUnit = 'g';
                    if (sizeStr.includes('ml') || sizeStr.includes('ltr') || sizeStr.includes('l')) inferredUnit = 'ml';
                    
                    if (!unitInput.value || unitInput.value === 'unit' || unitInput.value === '') {
                        const exists = Array.from(unitInput.options).some(o => o.value === inferredUnit);
                        if (exists) unitInput.value = inferredUnit;
                    }

                    if (!notesInput.value) {
                        notesInput.value = \`£\${parseFloat(item.price).toFixed(2)} / \${item.size}\`;
                    }
                }
            },
            
            async loadData() {`;

if (content.includes(handleIngTarget) && !content.includes('handleIngredientSelect(input) {')) {
    content = content.replace(handleIngTarget, handleIngReplacement);
    changed = true;
}

// 6. Update saveRecipe for yield
const saveRecipeYieldTarget = `yield: document.getElementById('recipeYield').value,`;
const saveRecipeYieldReplacement = `yield: document.getElementById('recipeYieldNum') ? (document.getElementById('recipeYieldNum').value + ' ' + document.getElementById('recipeYieldUnit').value).trim() : document.getElementById('recipeYield').value,`;
if (content.includes(saveRecipeYieldTarget)) {
    content = content.replace(saveRecipeYieldTarget, saveRecipeYieldReplacement);
    changed = true;
}

// 7. Update populateForm for yield
const populateYieldTarget = `document.getElementById('recipeYield').value = recipe.yield || '';`;
const populateYieldReplacement = `if (document.getElementById('recipeYieldNum')) {
                    const y = recipe.yield || '';
                    const parts = y.split(' ');
                    if (parts.length > 1 && !isNaN(parts[0])) {
                        document.getElementById('recipeYieldNum').value = parts[0];
                        document.getElementById('recipeYieldUnit').value = parts.slice(1).join(' ');
                    } else {
                        document.getElementById('recipeYieldNum').value = y;
                    }
                } else {
                    document.getElementById('recipeYield').value = recipe.yield || '';
                }`;
if (content.includes(populateYieldTarget)) {
    content = content.replace(populateYieldTarget, populateYieldReplacement);
    changed = true;
}


if (changed) {
    fs.writeFileSync(path, content);
    console.log("recipe_sop_manager.html fully patched");
} else {
    console.log("No patches were applied. Content may not match exactly.");
}
