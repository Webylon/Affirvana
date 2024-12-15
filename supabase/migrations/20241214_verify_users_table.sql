-- First, let's verify if the balance column exists
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'balance'
    ) THEN
        -- If balance column doesn't exist, create it
        ALTER TABLE public.users ADD COLUMN balance numeric DEFAULT 1000 NOT NULL;
        
        -- Update existing rows to have the default balance
        UPDATE public.users SET balance = 1000 WHERE balance IS NULL;
    END IF;
END $$;

-- Recreate the users table if it doesn't match our schema
CREATE TABLE IF NOT EXISTS public.users (
    id uuid references auth.users(id) on delete cascade primary key,
    email text not null unique,
    name text,
    balance numeric default 1000 not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- Ensure RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;

-- Recreate policies
CREATE POLICY "Users can view their own profile"
    ON public.users
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.users
    FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.users
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Refresh the schema cache
SELECT schema_cache_reload();
