-- Server-Side Rate Limiting for GrowthLens
-- Run this SQL in the Supabase SQL Editor to set up database-level rate limiting
-- This supplements the client-side rate limiting in LoginPage.jsx

-- 1. Create the rate_limits table to track authentication attempts
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier text NOT NULL,  -- email address or IP
  action text NOT NULL DEFAULT 'auth',  -- auth, password_reset, signup
  attempts integer DEFAULT 1,
  first_attempt_at timestamptz DEFAULT now(),
  locked_until timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_action 
  ON public.rate_limits(identifier, action);

-- Index for cleanup of old records
CREATE INDEX IF NOT EXISTS idx_rate_limits_first_attempt 
  ON public.rate_limits(first_attempt_at);

-- 2. Enable RLS on rate_limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Only allow the service role to read/write rate limits
-- No public access - this is managed by database functions only
CREATE POLICY "Service role full access on rate_limits"
  ON public.rate_limits
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 3. Function to check and record rate limits
-- Returns true if the request is allowed, false if rate-limited
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier text,
  p_action text DEFAULT 'auth',
  p_max_attempts integer DEFAULT 5,
  p_window_seconds integer DEFAULT 900,  -- 15 minutes
  p_lockout_seconds integer DEFAULT 900  -- 15 minutes
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_record rate_limits%ROWTYPE;
  v_window_start timestamptz;
BEGIN
  v_window_start := now() - (p_window_seconds || ' seconds')::interval;

  -- Find existing rate limit record within the window
  SELECT * INTO v_record
  FROM rate_limits
  WHERE identifier = p_identifier
    AND action = p_action
    AND first_attempt_at > v_window_start
  ORDER BY first_attempt_at DESC
  LIMIT 1;

  -- If currently locked out, check if lockout has expired
  IF v_record.locked_until IS NOT NULL AND v_record.locked_until > now() THEN
    RETURN false;  -- Still locked out
  END IF;

  -- If no record or record is outside window, create new
  IF v_record.id IS NULL OR v_record.first_attempt_at <= v_window_start THEN
    INSERT INTO rate_limits (identifier, action, attempts, first_attempt_at)
    VALUES (p_identifier, p_action, 1, now());
    RETURN true;  -- First attempt, allowed
  END IF;

  -- Increment attempts
  UPDATE rate_limits
  SET attempts = v_record.attempts + 1,
      updated_at = now(),
      locked_until = CASE
        WHEN v_record.attempts + 1 >= p_max_attempts
        THEN now() + (p_lockout_seconds || ' seconds')::interval
        ELSE NULL
      END
  WHERE id = v_record.id;

  -- Check if this attempt exceeds the limit
  IF v_record.attempts + 1 >= p_max_attempts THEN
    RETURN false;  -- Rate limited
  END IF;

  RETURN true;  -- Allowed
END;
$$;

-- 4. Function to reset rate limit after successful auth
CREATE OR REPLACE FUNCTION public.reset_rate_limit(
  p_identifier text,
  p_action text DEFAULT 'auth'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM rate_limits
  WHERE identifier = p_identifier
    AND action = p_action;
END;
$$;

-- 5. Cleanup function to remove old rate limit records (run periodically)
CREATE OR REPLACE FUNCTION public.cleanup_rate_limits()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted integer;
BEGIN
  DELETE FROM rate_limits
  WHERE first_attempt_at < now() - interval '24 hours'
  RETURNING 1 INTO v_deleted;

  RETURN COALESCE(v_deleted, 0);
END;
$$;

-- 6. Grant execute permissions to authenticated users (for client-side calls)
GRANT EXECUTE ON FUNCTION public.check_rate_limit TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_rate_limit TO anon;
GRANT EXECUTE ON FUNCTION public.reset_rate_limit TO authenticated;

-- 7. Schedule cleanup (run daily via pg_cron if available, or call manually)
-- Note: pg_cron may not be available on all Supabase plans
-- SELECT cron.schedule('cleanup-rate-limits', '0 3 * * *', 'SELECT public.cleanup_rate_limits()');

-- Usage examples:
-- Check if login attempt is allowed:
--   SELECT public.check_rate_limit('user@example.com', 'auth', 5, 900, 900);
--
-- After successful login, reset the counter:
--   SELECT public.reset_rate_limit('user@example.com', 'auth');
--
-- Check password reset rate limit (3 attempts per hour):
--   SELECT public.check_rate_limit('user@example.com', 'password_reset', 3, 3600, 3600);
