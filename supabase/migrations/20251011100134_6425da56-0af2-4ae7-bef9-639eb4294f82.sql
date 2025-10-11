-- Create function to increment movie views
CREATE OR REPLACE FUNCTION public.increment_movie_views(movie_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.movies
  SET views = COALESCE(views, 0) + 1
  WHERE id = movie_id;
END;
$$;