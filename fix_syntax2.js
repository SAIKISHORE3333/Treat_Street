const fs = require('fs');

function fixFile(path) {
    if (!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf8');
    
    // Replace all literal \ ' with '
    content = content.replace(/\\'/g, "'");
    
    fs.writeFileSync(path, content);
    console.log("Fixed syntax in " + path);
}

fixFile('d:/TREAT STREET PURCHASE/SOP/SOP.html');
fixFile('d:/Saikishore Backup 2026/OneDrive/Desktop/TSPP/SOP.html');
