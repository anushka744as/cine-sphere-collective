-- Align movies/profiles relationship so nested selects to profiles(role) are valid.

-- Ensure profiles have a role column (used in joins).
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'profiles_role_check'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'admin'));
  END IF;
END;
$$;

-- Point movies.uploaded_by at profiles instead of auth.users so Rest requests can expand profiles(role).
ALTER TABLE public.movies
  DROP CONSTRAINT IF EXISTS movies_uploaded_by_fkey;

ALTER TABLE public.movies
  ADD CONSTRAINT movies_uploaded_by_fkey
  FOREIGN KEY (uploaded_by) REFERENCES public.profiles(id) ON DELETE SET NULL;
