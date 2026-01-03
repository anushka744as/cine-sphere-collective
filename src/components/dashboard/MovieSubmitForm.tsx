import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Film, Youtube, Loader2 } from "lucide-react";
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

  const extractYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const [videoId, setVideoId] = useState("");

  useEffect(() => {
    if (youtubeUrl) {
      const extractedId = extractYouTubeId(youtubeUrl);
      if (extractedId) {
        setVideoId(extractedId);
        setThumbnailUrl(`https://img.youtube.com/vi/${extractedId}/maxresdefault.jpg`);
      }
    }
  }, [youtubeUrl]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const finalCategory = category === "Other" ? customCategory.trim() : category;
      const finalGenre = genre === "Other" ? customGenre.trim() : genre;

      if (!category || (category === "Other" && !customCategory.trim())) {
        toast.error("Please select or specify a category");
        setLoading(false);
        return;
      }

      const movieData: any = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        youtube_url: youtubeUrl,
        thumbnail_url: thumbnailUrl,
        category: finalCategory,
        genre: finalGenre || null,
      };

      if (!initialData) {
        movieData.status = isAdmin ? 'approved' : 'pending';
        if (userId) {
          movieData.uploaded_by = userId;
        }
      } else if (isAdmin && formData.get('status')) {
        movieData.status = formData.get('status') as string;
      }

      let error;
      
      if (initialData) {
        const result = await supabase
          .from('movies')
          .update(movieData)
          .eq('id', initialData.id);
        error = result.error;
      } else {
        const result = await supabase.from('movies').insert(movieData);
        error = result.error;
      }

      if (error) {
        toast.error(initialData ? "Failed to update film" : "Failed to submit film");
        console.error(error);
        setLoading(false);
        return;
      }
      
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Input */}
      <div className="space-y-2">
        <Label htmlFor="title" className="flex items-center gap-2 text-foreground/70">
          <Film className="h-4 w-4" />
          Title *
        </Label>
        <Input 
          id="title" 
          name="title" 
          required 
          disabled={loading}
          defaultValue={initialData?.title || ""}
          className="bg-card border-border focus:border-foreground/30"
          placeholder="Enter film title..."
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-foreground/70">Description</Label>
        <Textarea 
          id="description" 
          name="description" 
          rows={4} 
          disabled={loading}
          defaultValue={initialData?.description || ""}
          className="bg-card border-border focus:border-foreground/30 resize-none"
          placeholder="Tell us about your film..."
        />
      </div>

      {/* YouTube URL */}
      <div className="space-y-2">
        <Label htmlFor="youtube_url" className="flex items-center gap-2 text-foreground/70">
          <Youtube className="h-4 w-4" />
          YouTube URL *
        </Label>
        <Input 
          id="youtube_url" 
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          type="url" 
          required 
          disabled={loading}
          className="bg-card border-border focus:border-foreground/30"
          placeholder="https://www.youtube.com/watch?v=..."
        />
        {thumbnailUrl && (
          <div className="mt-2 rounded overflow-hidden border border-border">
            <img src={thumbnailUrl} alt="Thumbnail Preview" className="w-full h-auto" />
            <p className="text-xs text-foreground/40 p-2 bg-card">Thumbnail auto-extracted from YouTube</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="category" className="text-foreground/70">Category *</Label>
          <Select value={category} onValueChange={setCategory} required disabled={loading}>
            <SelectTrigger className="bg-card border-border">
              <SelectValue placeholder="Select category..." />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              {PREDEFINED_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {category === "Other" && (
            <Input
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Enter custom category..."
              className="mt-2 bg-card border-border"
              required
            />
          )}
        </div>

        {/* Genre Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="genre" className="text-foreground/70">Genre</Label>
          <Select value={genre} onValueChange={setGenre} disabled={loading}>
            <SelectTrigger className="bg-card border-border">
              <SelectValue placeholder="Select genre..." />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              {PREDEFINED_GENRES.map((g) => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {genre === "Other" && (
            <Input
              value={customGenre}
              onChange={(e) => setCustomGenre(e.target.value)}
              placeholder="Enter custom genre..."
              className="mt-2 bg-card border-border"
            />
          )}
        </div>
      </div>

      {/* Status Field (Admin Only, Edit Mode Only) */}
      {isAdmin && initialData && (
        <div className="space-y-2">
          <Label htmlFor="status" className="text-foreground/70">Status *</Label>
          <Select name="status" defaultValue={initialData.status} disabled={loading}>
            <SelectTrigger className="bg-card border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          disabled={loading}
          className="border-foreground/20"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={loading || !youtubeUrl}
          className="bg-foreground text-background hover:bg-foreground/90"
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
      </div>

      {/* Info Note */}
      <div className="p-4 rounded bg-card border border-border">
        <p className="text-sm text-foreground/50 flex items-start gap-2">
          <Youtube className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>
            Thumbnail is automatically extracted from YouTube.
            {!isAdmin && " Your submission will be reviewed before going live."}
          </span>
        </p>
      </div>
    </form>
  );
};

export default MovieSubmitForm;
