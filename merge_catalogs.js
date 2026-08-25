const fs = require('fs');

async function mergeCatalogs() {
    const SUPABASE_URL = 'https://sdlrwosjebiiztclsydu.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkbHJ3b3NqZWJpaXp0Y2xzeWR1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDY0MjM3NiwiZXhwIjoyMTAwMjE4Mzc2fQ.sUlZDNoqXaTvY22gWWAkNlYVDhCbYwK2xfu--rdGQv8';
    
    // 1. Fetch Supabase catalog
    const r = await fetch(SUPABASE_URL + '/rest/v1/catalog?limit=1000', { 
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY } 
    });
    const supabaseData = await r.json();
    console.log('Fetched ' + supabaseData.length + ' items from Supabase.');

    // 2. Load current catalog (320 items)
    const catalogPath1 = 'd:/TREAT STREET PURCHASE/SOP/catalog.js';
    const catalogPath2 = 'd:/Saikishore Backup 2026/OneDrive/Desktop/TSPP/catalog.js';
    
    let catalogScript = fs.readFileSync(catalogPath1, 'utf8');
    let tsCatalog = [];
    const catalogMatch = catalogScript.match(/window\.tsCatalog\s*=\s*(\[[\s\S]*\]);/);
    if (catalogMatch) {
        tsCatalog = eval(catalogMatch[1]);
    }
    
    console.log('Loaded ' + tsCatalog.length + ' items from local catalog.');

    // 3. Merge Supabase data into tsCatalog
    let maxId = tsCatalog.reduce((max, item) => (typeof item.id === 'number' && item.id > max) ? item.id : max, 0);
    let updatedCount = 0;
    let addedCount = 0;

    for (const sItem of supabaseData) {
        // Try to find exact match by name
        let match = tsCatalog.find(item => item.name.toLowerCase() === sItem.name.toLowerCase());
        
        // Manual aliasing for Costco buns
        if (!match && sItem.name === 'SP BRIOCHE BUNS') {
            match = tsCatalog.find(item => item.name === 'St Pierre Brioche buns');
        }

        if (match) {
            // Update fields if Supabase has better data
            if (sItem.price > 0) match.price = sItem.price;
            if (sItem.size && sItem.size !== 'Unit') match.size = sItem.size;
            if (sItem.category) match.category = sItem.category;
            if (sItem.supplier) match.supplier = sItem.supplier;
            updatedCount++;
        } else {
            // Add new item
            maxId++;
            tsCatalog.push({
                id: maxId,
                name: sItem.name,
                category: sItem.category || 'Other',
                size: sItem.size || 'Unit',
                supplier: sItem.supplier || 'Unknown',
                price: sItem.price || 0,
                vatRate: sItem.vatRate || 0
            });
            addedCount++;
        }
    }
    
    // Also, fix Trial_csv items that might be missing prices but have sizes
    const trialTxt = fs.readFileSync('d:/Saikishore Backup 2026/OneDrive/Desktop/TSPP/Trial_csv.txt', 'utf8');
    const trialLines = trialTxt.split('\\n');
    for (const line of trialLines) {
        const parts = line.split(',');
        if (parts.length >= 4) {
            const name = parts[0].replace(/"/g, '').trim();
            const cat = parts[1].replace(/"/g, '').trim();
            const size = parts[2].replace(/"/g, '').trim();
            const supplier = parts[3].replace(/"/g, '').trim();
            
            let match = tsCatalog.find(item => item.name.toLowerCase() === name.toLowerCase());
            if (match) {
                if (match.size === 'Unit' && size) match.size = size;
            }
        }
    }

    console.log("Updated " + updatedCount + " items.");
    console.log("Added " + addedCount + " items.");
    console.log("Total items now: " + tsCatalog.length);

    // 4. Save
    const newCatalogFile = 'window.tsCatalog = ' + JSON.stringify(tsCatalog, null, 2) + ';';
    fs.writeFileSync(catalogPath1, newCatalogFile);
    fs.writeFileSync(catalogPath2, newCatalogFile);
}

mergeCatalogs();
