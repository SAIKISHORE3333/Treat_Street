# Treat Street Architecture & Data Protection Constraints

## System Overview
Treat Street Operations Suite is the mission-critical inventory, procurement, and kitchen management system for Treat Street branches (Milton Keynes Stadium and regional hubs).

## Strict Data Protection Constraints
1. **UNDER NO CIRCUMSTANCES** should any tool, prompt, agent, or script invent, generate, mock, or substitute fake inventory items, suppliers, purchase orders, or ingredients.
2. `catalog.js` and `default_orders.js` are **READ-ONLY** production assets. Any feature additions must operate on existing data schemas without replacing them with dummy arrays.
3. If data is required for testing, use **ONLY** authentic items from the existing verified catalog.

## Architectural Guardrails
- **Baseline Immutability**: All core exports (`AUTHENTIC_CATALOG`, `AUTHENTIC_ORDERS`) are deeply frozen with `Object.freeze()`.
- **Runtime Client-side Migration**: `AUTH_DATA_VERSION = "v4.0.0_authentic_locked"` forces purging of corrupted/synthetic keys and reseeding directly from clean authentic exports.
- **Separation of Concerns**: Controllers (`sales_depletion_controller.js`, `sales_engine.js`) contain pure operational logic and never store inline product or order fallbacks.
