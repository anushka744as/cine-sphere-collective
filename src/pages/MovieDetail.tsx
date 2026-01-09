import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Eye, Clock, User } from "lucide-react";
import { toast } from "sonner";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<any>(null);
  const [uploaderProfile, setUploaderProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchMovie();
      incrementViews();
    }
  }, [id]);

  const fetchMovie = async () => {
    try {
      const { data: movieData, error: movieError } = await supabase
        .from('movies')
        .select('*')
        .eq('id', id)
        .single();

      if (movieError) throw movieError;
      setMovie(movieData);

      if (movieData.uploaded_by) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', movieData.uploaded_by)
          .single();

        setUploaderProfile(profileData);
      }
    } catch (error) {
      console.error('Error fetching movie:', error);
      toast.error("Failed to load movie");
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async () => {
    try {
      const { error } = await supabase.rpc('increment_movie_views', { movie_id: id });
      if (error) console.error('Error incrementing views:', error);
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const getYouTubeEmbedUrl = (url: string, videoId?: string) => {
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center min-h-[600px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Movie not found</h1>
            <Button onClick={() => navigate('/movies')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Movies
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(movie.youtube_url, movie.youtube_video_id);
  const hasSupplementalDetails =
    (movie.cast_members?.length ?? 0) > 0 ||
    (movie.awards?.length ?? 0) > 0 ||
    (movie.characteristics?.length ?? 0) > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <Button
          variant="ghost"
          onClick={() => navigate('/movies')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Movies
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="aspect-video w-full bg-black">
                {embedUrl ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={embedUrl}
                    title={movie.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-white">
                    Invalid YouTube URL
                  </div>
                )}
              </div>
            </Card>

            <Card className="mt-6">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {movie.views} views
                      </div>
                      {movie.duration && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {movie.duration}
                        </div>
                      )}
                      {uploaderProfile && (
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {uploaderProfile.username}
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary">{movie.status}</Badge>
                </div>

                <div className="flex gap-2 mb-4">
                  <Badge>{movie.category}</Badge>
                  {movie.genre && <Badge variant="outline">{movie.genre}</Badge>}
                </div>

                {movie.description && (
                  <div className="mt-4">
                    <h2 className="text-xl font-semibold mb-2">Description</h2>
                    <p className="text-muted-foreground">{movie.description}</p>
                  </div>
                )}

              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Movie Info</h2>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm text-muted-foreground">Category</dt>
                    <dd className="font-medium">{movie.category}</dd>
                  </div>
                  {movie.genre && (
                    <div>
                      <dt className="text-sm text-muted-foreground">Genre</dt>
                      <dd className="font-medium">{movie.genre}</dd>
                    </div>
                  )}
                  {movie.duration && (
                    <div>
                      <dt className="text-sm text-muted-foreground">Duration</dt>
                      <dd className="font-medium">{movie.duration}</dd>
                    </div>
                  )}
                  {movie.year && (
                    <div>
                      <dt className="text-sm text-muted-foreground">Release Year</dt>
                      <dd className="font-medium">{movie.year}</dd>
                    </div>
                  )}
                  {movie.country && (
                    <div>
                      <dt className="text-sm text-muted-foreground">Country</dt>
                      <dd className="font-medium">{movie.country}</dd>
                    </div>
                  )}
                  {movie.language && (
                    <div>
                      <dt className="text-sm text-muted-foreground">Language</dt>
                      <dd className="font-medium">{movie.language}</dd>
                    </div>
                  )}
                  {movie.director && (
                    <div>
                      <dt className="text-sm text-muted-foreground">Director</dt>
                      <dd className="font-medium">{movie.director}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm text-muted-foreground">Cinematographer</dt>
                    <dd className="font-medium">
                      {Array.isArray(movie.cinematographer)
                        ? movie.cinematographer.join(', ')
                        : movie.cinematographer}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Status</dt>
                    <dd className="font-medium capitalize">{movie.status}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Uploaded</dt>
                    <dd className="font-medium">
                      {new Date(movie.created_at).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            {hasSupplementalDetails && (
              <Card className="mt-6">
                <CardContent className="p-6 space-y-6">
                  {movie.cast_members?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold">Cast</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {movie.cast_members.map((member) => (
                          <Badge key={member} variant="outline">
                            {member}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {movie.awards?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold">Awards & Recognition</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {movie.awards.map((award) => (
                          <Badge key={award} variant="secondary">
                            {award}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {movie.characteristics?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold">Characteristics</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {movie.characteristics.map((charItem) => (
                          <Badge key={charItem} variant="outline">
                            {charItem}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MovieDetail;
