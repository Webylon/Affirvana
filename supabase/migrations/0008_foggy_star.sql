/*
  # Fix Profile Creation During Signup

  1. Changes
    - Drop existing policies
    - Add new policy to allow profile creation for new signups
    - Maintain secure read/update policies
  
  2. Security
    - Enable RLS
    - Allow profile creation during signup
    - Restrict profile access to owners
*/

-- Drop existing policies
drop policy if exists "Enable profile creation during signup" on profiles;
drop policy if exists "Enable read access for users to their own profile" on profiles;
drop policy if exists "Enable update for users to their own profile" on profiles;

-- Create new policies
create policy "Allow profile creation during signup"
  on profiles for insert
  to authenticated, anon
  with check (true);

create policy "Allow users to read own profile"
  on profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Allow users to update own profile"
  on profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);