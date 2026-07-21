import { motion } from 'framer-motion';

interface ISkeletonProps {
  className?: string;
  count?: number;
}

function Skeleton({ className = 'h-4 w-full', count = 1 }: ISkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className={`rounded-lg bg-border/60 ${className}`}
        />
      ))}
    </>
  );
}

export function SkeletonCard() {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4">
      <Skeleton className="h-11 w-11 shrink-0 rounded-2xl" />
      <div className="flex-1 space-y-2.5">
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default Skeleton;
