---
name: graphify
description: Custom skill for maintaining and querying structural codebase dependency graph files to reduce token consumption.
---

# Codebase Graphify Skill

This workspace skill provides instructions and automation to keep a structural codebase knowledge graph up to date and use it to minimize token usage during development.

## 🛠️ Commands
To update the project's dependency graph files after making code changes:
*   **Command**: `node project/graphify.cjs`
*   **Result**: Automatically updates the structured output files in `project/graphify-out/`.

## 📂 Output Files
The graph generator creates three primary artifacts in `project/graphify-out/`:
1.  **[graph.json](file:///d:/TREAT%20STREET%20PURCHASE/project/graphify-out/graph.json)**: A structured JSON file mapping all nodes (files & database tables), sizes, lines, categories, exports, imports, and centrality indices. This is ideal for LLMs to query.
2.  **[GRAPH_REPORT.md](file:///d:/TREAT%20STREET%20PURCHASE/project/graphify-out/GRAPH_REPORT.md)**: A readable summary of codebase statistics, "God Nodes" (interconnected cornerstones), database tables, and categories.
3.  **[graph.html](file:///d:/TREAT%20STREET%20PURCHASE/project/graphify-out/graph.html)**: A premium interactive visual representation using Vis.js. It features live physics, search-by-selection, and metadata panels.

## 💡 How to Leverage Graphify for Fewer Tokens
To reduce token consumption, the agent should:
1.  **Read the Map First**: Before opening large files or searching files recursively, look at `project/graphify-out/graph.json` or `GRAPH_REPORT.md` to see which files are related to the task.
2.  **Targeted Retrieval**: Retrieve only the exact nodes (files) in the dependency chain needed to implement changes, rather than parsing full directories or grepping wide scopes.
3.  **Recognize Key Anchors**: Look up the central "God Nodes" to see if modifications require changes to global types, API clients, or React Contexts.
