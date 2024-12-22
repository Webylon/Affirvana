/*
  # Create favorites table
  
  1. New Tables
    - `favorites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `item_id` (text)
      - `title` (text)
      - `price` (numeric)
      - `image` (text)
      - `category` (text)
      - `description` (text)
      - `rating` (numeric)
      - `rating_count` (integer)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade not null,
  item_id text not null,
  title text not null,
  price numeric not null,
  image text not null,
  category text not null,
  description text,
  rating numeric,
  rating_count integer,
  created_at timestamptz default now(),
  unique(user_id, item_id)
);

alter table public.favorites enable row level security;

create policy "Users can manage their own favorites"
  on favorites for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);