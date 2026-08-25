const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');

const html = fs.readFileSync('d:/TREAT STREET PURCHASE/SOP/SOP.html', 'utf8');

const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", (e) => { console.error("VC ERROR:", e); });
virtualConsole.on("jsdomError", (e) => { console.error("JSDOM ERROR:", e); });
virtualConsole.sendTo(console, { omitJSDOMErrors: true });

const dom = new JSDOM(html, {
    runScripts: "dangerously",
    resources: "usable",
    virtualConsole
});

dom.window.addEventListener('error', (event) => {
    console.log("WINDOW ERROR:", event.error);
});
