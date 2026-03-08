/*
  # Create leads table for Free Tools Hub

  1. New Tables
    - `leads`
      - `id` (uuid, primary key)
      - `email` (text, not null)
      - `tool_used` (text, not null) - which tool generated the lead
      - `tool_data` (jsonb) - the inputs/results from the tool session
      - `created_at` (timestamptz, default now())
      - `ip_address` (text) - optional tracking
  2. Security
    - Enable RLS on `leads` table
    - Allow anonymous inserts (public lead capture)
    - Only authenticated service role can read leads
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  tool_used text NOT NULL DEFAULT '',
  tool_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  ip_address text DEFAULT ''
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a lead"
  ON leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can view leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE raw_app_meta_data->>'role' = 'admin'
  ));