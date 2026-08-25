const fs = require('fs');

function makeHyperSafe(path) {
    if (!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf8');

    // Ensure this.catalog is always an array
    if (!content.includes('if (!Array.isArray(this.catalog)) this.catalog = [];')) {
        content = content.replace(/this\.catalog = this\.catalog\.filter/g, 
            'if (!Array.isArray(this.catalog)) this.catalog = [];\n                this.catalog = this.catalog.filter');
    }
    
    // Also in init():
    content = content.replace(/this\.catalog = localCatalog \? JSON\.parse\(localCatalog\) : \(window\.tsCatalog \? window\.tsCatalog : \[\]\);/g, 
        'this.catalog = localCatalog ? JSON.parse(localCatalog) : (window.tsCatalog ? window.tsCatalog : []);\n                if (!Array.isArray(this.catalog)) this.catalog = window.tsCatalog ? window.tsCatalog : [];');

    fs.writeFileSync(path, content);
    console.log("Made safe: " + path);
}

makeHyperSafe('d:/TREAT STREET PURCHASE/recipe_sop_manager.html');
makeHyperSafe('d:/TREAT STREET PURCHASE/SOP/SOP.html');
makeHyperSafe('d:/Saikishore Backup 2026/OneDrive/Desktop/TSPP/SOP.html');
