import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const AdminDashboard = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Failed to load movies");
    } else {
      setMovies(data || []);
    }
  };

  const handleAddMovie = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    const { error } = await supabase.from('movies').insert({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      youtube_url: formData.get('youtube_url') as string,
      thumbnail_url: formData.get('thumbnail_url') as string,
      category: formData.get('category') as string,
      genre: formData.get('genre') as string,
      duration: formData.get('duration') as string,
      status: 'approved'
    });

    if (error) {
      toast.error("Failed to add movie");
    } else {
      toast.success("Movie added successfully!");
      setIsOpen(false);
      fetchMovies();
      (e.target as HTMLFormElement).reset();
    }
    
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('movies')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Failed to delete movie");
    } else {
      toast.success("Movie deleted successfully!");
      fetchMovies();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage movies and content</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Movie
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Movie</DialogTitle>
              <DialogDescription>Fill in the movie details below</DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleAddMovie} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" name="title" required disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input id="category" name="category" required disabled={loading} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={3} disabled={loading} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtube_url">YouTube URL *</Label>
                <Input id="youtube_url" name="youtube_url" type="url" required disabled={loading} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
                <Input id="thumbnail_url" name="thumbnail_url" type="url" disabled={loading} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="genre">Genre</Label>
                  <Input id="genre" name="genre" disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input id="duration" name="duration" placeholder="e.g., 12:34" disabled={loading} />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add Movie"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Movies</CardTitle>
          <CardDescription>Total: {movies.length} movies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-semibold">{movie.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {movie.category} • {movie.status} • {movie.views} views
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(movie.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
