import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Film } from '@/data/dummyFilms';

interface WatchlistContextType {
  watchlist: Film[];
  addToWatchlist: (film: Film) => void;
  removeFromWatchlist: (filmId: string) => void;
  isInWatchlist: (filmId: string) => boolean;
  clearWatchlist: () => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider = ({ children }: { children: ReactNode }) => {
  const [watchlist, setWatchlist] = useState<Film[]>(() => {
    const saved = localStorage.getItem('watchlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = (film: Film) => {
    setWatchlist((prev) => {
      if (prev.find((f) => f.id === film.id)) return prev;
      return [...prev, film];
    });
  };

  const removeFromWatchlist = (filmId: string) => {
    setWatchlist((prev) => prev.filter((f) => f.id !== filmId));
  };

  const isInWatchlist = (filmId: string) => {
    return watchlist.some((f) => f.id === filmId);
  };

  const clearWatchlist = () => {
    setWatchlist([]);
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
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};
