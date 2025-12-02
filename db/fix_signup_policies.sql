-- Fix for Signup Issue: Missing RLS Policies for 'members' table

-- 1. Enable RLS (just in case)
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- 2. Allow users to insert their own profile during signup
-- This is critical for the signup flow to work
CREATE POLICY "Users can insert their own profile"
ON public.members
FOR INSERT
WITH CHECK (auth.uid() = id);

-- 3. Allow users to view all members (or restrict as needed)
-- Public profiles are usually visible to authenticated users
CREATE POLICY "Members are viewable by everyone"
ON public.members
FOR SELECT
USING (true);

-- 4. Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
ON public.members
FOR UPDATE
USING (auth.uid() = id);

-- 5. Allow admins to delete members (optional, based on role)
-- Assuming 'profiles' or 'members' table has a role column
CREATE POLICY "Admins can delete members"
ON public.members
FOR DELETE
USING (
  auth.jwt() ->> 'role' = 'service_role' OR
  EXISTS (
    SELECT 1 FROM public.members
    WHERE id = auth.uid() AND role = 'Admin'
  )
);
