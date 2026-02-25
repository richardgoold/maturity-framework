-- GrowthLens Security Audit Fixes
-- Run these in the Supabase SQL Editor (Dashboard â SQL Editor)
-- Each section corresponds to a SEC- finding from the audit
-- ============================================================

-- âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
-- SEC-09: Add DELETE RLS policy on contact_submissions
-- Currently admins cannot delete contact form submissions
-- âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
CREATE POLICY "Admins can delete contact submissions"
  ON contact_submissions
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
-- SEC-01: Server-side tier enforcement via RLS
-- Enforce free-tier limits at the database level
-- Free users: max 1 firm
-- âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

-- Drop existing insert policy if it exists (so we can recreate with tier check)
-- First check existing policy name:
-- SELECT policyname FROM pg_policies WHERE tablename = 'firms' AND cmd = 'INSERT';

-- Add a function to check tier limits
CREATE OR REPLACE FUNCTION check_firm_limit()
RETURNS TRIGGER AS $$
DECLARE
  user_tier TEXT;
  firm_count INTEGER;
BEGIN
  -- Get user's tier from profiles
  SELECT tier INTO user_tier
  FROM profiles
  WHERE id = NEW.user_id;

  -- If free tier, check firm count
  IF user_tier = 'free' OR user_tier IS NULL THEN
    SELECT COUNT(*) INTO firm_count
    FROM firms
    WHERE user_id = NEW.user_id;

    IF firm_count >= 1 THEN
      RAISE EXCEPTION 'Free tier limit: maximum 1 firm. Upgrade to premium for unlimited firms.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger (drop first if exists)
DROP TRIGGER IF EXISTS enforce_firm_limit ON firms;
CREATE TRIGGER enforce_firm_limit
  BEFORE INSERT ON firms
  FOR EACH ROW
  EXECUTE FUNCTION check_firm_limit();

-- âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
-- SEC-16: Server-side assessment limit per firm (free tier)
-- Free users: max 1 assessment per firm
-- âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
CREATE OR REPLACE FUNCTION check_assessment_limit()
RETURNS TRIGGER AS $$
DECLARE
  user_tier TEXT;
  assess_count INTEGER;
  firm_owner UUID;
BEGIN
  -- Get the firm's owner
  SELECT user_id INTO firm_owner
  FROM firms
  WHERE id = NEW.firm_id;

  -- Get user's tier
  SELECT tier INTO user_tier
  FROM profiles
  WHERE id = firm_owner;

  -- If free tier, check assessment count for this firm
  IF user_tier = 'free' OR user_tier IS NULL THEN
    SELECT COUNT(*) INTO assess_count
    FROM assessments
    WHERE firm_id = NEW.firm_id;

    IF assess_count >= 1 THEN
      RAISE EXCEPTION 'Free tier limit: maximum 1 assessment per firm. Upgrade to premium for unlimited assessments.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS enforce_assessment_limit ON assessments;
CREATE TRIGGER enforce_assessment_limit
  BEFORE INSERT ON assessments
  FOR EACH ROW
  EXECUTE FUNCTION check_assessment_limit();

-- âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
-- SEC-02: Server-side admin role verification
-- Add a helper function that checks admin status from JWT or profiles
-- This can be used in RLS policies for stronger enforcement
-- âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Add admin policies for firms table (missing from original)
CREATE POLICY "Admins can update any firm"
  ON firms
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete any firm"
  ON firms
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- Add admin delete policy for assessments (missing from original)
CREATE POLICY "Admins can delete any assessment"
  ON assessments
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
-- SEC-11: Add check constraint on audit_log details
-- Ensure details column doesn't grow unbounded and has structure
-- âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
ALTER TABLE audit_log
  ADD CONSTRAINT audit_log_details_size
  CHECK (octet_length(details::text) <= 10000);

-- âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
-- SEC-18: Make audit log writes more reliable
-- Create a helper function for transactional audit logging
-- âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
CREATE OR REPLACE FUNCTION log_admin_action(
  p_action TEXT,
  p_target_table TEXT,
  p_target_id UUID,
  p_details JSONB DEFAULT '{}'
)
RETURNS VOID AS $$
BEGIN
  -- Strip any email or password fields from details for PII protection (SEC-11)
  INSERT INTO audit_log (admin_id, action, target_table, target_id, details)
  VALUES (
    auth.uid(),
    p_action,
    p_target_table,
    p_target_id,
    p_details - 'email' - 'password' - 'encrypted_password'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
-- SEC-17: Notification flag for admin-modified assessments
-- Add a column to track when admin has modified an assessment
-- (The UI can check this to show a notice to the user)
-- âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'assessments' AND column_name = 'admin_modified_at'
  ) THEN
    ALTER TABLE assessments ADD COLUMN admin_modified_at TIMESTAMPTZ DEFAULT NULL;
    ALTER TABLE assessments ADD COLUMN admin_modified_by UUID DEFAULT NULL;
  END IF;
END $$;

-- âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
-- Verify: List all policies to confirm changes
-- âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;
