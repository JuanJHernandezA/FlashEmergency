import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Mic, MicOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface IChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  transcript: string;
  isListening: boolean;
  isSpeechSupported: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onResetTranscript: () => void;
}

function ChatInput({
  onSend,
  disabled,
  transcript,
  isListening,
  isSpeechSupported,
  onStartListening,
  onStopListening,
  onResetTranscript,
}: IChatInputProps) {
  const { t } = useTranslation();
  const [input, setInput] = useState('');

  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput('');
    onResetTranscript();
  };

  const handleMicToggle = () => {
    if (isListening) onStopListening();
    else onStartListening();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      {/* Mic button */}
      {isSpeechSupported && (
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={handleMicToggle}
          disabled={disabled}
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-200 ${
            isListening
              ? 'bg-gradient-to-br from-danger to-danger/80 text-white shadow-lg shadow-danger/25'
              : 'border border-border bg-card text-text-muted shadow-sm hover:border-primary/30 hover:text-primary'
          } disabled:cursor-not-allowed disabled:opacity-50`}
          aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </motion.button>
      )}

      {/* Input field */}
      <div className="relative flex-1">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isListening ? t('assistant.listening') : t('assistant.placeholder')}
          disabled={disabled}
          className="h-12 w-full rounded-2xl border border-border bg-card px-5 pr-14 text-sm text-text-primary shadow-sm placeholder:text-text-muted focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Type your emergency message"
        />

        {/* Send button */}
        <motion.button
          type="submit"
          whileTap={{ scale: 0.85 }}
          disabled={disabled || !input.trim()}
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-hover text-white shadow-sm transition-all duration-200 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Send message"
        >
          <Send size={14} />
        </motion.button>
      </div>
    </form>
  );
}

export default ChatInput;
