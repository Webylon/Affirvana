-- Create users table if it doesn't exist
create table if not exists public.users (
    id uuid references auth.users(id) on delete cascade primary key,
    email text not null unique,
    name text,
    balance numeric default 1000 not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- Set up RLS (Row Level Security)
alter table public.users enable row level security;

-- Create policies
create policy "Users can view their own profile"
    on public.users
    for select
    using (auth.uid() = id);

create policy "Users can update their own profile"
    on public.users
    for update
    using (auth.uid() = id);

create policy "Users can insert their own profile"
    on public.users
    for insert
    with check (auth.uid() = id);

-- Create function to handle updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger handle_updated_at
    before update on public.users
    for each row
    execute function public.handle_updated_at();
