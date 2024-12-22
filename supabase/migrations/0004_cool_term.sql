/*
  # Add user preferences to profiles
  
  1. Changes
    - Add preferences column to profiles table
  
  2. Security
    - Existing RLS policies will cover the new column
*/

alter table public.profiles 
add column if not exists preferences jsonb default '{"currency": "USD", "notifications": true, "theme": "light"}'::jsonb;