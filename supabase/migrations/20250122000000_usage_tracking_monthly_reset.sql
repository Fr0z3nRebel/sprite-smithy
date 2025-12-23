-- Function to check if usage needs reset and perform reset
CREATE OR REPLACE FUNCTION public.check_and_reset_usage(user_uuid UUID)
RETURNS void AS $$
DECLARE
  last_reset TIMESTAMP WITH TIME ZONE;
  current_month_start TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT last_reset_at INTO last_reset
  FROM public.usage_tracking
  WHERE user_id = user_uuid;

  -- Calculate first day of current month (in UTC)
  current_month_start := date_trunc('month', NOW());

  -- Reset if last_reset is before current month
  IF last_reset < current_month_start THEN
    UPDATE public.usage_tracking
    SET video_count = 0,
        last_reset_at = NOW(),
        updated_at = NOW()
    WHERE user_id = user_uuid;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update increment_video_count to auto-reset before incrementing
CREATE OR REPLACE FUNCTION public.increment_video_count(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  -- Check and reset if needed
  PERFORM public.check_and_reset_usage(user_uuid);

  -- Then increment
  UPDATE public.usage_tracking
  SET video_count = video_count + 1,
      updated_at = NOW()
  WHERE user_id = user_uuid
  RETURNING video_count INTO new_count;

  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update has_reached_limit to check reset before checking limit
CREATE OR REPLACE FUNCTION public.has_reached_limit(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_pro BOOLEAN;
  count INTEGER;
BEGIN
  -- Check and reset if needed first
  PERFORM public.check_and_reset_usage(user_uuid);

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

  -- Free tier limit is 5 videos per month
  RETURN count >= 5;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
