const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('recipe_sop_manager.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
const window = dom.window;

window.addEventListener('error', (event) => {
    console.error("JSDOM Error:", event.error);
});

dom.window.document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log("DOM loaded. Finding New Recipe button...");
        const buttons = window.document.querySelectorAll('button');
        const newBtn = Array.from(buttons).find(b => b.textContent.includes('New Recipe'));
        if (newBtn) {
            console.log("Clicking New Recipe button...");
            newBtn.click();
            console.log("Form hidden?", window.document.getElementById('formView').classList.contains('hidden'));
            
            console.log("Clicking Add Row in Ingredients...");
            const addIngBtn = window.document.querySelector('button[onclick="app.addIngredientRow()"]');
            addIngBtn.click();
            console.log("Rows count:", window.document.querySelectorAll('.ing-row').length);
        } else {
            console.log("Could not find button");
        }
    } catch(e) {
        console.error("Click error:", e);
    }
});
