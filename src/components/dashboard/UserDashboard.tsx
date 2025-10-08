import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import VideoCard from "@/components/VideoCard";
import { Film, Eye, Heart } from "lucide-react";

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalViews: 0,
  });
  const [recentMovies, setRecentMovies] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchRecentMovies();
  }, []);

  const fetchStats = async () => {
    const { data, error } = await supabase
      .from('movies')
      .select('views')
      .eq('status', 'approved');

    if (!error && data) {
      const totalViews = data.reduce((sum, movie) => sum + (movie.views || 0), 0);
      setStats({
        totalMovies: data.length,
        totalViews,
      });
    }
  };

  const fetchRecentMovies = async () => {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(6);

    if (!error && data) {
      setRecentMovies(data);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Movies</CardTitle>
            <Film className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMovies}</div>
            <p className="text-xs text-muted-foreground">Available to watch</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all content</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Coming soon</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recently Added</CardTitle>
          <CardDescription>Latest movies on CineSphere</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentMovies.map((movie) => (
              <VideoCard
                key={movie.id}
                title={movie.title}
                thumbnail={movie.thumbnail_url || `https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800`}
                duration={movie.duration || "N/A"}
                views={movie.views?.toString() || "0"}
                category={movie.category}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
