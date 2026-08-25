
/*
# Add supplier email + order branch name

## Changes

### suppliers
- `email` (text, nullable) — the supplier's contact email for automated PO delivery.
  Nullable so existing rows remain valid; admin sets these via the Inventory Manager.

### orders
- `branch_name` (text, nullable) — the Treat Street branch/location that raised the order.
  Captured at checkout and embedded in the automated purchase order email.

## Notes
- Both columns are nullable to maintain backward compatibility with existing rows.
- No destructive changes.
*/

ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE orders    ADD COLUMN IF NOT EXISTS branch_name text;
