import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { ROUTES } from '../constants';

function NotFoundPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-1 flex-col items-center justify-center gap-6 px-4 text-center"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-warning/10">
        <AlertCircle size={40} className="text-warning" />
      </div>
      <div>
        <h1 className="text-4xl font-bold text-text-primary">404</h1>
        <p className="mt-2 text-text-secondary">
          Page not found. The page you are looking for does not exist.
        </p>
      </div>
      <Link to={ROUTES.HOME}>
        <Button icon={<Home size={18} />} aria-label="Go back to home page">
          Back to Home
        </Button>
      </Link>
    </motion.div>
  );
}

export default NotFoundPage;
