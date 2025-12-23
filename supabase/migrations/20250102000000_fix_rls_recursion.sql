-- Fix RLS policy recursion issue
-- The "Admins can view all profiles" policy was causing infinite recursion
-- because it queried the profiles table to check admin status, which itself
-- needed to pass RLS policies.

-- Create a SECURITY DEFINER function to check if a user is an admin
-- This bypasses RLS, preventing recursion
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_uuid AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the old recursive policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create new policy using the SECURITY DEFINER function
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (public.is_admin(auth.uid()));

