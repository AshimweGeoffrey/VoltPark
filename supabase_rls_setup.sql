-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE parking_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE parking_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- PROFILES
-- Allow users to view any profile (needed for officers/admin to see user details, or social features)
-- You might want to restrict this to only own profile if privacy is strict, but usually name/role is public in app context
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- VEHICLES
-- Allow users to view their own vehicles
CREATE POLICY "Users can view own vehicles" ON vehicles
  FOR SELECT USING (
    auth.uid() = owner_id 
    OR 
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('ADMIN', 'OFFICER')
    )
  );

-- Allow users to insert their own vehicles
CREATE POLICY "Users can insert own vehicles" ON vehicles
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Allow users to update their own vehicles
CREATE POLICY "Users can update own vehicles" ON vehicles
  FOR UPDATE USING (auth.uid() = owner_id);

-- Allow users to delete their own vehicles
CREATE POLICY "Users can delete own vehicles" ON vehicles
  FOR DELETE USING (auth.uid() = owner_id);

-- PARKING ZONES
-- Allow everyone to view parking zones
CREATE POLICY "Parking zones are viewable by everyone" ON parking_zones
  FOR SELECT USING (true);

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

-- PARKING SESSIONS
-- Allow users to view sessions for their vehicles
CREATE POLICY "Users can view own sessions" ON parking_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM vehicles 
      WHERE vehicles.id = parking_sessions.vehicle_id 
      AND vehicles.owner_id = auth.uid()
    )    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('ADMIN', 'OFFICER')
    )  );

-- Allow users to create sessions for their vehicles
CREATE POLICY "Users can insert own sessions" ON parking_sessions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM vehicles 
      WHERE vehicles.id = parking_sessions.vehicle_id 
      AND vehicles.owner_id = auth.uid()
    )
  );

-- Allow users to update sessions (e.g. end session)
CREATE POLICY "Users can update own sessions" ON parking_sessions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM vehicles 
      WHERE vehicles.id = parking_sessions.vehicle_id 
      AND vehicles.owner_id = auth.uid()
    )
  );

-- NOTIFICATIONS
-- Allow users to view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to update (mark read) their own notifications
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- TICKETS
-- Allow users to view tickets for their vehicles
CREATE POLICY "Users can view own tickets" ON tickets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM vehicles 
      WHERE vehicles.id = tickets.vehicle_id 
      AND vehicles.owner_id = auth.uid()
    )
    OR officer_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('ADMIN', 'OFFICER')
    )
  );

-- Allow officers to create tickets
CREATE POLICY "Officers can create tickets" ON tickets
  FOR INSERT WITH CHECK (auth.uid() = officer_id);
