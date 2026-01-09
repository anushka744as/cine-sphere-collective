-- Drop restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Admins can insert movies" ON public.movies;
DROP POLICY IF EXISTS "Admins can update all movies" ON public.movies;
DROP POLICY IF EXISTS "Admins can delete movies" ON public.movies;
DROP POLICY IF EXISTS "Approved movies are viewable by everyone" ON public.movies;

-- Create permissive policies (default behavior)
CREATE POLICY "Admins can insert movies" 
ON public.movies 
FOR INSERT 
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all movies" 
ON public.movies 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete movies" 
ON public.movies 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Approved movies are viewable by everyone" 
ON public.movies 
FOR SELECT 
USING ((status = 'approved') OR (auth.uid() = uploaded_by) OR has_role(auth.uid(), 'admin'::app_role));

-- Also allow users to insert their own movies (for user dashboard submissions)
CREATE POLICY "Users can insert their own movies" 
ON public.movies 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = uploaded_by);