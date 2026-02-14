-- ============================================================
-- GrowthLens Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  company_name TEXT,
  job_title TEXT,
  revenue_band TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  approved BOOLEAN NOT NULL DEFAULT true,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'premium')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Firms table
CREATE TABLE IF NOT EXISTS public.firms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sector TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Assessments table
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  ratings JSONB NOT NULL DEFAULT '{}',
  benchmark_profile TEXT DEFAULT 'Professional Services',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Contact submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. App config table (for approval mode, etc.)
CREATE TABLE IF NOT EXISTS public.app_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default config
INSERT INTO public.app_config (key, value) VALUES ('approval_mode', 'auto')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- Row Level Security (RLS) Policies
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile; admins can read all
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Firms: users can CRUD their own firms; admins can read all
CREATE POLICY "Users can view own firms"
  ON public.firms FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own firms"
  ON public.firms FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own firms"
  ON public.firms FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own firms"
  ON public.firms FOR DELETE
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all firms"
  ON public.firms FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Assessments: users can CRUD their own assessments; admins can read all
CREATE POLICY "Users can view own assessments"
  ON public.assessments FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own assessments"
  ON public.assessments FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own assessments"
  ON public.assessments FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own assessments"
  ON public.assessments FOR DELETE
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all assessments"
  ON public.assessments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Contact submissions: anyone can insert; only admins can read
CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view contact submissions"
  ON public.contact_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- App config: anyone authenticated can read; only admins can update
CREATE POLICY "Authenticated users can read config"
  ON public.app_config FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update config"
  ON public.app_config FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================
-- Indexes for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_firms_user_id ON public.firms(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_firm_id ON public.assessments(firm_id);
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON public.assessments(user_id);

-- ============================================================
-- Updated_at trigger function
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER set_firms_updated_at
  BEFORE UPDATE ON public.firms
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_assessments_updated_at
  BEFORE UPDATE ON public.assessments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
