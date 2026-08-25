const fs = require('fs');

function fixFile(filename) {
    if (!fs.existsSync(filename)) return;
    let content = fs.readFileSync(filename, 'utf8');
    
    // Split and join to avoid any regex escaping confusion
    content = content.split('\\`').join('`');
    content = content.split('\\${').join('${');
    
    fs.writeFileSync(filename, content, 'utf8');
    console.log("Fixed " + filename);
}

fixFile('recipe_sop_manager.html');
fixFile('SOP/SOP.html');
