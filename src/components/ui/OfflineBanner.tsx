import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useOnlineStatus from '../../hooks/useOnlineStatus';

function OfflineBanner() {
  const { t } = useTranslation();
  const isOnline = useOnlineStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="flex items-center justify-center gap-2 bg-warning px-4 py-2"
        >
          <WifiOff size={14} className="text-white" />
          <p className="text-xs font-medium text-white">{t('offline.message')}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default OfflineBanner;
