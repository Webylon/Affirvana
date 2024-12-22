/*
  # Create purchases and purchase items tables
  
  1. New Tables
    - `purchases`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `total` (numeric)
      - `subtotal` (numeric)
      - `sales_tax` (numeric)
      - `luxury_tax` (numeric)
      - `shipping` (numeric)
      - `shipping_details` (jsonb)
      - `created_at` (timestamp)
    
    - `purchase_items`
      - `id` (uuid, primary key)
      - `purchase_id` (uuid, references purchases)
      - `item_id` (text)
      - `title` (text)
      - `price` (numeric)
      - `quantity` (integer)
      - `image` (text)
      - `category` (text)
  
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade not null,
  total numeric not null,
  subtotal numeric not null,
  sales_tax numeric not null,
  luxury_tax numeric not null,
  shipping numeric not null,
  shipping_details jsonb not null,
  created_at timestamptz default now()
);

create table if not exists public.purchase_items (
  id uuid primary key default gen_random_uuid(),
  purchase_id uuid references public.purchases on delete cascade not null,
  item_id text not null,
  title text not null,
  price numeric not null,
  quantity integer not null,
  image text not null,
  category text not null
);

alter table public.purchases enable row level security;
alter table public.purchase_items enable row level security;

create policy "Users can read own purchases"
  on purchases for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own purchases"
  on purchases for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can read own purchase items"
  on purchase_items for select
  to authenticated
  using (
    exists (
      select 1 from purchases
      where purchases.id = purchase_items.purchase_id
      and purchases.user_id = auth.uid()
    )
  );

create policy "Users can insert own purchase items"
  on purchase_items for insert
  to authenticated
  with check (
    exists (
      select 1 from purchases
      where purchases.id = purchase_items.purchase_id
      and purchases.user_id = auth.uid()
    )
  );