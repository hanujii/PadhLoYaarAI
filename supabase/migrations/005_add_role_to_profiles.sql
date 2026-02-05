-- Migration 005: Add Role to Profiles
-- Adds role column to support Admin vs User distinction

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- RLS Policy for Admins
-- Allows admins to view all profiles (useful for User Management page)
CREATE POLICY "Admins can view all profiles"
    ON profiles FOR SELECT
    USING (
        auth.uid() IN (
            SELECT id FROM profiles WHERE role = 'admin'
        )
    );

-- Comment
COMMENT ON COLUMN profiles.role IS 'User role: "user" or "admin"';
