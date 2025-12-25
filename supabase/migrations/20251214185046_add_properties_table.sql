/*
  # Add Properties Management System

  1. New Tables
    - `properties`: Stores property units with parent/child relationships
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text, property name)
      - `address` (text, full address)
      - `address_hash` (text, for grouping same-address units)
      - `parent_property_id` (uuid, nullable, self-reference)
      - `is_parent` (boolean, true for standalone or first unit in group)
      - `position_in_tier` (integer, position for tiered pricing)
      - `monthly_rate` (numeric, calculated rate in EUR)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `properties` table
    - Add policies for authenticated users to manage their own properties
  
  3. Functions
    - `calculate_property_rates()`: Automatically calculates rates based on parent/child logic
*/

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  name text NOT NULL,
  address text NOT NULL,
  address_hash text NOT NULL,
  parent_property_id uuid REFERENCES properties(id) DEFAULT NULL,
  is_parent boolean DEFAULT true,
  position_in_tier integer DEFAULT 1,
  monthly_rate numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Policies for properties
CREATE POLICY "Users can view own properties"
  ON properties
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own properties"
  ON properties
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own properties"
  ON properties
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own properties"
  ON properties
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Function to calculate property rates based on hybrid pricing
CREATE OR REPLACE FUNCTION calculate_property_rates(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  parent_count integer := 0;
  current_property RECORD;
  new_rate numeric(10,2);
BEGIN
  -- Reset all rates for this user
  UPDATE properties 
  SET monthly_rate = 0, position_in_tier = 0 
  WHERE user_id = p_user_id;
  
  -- Calculate rates for parent units (tiered pricing)
  FOR current_property IN 
    SELECT id, address_hash 
    FROM properties 
    WHERE user_id = p_user_id 
      AND is_parent = true 
    ORDER BY created_at
  LOOP
    parent_count := parent_count + 1;
    
    -- Apply tiered pricing
    IF parent_count = 1 THEN
      new_rate := 13.99;
    ELSIF parent_count BETWEEN 2 AND 5 THEN
      new_rate := 11.99;
    ELSIF parent_count BETWEEN 6 AND 15 THEN
      new_rate := 8.99;
    ELSIF parent_count BETWEEN 16 AND 30 THEN
      new_rate := 5.49;
    ELSE
      new_rate := 3.99;
    END IF;
    
    UPDATE properties 
    SET monthly_rate = new_rate, position_in_tier = parent_count
    WHERE id = current_property.id;
  END LOOP;
  
  -- Calculate rates for child units (flat €3.99)
  UPDATE properties 
  SET monthly_rate = 3.99
  WHERE user_id = p_user_id 
    AND is_parent = false;
    
END;
$$;

-- Trigger to recalculate rates when properties change
CREATE OR REPLACE FUNCTION trigger_recalculate_rates()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM calculate_property_rates(NEW.user_id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER recalculate_rates_on_property_change
  AFTER INSERT OR UPDATE OR DELETE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION trigger_recalculate_rates();

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON properties(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_address_hash ON properties(address_hash);
CREATE INDEX IF NOT EXISTS idx_properties_parent_id ON properties(parent_property_id);
