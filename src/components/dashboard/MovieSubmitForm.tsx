import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Film, Sparkles, Youtube, Loader2 } from "lucide-react";
import { toast } from "sonner";

const PREDEFINED_CATEGORIES = [
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "Thriller",
  "Science Fiction",
  "Romance",
  "Documentary",
  "Animation",
  "Adventure",
  "Crime",
  "Mystery",
  "Fantasy",
  "War",
  "Western",
  "Other"
];

const PREDEFINED_GENRES = [
  "Blockbuster",
  "Independent",
  "Art House",
  "Experimental",
  "Short Film",
  "Feature Film",
  "Anthology",
  "Biographical",
  "Historical",
  "Contemporary",
  "Period Piece",
  "Noir",
  "Other"
];

interface MovieSubmitFormProps {
  userId?: string;
  isAdmin?: boolean;
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const MovieSubmitForm = ({ userId, isAdmin = false, initialData, onSuccess, onCancel }: MovieSubmitFormProps) => {
  const [loading, setLoading] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState(initialData?.youtube_url || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnail_url || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [customCategory, setCustomCategory] = useState("");
  const [genre, setGenre] = useState(initialData?.genre || "");
  const [customGenre, setCustomGenre] = useState("");

  // Extract YouTube video ID and generate thumbnail
  const extractYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const [videoId, setVideoId] = useState(initialData?.youtube_video_id || "");

  useEffect(() => {
    if (youtubeUrl) {
      const extractedId = extractYouTubeId(youtubeUrl);
      if (extractedId) {
        setVideoId(extractedId);
        // Use maxresdefault for highest quality, fallback to hqdefault
        setThumbnailUrl(`https://img.youtube.com/vi/${extractedId}/maxresdefault.jpg`);
      }
    }
  }, [youtubeUrl]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const startTime = Date.now();

    try {
      const formData = new FormData(e.currentTarget);
      const finalCategory = category === "Other" ? customCategory.trim() : category;
      const finalGenre = genre === "Other" ? customGenre.trim() : genre;

      if (!category || (category === "Other" && !customCategory.trim())) {
        toast.error("Please select or specify a category");
        setLoading(false);
        return;
      }

      // Save custom category/genre in parallel (non-blocking)
      const customPromises = [];
      
      if (category === "Other" && customCategory.trim()) {
        customPromises.push(
          supabase
            .from('custom_categories')
            .insert({ name: customCategory.trim() })
            .select()
            .then(({ error }) => {
              if (error && !error.message?.includes('duplicate')) {
                console.warn('Custom category save error:', error);
              }
            })
        );
      }

      if (genre === "Other" && customGenre.trim()) {
        customPromises.push(
          supabase
            .from('custom_genres')
            .insert({ name: customGenre.trim() })
            .select()
            .then(({ error }) => {
              if (error && !error.message?.includes('duplicate')) {
                console.warn('Custom genre save error:', error);
              }
            })
        );
      }

      // Save custom categories/genres in parallel (don't wait)
      if (customPromises.length > 0) {
        Promise.all(customPromises).catch(err => console.warn('Error saving custom fields:', err));
      }

      const movieData: any = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        youtube_url: youtubeUrl,
        youtube_video_id: videoId,
        thumbnail_url: thumbnailUrl,
        category: finalCategory,
        genre: finalGenre || null,
      };

      // Only set status and uploaded_by for new submissions
      if (!initialData) {
        movieData.status = isAdmin ? 'approved' : 'pending';
        if (userId) {
          movieData.uploaded_by = userId;
        }
      } else if (isAdmin && formData.get('status')) {
        // Allow admin to update status
        movieData.status = formData.get('status') as string;
      }

      let error;
      
      if (initialData) {
        // Update existing film
        const result = await supabase
          .from('movies')
          .update(movieData)
          .eq('id', initialData.id);
        error = result.error;
      } else {
        // Insert new film
        const result = await supabase.from('movies').insert(movieData);
        error = result.error;
      }

      if (error) {
        toast.error(initialData ? "Failed to update film" : "Failed to submit film");
        console.error(error);
        setLoading(false);
        return;
      }

      const elapsed = Date.now() - startTime;
      console.log(`Form submission completed in ${elapsed}ms`);
      
      toast.success(
        initialData 
          ? "Film updated successfully!" 
          : (isAdmin ? "Film added successfully!" : "Film submitted! Awaiting admin approval.")
      );
      
      setLoading(false);
      onSuccess();
      
    } catch (error) {
      console.error('Submission error:', error);
      toast.error("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Title Input with 3D Effect */}
      <motion.div 
        className="space-y-2"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Label htmlFor="title" className="flex items-center gap-2">
          <Film className="h-4 w-4 text-primary" />
          Documentary Title *
        </Label>
        <Input 
          id="title" 
          name="title" 
          required 
          disabled={loading}
          className="transition-all duration-300 focus:scale-[1.02] focus:shadow-lg focus:shadow-primary/20"
          placeholder="Enter your documentary title..."
        />
      </motion.div>

      {/* Description with 3D Effect */}
      <motion.div 
        className="space-y-2"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          name="description" 
          rows={4} 
          disabled={loading}
          className="transition-all duration-300 focus:scale-[1.01] focus:shadow-lg focus:shadow-primary/20 resize-none"
                    placeholder="Tell us about your film..."
        />
      </motion.div>

      {/* YouTube URL with Preview */}
      <motion.div 
        className="space-y-2"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Label htmlFor="youtube_url" className="flex items-center gap-2">
          <Youtube className="h-4 w-4 text-red-600" />
          YouTube URL *
        </Label>
        <Input 
          id="youtube_url" 
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          type="url" 
          required 
          disabled={loading}
          className="transition-all duration-300 focus:scale-[1.02] focus:shadow-lg focus:shadow-red-600/20"
          placeholder="https://www.youtube.com/watch?v=..."
        />
        {thumbnailUrl && (
          <motion.div 
            className="mt-2 rounded-lg overflow-hidden border-2 border-primary/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <img src={thumbnailUrl} alt="Thumbnail Preview" className="w-full h-auto" />
            <p className="text-xs text-muted-foreground p-2 bg-card">✓ Thumbnail auto-extracted from YouTube</p>
          </motion.div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Dropdown */}
        <motion.div 
          className="space-y-2"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Label htmlFor="category" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-secondary" />
            Category *
          </Label>
          <Select value={category} onValueChange={setCategory} required disabled={loading}>
            <SelectTrigger className="transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-secondary/20">
              <SelectValue placeholder="Select category..." />
            </SelectTrigger>
            <SelectContent>
              {PREDEFINED_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {category === "Other" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Input
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Enter custom category..."
                className="mt-2"
                required
              />
            </motion.div>
          )}
        </motion.div>

        {/* Genre Dropdown */}
        <motion.div 
          className="space-y-2"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Label htmlFor="genre">Genre</Label>
          <Select value={genre} onValueChange={setGenre} disabled={loading}>
            <SelectTrigger className="transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20">
              <SelectValue placeholder="Select genre..." />
            </SelectTrigger>
            <SelectContent>
              {PREDEFINED_GENRES.map((g) => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {genre === "Other" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Input
                value={customGenre}
                onChange={(e) => setCustomGenre(e.target.value)}
                placeholder="Enter custom genre..."
                className="mt-2"
              />
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Status Field (Admin Only, Edit Mode Only) */}
      {isAdmin && initialData && (
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <Label htmlFor="status">Status *</Label>
          <Select name="status" defaultValue={initialData.status} disabled={loading}>
            <SelectTrigger className="glass">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass">
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div 
        className="flex justify-end space-x-3 pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          disabled={loading}
          className="hover:scale-105 transition-transform"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={loading || !youtubeUrl}
          className="bg-gradient-to-r from-primary to-red-600 hover:scale-105 transition-transform shadow-lg shadow-primary/50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {initialData ? 'Updating...' : 'Submitting...'}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Film className="h-4 w-4" />
              {initialData ? 'Update Film' : (isAdmin ? "Add Film" : "Submit Film")}
            </span>
          )}
        </Button>
      </motion.div>

      {/* Info Note */}
      <motion.div 
        className="p-4 rounded-lg bg-card/50 border border-border/50 backdrop-blur-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-sm text-muted-foreground flex items-start gap-2">
          <Youtube className="h-4 w-4 mt-0.5 text-red-600 flex-shrink-0" />
          <span>
            Thumbnail is automatically extracted from YouTube. Duration will be displayed when video is played.
            {!isAdmin && " Your submission will be reviewed by our team before going live."}
          </span>
        </p>
      </motion.div>
    </motion.form>
  );
};

export default MovieSubmitForm;

