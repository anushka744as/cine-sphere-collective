import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Eye, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<any[]>([]);
  const [uploaders, setUploaders] = useState<Record<string, string>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [editMovie, setEditMovie] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
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
      
      // Fetch uploader profiles
      const uploaderIds = [...new Set(data?.map(m => m.uploaded_by).filter(Boolean))];
      if (uploaderIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, username')
          .in('id', uploaderIds);
        
        if (profiles) {
          const uploaderMap: Record<string, string> = {};
          profiles.forEach(p => {
            uploaderMap[p.id] = p.username || 'Unknown';
          });
          setUploaders(uploaderMap);
        }
      }
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
    if (!confirm("Are you sure you want to delete this movie?")) return;

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

  const handleEdit = (movie: any) => {
    setEditMovie(movie);
    setIsEditOpen(true);
  };

  const handleUpdateMovie = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    const { error } = await supabase
      .from('movies')
      .update({
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        youtube_url: formData.get('youtube_url') as string,
        thumbnail_url: formData.get('thumbnail_url') as string,
        category: formData.get('category') as string,
        genre: formData.get('genre') as string,
        duration: formData.get('duration') as string,
        status: formData.get('status') as string,
      })
      .eq('id', editMovie.id);

    if (error) {
      toast.error("Failed to update movie");
    } else {
      toast.success("Movie updated successfully!");
      setIsEditOpen(false);
      setEditMovie(null);
      fetchMovies();
    }
    
    setLoading(false);
  };

  const handleStatusChange = async (id: string, status: string) => {
    const { error } = await supabase
      .from('movies')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success(`Movie ${status === 'approved' ? 'approved' : 'rejected'}!`);
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
                    {movie.category} • Status: <span className={movie.status === 'approved' ? 'text-green-600' : movie.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}>{movie.status}</span> • {movie.views} views
                    {movie.uploaded_by && ` • Uploaded by: ${uploaders[movie.uploaded_by] || 'Unknown'}`}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  {movie.status === 'pending' && (
                    <>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleStatusChange(movie.id, 'approved')}
                        title="Approve"
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleStatusChange(movie.id, 'rejected')}
                        title="Reject"
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                    </>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    title="View"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleEdit(movie)}
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(movie.id)}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Movie Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Movie</DialogTitle>
            <DialogDescription>Update movie details</DialogDescription>
          </DialogHeader>
          
          {editMovie && (
            <form onSubmit={handleUpdateMovie} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title *</Label>
                  <Input id="edit-title" name="title" defaultValue={editMovie.title} required disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category *</Label>
                  <Input id="edit-category" name="category" defaultValue={editMovie.category} required disabled={loading} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" name="description" defaultValue={editMovie.description} rows={3} disabled={loading} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-youtube_url">YouTube URL *</Label>
                <Input id="edit-youtube_url" name="youtube_url" type="url" defaultValue={editMovie.youtube_url} required disabled={loading} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-thumbnail_url">Thumbnail URL</Label>
                <Input id="edit-thumbnail_url" name="thumbnail_url" type="url" defaultValue={editMovie.thumbnail_url} disabled={loading} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-genre">Genre</Label>
                  <Input id="edit-genre" name="genre" defaultValue={editMovie.genre} disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-duration">Duration</Label>
                  <Input id="edit-duration" name="duration" defaultValue={editMovie.duration} placeholder="e.g., 12:34" disabled={loading} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status *</Label>
                <Select name="status" defaultValue={editMovie.status} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update Movie"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
