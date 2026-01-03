import { useNavigate } from "react-router-dom";

interface VideoCardProps {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  category: string;
  index?: number;
}

const VideoCard = ({ id, title, thumbnail, duration, category, index = 0 }: VideoCardProps) => {
  const navigate = useNavigate();

  return (
    <div 
      className="group cursor-pointer"
      onClick={() => navigate(`/movie/${id}`)}
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden mb-4">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-300" />
      </div>
      
      {/* Info */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-foreground/50">
          <span className="uppercase tracking-wider">{category}</span>
          <span>{duration}</span>
        </div>
        <h3 className="text-lg font-medium text-foreground group-hover:opacity-70 transition-opacity line-clamp-2">
          {title}
        </h3>
      </div>
    </div>
  );
};

export default VideoCard;
