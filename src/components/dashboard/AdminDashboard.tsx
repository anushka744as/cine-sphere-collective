import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Eye, Check, X, Star, Users, Film } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import MovieSubmitForm from "./MovieSubmitForm";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const [movies, setMovies] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userMovies, setUserMovies] = useState<any[]>([]);
  const [uploaders, setUploaders] = useState<Record<string, string>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [editMovie, setEditMovie] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMovies();
    fetchUsers();
  }, []);

  const fetchMovies = async () => {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Failed to load films");
      console.error(error);
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

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, created_at, role')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Failed to load users:", error);
    } else {
      setUsers(data || []);
    }
  };

  const getUserFilmCount = (userId: string) => {
    return movies.filter(m => m.uploaded_by === userId).length;
  };

  const fetchUserMovies = async (userId: string) => {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .eq('uploaded_by', userId)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Failed to load user films");
    } else {
      setUserMovies(data || []);
    }
  };

  const handleUserClick = async (user: any) => {
    setSelectedUser(user);
    await fetchUserMovies(user.id);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('movies')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Failed to delete film");
      console.error(error);
    } else {
      toast.success("Film deleted successfully!");
      await fetchMovies();
      if (selectedUser) {
        await fetchUserMovies(selectedUser.id);
      }
    }
    setLoading(false);
  };

  const handleEdit = (movie: any) => {
    setEditMovie(movie);
    setIsEditOpen(true);
  };

  const handleEditSuccess = async () => {
    setIsEditOpen(false);
    setEditMovie(null);
    await fetchMovies();
    if (selectedUser) {
      await fetchUserMovies(selectedUser.id);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    setLoading(true);
    const { error } = await supabase
      .from('movies')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success(`Film ${status === 'approved' ? 'approved' : 'rejected'}!`);
      await fetchMovies();
      if (selectedUser) {
        await fetchUserMovies(selectedUser.id);
      }
    }
    setLoading(false);
  };

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    setLoading(true);
    const { error } = await supabase
      .from('movies')
      .update({ is_featured: !currentStatus })
      .eq('id', id);

    if (error) {
      toast.error("Failed to update featured status");
    } else {
      toast.success(`Film ${!currentStatus ? 'added to' : 'removed from'} featured!`);
      await fetchMovies();
    }
    setLoading(false);
  };

  const handleRoleToggle = async (targetUser: any) => {
    if (targetUser.id === user?.id) {
      toast.error("You cannot change your own role");
      return;
    }

    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    if (!confirm(`Are you sure you want to change "${targetUser.username}"'s role to ${newRole}?`)) {
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', targetUser.id);

    if (error) {
      toast.error("Failed to update user role");
      console.error(error);
    } else {
      toast.success(`User role updated to ${newRole}!`);
      await fetchUsers();
    }
    setLoading(false);
  };

  const renderFilmCard = (movie: any) => (
    <div
      key={movie.id}
      className="flex flex-col sm:flex-row gap-4 p-4 bg-card border border-border rounded-lg hover:bg-accent/5 transition-colors"
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
              <Eye className="h-8 w-8 text-foreground/20" />
            </div>
          )}
          {/* Status Badge */}
          <div className="absolute top-2 right-2">
            <Badge className={
              movie.status === 'approved'
                ? 'bg-foreground text-background'
                : movie.status === 'pending'
                  ? 'bg-foreground/50'
                  : 'bg-foreground/30'
            }>
              {movie.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg mb-1 truncate">{movie.title}</h3>
        <p className="text-sm text-foreground/50 mb-2">
          {movie.category} {movie.genre && `• ${movie.genre}`}
        </p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/40">
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {movie.views || 0} views
          </span>
          {movie.uploaded_by && (
            <span>By: {uploaders[movie.uploaded_by] || 'Unknown'}</span>
          )}
          {movie.duration && (
            <span>{movie.duration}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex sm:flex-col items-center justify-end gap-2 flex-shrink-0">
        {movie.status === 'pending' && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleStatusChange(movie.id, 'approved')}
              title="Approve"
              disabled={loading}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleStatusChange(movie.id, 'rejected')}
              title="Reject"
              disabled={loading}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleToggleFeatured(movie.id, movie.is_featured)}
          title={movie.is_featured ? "Remove from Featured" : "Add to Featured"}
          className={movie.is_featured ? "text-yellow-500 fill-yellow-500" : "text-card"}
          disabled={loading}
        >
          <Star className="h-4 w-4" />
        </Button>
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
          onClick={() => handleDelete(movie.id, movie.title)}
          title="Delete"
          disabled={loading}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <p className="text-foreground/50 text-sm sm:text-base">Manage films, users, and content</p>
            <Badge variant="outline" className="text-xs">
              Logged in as: {userRole}
            </Badge>
          </div>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-foreground text-background hover:bg-foreground/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Film
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background border-border">
            <DialogHeader>
              <DialogTitle>Add New Film</DialogTitle>
              <DialogDescription>Fill in the film details below (approved automatically)</DialogDescription>
            </DialogHeader>

            <MovieSubmitForm
              userId={user?.id}
              isAdmin={true}
              onSuccess={async () => {
                setIsOpen(false);
                await fetchMovies();
                if (selectedUser) {
                  await fetchUserMovies(selectedUser.id);
                }
              }}
              onCancel={() => setIsOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all-films" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-card">
          <TabsTrigger value="all-films">
            <Film className="h-4 w-4 mr-2" />
            All Films ({movies.length})
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Users ({users.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all-films" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>All Films</CardTitle>
              <CardDescription className="text-foreground/50">
                Total: {movies.length} films
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <div className="space-y-4">
                {movies.map((movie) => renderFilmCard(movie))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Users List */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription className="text-foreground/50">Click on a user to see their films</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {users.map((u) => (
                    <div
                      key={u.id}
                      onClick={() => handleUserClick(u)}
                      className={`p-4 rounded-lg border border-border cursor-pointer transition-colors ${selectedUser?.id === u.id ? 'bg-foreground/10 border-foreground/30' : 'hover:bg-accent/5'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{u.username || 'Unknown User'}</p>
                            <Badge variant={u.role === 'admin' ? 'default' : 'secondary'} className="text-[10px] h-4 px-1">
                              {u.role}
                            </Badge>
                          </div>
                          <p className="text-xs text-foreground/40">
                            Joined {new Date(u.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {u.id !== user?.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRoleToggle(u);
                              }}
                              className="text-[10px] h-7 px-2"
                            >
                              Toggle Role
                            </Button>
                          )}
                          <Badge variant="secondary" className="bg-card">
                            {getUserFilmCount(u.id)} {getUserFilmCount(u.id) === 1 ? 'film' : 'films'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Selected User's Films */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>
                  {selectedUser ? `${selectedUser.username || 'Unknown'}'s Films` : 'Select a user'}
                </CardTitle>
                <CardDescription className="text-foreground/50">
                  {selectedUser && `${userMovies.length} films uploaded`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedUser ? (
                  <div className="space-y-4">
                    {userMovies.length === 0 ? (
                      <div className="text-center py-12 text-foreground/40">
                        <Film className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No films uploaded yet</p>
                      </div>
                    ) : (
                      userMovies.map((movie) => renderFilmCard(movie))
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-foreground/40">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Select a user from the list to view their films</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Movie Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background border-border">
          <DialogHeader>
            <DialogTitle>Edit Film</DialogTitle>
            <DialogDescription>Update film details</DialogDescription>
          </DialogHeader>

          {editMovie && (
            <MovieSubmitForm
              userId={user?.id}
              initialData={editMovie}
              onSuccess={handleEditSuccess}
              onCancel={() => setIsEditOpen(false)}
              isAdmin={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
