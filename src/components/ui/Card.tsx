import { motion } from 'framer-motion';

interface ICardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  noPadding?: boolean;
}

function Card({ children, className = '', hoverable = false, noPadding = false }: ICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={hoverable ? { y: -6, boxShadow: '0 20px 40px -12px rgba(37, 99, 235, 0.12)' } : undefined}
      className={`rounded-2xl border border-border bg-card shadow-md transition-shadow duration-300 ${noPadding ? '' : 'p-6'} ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default Card;
