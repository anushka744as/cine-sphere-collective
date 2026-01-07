import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Loader2 } from 'lucide-react';
import { fetchAwardInfo, AwardInfo } from '@/lib/wikipedia';

interface AwardCardProps {
  awardName: string;
  compact?: boolean;
}

export const AwardCard = ({ awardName, compact = false }: AwardCardProps) => {
  const [awardInfo, setAwardInfo] = useState<AwardInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchInfo = async () => {
      setLoading(true);
      setError(false);
      const info = await fetchAwardInfo(awardName);
      if (info) {
        setAwardInfo(info);
      } else {
        setError(true);
      }
      setLoading(false);
    };

    fetchInfo();
  }, [awardName]);

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 px-3 py-2 bg-muted/30 rounded-lg border border-border/50"
      >
        <Award className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">{awardName}</span>
        {loading && <Loader2 className="h-3 w-3 animate-spin" />}
      </motion.div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 bg-muted/20 rounded-xl border border-border/30">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !awardInfo) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-muted/20 rounded-xl border border-border/30"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Award className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium text-foreground">{awardName}</h4>
            <p className="text-xs text-muted-foreground">Award recognition</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-muted/20 rounded-xl border border-border/30 hover:border-border/60 transition-colors"
    >
      <div className="flex gap-4">
        {awardInfo.thumbnail ? (
          <img
            src={awardInfo.thumbnail}
            alt={awardInfo.title}
            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Award className="h-8 w-8 text-primary" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-foreground line-clamp-1">{awardInfo.title}</h4>
            {awardInfo.pageUrl && (
              <a
                href={awardInfo.pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{awardInfo.extract}</p>
        </div>
      </div>
    </motion.div>
  );
};
