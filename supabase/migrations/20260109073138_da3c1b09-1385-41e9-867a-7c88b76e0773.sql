-- Add missing columns to movies table
ALTER TABLE public.movies 
ADD COLUMN IF NOT EXISTS year integer,
ADD COLUMN IF NOT EXISTS country text,
ADD COLUMN IF NOT EXISTS language text,
ADD COLUMN IF NOT EXISTS director text,
ADD COLUMN IF NOT EXISTS director_bio text,
ADD COLUMN IF NOT EXISTS cinematographer text,
ADD COLUMN IF NOT EXISTS youtube_video_id text,
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS youtube_views integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS cast_members text[],
ADD COLUMN IF NOT EXISTS awards text[],
ADD COLUMN IF NOT EXISTS characteristics text[];

-- Create watchlists table
CREATE TABLE IF NOT EXISTS public.watchlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  film_id text NOT NULL,
  film_snapshot jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on watchlists
ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to manage their own watchlist
CREATE POLICY "Users can view their own watchlist" 
ON public.watchlists 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own watchlist" 
ON public.watchlists 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their own watchlist" 
ON public.watchlists 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_watchlists_user_id ON public.watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlists_film_id ON public.watchlists(film_id);