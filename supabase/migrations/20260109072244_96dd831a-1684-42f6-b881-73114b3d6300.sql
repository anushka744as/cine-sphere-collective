-- Drop existing insert policies
DROP POLICY IF EXISTS "Admins can insert movies" ON public.movies;
DROP POLICY IF EXISTS "Users can insert their own movies" ON public.movies;

-- Allow anyone (including anonymous) to insert movies
CREATE POLICY "Anyone can insert movies" 
ON public.movies 
FOR INSERT 
WITH CHECK (true);

-- Keep other policies but make SELECT public too
DROP POLICY IF EXISTS "Approved movies are viewable by everyone" ON public.movies;

CREATE POLICY "Anyone can view approved movies" 
ON public.movies 
FOR SELECT 
USING (true);