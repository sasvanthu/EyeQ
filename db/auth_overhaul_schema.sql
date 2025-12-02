-- Authentication System Overhaul Schema

-- 1. Rename 'members' to 'profiles' if it exists, or create 'profiles'
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'members') THEN
    ALTER TABLE public.members RENAME TO profiles;
  END IF;
END $$;

-- Ensure 'profiles' table exists with correct columns
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  email text,
  role text DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  department text,
  skills text[],
  streaks jsonb DEFAULT '{"current": 0, "longest": 0, "last_activity": null}'::jsonb,
  created_at timestamptz DEFAULT now(),
  avatar_url text
);

-- 2. Create 'requests' table for new member registration
CREATE TABLE IF NOT EXISTS public.requests (
  id bigserial PRIMARY KEY,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  department text,
  skills text[],
  reason text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now()
);

-- 3. Ensure 'projects' table exists
CREATE TABLE IF NOT EXISTS public.projects (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  github_url text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies

-- PROFILES
-- Admins can view and update all profiles
CREATE POLICY "Admins can do everything on profiles"
  ON public.profiles
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Members can view their own profile
CREATE POLICY "Members can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Members can update their own profile
CREATE POLICY "Members can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Public read access for profiles (optional, for leaderboard/team view)
-- If you want strict privacy, remove this. But usually team members need to see each other.
CREATE POLICY "Members can view other members"
  ON public.profiles FOR SELECT
  USING (auth.role() = 'authenticated');


-- REQUESTS
-- Public can insert requests (for /join-us page)
CREATE POLICY "Public can insert requests"
  ON public.requests FOR INSERT
  WITH CHECK (true);

-- Only Admins can view/update requests
CREATE POLICY "Admins can view requests"
  ON public.requests FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update requests"
  ON public.requests FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- PROJECTS
-- Admins can do everything
CREATE POLICY "Admins can do everything on projects"
  ON public.projects
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Members can insert their own projects
CREATE POLICY "Members can insert own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Members can update/delete their own projects
CREATE POLICY "Members can update own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Members can delete own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

-- Everyone (authenticated) can view projects
CREATE POLICY "Authenticated users can view projects"
  ON public.projects FOR SELECT
  USING (auth.role() = 'authenticated');


-- 6. Storage Policies (Gallery)
-- Assuming 'gallery' bucket exists
-- Admins can upload/delete
-- Authenticated users can view

-- Note: You need to create the 'gallery' bucket in Supabase Storage if it doesn't exist.
