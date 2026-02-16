-- ============================================================
-- GrowthLens Phase 3: Admin Dashboard — Schema Changes
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. Create audit_log table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  target_user_id UUID REFERENCES auth.users(id),
  target_resource TEXT,
  target_resource_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Indexes for audit_log
CREATE INDEX IF NOT EXISTS idx_audit_admin_id ON public.audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_target_user ON public.audit_log(target_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON public.audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON public.audit_log(created_at DESC);

-- 2. Alter contact_submissions — add user_id and source_context
-- ============================================================
ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS source_context TEXT;

CREATE INDEX IF NOT EXISTS idx_contact_user_id ON public.contact_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_contact_read ON public.contact_submissions(read);

-- 3. Alter profiles — add last_active_at for tracking
-- ============================================================
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_profiles_last_active ON public.profiles(last_active_at DESC);

-- 4. Add default_tier config row if not exists
-- ============================================================
INSERT INTO public.app_config (key, value) VALUES ('default_tier', 'free')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- NEW RLS Policies for Admin Write Operations
-- ============================================================

-- 5. Admins can UPDATE profiles (tier, approved, role)
-- ============================================================
CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 6. Admins can UPDATE assessments (edit ratings)
-- ============================================================
CREATE POLICY "Admins can update all assessments"
  ON public.assessments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 7. Admins can UPDATE contact_submissions (mark as read)
-- ============================================================
CREATE POLICY "Admins can update contact submissions"
  ON public.contact_submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 8. Admins can INSERT and SELECT audit_log
-- ============================================================
CREATE POLICY "Admins can insert audit log"
  ON public.audit_log FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can view audit log"
  ON public.audit_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 9. Admins can INSERT into app_config (for new config keys)
-- ============================================================
CREATE POLICY "Admins can insert config"
  ON public.app_config FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================
-- Done! Verify by checking:
-- SELECT * FROM public.audit_log LIMIT 1;
-- SELECT * FROM public.app_config;
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'contact_submissions';
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'profiles';
-- ============================================================
