/*
  # Fix Signup Timeout Issue

  1. Problem
    - The current trigger tries to insert into both `profiles` and `users` tables
    - This causes a 504 timeout during signup
    - The trigger is too complex and causes delays

  2. Solution
    - Simplify the trigger to only create a profile entry
    - Remove the automatic `users` table insertion
    - Use ON CONFLICT to prevent duplicate entries

  3. Changes
    - Update `handle_new_user()` function to only insert into profiles
    - Add proper error handling with ON CONFLICT
    - Keep it simple and fast
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name')
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();