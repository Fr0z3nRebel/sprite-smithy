-- Sprite Smithy Initial Database Schema
-- This migration creates the core tables for authentication, purchases, and admin setup

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROFILES TABLE
-- Extends auth.users with additional user information
-- ============================================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  has_completed_onboarding BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index on email for faster lookups
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_role ON public.profiles(role);

-- ============================================================================
-- PURCHASES TABLE
-- Tracks one-time payments for lifetime access (replaces subscriptions)
-- ============================================================================
CREATE TABLE public.purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_payment_intent_id TEXT,
  stripe_checkout_session_id TEXT,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'paid')),
  amount_paid INTEGER DEFAULT 0, -- Amount in cents (e.g., 3000 = $30.00)
  currency TEXT DEFAULT 'usd',
  purchased_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster lookups
CREATE INDEX idx_purchases_user_id ON public.purchases(user_id);
CREATE INDEX idx_purchases_stripe_customer_id ON public.purchases(stripe_customer_id);
CREATE INDEX idx_purchases_tier ON public.purchases(tier);

-- ============================================================================
-- ADMIN SETUP TABLE
-- Ensures only one admin account can be created via the special setup route
-- ============================================================================
CREATE TABLE public.admin_setup (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  is_completed BOOLEAN DEFAULT false,
  completed_by UUID REFERENCES public.profiles(id),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the initial admin setup record
INSERT INTO public.admin_setup (is_completed) VALUES (false);

-- ============================================================================
-- USAGE TRACKING TABLE
-- Tracks video processing usage for free tier limits
-- ============================================================================
CREATE TABLE public.usage_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  video_count INTEGER DEFAULT 0,
  last_reset_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index on user_id
CREATE INDEX idx_usage_tracking_user_id ON public.usage_tracking(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_setup ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Purchases Policies
CREATE POLICY "Users can view own purchase"
  ON public.purchases
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert purchases"
  ON public.purchases
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update purchases"
  ON public.purchases
  FOR UPDATE
  USING (true);

-- Admin Setup Policies
CREATE POLICY "Anyone can view admin setup status"
  ON public.admin_setup
  FOR SELECT
  USING (true);

CREATE POLICY "Service role can update admin setup"
  ON public.admin_setup
  FOR UPDATE
  USING (true);

-- Usage Tracking Policies
CREATE POLICY "Users can view own usage"
  ON public.usage_tracking
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own usage"
  ON public.usage_tracking
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage usage"
  ON public.usage_tracking
  FOR ALL
  USING (true);

-- ============================================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================================

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );

  -- Create free tier purchase record
  INSERT INTO public.purchases (user_id, tier)
  VALUES (NEW.id, 'free');

  -- Create usage tracking record
  INSERT INTO public.usage_tracking (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at on profiles
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Triggers for updated_at on usage_tracking
CREATE TRIGGER usage_tracking_updated_at
  BEFORE UPDATE ON public.usage_tracking
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to check if user has pro tier
CREATE OR REPLACE FUNCTION public.is_pro_user(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.purchases
    WHERE user_id = user_uuid AND tier = 'paid'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment video usage count
CREATE OR REPLACE FUNCTION public.increment_video_count(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE public.usage_tracking
  SET video_count = video_count + 1
  WHERE user_id = user_uuid
  RETURNING video_count INTO new_count;

  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has reached free tier limit (5 videos/month)
CREATE OR REPLACE FUNCTION public.has_reached_limit(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_pro BOOLEAN;
  count INTEGER;
BEGIN
  -- Check if user is pro
  is_pro := public.is_pro_user(user_uuid);

  -- Pro users have no limits
  IF is_pro THEN
    RETURN false;
  END IF;

  -- Get current video count
  SELECT video_count INTO count
  FROM public.usage_tracking
  WHERE user_id = user_uuid;

  -- Free tier limit is 5 videos
  RETURN count >= 5;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE public.profiles IS 'User profile information extending auth.users';
COMMENT ON TABLE public.purchases IS 'One-time payment records for lifetime access';
COMMENT ON TABLE public.admin_setup IS 'Tracks admin setup completion to ensure one-time use';
COMMENT ON TABLE public.usage_tracking IS 'Tracks video processing usage for free tier limits';

COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates profile, purchase, and usage records on user signup';
COMMENT ON FUNCTION public.is_pro_user(UUID) IS 'Checks if a user has purchased pro tier';
COMMENT ON FUNCTION public.increment_video_count(UUID) IS 'Increments the video processing count for a user';
COMMENT ON FUNCTION public.has_reached_limit(UUID) IS 'Checks if a free tier user has reached the 5 video/month limit';
