const fs = require('fs');

function fixFile(path) {
    if (!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf8');
    
    // Fix literal '\\n' injected by my patch script
    content = content.replace(/this\.saveData\(\);\\n                    this\.updateCatalogWithSubRecipes\(\);/g, 'this.saveData();\n                    this.updateCatalogWithSubRecipes();');
    
    content = content.replace(/await this\.saveData\(\);\\n                    this\.updateCatalogWithSubRecipes\(\);/g, 'await this.saveData();\n                    this.updateCatalogWithSubRecipes();');
    
    content = content.replace(/this\.loadData\(\);\\n                this\.updateCatalogWithSubRecipes\(\);/g, 'this.loadData();\n                this.updateCatalogWithSubRecipes();');

    content = content.replace(/await this\.loadData\(\);\\n                this\.updateCatalogWithSubRecipes\(\);/g, 'await this.loadData();\n                this.updateCatalogWithSubRecipes();');

    content = content.replace(/updateCatalogWithSubRecipes\(\) \{([\s\S]*?)\}\\n\\n            init\(\) \{/g, 'updateCatalogWithSubRecipes() {$1}\n\n            init() {');

    fs.writeFileSync(path, content);
    console.log("Fixed " + path);
}

fixFile('d:/TREAT STREET PURCHASE/recipe_sop_manager.html');
fixFile('d:/TREAT STREET PURCHASE/SOP/SOP.html');
fixFile('d:/Saikishore Backup 2026/OneDrive/Desktop/TSPP/SOP.html');
