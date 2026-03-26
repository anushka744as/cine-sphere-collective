-- Allow every authenticated or anonymous user to do anything on each table.

-- Profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all profiles" ON public.profiles
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Movies
DROP POLICY IF EXISTS "Approved movies are viewable by everyone" ON public.movies;
DROP POLICY IF EXISTS "Authenticated users can insert movies" ON public.movies;
DROP POLICY IF EXISTS "Users can update their own movies" ON public.movies;
DROP POLICY IF EXISTS "Users can delete their own movies" ON public.movies;
DROP POLICY IF EXISTS "Users can update their own pending films" ON public.movies;
DROP POLICY IF EXISTS "Users can delete their own pending films" ON public.movies;
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all movies" ON public.movies
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Watchlists
DROP POLICY IF EXISTS "Watchlists are accessible to owner" ON public.watchlists;
DROP POLICY IF EXISTS "Users can insert watchlists entries" ON public.watchlists;
DROP POLICY IF EXISTS "Users can delete their own watchlist entries" ON public.watchlists;
ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all watchlists" ON public.watchlists
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- User roles
DROP POLICY IF EXISTS "User roles are viewable by everyone" ON public.user_roles;
DROP POLICY IF EXISTS "Users can manage their own user roles" ON public.user_roles;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all user roles" ON public.user_roles
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);
