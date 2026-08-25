const fs = require('fs');

function extractInventoryAndMerge() {
    // 1. Read inventory from recipe_sop_manager.html
    const recipeManagerPath = 'd:/TREAT STREET PURCHASE/recipe_sop_manager.html';
    const recipeHtml = fs.readFileSync(recipeManagerPath, 'utf8');
    
    const inventoryMatch = recipeHtml.match(/inventory:\s*(\[[\s\S]*?\])/);
    if (!inventoryMatch) {
        console.log("Could not find inventory array");
        return;
    }
    
    // Evaluate the array using eval
    const inventoryStr = inventoryMatch[1];
    let newInventory = [];
    try {
        newInventory = eval(inventoryStr);
    } catch (e) {
        console.log("Failed to eval inventory:", e);
        return;
    }
    
    console.log("Found " + newInventory.length + " items in recipe_sop_manager.html inventory.");

    // 2. Read catalog.js
    const catalogPath1 = 'd:/TREAT STREET PURCHASE/SOP/catalog.js';
    const catalogPath2 = 'd:/Saikishore Backup 2026/OneDrive/Desktop/TSPP/catalog.js';
    
    let catalogScript = fs.readFileSync(catalogPath1, 'utf8');
    let tsCatalog = [];
    
    // We need to extract the existing array from window.tsCatalog = [...]
    const catalogMatch = catalogScript.match(/window\.tsCatalog\s*=\s*(\[[\s\S]*\]);/);
    if (catalogMatch) {
        tsCatalog = eval(catalogMatch[1]);
    }
    
    let addedCount = 0;
    let maxId = tsCatalog.reduce((max, item) => (typeof item.id === 'number' && item.id > max) ? item.id : max, 0);

    // 3. Merge new items
    for (const newItem of newInventory) {
        // Check if item already exists by name
        if (!tsCatalog.some(item => item.name.toLowerCase() === newItem.name.toLowerCase())) {
            maxId++;
            tsCatalog.push({
                id: maxId,
                name: newItem.name,
                category: "Buns & Breads", // Generic category for these RAW/PKG items
                size: "Unit",
                supplier: "Costco",
                price: 0.00,
                vatRate: 0
            });
            addedCount++;
        }
    }
    
    console.log("Added " + addedCount + " new items.");
    
    // 4. Write back to catalog.js
    const newCatalogFile = 'window.tsCatalog = ' + JSON.stringify(tsCatalog, null, 2) + ';';
    
    fs.writeFileSync(catalogPath1, newCatalogFile);
    fs.writeFileSync(catalogPath2, newCatalogFile);
    console.log("Updated both catalog.js files.");
}

extractInventoryAndMerge();
