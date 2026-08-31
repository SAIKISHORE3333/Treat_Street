/*
# Item Aliases and Sales Depletion Runs Schema
Creates tables for:
- item_aliases (Cross-platform menu name mapping to canonical SOP recipes)
- sales_depletion_runs (Audit log of automated cross-platform depletion batches)
*/

CREATE TABLE IF NOT EXISTS item_aliases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_name text NOT NULL,
  normalized_external_name text NOT NULL,
  recipe_name text NOT NULL,
  source_platform text NOT NULL DEFAULT 'ALL',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT uq_norm_platform UNIQUE (normalized_external_name, source_platform)
);

ALTER TABLE item_aliases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_item_aliases" ON item_aliases;
CREATE POLICY "anon_all_item_aliases" ON item_aliases FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS sales_depletion_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_code text NOT NULL,
  branch_id text NOT NULL DEFAULT 'MK Stadium HQ',
  total_menus_sold integer NOT NULL DEFAULT 0,
  platforms_included text[] DEFAULT ARRAY[]::text[],
  breakdown_json jsonb DEFAULT '{}'::jsonb,
  depleted_ingredients_json jsonb DEFAULT '{}'::jsonb,
  executed_by text DEFAULT 'Admin',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sales_depletion_runs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_sales_depletion_runs" ON sales_depletion_runs;
CREATE POLICY "anon_all_sales_depletion_runs" ON sales_depletion_runs FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
