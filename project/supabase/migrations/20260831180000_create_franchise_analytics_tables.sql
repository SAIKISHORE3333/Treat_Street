/*
# Franchise Analytics & Executive Summary Schema
Creates tables for:
- daily_analytics_summaries (Compact daily rollups indexed by date & branch)
- menu_engineering_items (Daily BCG matrix item classifications)
- franchise_archive_logs (Record of monthly pendrive / cloud backup exports)
*/

CREATE TABLE IF NOT EXISTS daily_analytics_summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  summary_date date NOT NULL,
  branch_id text NOT NULL DEFAULT 'MK Stadium HQ',
  gross_sales decimal(12,2) NOT NULL DEFAULT 0.00,
  discounts decimal(12,2) NOT NULL DEFAULT 0.00,
  commissions decimal(12,2) NOT NULL DEFAULT 0.00,
  net_sales decimal(12,2) NOT NULL DEFAULT 0.00,
  food_cost decimal(12,2) NOT NULL DEFAULT 0.00,
  waste_cost decimal(12,2) NOT NULL DEFAULT 0.00,
  net_profit decimal(12,2) NOT NULL DEFAULT 0.00,
  net_margin_pct decimal(5,2) NOT NULL DEFAULT 0.00,
  total_orders integer NOT NULL DEFAULT 0,
  avg_prep_time_min decimal(5,1) NOT NULL DEFAULT 0.0,
  avg_rating decimal(3,2) NOT NULL DEFAULT 5.00,
  channel_metrics_json jsonb DEFAULT '{}'::jsonb,
  menu_matrix_json jsonb DEFAULT '{}'::jsonb,
  waste_top5_json jsonb DEFAULT '[]'::jsonb,
  hourly_trends_json jsonb DEFAULT '[]'::jsonb,
  insights_json jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT uq_date_branch UNIQUE (summary_date, branch_id)
);

ALTER TABLE daily_analytics_summaries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_daily_analytics" ON daily_analytics_summaries;
CREATE POLICY "anon_all_daily_analytics" ON daily_analytics_summaries FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS menu_engineering_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  summary_date date NOT NULL,
  branch_id text NOT NULL DEFAULT 'MK Stadium HQ',
  item_name text NOT NULL,
  channel text NOT NULL DEFAULT 'ALL',
  units_sold integer NOT NULL DEFAULT 0,
  gross_revenue decimal(10,2) NOT NULL DEFAULT 0.00,
  food_cost decimal(10,2) NOT NULL DEFAULT 0.00,
  contribution_margin decimal(10,2) NOT NULL DEFAULT 0.00,
  margin_pct decimal(5,2) NOT NULL DEFAULT 0.00,
  bcg_category text NOT NULL, -- 'STAR', 'WORKHORSE', 'PUZZLE', 'DOG'
  popularity_index decimal(5,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE menu_engineering_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_menu_items" ON menu_engineering_items;
CREATE POLICY "anon_all_menu_items" ON menu_engineering_items FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS franchise_archive_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  archive_period text NOT NULL, -- e.g. '2026-08'
  branch_id text NOT NULL DEFAULT 'MK Stadium HQ',
  total_records integer NOT NULL DEFAULT 0,
  file_size_kb decimal(10,2) NOT NULL DEFAULT 0.00,
  storage_target text NOT NULL DEFAULT 'PENDRIVE_EXPORT', -- 'PENDRIVE_EXPORT', 'SUPABASE_STORAGE'
  created_at timestamptz DEFAULT now()
);

ALTER TABLE franchise_archive_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_archive_logs" ON franchise_archive_logs;
CREATE POLICY "anon_all_archive_logs" ON franchise_archive_logs FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
