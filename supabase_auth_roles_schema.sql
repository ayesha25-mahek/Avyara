-- ==============================================================================
-- Avyra / BizzoraAI - Supabase PostgreSQL Auth & Role-Based Access Control Schema
-- ==============================================================================

-- 1. Create custom role enum type
DO $$ BEGIN
    CREATE TYPE user_app_role AS ENUM (
        'super_admin',
        'technical_lead',
        'pr_lead',
        'technical_team',
        'pr_team'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create user_profiles table (linked to auth.users if Supabase Auth is enabled)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role user_app_role NOT NULL DEFAULT 'technical_team',
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast lookup by email
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles (email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles (role);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON public.user_profiles
    FOR SELECT
    USING (
        auth.uid() = auth_user_id
        OR email = auth.jwt() ->> 'email'
    );

-- Super Admins can view and manage all profiles
CREATE POLICY "Super Admins can view all profiles"
    ON public.user_profiles
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles up
            WHERE up.auth_user_id = auth.uid()
            AND up.role = 'super_admin'
        )
    );

-- 5. Audit Log Table for System & Deliverable Activity
CREATE TABLE IF NOT EXISTS public.system_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_email TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    action_type TEXT NOT NULL, -- e.g. 'LOGIN', 'GENERATE_OUTPUT', 'REVISION', 'ROLE_CHANGE'
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.system_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super Admins can view all activity logs"
    ON public.system_activity_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles up
            WHERE up.auth_user_id = auth.uid()
            AND up.role = 'super_admin'
        )
    );

-- 6. Seed Authorized Initial Accounts
INSERT INTO public.user_profiles (email, full_name, role, is_active)
VALUES
    ('ayeshamahek2509@gmail.com', 'Super Admin', 'super_admin', true),
    ('suravaishnavi16@gmail.com', 'Technical Lead', 'technical_lead', true),
    ('hansikareddy25@gmail.com', 'PR Lead', 'pr_lead', true),
    ('afreenfasiha18@gmail.com', 'Technical Team Member', 'technical_team', true),
    ('shaikfaisal786111@gmail.com', 'PR Team Member', 'pr_team', true)
ON CONFLICT (email) DO UPDATE 
SET role = EXCLUDED.role, full_name = EXCLUDED.full_name;
