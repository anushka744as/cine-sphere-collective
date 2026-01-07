import { useState, useEffect, useRef } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film } from '@/data/dummyFilms';

const categories = ["All", "Drama", "Romance", "Comedy", "Thriller", "Animation"];
const characteristics = ["PSYCHOLOGICAL", "DRAMA", "INTIMATE", "PROVOCATIVE", "NOSTALGIC", "POETIC", "ROMANTIC", "MELANCHOLIC", "HAUNTING", "MASTERFUL", "ETHEREAL", "EMOTIONAL"];
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SearchBarProps {
  films: Film[];
  onSearchResults: (results: Film[]) => void;
  onClose?: () => void;
  isOpen?: boolean;
}

export const SearchBar = ({ films, onSearchResults, onClose, isOpen = true }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCharacteristics, setSelectedCharacteristics] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const filtered = films.filter((film) => {
      const matchesQuery =
        query === '' ||
        film.title.toLowerCase().includes(query.toLowerCase()) ||
        film.director.toLowerCase().includes(query.toLowerCase()) ||
        film.description.toLowerCase().includes(query.toLowerCase()) ||
        film.cast.some((c) => c.toLowerCase().includes(query.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All' || film.category === selectedCategory;

      const matchesCharacteristics =
        selectedCharacteristics.length === 0 ||
        selectedCharacteristics.some((char) =>
          film.characteristics.includes(char)
        );

      return matchesQuery && matchesCategory && matchesCharacteristics;
    });

    onSearchResults(filtered);
  }, [query, selectedCategory, selectedCharacteristics, films, onSearchResults]);

  const toggleCharacteristic = (char: string) => {
    setSelectedCharacteristics((prev) =>
      prev.includes(char) ? prev.filter((c) => c !== char) : [...prev, char]
    );
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedCategory('All');
    setSelectedCharacteristics([]);
  };

  const hasActiveFilters = query !== '' || selectedCategory !== 'All' || selectedCharacteristics.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full bg-background/95 backdrop-blur-md border-b border-border"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search by title, director, or cast..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 bg-muted/50 border-border"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-primary text-primary-foreground' : ''}
          >
            <Filter className="h-4 w-4" />
          </Button>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
          )}

          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-4">
                {/* Categories */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Category</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Badge
                        key={category}
                        variant={selectedCategory === category ? 'default' : 'outline'}
                        className="cursor-pointer hover:bg-primary/20"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Characteristics */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Characteristics</p>
                  <div className="flex flex-wrap gap-2">
                    {characteristics.slice(0, 12).map((char) => (
                      <Badge
                        key={char}
                        variant={selectedCharacteristics.includes(char) ? 'default' : 'outline'}
                        className="cursor-pointer hover:bg-primary/20 text-xs"
                        onClick={() => toggleCharacteristic(char)}
                      >
                        {char}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
