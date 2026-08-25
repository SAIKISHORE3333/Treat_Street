const fs = require('fs');

const calcMethod = `calculateRowCost(element) {
                const row = element.closest('tr');
                const nameInput = row.querySelector('.ing-name').value;
                const qtyInput = parseFloat(row.querySelector('.ing-qty').value);
                const unitInput = row.querySelector('.ing-unit').value;
                const notesInput = row.querySelector('.ing-notes');

                if (!nameInput || !this.catalog) return;
                
                const item = this.catalog.find(i => i.name === nameInput);
                if (!item) return;

                const price = parseFloat(item.price) || 0;
                const sizeStr = (item.size || '').toLowerCase();
                
                let totalCatalogAmt = 1;
                let isVolume = false;
                let isWeight = false;

                const match = sizeStr.match(/(\\d+)\\s*x\\s*([\\d.]+)\\s*([a-z]+)/);
                if (match) {
                    const count = parseFloat(match[1]);
                    const amount = parseFloat(match[2]);
                    const type = match[3];
                    totalCatalogAmt = count * amount;
                    if (type.includes('ltr') || type === 'l') { totalCatalogAmt *= 1000; isVolume = true; }
                    else if (type.includes('ml')) { isVolume = true; }
                    else if (type.includes('kg')) { totalCatalogAmt *= 1000; isWeight = true; }
                    else if (type.includes('g')) { isWeight = true; }
                } else {
                    const singleMatch = sizeStr.match(/([\\d.]+)\\s*([a-z]+)/);
                    if (singleMatch) {
                        const amount = parseFloat(singleMatch[1]);
                        const type = singleMatch[2];
                        totalCatalogAmt = amount;
                        if (type.includes('ltr') || type === 'l') { totalCatalogAmt *= 1000; isVolume = true; }
                        else if (type.includes('ml')) { isVolume = true; }
                        else if (type.includes('kg')) { totalCatalogAmt *= 1000; isWeight = true; }
                        else if (type.includes('g')) { isWeight = true; }
                    }
                }

                if (isNaN(qtyInput) || !unitInput || qtyInput === 0) {
                    notesInput.value = \`£\${price.toFixed(2)} / \${item.size || 'Unit'}\`;
                    return;
                }

                let recipeBaseQty = qtyInput;
                const u = unitInput.toLowerCase();
                
                if (u === 'l') recipeBaseQty = qtyInput * 1000;
                else if (u === 'tbsp') recipeBaseQty = qtyInput * 15;
                else if (u === 'tsp') recipeBaseQty = qtyInput * 5;
                else if (u === 'cups') recipeBaseQty = qtyInput * 250;
                else if (u === 'kg') recipeBaseQty = qtyInput * 1000;
                else if (u === 'oz') recipeBaseQty = qtyInput * 28.35;
                else if (u === 'lbs') recipeBaseQty = qtyInput * 453.59;
                
                let calculatedCost = 0;
                if (totalCatalogAmt > 0) {
                    calculatedCost = (price / totalCatalogAmt) * recipeBaseQty;
                }
                
                notesInput.value = \`Cost: £\${calculatedCost.toFixed(2)} (from £\${price.toFixed(2)} / \${item.size || 'Unit'})\`;
            },`;

function patchFile(filepath, appName) {
    if (!fs.existsSync(filepath)) return;
    let content = fs.readFileSync(filepath, 'utf8');

    // 1. Add calculateRowCost to the object
    if (!content.includes('calculateRowCost(element)')) {
        content = content.replace('handleIngredientSelect(input) {', calcMethod + '\\n\\n            handleIngredientSelect(input) {');
    }

    // 2. Modify handleIngredientSelect to call calculateRowCost
    if (!content.includes('this.calculateRowCost(input)')) {
        content = content.replace(/if \(!notesInput.value\)\s*\{\s*notesInput.value = `£\${parseFloat\(item.price\).toFixed\(2\)} \/ \${item.size}`;\s*\}/g, 'this.calculateRowCost(input);');
        
        // Sometimes notesInput replacement might fail if spacing is weird.
        // Let's use a simpler replace on the end of handleIngredientSelect:
        // Actually, replacing notesInput assignment is better. Let's do it robustly:
        content = content.replace(/notesInput\.value = `£\${parseFloat\(item\.price\)\.toFixed\(2\)} \/ \${item\.size}`;/g, 'this.calculateRowCost(input);');
        content = content.replace(/if \(!notesInput\.value\) \{\s*this.calculateRowCost\(input\);\s*\}/g, 'this.calculateRowCost(input);');
    }

    // 3. Add oninput to ing-qty
    const qtyRegex = /class="ing-qty(.*?)outline-none"/g;
    content = content.replace(qtyRegex, (match) => {
        if (!match.includes('oninput')) {
            return match + ` oninput="${appName}.calculateRowCost(this)"`;
        }
        return match;
    });

    // 4. Add onchange to ing-unit
    const unitRegex = /<select class="ing-unit/g;
    content = content.replace(unitRegex, (match) => {
        if (!content.includes(`onchange="${appName}.calculateRowCost`)) { // crude check, but works for file
           return match + ` onchange="${appName}.calculateRowCost(this)"`;
        }
        return match;
    });

    // 5. Replace `onchange=` if we only appended it to the select tag, we must ensure it's not duplicate.
    // Let's use a smarter regex for the select tag.
    const unitSelectRegex = /(<select class="ing-unit[^>]+?)>/g;
    content = content.replace(unitSelectRegex, (match, p1) => {
        if (!p1.includes('onchange')) {
            return p1 + ` onchange="${appName}.calculateRowCost(this)">`;
        }
        return match;
    });

    fs.writeFileSync(filepath, content);
    console.log("Patched " + filepath);
}

patchFile('d:/TREAT STREET PURCHASE/SOP/SOP.html', 'sopApp');
patchFile('d:/TREAT STREET PURCHASE/recipe_sop_manager.html', 'app');
patchFile('d:/Saikishore Backup 2026/OneDrive/Desktop/TSPP/SOP.html', 'sopApp');
