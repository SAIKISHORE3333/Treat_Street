
/*
# Staff Purchasing Portal — Core Schema

## Summary
Creates the four core tables for the staff purchasing portal: suppliers,
products, orders, and order_items. This is a single-tenant app (no user
accounts), so RLS policies grant full CRUD access to the anon role, allowing
the frontend (using the anon key) to read and write freely.

## New Tables

### suppliers
Stores supplier/vendor names. Products reference a supplier by foreign key.
- id (uuid, PK)
- name (text, unique)
- created_at (timestamptz)

### products
The full catalog of purchasable items.
- id (uuid, PK)
- ingredient_id (text, unique) — legacy ING-xxx codes from the import
- name (text)
- supplier_id (uuid → suppliers.id)
- category (text) — derived category label
- package_size (text) — e.g. "4 x 400g"
- price (decimal) — unit price in GBP
- active (boolean) — soft-delete / hide from storefront
- created_at (timestamptz)

### orders
A submitted checkout from a staff member.
- id (uuid, PK)
- staff_name (text)
- department (text)
- notes (text, nullable)
- total_cost (decimal)
- status (text) — Pending | Ordered | Fulfilled
- created_at (timestamptz)

### order_items
Line items within an order. Snapshotted name + price at order time.
- id (uuid, PK)
- order_id (uuid → orders.id, CASCADE delete)
- product_id (uuid → products.id, SET NULL on delete)
- product_name (text snapshot)
- supplier_name (text snapshot)
- category (text snapshot)
- quantity (integer)
- unit_price (decimal snapshot)
- created_at (timestamptz)

## Security
RLS enabled on all four tables. Four separate policies per table
(SELECT / INSERT / UPDATE / DELETE) scoped to anon + authenticated,
since the storefront has no sign-in screen.
*/

-- ─── Suppliers ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS suppliers (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_suppliers"  ON suppliers;
DROP POLICY IF EXISTS "anon_insert_suppliers"  ON suppliers;
DROP POLICY IF EXISTS "anon_update_suppliers"  ON suppliers;
DROP POLICY IF EXISTS "anon_delete_suppliers"  ON suppliers;

CREATE POLICY "anon_select_suppliers"  ON suppliers FOR SELECT  TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_suppliers"  ON suppliers FOR INSERT  TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_suppliers"  ON suppliers FOR UPDATE  TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_suppliers"  ON suppliers FOR DELETE  TO anon, authenticated USING (true);

-- ─── Products ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS products (
  id            uuid           PRIMARY KEY DEFAULT gen_random_uuid(),
  ingredient_id text           UNIQUE,
  name          text           NOT NULL,
  supplier_id   uuid           REFERENCES suppliers(id) ON DELETE SET NULL,
  category      text           NOT NULL DEFAULT 'Uncategorized',
  package_size  text,
  price         decimal(10,2)  NOT NULL DEFAULT 0.00,
  active        boolean        NOT NULL DEFAULT true,
  created_at    timestamptz    DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_supplier_id_idx  ON products(supplier_id);
CREATE INDEX IF NOT EXISTS products_category_idx     ON products(category);
CREATE INDEX IF NOT EXISTS products_active_idx       ON products(active);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_products"  ON products;
DROP POLICY IF EXISTS "anon_insert_products"  ON products;
DROP POLICY IF EXISTS "anon_update_products"  ON products;
DROP POLICY IF EXISTS "anon_delete_products"  ON products;

CREATE POLICY "anon_select_products"  ON products FOR SELECT  TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_products"  ON products FOR INSERT  TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_products"  ON products FOR UPDATE  TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_products"  ON products FOR DELETE  TO anon, authenticated USING (true);

-- ─── Orders ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS orders (
  id          uuid           PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_name  text           NOT NULL,
  department  text           NOT NULL,
  notes       text,
  total_cost  decimal(10,2)  NOT NULL DEFAULT 0.00,
  status      text           NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending','Ordered','Fulfilled')),
  created_at  timestamptz    DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_status_idx     ON orders(status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at DESC);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_orders"  ON orders;
DROP POLICY IF EXISTS "anon_insert_orders"  ON orders;
DROP POLICY IF EXISTS "anon_update_orders"  ON orders;
DROP POLICY IF EXISTS "anon_delete_orders"  ON orders;

CREATE POLICY "anon_select_orders"  ON orders FOR SELECT  TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_orders"  ON orders FOR INSERT  TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_orders"  ON orders FOR UPDATE  TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_orders"  ON orders FOR DELETE  TO anon, authenticated USING (true);

-- ─── Order Items ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS order_items (
  id            uuid           PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      uuid           NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id    uuid           REFERENCES products(id) ON DELETE SET NULL,
  product_name  text           NOT NULL,
  supplier_name text           NOT NULL,
  category      text           NOT NULL,
  quantity      integer        NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price    decimal(10,2)  NOT NULL,
  created_at    timestamptz    DEFAULT now()
);

CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items(order_id);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_order_items"  ON order_items;
DROP POLICY IF EXISTS "anon_insert_order_items"  ON order_items;
DROP POLICY IF EXISTS "anon_update_order_items"  ON order_items;
DROP POLICY IF EXISTS "anon_delete_order_items"  ON order_items;

CREATE POLICY "anon_select_order_items"  ON order_items FOR SELECT  TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_order_items"  ON order_items FOR INSERT  TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_order_items"  ON order_items FOR UPDATE  TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_order_items"  ON order_items FOR DELETE  TO anon, authenticated USING (true);
