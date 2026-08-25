const fs = require('fs');
const path = require('path');

const PROJECT_DIR = __dirname;
const SRC_DIR = path.join(PROJECT_DIR, 'src');
const SUPABASE_DIR = path.join(PROJECT_DIR, 'supabase');
const OUT_DIR = path.join(PROJECT_DIR, 'graphify-out');

// Ensure output directory exists
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// File system traversal helpers
function getFilesRecursively(dir, extensions = ['.ts', '.tsx', '.js', '.jsx', '.css', '.sql']) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist' && file !== 'graphify-out') {
        results = results.concat(getFilesRecursively(fullPath, extensions));
      }
    } else {
      const ext = path.extname(fullPath).toLowerCase();
      if (extensions.includes(ext)) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

// Resolve import paths in JS/TS/CSS
function resolveImport(sourceFile, importStr) {
  if (!importStr.startsWith('.') && !importStr.startsWith('/')) {
    // External dependency
    return { type: 'external', name: importStr };
  }
  
  const sourceDir = path.dirname(sourceFile);
  let targetPath = path.resolve(sourceDir, importStr);
  
  // Try exact path
  if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
    return { type: 'internal', path: targetPath };
  }
  
  // Try extensions
  const extensions = ['.tsx', '.ts', '.jsx', '.js', '.css', '.json', '.csv'];
  for (const ext of extensions) {
    const p = targetPath + ext;
    if (fs.existsSync(p) && fs.statSync(p).isFile()) {
      return { type: 'internal', path: p };
    }
  }
  
  // Try index files
  for (const ext of extensions) {
    const p = path.join(targetPath, 'index' + ext);
    if (fs.existsSync(p) && fs.statSync(p).isFile()) {
      return { type: 'internal', path: p };
    }
  }
  
  return { type: 'unresolved', path: targetPath, raw: importStr };
}

// Categorize code based on path and contents
function determineCategory(relPath, content) {
  if (relPath.endsWith('.sql')) return 'Database Migration';
  if (relPath.includes('src/components/admin/')) return 'Admin Component';
  if (relPath.includes('src/components/')) return 'UI Component';
  if (relPath.includes('src/pages/')) return 'Page View';
  if (relPath.includes('src/context/')) return 'React Context';
  if (relPath.includes('src/lib/')) return 'Library Config';
  if (relPath.includes('src/config/')) return 'App Config';
  if (relPath.includes('src/types/')) return 'Type Definition';
  if (relPath.includes('src/data/')) return 'Data Asset';
  if (relPath.includes('src/main.tsx') || relPath.includes('src/App.tsx')) return 'App Entry';
  if (relPath.endsWith('.css')) return 'Styling';
  return 'Utility/Other';
}

// Analyze a file
function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(PROJECT_DIR, filePath).replace(/\\/g, '/');
  const sizeBytes = fs.statSync(filePath).size;
  const lines = content.split('\n');
  const lineCount = lines.length;
  
  const imports = [];
  const exports = [];
  
  if (filePath.endsWith('.sql')) {
    // Parse SQL Tables and References
    const tableRegex = /create\s+table\s+(?:if\s+not\s+exists\s+)?(?:public\.)?(\w+)/gi;
    let match;
    while ((match = tableRegex.exec(content)) !== null) {
      exports.push({ name: match[1], type: 'table' });
    }
    
    const refRegex = /references\s+(?:public\.)?(\w+)/gi;
    while ((match = refRegex.exec(content)) !== null) {
      imports.push({ type: 'table_ref', name: match[1] });
    }
  } else {
    // Parse JS/TS imports
    // Matches: import { ... } from './path'; or import './path';
    const importRegex = /(?:import|export)\s+(?:[\w*\s{},]*\s+from\s+)?['"]([^'"]+)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const resolved = resolveImport(filePath, match[1]);
      imports.push({
        raw: match[1],
        resolved: resolved.type === 'internal' ? path.relative(PROJECT_DIR, resolved.path).replace(/\\/g, '/') : null,
        type: resolved.type,
        name: resolved.type === 'external' ? resolved.name : null
      });
    }
    
    // Parse JS/TS exports
    const namedExportRegex = /export\s+(?:const|function|interface|type|class|default)\s+(\w+)/g;
    while ((match = namedExportRegex.exec(content)) !== null) {
      exports.push({ name: match[1], type: 'symbol' });
    }
  }
  
  return {
    path: relPath,
    name: path.basename(filePath),
    category: determineCategory(relPath, content),
    sizeBytes,
    lineCount,
    imports,
    exports
  };
}

// Main execution
function main() {
  console.log('🔍 Starting Graphify Codebase Analyzer...');
  
  const srcFiles = getFilesRecursively(SRC_DIR);
  const sqlFiles = getFilesRecursively(SUPABASE_DIR, ['.sql']);
  const allFiles = [...srcFiles, ...sqlFiles];
  
  console.log(`📂 Found ${srcFiles.length} source files and ${sqlFiles.length} database files.`);
  
  const nodeMap = {};
  const externalDependencies = new Set();
  
  // 1. Analyze all files
  allFiles.forEach(file => {
    try {
      const analysis = analyzeFile(file);
      nodeMap[analysis.path] = analysis;
    } catch (err) {
      console.error(`⚠️ Error analyzing ${file}:`, err.message);
    }
  });
  
  // 2. Build relationships & calculate centrality
  const nodes = [];
  const edges = [];
  
  // Initial nodes from analyzed files
  Object.keys(nodeMap).forEach(key => {
    const f = nodeMap[key];
    nodes.push({
      id: f.path,
      label: f.name,
      category: f.category,
      size: f.sizeBytes,
      lines: f.lineCount,
      exportCount: f.exports.length,
      incomingCount: 0,
      outgoingCount: 0
    });
  });
  
  // Add connections
  Object.keys(nodeMap).forEach(key => {
    const f = nodeMap[key];
    f.imports.forEach(imp => {
      if (imp.type === 'internal' && imp.resolved && nodeMap[imp.resolved]) {
        edges.push({
          from: f.path,
          to: imp.resolved,
          type: 'import'
        });
        // Update counts
        const fromNode = nodes.find(n => n.id === f.path);
        const toNode = nodes.find(n => n.id === imp.resolved);
        if (fromNode) fromNode.outgoingCount++;
        if (toNode) toNode.incomingCount++;
      } else if (imp.type === 'external' && imp.name) {
        externalDependencies.add(imp.name);
      } else if (imp.type === 'table_ref') {
        // Find migration defining this table
        let targetMigration = null;
        Object.keys(nodeMap).forEach(k => {
          if (nodeMap[k].exports.some(e => e.type === 'table' && e.name === imp.name)) {
            targetMigration = k;
          }
        });
        if (targetMigration) {
          edges.push({
            from: f.path,
            to: targetMigration,
            type: 'sql_ref',
            label: `references ${imp.name}`
          });
          const fromNode = nodes.find(n => n.id === f.path);
          const toNode = nodes.find(n => n.id === targetMigration);
          if (fromNode) fromNode.outgoingCount++;
          if (toNode) toNode.incomingCount++;
        }
      }
    });
  });
  
  // Calculate God Node Centrality score (inDegree * 1.8 + outDegree)
  nodes.forEach(node => {
    node.centrality = (node.incomingCount * 1.8) + node.outgoingCount;
  });
  
  // Sort nodes by centrality to identify key elements
  const godNodes = [...nodes].sort((a, b) => b.centrality - a.centrality).slice(0, 5);
  
  // Create metadata block
  const graphData = {
    generatedAt: new Date().toISOString(),
    project: 'Treat Street Purchase',
    metrics: {
      totalFiles: nodes.length,
      totalLines: nodes.reduce((sum, n) => sum + n.lines, 0),
      totalBytes: nodes.reduce((sum, n) => sum + n.size, 0),
      externalCount: externalDependencies.size
    },
    nodes,
    edges,
    externalDependencies: Array.from(externalDependencies).sort()
  };
  
  // Write graph.json
  fs.writeFileSync(path.join(OUT_DIR, 'graph.json'), JSON.stringify(graphData, null, 2));
  console.log('✅ Generated graphify-out/graph.json');
  
  // Write GRAPH_REPORT.md
  let report = `# Codebase Structural Knowledge Graph Report\n\n`;
  report += `*Generated: ${new Date().toLocaleString()}*\n\n`;
  report += `This report outlines the structural relationships and architecture of the **Treat Street Purchase** project.\n\n`;
  
  report += `## 📊 Project Statistics\n\n`;
  report += `| Metric | Value |\n`;
  report += `| :--- | :--- |\n`;
  report += `| **Total Code Files** | ${graphData.metrics.totalFiles} |\n`;
  report += `| **Total Lines of Code** | ${graphData.metrics.totalLines} |\n`;
  report += `| **Total Code Size** | ${(graphData.metrics.totalBytes / 1024).toFixed(2)} KB |\n`;
  report += `| **Third-Party Libraries** | ${graphData.metrics.externalCount} |\n\n`;
  
  report += `## 👑 Architectural Cornerstone Nodes (God Nodes)\n`;
  report += `These files have the highest interconnectedness (centrality) and represent critical anchors of the codebase:\n\n`;
  godNodes.forEach((n, idx) => {
    report += `${idx + 1}. **[${n.label}](file:///${path.join(PROJECT_DIR, n.id).replace(/\\/g, '/')})** (${n.category})\n`;
    report += `   - Centrality Index: \`${n.centrality.toFixed(1)}\` (Incoming: \`${n.incomingCount}\`, Outgoing: \`${n.outgoingCount}\`)\n`;
    report += `   - Size: \`${n.lines}\` lines (${(n.size / 1024).toFixed(2)} KB)\n\n`;
  });
  
  report += `## 📦 Components Map by Category\n\n`;
  const categories = [...new Set(nodes.map(n => n.category))].sort();
  categories.forEach(cat => {
    const catNodes = nodes.filter(n => n.category === cat);
    report += `### 🏷️ ${cat} (${catNodes.length} files)\n`;
    catNodes.forEach(n => {
      report += `- **[${n.label}](file:///${path.join(PROJECT_DIR, n.id).replace(/\\/g, '/')})** - \`${n.lines}\` lines | Centrality: \`${n.centrality.toFixed(1)}\`\n`;
    });
    report += `\n`;
  });
  
  report += `## 📚 Third-Party Dependencies Used\n`;
  report += graphData.externalDependencies.map(dep => `- \`${dep}\``).join('\n') + `\n\n`;
  
  report += `## 🔀 Database Relational Mappings\n`;
  const migrations = nodes.filter(n => n.category === 'Database Migration');
  if (migrations.length > 0) {
    report += `Supabase schema is created using standard PostgreSQL migrations. Key schemas defined:\n\n`;
    migrations.forEach(m => {
      const fileData = nodeMap[m.id];
      const tables = fileData.exports.filter(e => e.type === 'table').map(t => `\`${t.name}\``);
      if (tables.length > 0) {
        report += `- **[${m.label}](file:///${path.join(PROJECT_DIR, m.id).replace(/\\/g, '/')})** defines table(s): ${tables.join(', ')}\n`;
      }
    });
  }
  
  fs.writeFileSync(path.join(OUT_DIR, 'GRAPH_REPORT.md'), report);
  console.log('✅ Generated graphify-out/GRAPH_REPORT.md');
  
  // Write graph.html (Vis.js visualization)
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Treat Street Purchase - Dependency Graph</title>
  <!-- Vis.js for Network Graph -->
  <script type="text/javascript" src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      background: radial-gradient(circle at center, #0f172a 0%, #020617 100%);
      color: #f8fafc;
      font-family: 'Inter', system-ui, sans-serif;
    }
    #mynetwork {
      width: 100%;
      height: calc(100vh - 80px);
      background-color: transparent;
    }
    .glass {
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
  </style>
</head>
<body class="overflow-hidden h-screen flex flex-col">
  <!-- Header -->
  <header class="h-20 border-b border-slate-800/80 glass px-6 flex items-center justify-between shrink-0 z-10 shadow-lg">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="white" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        </svg>
      </div>
      <div>
        <h1 class="text-lg font-black tracking-tight text-white uppercase">Treat Street</h1>
        <p class="text-xs text-slate-400 font-semibold tracking-wide uppercase">Interactive Codebase Dependency Graph</p>
      </div>
    </div>
    
    <div class="flex items-center gap-6 text-sm">
      <div class="text-right hidden md:block">
        <span class="text-slate-400 text-xs">Total Files Indexed</span>
        <div class="text-amber-400 font-bold text-base">${graphData.metrics.totalFiles} nodes</div>
      </div>
      <div class="text-right hidden md:block">
        <span class="text-slate-400 text-xs">Total Code Size</span>
        <div class="text-rose-400 font-bold text-base">${(graphData.metrics.totalBytes / 1024).toFixed(1)} KB</div>
      </div>
      <button onclick="fitGraph()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700/60 rounded-xl transition-all font-semibold text-xs text-white shadow-sm flex items-center gap-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18a2.25 2.25 0 0 1-2.25 2.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>
        Recenter
      </button>
    </div>
  </header>

  <!-- Main view -->
  <div class="flex-1 flex relative overflow-hidden">
    <!-- Graph canvas -->
    <div id="mynetwork" class="flex-1"></div>

    <!-- Node info panel -->
    <div id="details-panel" class="absolute right-6 top-6 bottom-6 w-96 glass rounded-2xl p-6 z-10 shadow-2xl flex flex-col transition-all duration-300 opacity-0 pointer-events-none transform translate-x-4">
      <div class="flex items-start justify-between mb-4 pb-4 border-b border-slate-800">
        <div>
          <h2 id="node-name" class="font-bold text-white text-lg break-all">Select a node</h2>
          <span id="node-category" class="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">Category</span>
        </div>
        <button onclick="closeDetails()" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/80 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto space-y-5 pr-1">
        <div>
          <h3 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">File Path</h3>
          <p id="node-path" class="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl font-mono break-all border border-slate-800/40 select-all"></p>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="bg-slate-900/40 border border-slate-800/40 p-3 rounded-xl">
            <h4 class="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-0.5">File Size</h4>
            <p id="node-size" class="text-white text-sm font-bold">0 KB</p>
          </div>
          <div class="bg-slate-900/40 border border-slate-800/40 p-3 rounded-xl">
            <h4 class="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-0.5">Lines</h4>
            <p id="node-lines" class="text-white text-sm font-bold">0 lines</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="bg-slate-900/40 border border-slate-800/40 p-3 rounded-xl">
            <h4 class="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-0.5">Incoming Links</h4>
            <p id="node-incoming" class="text-amber-400 text-sm font-bold">0</p>
          </div>
          <div class="bg-slate-900/40 border border-slate-800/40 p-3 rounded-xl">
            <h4 class="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-0.5">Outgoing Links</h4>
            <p id="node-outgoing" class="text-emerald-400 text-sm font-bold">0</p>
          </div>
        </div>

        <div class="bg-slate-900/40 border border-slate-800/40 p-3.5 rounded-xl">
          <h4 class="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1.5">God Node Centrality Score</h4>
          <div class="flex items-center gap-3">
            <div class="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div id="node-centrality-bar" class="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full" style="width: 0%"></div>
            </div>
            <span id="node-centrality" class="text-white text-sm font-black">0</span>
          </div>
          <p class="text-[10px] text-slate-400 mt-2 font-medium">Weighted index based on incoming (1.8x) and outgoing imports.</p>
        </div>

        <div>
          <h3 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Connected Files</h3>
          <div id="node-relations" class="space-y-1.5 max-h-48 overflow-y-auto"></div>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="absolute left-6 bottom-6 glass rounded-2xl p-4 z-10 text-xs shadow-2xl flex flex-col gap-2">
      <h3 class="font-bold text-white mb-1 tracking-wider uppercase text-[10px] text-slate-400">Node Categories</h3>
      <div class="grid grid-cols-2 gap-x-4 gap-y-2">
        <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full" style="background-color: #3b82f6;"></div><span class="text-slate-300">UI Component</span></div>
        <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full" style="background-color: #f59e0b;"></div><span class="text-slate-300">Admin Component</span></div>
        <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full" style="background-color: #ef4444;"></div><span class="text-slate-300">Page View</span></div>
        <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full" style="background-color: #10b981;"></div><span class="text-slate-300">React Context</span></div>
        <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full" style="background-color: #8b5cf6;"></div><span class="text-slate-300">Database Schema</span></div>
        <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full" style="background-color: #64748b;"></div><span class="text-slate-300">App Entry/Others</span></div>
      </div>
    </div>
  </div>

  <script>
    const data = ${JSON.stringify(graphData)};
    
    // Categorization colors
    const colors = {
      'UI Component': { background: '#3b82f6', border: '#2563eb', highlight: { background: '#60a5fa', border: '#3b82f6' } },
      'Admin Component': { background: '#f59e0b', border: '#d97706', highlight: { background: '#fbbf24', border: '#f59e0b' } },
      'Page View': { background: '#ef4444', border: '#dc2626', highlight: { background: '#f87171', border: '#ef4444' } },
      'React Context': { background: '#10b981', border: '#059669', highlight: { background: '#34d399', border: '#10b981' } },
      'Database Migration': { background: '#8b5cf6', border: '#7c3aed', highlight: { background: '#a78bfa', border: '#8b5cf6' } },
      'Library Config': { background: '#ec4899', border: '#db2777', highlight: { background: '#f472b6', border: '#ec4899' } },
      'App Entry': { background: '#e2e8f0', border: '#94a3b8', highlight: { background: '#ffffff', border: '#cbd5e1' } },
      'default': { background: '#64748b', border: '#475569', highlight: { background: '#94a3b8', border: '#64748b' } }
    };
    
    const visNodes = data.nodes.map(n => {
      const col = colors[n.category] || colors['default'];
      const centralityPercent = Math.min(100, (n.centrality / 15) * 100);
      
      // Node sizing based on lines count
      const sizeVal = Math.max(12, Math.min(32, 10 + Math.sqrt(n.lines)));
      
      return {
        id: n.id,
        label: n.label,
        shape: 'dot',
        size: sizeVal,
        color: {
          background: col.background,
          border: col.border,
          highlight: col.highlight
        },
        font: { color: '#f8fafc', size: 11, face: 'Inter, system-ui' },
        borderWidth: 1.5,
        shadow: { enabled: true, color: 'rgba(0,0,0,0.5)', size: 4, x: 0, y: 2 },
        // Custom variables
        rawNode: n
      };
    });

    const visEdges = data.edges.map(e => ({
      from: e.from,
      to: e.to,
      arrows: 'to',
      color: { color: '#334155', highlight: '#f59e0b', hover: '#475569' },
      width: 1.5,
      smooth: { type: 'cubicBezier', roundness: 0.4 }
    }));

    const container = document.getElementById('mynetwork');
    const graphPayload = {
      nodes: new vis.DataSet(visNodes),
      edges: new vis.DataSet(visEdges)
    };

    const options = {
      physics: {
        forceAtlas2Based: {
          gravitationalConstant: -26,
          centralGravity: 0.005,
          springLength: 90,
          springConstant: 0.18
        },
        maxVelocity: 146,
        solver: 'forceAtlas2Based',
        timestep: 0.35,
        stabilization: { iterations: 150 }
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
        selectable: true,
        selectConnectedEdges: true
      }
    };

    const network = new vis.Network(container, graphPayload, options);
    
    // Fit network
    function fitGraph() {
      network.fit({ animation: { duration: 1000, easingFunction: 'easeInOutQuad' } });
    }

    // Detail Panel Logic
    const panel = document.getElementById('details-panel');
    
    network.on("selectNode", function (params) {
      const nodeId = params.nodes[0];
      const clickedNode = visNodes.find(n => n.id === nodeId).rawNode;
      showNodeDetails(clickedNode);
    });

    network.on("deselectNode", function (params) {
      closeDetails();
    });

    function showNodeDetails(node) {
      document.getElementById('node-name').innerText = node.label;
      const catBadge = document.getElementById('node-category');
      catBadge.innerText = node.category;
      
      // Style category badge
      const c = colors[node.category] || colors['default'];
      catBadge.style.backgroundColor = c.background;
      catBadge.style.color = '#fff';
      
      document.getElementById('node-path').innerText = node.id;
      document.getElementById('node-size').innerText = (node.size / 1024).toFixed(2) + ' KB';
      document.getElementById('node-lines').innerText = node.lines + ' lines';
      document.getElementById('node-incoming').innerText = node.incomingCount;
      document.getElementById('node-outgoing').innerText = node.outgoingCount;
      document.getElementById('node-centrality').innerText = node.centrality.toFixed(1);
      
      const centPercent = Math.min(100, (node.centrality / 12) * 100);
      document.getElementById('node-centrality-bar').style.width = centPercent + '%';
      
      // Find connected files
      const relContainer = document.getElementById('node-relations');
      relContainer.innerHTML = '';
      
      const connections = data.edges.filter(e => e.from === node.id || e.to === node.id);
      
      if (connections.length === 0) {
        relContainer.innerHTML = '<p class="text-xs text-slate-500 italic">No connected nodes</p>';
      } else {
        const uniqueConnected = new Set();
        connections.forEach(e => {
          if (e.from !== node.id) uniqueConnected.add(e.from);
          if (e.to !== node.id) uniqueConnected.add(e.to);
        });
        
        uniqueConnected.forEach(connId => {
          const connNode = data.nodes.find(n => n.id === connId);
          if (connNode) {
            const item = document.createElement('div');
            item.className = "flex items-center justify-between p-2 hover:bg-slate-800/50 rounded-lg cursor-pointer transition-colors text-xs";
            item.onclick = () => {
              network.selectNodes([connId]);
              showNodeDetails(connNode);
              network.focus(connId, { animation: { duration: 600 } });
            };
            
            const nameSpan = document.createElement('span');
            nameSpan.className = "text-slate-300 font-semibold truncate max-w-[200px]";
            nameSpan.innerText = connNode.label;
            
            const catBadge = document.createElement('span');
            catBadge.className = "text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide shrink-0";
            const col = colors[connNode.category] || colors['default'];
            catBadge.style.backgroundColor = col.background + '30';
            catBadge.style.color = col.background;
            catBadge.innerText = connNode.category.split(' ')[0];
            
            item.appendChild(nameSpan);
            item.appendChild(catBadge);
            relContainer.appendChild(item);
          }
        });
      }
      
      panel.classList.remove('opacity-0', 'pointer-events-none', 'translate-x-4');
    }

    function closeDetails() {
      panel.classList.add('opacity-0', 'pointer-events-none', 'translate-x-4');
    }
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(OUT_DIR, 'graph.html'), htmlContent);
  console.log('✅ Generated graphify-out/graph.html');
  
  console.log('🎉 Graphify successful! structural mapping complete.');
}

main();
