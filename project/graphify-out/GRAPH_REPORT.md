# Codebase Structural Knowledge Graph Report

*Generated: 02/07/2026, 14:25:04*

This report outlines the structural relationships and architecture of the **Treat Street Purchase** project.

## 📊 Project Statistics

| Metric | Value |
| :--- | :--- |
| **Total Code Files** | 21 |
| **Total Lines of Code** | 2192 |
| **Total Code Size** | 103.34 KB |
| **Third-Party Libraries** | 4 |

## 👑 Architectural Cornerstone Nodes (God Nodes)
These files have the highest interconnectedness (centrality) and represent critical anchors of the codebase:

1. **[CartContext.tsx](file:///D:/TREAT STREET PURCHASE/project/src/context/CartContext.tsx)** (React Context)
   - Centrality Index: `10.0` (Incoming: `5`, Outgoing: `1`)
   - Size: `116` lines (3.63 KB)

2. **[index.ts](file:///D:/TREAT STREET PURCHASE/project/src/types/index.ts)** (Type Definition)
   - Centrality Index: `9.0` (Incoming: `5`, Outgoing: `0`)
   - Size: `51` lines (0.96 KB)

3. **[20260701121531_create_purchasing_portal_schema.sql](file:///D:/TREAT STREET PURCHASE/project/supabase/migrations/20260701121531_create_purchasing_portal_schema.sql)** (Database Migration)
   - Centrality Index: `8.4` (Incoming: `3`, Outgoing: `3`)
   - Size: `163` lines (7.37 KB)

4. **[App.tsx](file:///D:/TREAT STREET PURCHASE/project/src/App.tsx)** (App Entry)
   - Centrality Index: `7.8` (Incoming: `1`, Outgoing: `6`)
   - Size: `51` lines (1.38 KB)

5. **[supabase.ts](file:///D:/TREAT STREET PURCHASE/project/src/lib/supabase.ts)** (Library Config)
   - Centrality Index: `7.2` (Incoming: `4`, Outgoing: `0`)
   - Size: `7` lines (0.26 KB)

## 📦 Components Map by Category

### 🏷️ Admin Component (3 files)
- **[AdminLogin.tsx](file:///D:/TREAT STREET PURCHASE/project/src/components/admin/AdminLogin.tsx)** - `116` lines | Centrality: `2.8`
- **[InventoryManager.tsx](file:///D:/TREAT STREET PURCHASE/project/src/components/admin/InventoryManager.tsx)** - `421` lines | Centrality: `3.8`
- **[OrderLog.tsx](file:///D:/TREAT STREET PURCHASE/project/src/components/admin/OrderLog.tsx)** - `284` lines | Centrality: `3.8`

### 🏷️ App Config (1 files)
- **[admin.ts](file:///D:/TREAT STREET PURCHASE/project/src/config/admin.ts)** - `3` lines | Centrality: `3.6`

### 🏷️ App Entry (2 files)
- **[App.tsx](file:///D:/TREAT STREET PURCHASE/project/src/App.tsx)** - `51` lines | Centrality: `7.8`
- **[main.tsx](file:///D:/TREAT STREET PURCHASE/project/src/main.tsx)** - `11` lines | Centrality: `2.0`

### 🏷️ Database Migration (4 files)
- **[20260701121531_create_purchasing_portal_schema.sql](file:///D:/TREAT STREET PURCHASE/project/supabase/migrations/20260701121531_create_purchasing_portal_schema.sql)** - `163` lines | Centrality: `8.4`
- **[20260701121630_seed_initial_products.sql](file:///D:/TREAT STREET PURCHASE/project/supabase/migrations/20260701121630_seed_initial_products.sql)** - `105` lines | Centrality: `0.0`
- **[20260701135236_add_supplier_email_and_order_branch.sql](file:///D:/TREAT STREET PURCHASE/project/supabase/migrations/20260701135236_add_supplier_email_and_order_branch.sql)** - `22` lines | Centrality: `0.0`
- **[20260701141907_reseed_inventory_with_supplier_email.sql](file:///D:/TREAT STREET PURCHASE/project/supabase/migrations/20260701141907_reseed_inventory_with_supplier_email.sql)** - `114` lines | Centrality: `0.0`

### 🏷️ Library Config (1 files)
- **[supabase.ts](file:///D:/TREAT STREET PURCHASE/project/src/lib/supabase.ts)** - `7` lines | Centrality: `7.2`

### 🏷️ Page View (2 files)
- **[AdminDashboard.tsx](file:///D:/TREAT STREET PURCHASE/project/src/pages/AdminDashboard.tsx)** - `99` lines | Centrality: `5.8`
- **[Storefront.tsx](file:///D:/TREAT STREET PURCHASE/project/src/pages/Storefront.tsx)** - `167` lines | Centrality: `4.8`

### 🏷️ React Context (1 files)
- **[CartContext.tsx](file:///D:/TREAT STREET PURCHASE/project/src/context/CartContext.tsx)** - `116` lines | Centrality: `10.0`

### 🏷️ Styling (1 files)
- **[index.css](file:///D:/TREAT STREET PURCHASE/project/src/index.css)** - `24` lines | Centrality: `1.8`

### 🏷️ Type Definition (1 files)
- **[index.ts](file:///D:/TREAT STREET PURCHASE/project/src/types/index.ts)** - `51` lines | Centrality: `9.0`

### 🏷️ UI Component (4 files)
- **[CartDrawer.tsx](file:///D:/TREAT STREET PURCHASE/project/src/components/CartDrawer.tsx)** - `113` lines | Centrality: `2.8`
- **[CheckoutModal.tsx](file:///D:/TREAT STREET PURCHASE/project/src/components/CheckoutModal.tsx)** - `156` lines | Centrality: `3.8`
- **[ItemCard.tsx](file:///D:/TREAT STREET PURCHASE/project/src/components/ItemCard.tsx)** - `99` lines | Centrality: `3.8`
- **[Navbar.tsx](file:///D:/TREAT STREET PURCHASE/project/src/components/Navbar.tsx)** - `68` lines | Centrality: `2.8`

### 🏷️ Utility/Other (1 files)
- **[vite-env.d.ts](file:///D:/TREAT STREET PURCHASE/project/src/vite-env.d.ts)** - `2` lines | Centrality: `0.0`

## 📚 Third-Party Dependencies Used
- `@supabase/supabase-js`
- `lucide-react`
- `react`
- `react-dom/client`

## 🔀 Database Relational Mappings
Supabase schema is created using standard PostgreSQL migrations. Key schemas defined:

- **[20260701121531_create_purchasing_portal_schema.sql](file:///D:/TREAT STREET PURCHASE/project/supabase/migrations/20260701121531_create_purchasing_portal_schema.sql)** defines table(s): `suppliers`, `products`, `orders`, `order_items`
