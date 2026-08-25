const fs = require('fs');

const subRecipeMethod = `updateCatalogWithSubRecipes() {
                // Remove existing sub-recipes from catalog to prevent duplicates
                this.catalog = this.catalog.filter(item => item.category !== 'Sub-Recipe');
                
                let maxId = this.catalog.reduce((max, item) => (typeof item.id === 'number' && item.id > max) ? item.id : max, 0);

                if (this.recipes && Array.isArray(this.recipes)) {
                    for (const recipe of this.recipes) {
                        let totalCost = 0;
                        if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
                            for (const ing of recipe.ingredients) {
                                if (ing.notes) {
                                    const match = ing.notes.match(/Cost: £([\\d.]+)/);
                                    if (match) {
                                        totalCost += parseFloat(match[1]);
                                    }
                                }
                            }
                        }
                        
                        if (totalCost > 0 || (recipe.title && recipe.yield)) {
                            maxId++;
                            this.catalog.push({
                                id: maxId,
                                name: recipe.title || 'Untitled Recipe',
                                category: 'Sub-Recipe',
                                size: recipe.yield || 'Unit',
                                supplier: 'Internal',
                                price: parseFloat(totalCost.toFixed(2)),
                                vatRate: 0
                            });
                        }
                    }
                }
                
                // Rebuild Datalist
                let datalist = document.getElementById('ingredient-catalog-list');
                if (datalist && this.catalog) {
                    datalist.innerHTML = this.catalog.map(i => \`<option value="\${i.name.replace(/"/g, '&quot;')}">\`).join('');
                }
            },`;

function patchFile(filepath) {
    if (!fs.existsSync(filepath)) return;
    let content = fs.readFileSync(filepath, 'utf8');

    // 1. Add the method
    if (!content.includes('updateCatalogWithSubRecipes() {')) {
        content = content.replace('init() {', subRecipeMethod + '\\n\\n            init() {');
    }

    // 2. Call it in init()
    if (!content.includes('this.updateCatalogWithSubRecipes();')) {
        // Place it after loadData()
        content = content.replace(/this\.loadData\(\);/g, 'this.loadData();\\n                this.updateCatalogWithSubRecipes();');
        // If it's recipe_sop_manager with await loadData()
        content = content.replace(/await this\.loadData\(\);/g, 'await this.loadData();\\n                this.updateCatalogWithSubRecipes();');
    }

    // 3. Call it in saveRecipe()
    // It's usually after dashboardView or saveData. Let's find "this.showDashboard()" inside saveRecipe and prepend it.
    // But `showDashboard` is called in multiple places. Let's just find `this.saveData();` and append it there.
    const saveRegex = /(this\.saveData\(\);)/g;
    const saveRegexAwait = /(await this\.saveData\(\);)/g;
    
    // Only replace if not already replaced
    if (!content.includes('this.saveData();\\n                    this.updateCatalogWithSubRecipes();') &&
        !content.includes('await this.saveData();\\n                    this.updateCatalogWithSubRecipes();')) {
        
        content = content.replace(saveRegex, '$1\\n                    this.updateCatalogWithSubRecipes();');
        content = content.replace(saveRegexAwait, '$1\\n                    this.updateCatalogWithSubRecipes();');
    }
    
    // There's a bug in replace logic if saveData is called inside init().
    // We already handled init() by placing it after loadData.

    fs.writeFileSync(filepath, content);
    console.log("Patched " + filepath);
}

patchFile('d:/TREAT STREET PURCHASE/SOP/SOP.html');
patchFile('d:/TREAT STREET PURCHASE/recipe_sop_manager.html');
patchFile('d:/Saikishore Backup 2026/OneDrive/Desktop/TSPP/SOP.html');
