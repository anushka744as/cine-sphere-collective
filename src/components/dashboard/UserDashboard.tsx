import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Trash2, Eye, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import MovieSubmitForm from "./MovieSubmitForm";

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myMovies, setMyMovies] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editMovie, setEditMovie] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMyMovies();
    }
  }, [user]);

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

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('movies')
      .delete()
      .eq('id', id)
      .eq('uploaded_by', user?.id);

    if (error) {
      toast.error("Failed to delete film");
      console.error(error);
    } else {
      toast.success("Film deleted successfully!");
      fetchMyMovies();
    }
    setLoading(false);
  };

  const handleEdit = (movie: any) => {
    setEditMovie(movie);
    setIsEditOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditOpen(false);
    setEditMovie(null);
    fetchMyMovies();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">My Films</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Upload and manage your film submissions</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="shadow-lg">
              <Plus className="mr-2 h-4 w-4" />
              Submit Film
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Submit Your Film</DialogTitle>
              <DialogDescription>Share your YouTube film with the community</DialogDescription>
            </DialogHeader>
            
            <MovieSubmitForm
              userId={user?.id}
              isAdmin={false}
              onSuccess={() => {
                setIsOpen(false);
                fetchMyMovies();
              }}
              onCancel={() => setIsOpen(false)}
            />
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
          <CardTitle>Your Films</CardTitle>
          <CardDescription>Manage your submissions</CardDescription>
        </CardHeader>
        <CardContent>
          {myMovies.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>You haven't submitted any films yet.</p>
              <Button className="mt-4" onClick={() => setIsOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Submit Your First Film
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {myMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="flex-shrink-0">
                    <div className="relative w-full sm:w-40 h-32 sm:h-24 rounded-md overflow-hidden bg-muted">
                      {movie.thumbnail_url ? (
                        <img 
                          src={movie.thumbnail_url} 
                          alt={movie.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Eye className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                      )}
                      {/* Status Badge */}
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          movie.status === 'approved' 
                            ? 'bg-green-600/90 text-white' 
                            : movie.status === 'pending'
                            ? 'bg-yellow-600/90 text-white'
                            : 'bg-red-600/90 text-white'
                        }`}>
                          {movie.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1 truncate">{movie.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {movie.category} {movie.genre && `• ${movie.genre}`}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {movie.views || 0} views
                      </span>
                      {movie.duration && (
                        <span>{movie.duration}</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/movie/${movie.id}`)}
                      className="flex-1 sm:flex-none"
                    >
                      <Eye className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">View</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(movie)}
                      className="flex-1 sm:flex-none"
                      disabled={loading || movie.status === 'approved'}
                      title={movie.status === 'approved' ? 'Cannot edit approved films' : 'Edit'}
                    >
                      <Edit className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(movie.id, movie.title)}
                      className="flex-1 sm:flex-none text-destructive hover:text-destructive"
                      disabled={loading || movie.status === 'approved'}
                      title={movie.status === 'approved' ? 'Cannot delete approved films' : 'Delete'}
                    >
                      <Trash2 className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Movie Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Your Film</DialogTitle>
            <DialogDescription>Update your film details</DialogDescription>
          </DialogHeader>
          
          {editMovie && (
            <MovieSubmitForm
              userId={user?.id}
              isAdmin={false}
              initialData={editMovie}
              onSuccess={handleEditSuccess}
              onCancel={() => setIsEditOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDashboard;
