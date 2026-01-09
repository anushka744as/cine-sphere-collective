import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Film, dummyFilms } from "@/data/dummyFilms";

interface WatchlistContextType {
  watchlist: Film[];
  addToWatchlist: (film: Film) => Promise<void>;
  removeFromWatchlist: (filmId: string) => Promise<void>;
  isInWatchlist: (filmId: string) => boolean;
  clearWatchlist: () => Promise<void>;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

const getSavedWatchlist = (): Film[] => {
  if (typeof window === "undefined") return [];
  const saved = window.localStorage.getItem("watchlist");
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch (error) {
    console.error("Failed to parse watchlist from localStorage", error);
    return [];
  }
};

const persistLocalWatchlist = (list: Film[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("watchlist", JSON.stringify(list));
};

// Watchlist entry from DB
interface WatchlistEntry {
  id: string;
  user_id: string;
  film_id: string;
  film_snapshot: Record<string, unknown> | null;
  created_at: string;
}

export const WatchlistProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<Film[]>(getSavedWatchlist);
  const [entryIds, setEntryIds] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setWatchlist([]);
      setEntryIds({});
      const fetchWatchlist = async () => {
        // Use type assertion since watchlists table may not be in generated types
        const { data, error } = await (supabase as any)
          .from("watchlists")
          .select("id, film_id, film_snapshot")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Failed to load watchlist:", error);
          return;
        }

        const entries = data as WatchlistEntry[] | null;
        const nextEntryIds: Record<string, string> = {};
        const nextWatchlist: Film[] = [];

        entries?.forEach((entry) => {
          let film: Film | null = null;
          if (entry.film_snapshot && typeof entry.film_snapshot === 'object') {
            const snapshot = entry.film_snapshot;
            film = {
              id: String(snapshot.id || entry.film_id),
              title: String(snapshot.title || ''),
              director: String(snapshot.director || ''),
              directorBio: String(snapshot.directorBio || ''),
              year: Number(snapshot.year) || 0,
              duration: String(snapshot.duration || ''),
              category: String(snapshot.category || ''),
              description: String(snapshot.description || ''),
              thumbnail: String(snapshot.thumbnail || ''),
              videoUrl: String(snapshot.videoUrl || ''),
              characteristics: Array.isArray(snapshot.characteristics) ? snapshot.characteristics as string[] : [],
              awards: Array.isArray(snapshot.awards) ? snapshot.awards as string[] : [],
              cast: Array.isArray(snapshot.cast) ? snapshot.cast as string[] : [],
              cinematographer: Array.isArray(snapshot.cinematographer) 
                ? snapshot.cinematographer as string[] 
                : (snapshot.cinematographer ? [String(snapshot.cinematographer)] : []),
              country: String(snapshot.country || ''),
              language: String(snapshot.language || ''),
              directorImage: snapshot.directorImage ? String(snapshot.directorImage) : undefined,
            };
          } else {
            film = dummyFilms.find((item) => item.id === entry.film_id) ?? null;
          }
          if (!film) return;
          nextWatchlist.push(film);
          nextEntryIds[film.id] = entry.id;
        });

        setWatchlist(nextWatchlist);
        setEntryIds(nextEntryIds);
      };

      fetchWatchlist();
    } else {
      setWatchlist(getSavedWatchlist());
      setEntryIds({});
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      persistLocalWatchlist(watchlist);
    }
  }, [watchlist, user]);

  const addToWatchlist = async (film: Film) => {
    setWatchlist((prev) => {
      if (prev.find((f) => f.id === film.id)) return prev;
      return [...prev, film];
    });

    if (user) {
      const { data, error } = await (supabase as any)
        .from("watchlists")
        .insert({
          user_id: user.id,
          film_id: film.id,
          film_snapshot: film,
        })
        .select("id")
        .single();

      if (error) {
        console.error("Failed to persist watchlist entry:", error);
        return;
      }

      if (data?.id) {
        setEntryIds((prev) => ({ ...prev, [film.id]: data.id }));
      }
    }
  };

  const removeFromWatchlist = async (filmId: string) => {
    setWatchlist((prev) => prev.filter((f) => f.id !== filmId));
    setEntryIds((prev) => {
      const next = { ...prev };
      delete next[filmId];
      return next;
    });

    if (user && entryIds[filmId]) {
      const { error } = await (supabase as any)
        .from("watchlists")
        .delete()
        .eq("id", entryIds[filmId]);

      if (error) {
        console.error("Failed to remove watchlist entry:", error);
      }
    }
  };

  const isInWatchlist = (filmId: string) => {
    return watchlist.some((f) => f.id === filmId);
  };

  const clearWatchlist = async () => {
    setWatchlist([]);
    setEntryIds({});

    if (user) {
      const { error } = await (supabase as any)
        .from("watchlists")
        .delete()
        .eq("user_id", user.id);

      if (error) {
        console.error("Failed to clear watchlist:", error);
      }
    }
  };

  return (
    <WatchlistContext.Provider
      value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist, clearWatchlist }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
};
