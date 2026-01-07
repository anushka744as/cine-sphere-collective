-- Create user-specific watchlist storage
CREATE TABLE public.watchlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  film_id text NOT NULL,
  film_snapshot jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_watchlists_user ON public.watchlists(user_id);
CREATE INDEX idx_watchlists_user_film ON public.watchlists(user_id, film_id);

CREATE POLICY "Watchlists are accessible to owner"
  ON public.watchlists FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert watchlists entries"
  ON public.watchlists FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own watchlist entries"
  ON public.watchlists FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
