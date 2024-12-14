-- Drop the existing favorites table if it exists
drop table if exists public.favorites;

-- Create a simplified favorites table
create table public.favorites (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    item_id text not null,
    title text not null,
    description text,
    price numeric not null,
    image_url text not null,
    created_at timestamptz default now() not null,
    
    -- Add a unique constraint to prevent duplicate favorites
    unique(user_id, item_id)
);

-- Set up RLS (Row Level Security)
alter table public.favorites enable row level security;

-- Create policies
create policy "Users can view their own favorites"
    on public.favorites
    for select
    using (auth.uid() = user_id);

create policy "Users can insert their own favorites"
    on public.favorites
    for insert
    with check (auth.uid() = user_id);

create policy "Users can delete their own favorites"
    on public.favorites
    for delete
    using (auth.uid() = user_id);

-- Create indexes for better performance
create index favorites_user_id_idx on public.favorites(user_id);
create index favorites_item_id_idx on public.favorites(item_id);
