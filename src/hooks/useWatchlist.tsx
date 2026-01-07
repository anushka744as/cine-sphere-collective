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

export const WatchlistProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<Film[]>(getSavedWatchlist);
  const [entryIds, setEntryIds] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setWatchlist([]);
      setEntryIds({});
      const fetchWatchlist = async () => {
        const { data, error } = await supabase
          .from("watchlists")
          .select("id, film_id, film_snapshot")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Failed to load watchlist:", error);
          return;
        }

        const nextEntryIds: Record<string, string> = {};
        const nextWatchlist: Film[] = [];

        data?.forEach((entry) => {
          let film: Film | null = null;
          if (entry.film_snapshot) {
            film = entry.film_snapshot as Film;
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
      const { data, error } = await supabase
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
      const { error } = await supabase
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
      const { error } = await supabase
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
