import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Trash2, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myMovies, setMyMovies] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMyMovies();
  }, []);

  const fetchMyMovies = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .eq('uploaded_by', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Failed to load your movies");
    } else {
      setMyMovies(data || []);
    }
  };

  const handleSubmitMovie = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

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
      uploaded_by: user.id,
      status: 'pending'
    });

    if (error) {
      toast.error("Failed to submit movie");
    } else {
      toast.success("Movie submitted successfully! Awaiting admin approval.");
      setIsOpen(false);
      fetchMyMovies();
      (e.target as HTMLFormElement).reset();
    }
    
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('movies')
      .delete()
      .eq('id', id)
      .eq('uploaded_by', user?.id);

    if (error) {
      toast.error("Failed to delete movie");
    } else {
      toast.success("Movie deleted successfully!");
      fetchMyMovies();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Movies</h1>
          <p className="text-muted-foreground">Upload and manage your movie submissions</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="shadow-lg">
              <Plus className="mr-2 h-4 w-4" />
              Submit Movie
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Submit Your Movie</DialogTitle>
              <DialogDescription>Share your YouTube movie link with the community</DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmitMovie} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" name="title" required disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input id="category" name="category" placeholder="Action, Drama, Comedy..." required disabled={loading} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={3} disabled={loading} placeholder="Tell us about your movie..." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtube_url">YouTube URL *</Label>
                <Input 
                  id="youtube_url" 
                  name="youtube_url" 
                  type="url" 
                  required 
                  disabled={loading}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
                <Input 
                  id="thumbnail_url" 
                  name="thumbnail_url" 
                  type="url" 
                  disabled={loading}
                  placeholder="https://example.com/thumbnail.jpg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="genre">Genre</Label>
                  <Input id="genre" name="genre" disabled={loading} placeholder="Thriller, Romance..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input id="duration" name="duration" placeholder="e.g., 2:15:30" disabled={loading} />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Movie"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{myMovies.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {myMovies.filter(m => m.status === 'approved').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {myMovies.filter(m => m.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Movies</CardTitle>
          <CardDescription>Manage your submissions</CardDescription>
        </CardHeader>
        <CardContent>
          {myMovies.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>You haven't submitted any movies yet.</p>
              <Button className="mt-4" onClick={() => setIsOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Submit Your First Movie
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {myMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{movie.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {movie.category} • Status: <span className={movie.status === 'approved' ? 'text-green-600' : 'text-yellow-600'}>{movie.status}</span> • {movie.views} views
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => navigate(`/movie/${movie.id}`)}
                    >
                      <Eye className="h-4 w-4" />
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
