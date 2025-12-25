/*
  # Update User Creation Trigger

  This migration updates the automatic user creation process to ensure all required
  fields are properly initialized when a new user signs up.

  1. Changes
    - Updates the `handle_new_user()` trigger function to create records in both
      `profiles` and `users` tables
    - Initializes all required user fields with proper default values
    - Sets `stripe_subscription_id` to NULL (not undefined)
    - Sets `subscription_status` to 'none' for new users

  2. Default Values for New Users
    - currency: 'EUR'
    - language: 'fr'
    - timezone: 'Europe/Paris'
    - theme: 'auto'
    - notification_preferences: {notifyOnBooking: true, notifyOnApiError: true}
    - report_frequency: 'hebdomadaire'
    - role: 'admin'
    - team_id: same as user id
    - stripe_subscription_id: NULL
    - subscription_status: 'none'

  3. Security
    - Function runs with SECURITY DEFINER to allow insertion into both tables
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

  INSERT INTO public.users (
    id,
    email,
    name,
    currency,
    language,
    timezone,
    theme,
    notification_preferences,
    report_frequency,
    team_id,
    role,
    stripe_customer_id,
    stripe_subscription_id,
    subscription_status,
    created_at,
    updated_at
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', 'Nouvel Utilisateur'),
    'EUR',
    'fr',
    'Europe/Paris',
    'auto',
    '{"notifyOnBooking": true, "notifyOnApiError": true}'::jsonb,
    'hebdomadaire',
    new.id,
    'admin',
    NULL,
    NULL,
    'none',
    now(),
    now()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
