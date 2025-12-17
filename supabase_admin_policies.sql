-- ADMIN POLICIES

-- PARKING ZONES
-- Allow admins to insert parking zones
CREATE POLICY "Admins can insert parking zones" ON parking_zones
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'ADMIN'
    )
  );

-- Allow admins to update parking zones
CREATE POLICY "Admins can update parking zones" ON parking_zones
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'ADMIN'
    )
  );

-- Allow admins to delete parking zones
CREATE POLICY "Admins can delete parking zones" ON parking_zones
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'ADMIN'
    )
  );

-- PROFILES
-- Allow admins to update any profile
CREATE POLICY "Admins can update any profile" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'ADMIN'
    )
  );
  
-- Allow admins to delete any profile
CREATE POLICY "Admins can delete any profile" ON profiles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'ADMIN'
    )
  );

-- VEHICLES
-- Allow admins to update any vehicle
CREATE POLICY "Admins can update any vehicle" ON vehicles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'ADMIN'
    )
  );

-- Allow admins to delete any vehicle
CREATE POLICY "Admins can delete any vehicle" ON vehicles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'ADMIN'
    )
  );
