/*
# Audits, Kitchen Ops, and Live Stock Schema
Creates tables for storing:
- inventory_audits
- inventory_audit_items
- waste_logs
- production_logs
- inventory_stock_levels
*/

CREATE TABLE IF NOT EXISTS inventory_audits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_code text NOT NULL,
  branch_id text NOT NULL DEFAULT 'MK Stadium HQ',
  total_variance_cost decimal(10,2) NOT NULL DEFAULT 0.00,
  items_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE inventory_audits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_inventory_audits" ON inventory_audits;
CREATE POLICY "anon_all_inventory_audits" ON inventory_audits FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS inventory_audit_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id uuid REFERENCES inventory_audits(id) ON DELETE CASCADE,
  ingredient_id text NOT NULL,
  ingredient_name text NOT NULL,
  theoretical_qty decimal(10,2) NOT NULL DEFAULT 0.00,
  actual_qty decimal(10,2) NOT NULL DEFAULT 0.00,
  variance decimal(10,2) NOT NULL DEFAULT 0.00,
  variance_cost decimal(10,2) NOT NULL DEFAULT 0.00,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE inventory_audit_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_inventory_audit_items" ON inventory_audit_items;
CREATE POLICY "anon_all_inventory_audit_items" ON inventory_audit_items FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS waste_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  log_code text,
  branch_id text NOT NULL DEFAULT 'MK Stadium HQ',
  recipe_name text NOT NULL,
  quantity decimal(10,2) NOT NULL DEFAULT 0.00,
  estimated_cost decimal(10,2) NOT NULL DEFAULT 0.00,
  reason text,
  expiry_date date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE waste_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_waste_logs" ON waste_logs;
CREATE POLICY "anon_all_waste_logs" ON waste_logs FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS production_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  log_code text,
  branch_id text NOT NULL DEFAULT 'MK Stadium HQ',
  recipe_name text NOT NULL,
  batches_produced integer NOT NULL DEFAULT 1,
  staff_name text,
  expiry_date date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE production_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_production_logs" ON production_logs;
CREATE POLICY "anon_all_production_logs" ON production_logs FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS inventory_stock_levels (
  ingredient_id text PRIMARY KEY,
  ingredient_name text,
  current_units decimal(10,2) NOT NULL DEFAULT 0.00,
  unit_price decimal(10,2) NOT NULL DEFAULT 0.00,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE inventory_stock_levels ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_inventory_stock_levels" ON inventory_stock_levels;
CREATE POLICY "anon_all_inventory_stock_levels" ON inventory_stock_levels FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
