# Treat Street - Complete Disaster Recovery & Build Guide

> **Important**: This backup contains the complete source code, database migrations, configuration, edge functions, and Git repository for the **Treat Street Purchasing & Ops Portal**. Even if you lose your computer, you can recreate and run everything on any new computer using the instructions below.

---

## 📁 What is in this Backup?

| Folder / File | What it is | Why it's Important |
| :--- | :--- | :--- |
| **`index.html`** | Treat Street Hub Dashboard | Central navigation launcher for all portal modules |
| **`purchase.html`** | Purchasing & Order Portal | Allows branches to create and dispatch purchase orders |
| **`inventory.html`** | Live Inventory Manager | Real-time stock control, supplier links, item catalog |
| **`kitchen_ops.html`** | Kitchen Ops & Audits | Daily prep, shift checklists, audit tracking, task management |
| **`analytics.html`** | Sales & Cost Analytics | Square report processing, sales vs cost breakdown, franchise charts |
| **`recipe_sop_manager.html`** | Recipe & SOP Manager | Ingredient costing, allergen tagging, recipe creation |
| **`SOP.html` & `SOP/`** | Standard Operating Procedures | Digital visual manuals and standard operating guides |
| **`analytics_engine.js`** | Core Analytics Engine | Universal report parser, variance and revenue calculations |
| **`catalog.js` & `default_orders.js`** | Product Catalog & Order Presets | Preset supplier catalogs and standard branch order templates |
| **`project/`** | Full Vite + React + TypeScript App | Production-grade web application with Supabase integration |
| **`project/.env`** | Supabase Connection Keys | **CRITICAL**: Contains the live Supabase database URL and API keys |
| **`project/supabase/migrations/`** | Complete Database Schema | All 7 SQL migration scripts to rebuild tables, seeds, and security policies from scratch |
| **`project/supabase/functions/`** | Backend Edge Functions | Cloud serverless functions (`send-purchase-order`, `webhook-proxy`) |
| **`.git/`** | Complete Git History | Complete commit log and GitHub remote link |

---

## 🚀 Scenario 1: Quick Launch (No Installation Required)

You do NOT need Node.js or any programming tools to run the core operations and dashboard:

1. Plug in your USB drive on any computer (Windows, Mac, Linux).
2. Open the `TREAT STREET HUB` folder.
3. Double-click **`START_PORTAL.bat`** (or open **`index.html`** directly in Chrome, Edge, or Firefox).
4. You can navigate between **Purchase Portal**, **Inventory**, **Kitchen Operations**, **Analytics**, and **Recipe SOP Manager**.

---

## 🛠️ Scenario 2: Running the React + TypeScript Application on a New Laptop

If you get a new laptop and want to run the full React/Vite development portal:

### Step 1: Install Node.js
1. Download and install **Node.js (LTS version)** from [nodejs.org](https://nodejs.org/).

### Step 2: Install Dependencies & Run
1. Open PowerShell, Command Prompt, or Terminal.
2. Navigate into the `project` folder:
   ```bash
   cd "E:\TREAT STREET HUB\project"
   ```
   *(Or wherever you copy the folder onto your new laptop)*
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the local development server:
   ```bash
   npm run dev
   ```
5. Open the URL shown in your terminal (usually `http://localhost:5173`) in your browser.

*(Alternatively, on Windows, you can simply double-click `SETUP_AND_RUN_REACT_APP.bat` located inside the `project` folder)*

---

## 🗄️ Scenario 3: Rebuilding the Database from Scratch (Supabase)

If the Supabase database is ever lost or you want to launch a brand new database instance:

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Go to the **SQL Editor** in your Supabase project dashboard.
3. Run the migration files located in `project/supabase/migrations/` in chronological order:
   1. `20260701121531_create_purchasing_portal_schema.sql` (Creates core portal tables & schemas)
   2. `20260701121630_seed_initial_products.sql` (Seeds initial products catalog)
   3. `20260701135236_add_supplier_email_and_order_branch.sql` (Adds supplier email routing)
   4. `20260701141907_reseed_inventory_with_supplier_email.sql` (Reseeds supplier details)
   5. `20260831141500_create_audits_and_ops_tables.sql` (Creates kitchen operations & audit tables)
   6. `20260831155000_create_item_aliases_table.sql` (Creates item alias mapping for reports)
   7. `20260831180000_create_franchise_analytics_tables.sql` (Creates franchise analytics tables)
4. Copy your new project's **Project URL** and **Anon Key** from Supabase (Settings -> API).
5. Update `project/.env` with your new credentials:
   ```env
   VITE_SUPABASE_URL=YOUR_NEW_PROJECT_URL
   VITE_SUPABASE_ANON_KEY=YOUR_NEW_ANON_KEY
   ```

---

## 🌐 Scenario 4: GitHub Repository & Cloud Backup

Your code is also linked to your GitHub repository:
- **Repository URL**: `https://github.com/SAIKISHORE3333/Treat_Street.git`
- **Main Branch**: `main`

If you ever need to clone it again on any computer:
```bash
git clone https://github.com/SAIKISHORE3333/Treat_Street.git
```
*Note: `.env` is kept private and will not be in GitHub, but it is safely saved on this USB drive in `project/.env`.*
