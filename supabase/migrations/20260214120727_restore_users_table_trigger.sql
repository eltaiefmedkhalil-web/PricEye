/*
  # Restore Users Table Creation on Signup

  1. Problem
    - Previous migration removed `users` table insertion from signup trigger
    - New users only get a `profiles` row but no `users` row
    - The dashboard and webhook rely on `users` table existing

  2. Solution
    - Restore `users` table insertion with minimal columns (fast)
    - Rely on column defaults for non-essential fields
    - Keep ON CONFLICT to prevent duplicates

  3. Changes
    - Update `handle_new_user()` to insert into both `profiles` and `users`
    - Only set: id, email, name, team_id (self-reference)
    - All other columns use their table defaults
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

  INSERT INTO public.users (id, email, name, team_id)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', ''),
    new.id
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
