import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Siren, Mic, MicOff } from 'lucide-react';
import { vibrate } from '../../utils/share';
import useVoiceActivation from '../../hooks/useVoiceActivation';
import EmergencyMode from './EmergencyMode';

function SOSButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleActivate = useCallback(() => {
    vibrate();
    setIsOpen(true);
  }, []);

  const { isListening, isSupported, startListening, stopListening } = useVoiceActivation(handleActivate);

  return (
    <>
      {/* Voice activation toggle */}
      {isSupported && (
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={isListening ? stopListening : startListening}
          className={`fixed bottom-24 left-4 z-40 flex h-10 w-10 items-center justify-center rounded-full border shadow-md transition-all md:bottom-8 md:left-8 ${
            isListening
              ? 'border-danger/30 bg-danger-light text-danger'
              : 'border-border bg-card text-text-muted hover:text-primary'
          }`}
          aria-label={isListening ? 'Stop voice detection' : 'Start voice detection'}
        >
          {isListening ? <Mic size={16} /> : <MicOff size={16} />}
        </motion.button>
      )}

      {/* Floating SOS Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
        animate={{ boxShadow: ['0 0 0 0 rgba(220, 38, 38, 0.4)', '0 0 0 12px rgba(220, 38, 38, 0)', '0 0 0 0 rgba(220, 38, 38, 0)'] }}
        transition={{ boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
        onClick={handleActivate}
        className="fixed bottom-24 right-4 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-danger to-danger/80 text-white shadow-xl shadow-danger/40 md:bottom-8 md:right-8 md:h-[72px] md:w-[72px]"
        aria-label="SOS Emergency Button"
      >
        <Siren size={26} />
      </motion.button>

      {/* Full-screen Emergency Mode */}
      <AnimatePresence>
        {isOpen && <EmergencyMode onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

export default SOSButton;
