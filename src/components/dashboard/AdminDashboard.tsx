import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Eye, Check, X, Star, Users, Film } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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
  const [statusFilter, setStatusFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [uploaderFilter, setUploaderFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmAction, setConfirmAction] = useState<null | { movie: any; status: string }>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editMovie, setEditMovie] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedMovieIds, setSelectedMovieIds] = useState<string[]>([]);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
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
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, username, created_at, role')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Failed to load users:", error);
      return;
    }

    setUsers(
      (profiles || []).map((p: any) => ({
        ...p,
        role: p.role || 'user',
      }))
    );
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
      setSelectedMovieIds((prev) => prev.filter((movieId) => movieId !== id));
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

  const openStatusDialog = (movie: any, status: string) => {
    setConfirmAction({ movie, status });
    setIsConfirmOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!confirmAction) return;
    setIsConfirmOpen(false);
    await handleStatusChange(confirmAction.movie.id, confirmAction.status);
    setConfirmAction(null);
  };

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    setLoading(true);
    // Use type assertion since is_featured may not be in generated types
    const { error } = await (supabase as any)
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

  const uploaderOptions = useMemo(() => {
    const uniqueIds = Array.from(new Set(movies.map((movie) => movie.uploaded_by)));
    const options = [
      { value: "all", label: "All Uploaders" },
    ];
    if (uniqueIds.some((id) => !id)) {
      options.push({ value: "unknown", label: "Unknown" });
    }
    uniqueIds
      .filter((id): id is string => Boolean(id))
      .forEach((id) => {
        options.push({ value: id, label: uploaders[id] || "Unknown" });
      });
    return options;
  }, [movies, uploaders]);

  const filteredMovies = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return movies.filter((movie) => {
      if (statusFilter !== "all" && movie.status !== statusFilter) {
        return false;
      }

      if (featuredFilter === "featured" && !movie.is_featured) {
        return false;
      }
      if (featuredFilter === "not-featured" && movie.is_featured) {
        return false;
      }

      if (uploaderFilter === "unknown" && movie.uploaded_by) {
        return false;
      }
      if (uploaderFilter !== "all" && uploaderFilter !== "unknown" && movie.uploaded_by !== uploaderFilter) {
        return false;
      }

      if (term) {
        const haystack = `${movie.title} ${movie.director} ${movie.category}`.toLowerCase();
        if (!haystack.includes(term)) {
          return false;
        }
      }

      return true;
    });
  }, [movies, statusFilter, featuredFilter, uploaderFilter, searchTerm]);

  const toggleMovieSelection = (movieId: string) => {
    setSelectedMovieIds((prev) =>
      prev.includes(movieId) ? prev.filter((id) => id !== movieId) : [...prev, movieId]
    );
  };

  const selectAllFiltered = () => {
    setSelectedMovieIds(filteredMovies.map((movie) => movie.id));
  };

  const clearSelection = () => {
    setSelectedMovieIds([]);
  };

  const openBulkDeleteDialog = () => {
    if (selectedMovieIds.length === 0) {
      toast.error("Select at least one film to delete.");
      return;
    }
    setIsBulkDeleteOpen(true);
  };

  const handleBulkDelete = async () => {
    if (selectedMovieIds.length === 0) return;
    setIsBulkDeleteOpen(false);
    setIsBulkDeleting(true);

    const { error } = await supabase
      .from('movies')
      .delete()
      .in('id', selectedMovieIds);

    if (error) {
      toast.error("Failed to delete selected films");
      console.error(error);
    } else {
      toast.success("Selected films deleted");
      setSelectedMovieIds([]);
      await fetchMovies();
      if (selectedUser) {
        await fetchUserMovies(selectedUser.id);
      }
    }

    setIsBulkDeleting(false);
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

  const renderFilmCard = (movie: any) => {
    const isSelected = selectedMovieIds.includes(movie.id);

    return (
      <div
        key={movie.id}
        className={`relative flex flex-col sm:flex-row gap-4 p-4 bg-card border rounded-lg transition-colors ${isSelected ? "border-foreground/60 bg-foreground/5" : "border-border hover:bg-accent/5"}`}
      >
        <div className="absolute top-2 left-2">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => toggleMovieSelection(movie.id)}
          />
        </div>

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
                  onClick={() => openStatusDialog(movie, 'approved')}
                  title="Approve"
                  disabled={loading}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openStatusDialog(movie, 'rejected')}
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
          className="text-yellow-500"
          disabled={loading}
        >
          <Star
            className="h-4 w-4"
            stroke="currentColor"
            fill={movie.is_featured ? "currentColor" : "none"}
          />
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
};

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
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle>All Films</CardTitle>
              <span className="text-xs text-foreground/50 uppercase tracking-[0.2em]">
                Showing {filteredMovies.length} / {movies.length}
              </span>
            </div>
            <CardDescription className="text-foreground/50">
              {filteredMovies.length === movies.length
                ? `Total: ${movies.length} films`
                : `${filteredMovies.length} match current filters`}
            </CardDescription>
          </div>

          <div className="flex flex-wrap gap-3">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, director, category..."
              className="min-w-[220px] bg-card border-border"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-card border-border">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
              <SelectTrigger className="bg-card border-border">
                <SelectValue placeholder="Featured" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="all">All films</SelectItem>
                <SelectItem value="featured">Featured only</SelectItem>
                <SelectItem value="not-featured">Non-featured</SelectItem>
              </SelectContent>
            </Select>
            <Select value={uploaderFilter} onValueChange={setUploaderFilter}>
              <SelectTrigger className="bg-card border-border">
                <SelectValue placeholder="Uploader" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                {uploaderOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-foreground/60">
              {selectedMovieIds.length} selected
            </span>
            <Button variant="ghost" onClick={selectAllFiltered} disabled={filteredMovies.length === 0}>
              Select all
            </Button>
            <Button variant="outline" onClick={clearSelection}>
              Clear
            </Button>
            <Button
              variant="destructive"
              onClick={openBulkDeleteDialog}
              disabled={selectedMovieIds.length === 0 || isBulkDeleting}
            >
              Delete selected
            </Button>
          </div>
        </CardHeader>
            <CardContent className="overflow-x-auto">
              <div className="space-y-4">
                {filteredMovies.length === 0 ? (
                  <div className="text-center py-12 text-foreground/50">
                    No films match those filters. Try broadening the search.
                  </div>
                ) : (
                  filteredMovies.map((movie) => renderFilmCard(movie))
                )}
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

      <Dialog open={isConfirmOpen} onOpenChange={(open) => {
        setIsConfirmOpen(open);
        if (!open) setConfirmAction(null);
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              {confirmAction
                ? `Are you sure you want to ${confirmAction.status === 'approved' ? 'approve' : 'reject'} "${confirmAction.movie.title}"?`
                : 'Are you sure you want to proceed?'}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsConfirmOpen(false);
                setConfirmAction(null);
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmStatusChange}
              disabled={loading || !confirmAction}
            >
              {confirmAction?.status === 'approved' ? 'Approve' : 'Reject'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete {selectedMovieIds.length} film{selectedMovieIds.length === 1 ? "" : "s"}?</DialogTitle>
            <DialogDescription>
              This will permanently remove the selected films. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsBulkDeleteOpen(false)}
              disabled={isBulkDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
            >
              {isBulkDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
