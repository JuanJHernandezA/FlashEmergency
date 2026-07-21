import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { toast } from 'sonner';
import useInstallPrompt from '../../hooks/useInstallPrompt';

function InstallBanner() {
  const { canInstall, promptInstall } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);

  if (!canInstall || dismissed) return null;

  const handleInstall = async () => {
    const accepted = await promptInstall();
    if (accepted) {
      toast.success('App installed successfully!');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mx-4 mt-4 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 lg:mx-8"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Download size={16} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary">Install SafeAid AI</p>
          <p className="text-xs text-text-secondary">
            Install for quick access and offline support.
          </p>
        </div>
        <button
          type="button"
          onClick={handleInstall}
          className="shrink-0 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-hover"
          aria-label="Install app"
        >
          Install
        </button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-text-secondary hover:bg-border/50"
          aria-label="Dismiss install banner"
        >
          <X size={14} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

export default InstallBanner;
