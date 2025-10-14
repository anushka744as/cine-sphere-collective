-- ============================================================================
-- CINESPHERE DATABASE SCHEMA
-- Complete schema for film showcase platform
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- DROP EXISTING TABLES (for clean setup)
-- ============================================================================
DROP TABLE IF EXISTS public.movies CASCADE;
DROP TABLE IF EXISTS public.custom_genres CASCADE;
DROP TABLE IF EXISTS public.custom_categories CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- ============================================================================
-- PROFILES TABLE (Consolidated with roles)
-- ============================================================================
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- MOVIES TABLE
-- ============================================================================
CREATE TABLE public.movies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  youtube_url text NOT NULL,
  youtube_video_id text,
  thumbnail_url text,
  category text NOT NULL,
  genre text,
  duration text,
  views integer DEFAULT 0,
  youtube_views integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  uploaded_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- CUSTOM CATEGORIES TABLE
-- ============================================================================
CREATE TABLE public.custom_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  usage_count integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- CUSTOM GENRES TABLE
-- ============================================================================
CREATE TABLE public.custom_genres (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  usage_count integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX idx_movies_status ON public.movies(status);
CREATE INDEX idx_movies_category ON public.movies(category);
CREATE INDEX idx_movies_uploaded_by ON public.movies(uploaded_by);
CREATE INDEX idx_movies_created_at ON public.movies(created_at DESC);
CREATE INDEX idx_movies_views ON public.movies(views DESC);
CREATE INDEX idx_movies_youtube_views ON public.movies(youtube_views DESC);
CREATE INDEX idx_movies_is_featured ON public.movies(is_featured);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_custom_categories_name ON public.custom_categories(name);
CREATE INDEX idx_custom_genres_name ON public.custom_genres(name);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment movie views
CREATE OR REPLACE FUNCTION public.increment_movie_views(movie_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.movies
  SET views = views + 1
  WHERE id = movie_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update updated_at on profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to update updated_at on movies
DROP TRIGGER IF EXISTS update_movies_updated_at ON public.movies;
CREATE TRIGGER update_movies_updated_at
  BEFORE UPDATE ON public.movies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_genres ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES POLICIES
-- ============================================================================

-- Everyone can view profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can insert their own profile
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- MOVIES POLICIES
-- ============================================================================

-- Everyone can view approved movies
DROP POLICY IF EXISTS "Approved movies are viewable by everyone" ON public.movies;
CREATE POLICY "Approved movies are viewable by everyone"
  ON public.movies FOR SELECT
  USING (status = 'approved' OR uploaded_by = auth.uid() OR public.is_admin(auth.uid()));

-- Authenticated users can insert movies
DROP POLICY IF EXISTS "Authenticated users can insert movies" ON public.movies;
CREATE POLICY "Authenticated users can insert movies"
  ON public.movies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

-- Users can update their own movies, admins can update any
DROP POLICY IF EXISTS "Users can update their own movies" ON public.movies;
CREATE POLICY "Users can update their own movies"
  ON public.movies FOR UPDATE
  TO authenticated
  USING (auth.uid() = uploaded_by OR public.is_admin(auth.uid()))
  WITH CHECK (auth.uid() = uploaded_by OR public.is_admin(auth.uid()));

-- Users can delete their own movies, admins can delete any
DROP POLICY IF EXISTS "Users can delete their own movies" ON public.movies;
CREATE POLICY "Users can delete their own movies"
  ON public.movies FOR DELETE
  TO authenticated
  USING (auth.uid() = uploaded_by OR public.is_admin(auth.uid()));

-- ============================================================================
-- CUSTOM CATEGORIES POLICIES
-- ============================================================================

-- Everyone can view categories
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.custom_categories;
CREATE POLICY "Categories are viewable by everyone"
  ON public.custom_categories FOR SELECT
  USING (true);

-- Authenticated users can insert categories
DROP POLICY IF EXISTS "Authenticated users can insert categories" ON public.custom_categories;
CREATE POLICY "Authenticated users can insert categories"
  ON public.custom_categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Admins can update categories
DROP POLICY IF EXISTS "Admins can update categories" ON public.custom_categories;
CREATE POLICY "Admins can update categories"
  ON public.custom_categories FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Admins can delete categories
DROP POLICY IF EXISTS "Admins can delete categories" ON public.custom_categories;
CREATE POLICY "Admins can delete categories"
  ON public.custom_categories FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ============================================================================
-- CUSTOM GENRES POLICIES
-- ============================================================================

-- Everyone can view genres
DROP POLICY IF EXISTS "Genres are viewable by everyone" ON public.custom_genres;
CREATE POLICY "Genres are viewable by everyone"
  ON public.custom_genres FOR SELECT
  USING (true);

-- Authenticated users can insert genres
DROP POLICY IF EXISTS "Authenticated users can insert genres" ON public.custom_genres;
CREATE POLICY "Authenticated users can insert genres"
  ON public.custom_genres FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Admins can update genres
DROP POLICY IF EXISTS "Admins can update genres" ON public.custom_genres;
CREATE POLICY "Admins can update genres"
  ON public.custom_genres FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Admins can delete genres
DROP POLICY IF EXISTS "Admins can delete genres" ON public.custom_genres;
CREATE POLICY "Admins can delete genres"
  ON public.custom_genres FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ============================================================================
-- SEED DATA (Optional - Create first admin user)
-- ============================================================================

-- To create an admin user, first sign up through the app, then run:
-- UPDATE public.profiles SET role = 'admin' WHERE id = 'YOUR_USER_ID';

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;

-- Grant all on tables
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant all on sequences
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role, authenticated;

-- Grant execute on functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- ============================================================================
-- NOTES
-- ============================================================================
-- 
-- 1. FIRST ADMIN SETUP:
--    After signup, make yourself admin by running in SQL Editor:
--    UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@example.com';
--
-- 2. VIEWS COUNT:
--    Views are stored in database and can be incremented using:
--    SELECT public.increment_movie_views('movie-id');
--    YouTube API integration for real-time views would require API key and additional setup.
--
-- 3. YOUTUBE METADATA:
--    Thumbnails are auto-extracted from YouTube URLs in the frontend.
--    For duration and real views, you would need YouTube Data API v3.
--
-- 4. CUSTOM CATEGORIES/GENRES:
--    Users can add custom categories/genres which are saved for future use.
--
-- ============================================================================
