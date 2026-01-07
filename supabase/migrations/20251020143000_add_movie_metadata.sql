-- Add metadata fields needed by the submission form
ALTER TABLE public.movies
  ADD COLUMN IF NOT EXISTS year integer,
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS language text,
  ADD COLUMN IF NOT EXISTS director text,
  ADD COLUMN IF NOT EXISTS director_bio text,
  ADD COLUMN IF NOT EXISTS cinematographer text,
  ADD COLUMN IF NOT EXISTS cast_members text[],
  ADD COLUMN IF NOT EXISTS awards text[],
  ADD COLUMN IF NOT EXISTS characteristics text[],
  ADD COLUMN IF NOT EXISTS youtube_video_id text,
  ADD COLUMN IF NOT EXISTS youtube_views integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_movies_youtube_views ON public.movies(youtube_views DESC);
CREATE INDEX IF NOT EXISTS idx_movies_is_featured ON public.movies(is_featured);
