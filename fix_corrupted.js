const fs = require('fs');

function fixFile(path) {
    if (!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf8');

    // 1. Remove ALL calls to updateCatalogWithSubRecipes (we will re-add them)
    content = content.replace(/this\.updateCatalogWithSubRecipes\(\);\n?/g, '');
    content = content.replace(/this\.updateCatalogWithSubRecipes\(\);/g, '');

    // 2. Fix the async issue
    content = content.replace(/async updateCatalogWithSubRecipes\(\) \{/g, 'updateCatalogWithSubRecipes() {');
    
    // If it's recipe_sop_manager, make sure init() is async
    if (path.includes('recipe_sop_manager.html')) {
        content = content.replace(/\n\s*init\(\) \{/g, '\n            async init() {');
        // Re-add after loadData
        content = content.replace(/await this\.loadData\(\);/g, 'await this.loadData();\n                this.updateCatalogWithSubRecipes();');
        // Re-add after saveData
        content = content.replace(/await this\.saveData\(\);/g, 'await this.saveData();\n                    this.updateCatalogWithSubRecipes();');
    } else {
        // For SOP.html
        // Re-add after loadData
        content = content.replace(/this\.loadData\(\);/g, 'this.loadData();\n                this.updateCatalogWithSubRecipes();');
        // Re-add after saveData
        content = content.replace(/this\.saveData\(\);/g, 'this.saveData();\n                    this.updateCatalogWithSubRecipes();');
    }

    fs.writeFileSync(path, content);
    console.log("Fixed thoroughly " + path);
}

fixFile('d:/TREAT STREET PURCHASE/recipe_sop_manager.html');
fixFile('d:/TREAT STREET PURCHASE/SOP/SOP.html');
fixFile('d:/Saikishore Backup 2026/OneDrive/Desktop/TSPP/SOP.html');
