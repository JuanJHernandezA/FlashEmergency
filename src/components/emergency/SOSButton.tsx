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
      {/* Voice activation toggle — right side, above SOS on mobile */}
      {isSupported && (
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={isListening ? stopListening : startListening}
          className={`fixed right-3 top-[50%] z-30 flex h-9 w-9 -translate-y-[calc(50%+56px)] items-center justify-center rounded-full border shadow-md transition-all md:bottom-8 md:left-8 md:right-auto md:top-auto md:translate-y-0 md:h-10 md:w-10 ${
            isListening
              ? 'border-danger/30 bg-danger-light text-danger'
              : 'border-border bg-card text-text-muted hover:text-primary'
          }`}
          aria-label={isListening ? 'Stop voice detection' : 'Start voice detection'}
        >
          {isListening ? <Mic size={16} /> : <MicOff size={16} />}
        </motion.button>
      )}

      {/* Floating SOS Button — right side, vertically centered on mobile */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
        animate={{ boxShadow: ['0 0 0 0 rgba(220, 38, 38, 0.4)', '0 0 0 12px rgba(220, 38, 38, 0)', '0 0 0 0 rgba(220, 38, 38, 0)'] }}
        transition={{ boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
        onClick={handleActivate}
        className="fixed right-3 top-[50%] z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-danger to-danger/80 text-white shadow-xl shadow-danger/40 md:bottom-8 md:right-8 md:top-auto md:translate-y-0 md:h-[72px] md:w-[72px]"
        aria-label="SOS Emergency Button"
      >
        <Siren size={22} />
      </motion.button>

      {/* Full-screen Emergency Mode */}
      <AnimatePresence>
        {isOpen && <EmergencyMode onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

export default SOSButton;
