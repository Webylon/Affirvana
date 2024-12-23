/*
  # Add purchase date tracking

  1. Changes
    - Add purchase_date column to purchases table
    - Set default value to current timestamp
    - Backfill existing rows
    - Make column not nullable

  2. Security
    - Inherits existing RLS policies from purchases table
*/

-- Add purchase_date column with default value
alter table public.purchases
add column if not exists purchase_date timestamptz default now();

-- Backfill any existing rows
update public.purchases
set purchase_date = created_at
where purchase_date is null;

-- Make column not nullable after backfill
alter table public.purchases
alter column purchase_date set not null;