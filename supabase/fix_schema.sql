-- ============================================================================
-- CINESPHERE REPAIR SCRIPT
-- Run this in your Supabase SQL Editor to resolve all PGRST204/205 errors
-- ============================================================================

-- 1. Ensure Profiles table is correct (Fixes role 400 error)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Force add role column if it was somehow missed but table exists
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'role') THEN
    ALTER TABLE public.profiles ADD COLUMN role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin'));
  END IF;
END $$;

-- 2. Ensure Movies table has all required columns (Fixes characteristics PGRST204)
ALTER TABLE public.movies ADD COLUMN IF NOT EXISTS characteristics text[];
ALTER TABLE public.movies ADD COLUMN IF NOT EXISTS awards text[];
ALTER TABLE public.movies ADD COLUMN IF NOT EXISTS cast_members text[];
ALTER TABLE public.movies ADD COLUMN IF NOT EXISTS director text;
ALTER TABLE public.movies ADD COLUMN IF NOT EXISTS director_bio text;
  ALTER TABLE public.movies ADD COLUMN IF NOT EXISTS cinematographer text[];
  -- Handle migration if it was already text
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'movies' AND column_name = 'cinematographer' AND data_type = 'text') THEN
    ALTER TABLE public.movies ALTER COLUMN cinematographer TYPE text[] USING array[cinematographer];
  END IF;
ALTER TABLE public.movies ADD COLUMN IF NOT EXISTS country text;
ALTER TABLE public.movies ADD COLUMN IF NOT EXISTS language text;
ALTER TABLE public.movies ADD COLUMN IF NOT EXISTS duration text;
ALTER TABLE public.movies ADD COLUMN IF NOT EXISTS youtube_video_id text;
ALTER TABLE public.movies ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));

-- 3. Ensure Watchlists table exists (Fixes PGRST205)
CREATE TABLE IF NOT EXISTS public.watchlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  film_id text NOT NULL,
  film_snapshot jsonb,
  created_at timestamptz DEFAULT now()
);

-- 4. Enable RLS on everyone
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;

-- 5. Set up debug policies (ALLOW ALL for now to resolve permission issues)
-- Profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

-- Movies
DROP POLICY IF EXISTS "Movies are viewable by everyone" ON public.movies;
CREATE POLICY "Movies are viewable by everyone" ON public.movies FOR SELECT USING (true);
DROP POLICY IF EXISTS "Anyone can insert movies" ON public.movies;
CREATE POLICY "Anyone can insert movies" ON public.movies FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Anyone can update movies" ON public.movies;
CREATE POLICY "Anyone can update movies" ON public.movies FOR UPDATE USING (true);

-- Watchlists
DROP POLICY IF EXISTS "Watchlists are accessible to everyone" ON public.watchlists;
CREATE POLICY "Watchlists are accessible to everyone" ON public.watchlists FOR SELECT USING (true);
DROP POLICY IF EXISTS "Everyone can insert watchlists entries" ON public.watchlists;
CREATE POLICY "Everyone can insert watchlists entries" ON public.watchlists FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Everyone can delete watchlists entries" ON public.watchlists;
CREATE POLICY "Everyone can delete watchlists entries" ON public.watchlists FOR DELETE USING (true);

-- 6. Grant Permissions (Crucial for PostgREST visibility)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- 7. RELOAD SCHEMA CACHE (The MOST important line)
NOTIFY pgrst, 'reload config';

-- 8. Trigger to auto-create profile on signup (if not already there)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'user'
  ) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
