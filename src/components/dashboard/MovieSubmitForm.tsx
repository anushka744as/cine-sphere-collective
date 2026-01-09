import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Film, Youtube, Loader2, Plus, X, Award, Users, Camera, Globe, Languages } from "lucide-react";
import { toast } from "sonner";
import { AwardCard } from "@/components/AwardCard";

const PREDEFINED_CATEGORIES = [
  "Action", "Comedy", "Drama", "Horror", "Thriller", "Science Fiction",
  "Romance", "Documentary", "Animation", "Adventure", "Crime", "Mystery",
  "Fantasy", "War", "Western", "Other"
];

const PREDEFINED_GENRES = [
  "Blockbuster", "Independent", "Art House", "Experimental", "Short Film",
  "Feature Film", "Anthology", "Biographical", "Historical", "Contemporary",
  "Period Piece", "Noir", "Coming-of-Age", "Slice of Life", "Psychological Drama",
  "Romantic Drama", "Courtroom Drama", "Dark Comedy", "Fantasy Drama", "Other"
];

const CHARACTERISTICS = [
  "PSYCHOLOGICAL", "DRAMA", "INTIMATE", "PROVOCATIVE", "NOSTALGIC", "POETIC",
  "ROMANTIC", "MELANCHOLIC", "HAUNTING", "MASTERFUL", "ETHEREAL", "EMOTIONAL",
  "GRIPPING", "COMPLEX", "SURREAL", "BOLD", "HEARTWARMING", "WITTY", "MEDITATIVE",
  "PEACEFUL", "TOUCHING", "BEAUTIFUL", "BITTERSWEET", "UNFORGETTABLE"
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
  const [activeSection, setActiveSection] = useState<'basic' | 'details' | 'credits'>('basic');

  // Basic Info
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [youtubeUrl, setYoutubeUrl] = useState(initialData?.youtube_url || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnail_url || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [customCategory, setCustomCategory] = useState("");
  const [genre, setGenre] = useState(initialData?.genre || "");
  const [customGenre, setCustomGenre] = useState("");

  // Extended Details
  const [year, setYear] = useState(initialData?.year?.toString() || new Date().getFullYear().toString());
  const [duration, setDuration] = useState(initialData?.duration || "");
  const [country, setCountry] = useState(initialData?.country || "");
  const [language, setLanguage] = useState(initialData?.language || "");
  const [selectedCharacteristics, setSelectedCharacteristics] = useState<string[]>(initialData?.characteristics || []);
  const [youtubeVideoId, setYoutubeVideoId] = useState(initialData?.youtube_video_id || "");

  // Credits
  const [director, setDirector] = useState(initialData?.director || "");
  const [directorBio, setDirectorBio] = useState(initialData?.director_bio || "");
  const [cinematographer, setCinematographer] = useState<string[]>(
    Array.isArray(initialData?.cinematographer)
      ? initialData.cinematographer
      : (initialData?.cinematographer ? [initialData.cinematographer] : [])
  );
  const [newCinematographer, setNewCinematographer] = useState("");
  const [cast, setCast] = useState<string[]>(initialData?.cast_members || []);
  const [newCastMember, setNewCastMember] = useState("");

  // Awards
  const [awards, setAwards] = useState<string[]>(initialData?.awards || []);
  const [newAward, setNewAward] = useState("");

  const extractYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  useEffect(() => {
    if (!youtubeUrl) {
      setThumbnailUrl("");
      setYoutubeVideoId("");
      return;
    }

    const extractedId = extractYouTubeId(youtubeUrl);
    if (extractedId) {
      setThumbnailUrl(`https://img.youtube.com/vi/${extractedId}/maxresdefault.jpg`);
      setYoutubeVideoId(extractedId);
    } else {
      setThumbnailUrl("");
      setYoutubeVideoId("");
    }
  }, [youtubeUrl]);

  const toggleCharacteristic = (char: string) => {
    setSelectedCharacteristics(prev =>
      prev.includes(char) ? prev.filter(c => c !== char) : [...prev, char]
    );
  };

  const addCinematographer = () => {
    if (newCinematographer.trim() && !cinematographer.includes(newCinematographer.trim())) {
      setCinematographer([...cinematographer, newCinematographer.trim()]);
      setNewCinematographer("");
    }
  };

  const removeCinematographer = (member: string) => {
    setCinematographer(cinematographer.filter(c => c !== member));
  };

  const addCastMember = () => {
    if (newCastMember.trim() && !cast.includes(newCastMember.trim())) {
      setCast([...cast, newCastMember.trim()]);
      setNewCastMember("");
    }
  };

  const removeCastMember = (member: string) => {
    setCast(cast.filter(c => c !== member));
  };

  const addAward = () => {
    if (newAward.trim() && !awards.includes(newAward.trim())) {
      setAwards([...awards, newAward.trim()]);
      setNewAward("");
    }
  };

  const removeAward = (award: string) => {
    setAwards(awards.filter(a => a !== award));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalCategory = category === "Other" ? customCategory.trim() : category;
      const finalGenre = genre === "Other" ? customGenre.trim() : genre;

      if (!category || (category === "Other" && !customCategory.trim())) {
        toast.error("Please select or specify a category");
        setLoading(false);
        return;
      }

      if (!title.trim() || !youtubeUrl.trim()) {
        toast.error("Title and YouTube URL are required");
        setLoading(false);
        return;
      }

      if (!director.trim()) {
        toast.error("Director name is required");
        setLoading(false);
        return;
      }

      const parsedYear = year ? parseInt(year, 10) : null;
      const normalizedYear = Number.isNaN(parsedYear) ? null : parsedYear;

      const movieData: any = {
        title: title.trim(),
        description: description.trim(),
        youtube_url: youtubeUrl.trim(),
        youtube_video_id: youtubeVideoId || null,
        thumbnail_url: thumbnailUrl,
        category: finalCategory,
        genre: finalGenre || null,
        duration: duration || null,
        year: normalizedYear,
        country: country || null,
        language: language || null,
        director: director || null,
        director_bio: directorBio || null,
        cinematographer: cinematographer && cinematographer.length > 0 ? cinematographer : undefined,
        cast_members: cast && cast.length > 0 ? cast : undefined,
        awards: awards && awards.length > 0 ? awards : undefined,
        characteristics: selectedCharacteristics && selectedCharacteristics.length > 0 ? selectedCharacteristics : undefined,
      };

      if (!initialData) {
        movieData.status = isAdmin ? 'approved' : 'pending';
        if (userId) {
          movieData.uploaded_by = userId;
        }
      } else if (isAdmin) {
        movieData.status = initialData.status;
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

  const sectionVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section Tabs */}
      <div className="flex gap-2 border-b border-border pb-4">
        {[
          { id: 'basic', label: 'Basic Info', icon: Film },
          { id: 'details', label: 'Details', icon: Globe },
          { id: 'credits', label: 'Credits & Awards', icon: Award }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveSection(id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeSection === id
              ? 'bg-foreground text-background'
              : 'text-foreground/60 hover:text-foreground hover:bg-muted'
              }`}
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeSection === 'basic' && (
          <motion.div
            key="basic"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2 text-foreground/70">
                <Film className="h-4 w-4" />
                Title
                <span className="text-destructive text-xs font-semibold">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={loading}
                className="bg-card border-border"
                placeholder="Enter film title..."
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground/70">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                disabled={loading}
                className="bg-card border-border resize-none"
                placeholder="Tell us about your film..."
              />
            </div>

            {/* YouTube URL */}
            <div className="space-y-2">
              <Label htmlFor="youtube_url" className="flex items-center gap-2 text-foreground/70">
                <Youtube className="h-4 w-4" />
                <span className="flex items-center gap-1">
                  YouTube URL
                  <span className="text-destructive text-xs font-semibold">*</span>
                </span>
              </Label>
              <Input
                id="youtube_url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                type="url"
                required
                disabled={loading}
                className="bg-card border-border"
                placeholder="https://www.youtube.com/watch?v=..."
              />
              {thumbnailUrl && (
                <div className="mt-2 rounded overflow-hidden border border-border">
                  <img src={thumbnailUrl} alt="Thumbnail Preview" className="w-full h-auto" />
                  <p className="text-xs text-foreground/40 p-2 bg-card">Thumbnail auto-extracted</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-2">
                <Label className="text-foreground/70 flex items-center gap-1">
                  <span>Category</span>
                  <span className="text-destructive text-xs font-semibold">*</span>
                </Label>
                <Select value={category} onValueChange={setCategory} disabled={loading}>
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
                    placeholder="Custom category..."
                    className="mt-2 bg-card border-border"
                  />
                )}
              </div>

              {/* Genre */}
              <div className="space-y-2">
                <Label className="text-foreground/70">Genre</Label>
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
                    placeholder="Custom genre..."
                    className="mt-2 bg-card border-border"
                  />
                )}
              </div>
            </div>

            {/* Status (Admin only) */}
            {isAdmin && initialData && (
              <div className="space-y-2">
                <Label className="text-foreground/70">Status</Label>
                <Select
                  value={initialData.status}
                  onValueChange={(value) => initialData.status = value}
                  disabled={loading}
                >
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
          </motion.div>
        )}

        {activeSection === 'details' && (
          <motion.div
            key="details"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Year */}
              <div className="space-y-2">
                <Label className="text-foreground/70">Release Year</Label>
                <Input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  min="1900"
                  max="2030"
                  disabled={loading}
                  className="bg-card border-border"
                />
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label className="text-foreground/70">Duration</Label>
                <Input
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g., 1h 45min"
                  disabled={loading}
                  className="bg-card border-border"
                />
              </div>

              {/* Country */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-foreground/70">
                  <Globe className="h-4 w-4" />
                  Country
                </Label>
                <Input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g., United States"
                  disabled={loading}
                  className="bg-card border-border"
                />
              </div>

              {/* Language */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-foreground/70">
                  <Languages className="h-4 w-4" />
                  Language
                </Label>
                <Input
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="e.g., English, French"
                  disabled={loading}
                  className="bg-card border-border"
                />
              </div>
            </div>

            {/* Characteristics */}
            <div className="space-y-3">
              <Label className="text-foreground/70">Characteristics</Label>
              <p className="text-xs text-foreground/40">Select up to 6 characteristics that describe your film</p>
              <div className="flex flex-wrap gap-2">
                {CHARACTERISTICS.map((char) => (
                  <button
                    key={char}
                    type="button"
                    onClick={() => toggleCharacteristic(char)}
                    disabled={loading || (selectedCharacteristics.length >= 6 && !selectedCharacteristics.includes(char))}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${selectedCharacteristics.includes(char)
                      ? 'bg-foreground text-background border-foreground'
                      : 'border-border text-foreground/60 hover:border-foreground/50'
                      } ${loading || (selectedCharacteristics.length >= 6 && !selectedCharacteristics.includes(char)) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {char}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeSection === 'credits' && (
          <motion.div
            key="credits"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            {/* Director */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-foreground/70">
                <Users className="h-4 w-4" />
                <span className="flex items-center gap-1">
                  Director
                  <span className="text-destructive text-xs font-semibold">*</span>
                </span>
              </Label>
              <Input
                value={director}
                onChange={(e) => setDirector(e.target.value)}
                placeholder="Director name..."
                required
                disabled={loading}
                className="bg-card border-border"
              />
            </div>

            {/* Director Bio */}
            <div className="space-y-2">
              <Label className="text-foreground/70">Director Bio</Label>
              <Textarea
                value={directorBio}
                onChange={(e) => setDirectorBio(e.target.value)}
                rows={3}
                placeholder="Brief biography..."
                disabled={loading}
                className="bg-card border-border resize-none"
              />
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-foreground/70">
                <Camera className="h-4 w-4" />
                Cinematographer
              </Label>
              <div className="flex gap-2">
                <Input
                  value={newCinematographer}
                  onChange={(e) => setNewCinematographer(e.target.value)}
                  placeholder="Add cinematographer..."
                  disabled={loading}
                  className="bg-card border-border"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCinematographer())}
                />
                <Button type="button" variant="outline" onClick={addCinematographer} disabled={loading}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {cinematographer.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {cinematographer.map((member) => (
                    <span
                      key={member}
                      className="flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-sm"
                    >
                      {member}
                      <button type="button" onClick={() => removeCinematographer(member)} className="hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Cast */}
            <div className="space-y-3">
              <Label className="text-foreground/70">Cast Members</Label>
              <div className="flex gap-2">
                <Input
                  value={newCastMember}
                  onChange={(e) => setNewCastMember(e.target.value)}
                  placeholder="Add cast member..."
                  disabled={loading}
                  className="bg-card border-border"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCastMember())}
                />
                <Button type="button" variant="outline" onClick={addCastMember} disabled={loading}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {cast.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {cast.map((member) => (
                    <span
                      key={member}
                      className="flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-sm"
                    >
                      {member}
                      <button type="button" onClick={() => removeCastMember(member)} className="hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Awards */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-foreground/70">
                <Award className="h-4 w-4" />
                Awards & Recognition
              </Label>
              <p className="text-xs text-foreground/40">
                Add award names to auto-fetch details from Wikipedia (optional).
              </p>
              <div className="flex gap-2">
                <Input
                  value={newAward}
                  onChange={(e) => setNewAward(e.target.value)}
                  placeholder="e.g., Sundance Film Festival"
                  disabled={loading}
                  className="bg-card border-border"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAward())}
                />
                <Button type="button" variant="outline" onClick={addAward} disabled={loading}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {awards.length > 0 && (
                <div className="space-y-3 mt-4">
                  {awards.map((award) => (
                    <div key={award} className="relative">
                      <AwardCard awardName={award} />
                      <button
                        type="button"
                        onClick={() => removeAward(award)}
                        className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/80"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <div className="flex items-center gap-2">
          {activeSection !== 'basic' && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                if (activeSection === 'credits') {
                  setActiveSection('details');
                } else {
                  setActiveSection('basic');
                }
              }}
              disabled={loading}
            >
              Back
            </Button>
          )}
          {activeSection !== 'credits' ? (
            <Button
              type="button"
              onClick={() => {
                if (activeSection === 'basic') {
                  setActiveSection('details');
                } else {
                  setActiveSection('credits');
                }
              }}
              disabled={loading}
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={loading || !youtubeUrl || !title}
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
          )}
        </div>
      </div>

      {/* Info Note */}
      <div className="p-4 rounded bg-card border border-border">
        <p className="text-sm text-foreground/50 flex items-start gap-2">
          <Youtube className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>
            Thumbnail is auto-extracted from YouTube. Extended details (director, cast, awards) enhance the film page.
            {!isAdmin && " Your submission will be reviewed before going live."}
          </span>
        </p>
      </div>
    </form>
  );
};

export default MovieSubmitForm;
