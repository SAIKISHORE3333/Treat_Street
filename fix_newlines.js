const fs = require('fs');

function fixFile(path) {
    if (!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf8');
    
    // Fix the broken step.desc.replace regex
    // The broken text is literally:
    // replace(/\
    // /g, '<br>')
    content = content.replace(/step\.desc\.replace\(\/\\\n\/g, '<br>'\)/g, "step.desc.replace(/\\\\n/g, '<br>')");
    
    // Fix the broken costing string
    // costing: 'Target Cost: 18%\
    // Ensure tomatoes are fully crushed.'
    content = content.replace(/costing: 'Target Cost: 18%\\\nEnsure tomatoes are fully crushed\.'/g, "costing: 'Target Cost: 18%\\\\nEnsure tomatoes are fully crushed.'");

    fs.writeFileSync(path, content);
    console.log("Fixed " + path);
}

fixFile('d:/TREAT STREET PURCHASE/recipe_sop_manager.html');
fixFile('d:/TREAT STREET PURCHASE/SOP/SOP.html');
fixFile('d:/Saikishore Backup 2026/OneDrive/Desktop/TSPP/SOP.html');
