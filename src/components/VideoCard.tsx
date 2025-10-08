import { Play, Clock, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface VideoCardProps {
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  category: string;
}

const VideoCard = ({ title, thumbnail, duration, views, category }: VideoCardProps) => {
  return (
    <Card className="group overflow-hidden hover-lift cursor-pointer bg-card border-border">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="rounded-full bg-primary/90 p-4">
            <Play className="h-8 w-8 text-white fill-white" />
          </div>
        </div>
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs flex items-center space-x-1">
          <Clock className="h-3 w-3" />
          <span>{duration}</span>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="mb-2">
          <span className="inline-block px-2 py-1 rounded-full text-xs bg-primary/20 text-primary">
            {category}
          </span>
        </div>
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="flex items-center text-sm text-muted-foreground">
          <Eye className="h-4 w-4 mr-1" />
          <span>{views} views</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
