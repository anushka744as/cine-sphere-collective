import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import VideoCard from "@/components/VideoCard";
import Footer from "@/components/Footer";

// Mock data for featured videos
const featuredVideos = [
  {
    id: "1",
    title: "The Art of Visual Storytelling",
    thumbnail: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800",
    duration: "12:34",
    views: "2.4K",
    category: "Documentary"
  },
  {
    id: "2",
    title: "Cinematography Masterclass",
    thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800",
    duration: "18:45",
    views: "5.1K",
    category: "Education"
  },
  {
    id: "3",
    title: "Behind the Lens: A Journey",
    thumbnail: "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=800",
    duration: "9:23",
    views: "3.8K",
    category: "Short Film"
  },
  {
    id: "4",
    title: "Urban Cinematography",
    thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800",
    duration: "15:12",
    views: "4.2K",
    category: "Experimental"
  },
  {
    id: "5",
    title: "Color Grading Techniques",
    thumbnail: "https://images.unsplash.com/photo-1509824227185-9c5a01ceba0d?w=800",
    duration: "22:18",
    views: "6.7K",
    category: "Tutorial"
  },
  {
    id: "6",
    title: "Motion Picture Magic",
    thumbnail: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800",
    duration: "11:55",
    views: "3.3K",
    category: "Behind the Scenes"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      
      {/* Featured Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Featured Content</h2>
          <p className="text-muted-foreground">Handpicked selections from our community</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredVideos.map((video) => (
            <VideoCard key={video.id} {...video} />
          ))}
        </div>
      </section>

      {/* Trending Section */}
      <section className="container mx-auto px-4 py-16" id="trending">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Trending Now</h2>
          <p className="text-muted-foreground">Most watched this week</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredVideos.slice(0, 3).map((video) => (
            <VideoCard key={video.id} {...video} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
