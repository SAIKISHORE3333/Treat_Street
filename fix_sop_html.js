const fs = require('fs');
const path = 'd:/TREAT STREET PURCHASE/SOP/SOP.html';
let content = fs.readFileSync(path, 'utf8');

let changed = false;

// 1. Fix init() and add catalog building
const initTarget = `init() {
                this.loadData();`;
            
const initReplacement = `catalog: [],
            
            init() {
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

                this.loadData();`;

if (content.includes(initTarget) && !content.includes('this.catalog = localCatalog')) {
    content = content.replace(initTarget, initReplacement);
    changed = true;
}

// 2. Update saveRecipe/saveData if necessary. Wait, in SOP.html, saveRecipe(event) handles form submit and constructs the recipe object.
// Let's check where it constructs the recipe.
const saveRecipeYieldTarget = `yield: document.getElementById('recipeYield').value,`;
const saveRecipeYieldReplacement = `yield: document.getElementById('recipeYieldNum') ? (document.getElementById('recipeYieldNum').value + ' ' + document.getElementById('recipeYieldUnit').value).trim() : document.getElementById('recipeYield').value,`;
if (content.includes(saveRecipeYieldTarget)) {
    content = content.replace(saveRecipeYieldTarget, saveRecipeYieldReplacement);
    changed = true;
}

// 3. Update populateForm for yield parsing
const populateYieldTarget = `document.getElementById('recipeYield').value = recipe.yield;`;
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
    console.log("SOP.html fixed");
    // Also copy to backup
    const bkpPath = 'd:/Saikishore Backup 2026/OneDrive/Desktop/TSPP/SOP.html';
    if (fs.existsSync(bkpPath)) {
        fs.writeFileSync(bkpPath, content);
    }
} else {
    console.log("No fixes applied. Target strings not found.");
}
