/*
  # Fix Profiles RLS Policies

  1. Changes
    - Drop existing RLS policies
    - Add new policy to allow profile creation during signup
    - Add policies for read/update access
  
  2. Security
    - Enable RLS
    - Ensure users can only access their own profile
    - Allow profile creation during signup
*/

-- Drop existing policies
drop policy if exists "Enable insert for authenticated users creating their own profile" on profiles;
drop policy if exists "Enable read access for users to their own profile" on profiles;
drop policy if exists "Enable update for users to their own profile" on profiles;

-- Create new policies with proper permissions
create policy "Enable profile creation during signup"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Enable read access for users to their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Enable update for users to their own profile"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);