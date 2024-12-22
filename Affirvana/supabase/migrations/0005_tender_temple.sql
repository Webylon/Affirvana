/*
  # Fix profiles table RLS policies

  1. Changes
    - Add insert policy for profiles table to allow new user registration
    - Update existing policies to be more specific
  
  2. Security
    - Enable RLS (already enabled)
    - Add policy for authenticated users to insert their own profile
    - Ensure users can only read/update their own profile
*/

-- Drop existing policies to recreate them with proper permissions
drop policy if exists "Users can read own profile" on profiles;
drop policy if exists "Users can update own profile" on profiles;

-- Create new policies with proper permissions
create policy "Enable insert for authenticated users creating their own profile"
  on profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Enable read access for users to their own profile"
  on profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Enable update for users to their own profile"
  on profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);