const fs = require('fs');

function fixFile(path) {
    if (!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf8');
    
    // Replace literal backslash-quote with just quote
    content = content.replace(/\\'selected\\'/g, "'selected'");
    content = content.replace(/\\'\\'/g, "''");
    
    // Replace literal '\n' with actual newline
    content = content.replace(/\\n                            <option/g, "\n                            <option");
    content = content.replace(/\\n                        <\/select>/g, "\n                        </select>");
    
    fs.writeFileSync(path, content);
    console.log("Fixed syntax in " + path);
}

fixFile('d:/TREAT STREET PURCHASE/SOP/SOP.html');
fixFile('d:/Saikishore Backup 2026/OneDrive/Desktop/TSPP/SOP.html');
