import { motion } from 'framer-motion';
import { Bot, User, Volume2, VolumeX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { IChatMessage } from '../../types';

interface IChatBubbleProps {
  message: IChatMessage;
  isSpeaking: boolean;
  onSpeak: (text: string) => void;
  onStopSpeaking: () => void;
}

function formatContent(content: string): string {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />');
}

function ChatBubble({ message, isSpeaking, onSpeak, onStopSpeaking }: IChatBubbleProps) {
  const { t } = useTranslation();
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl shadow-sm ${
          isUser
            ? 'bg-gradient-to-br from-primary to-primary-hover'
            : 'bg-gradient-to-br from-success to-success/80'
        }`}
      >
        {isUser ? (
          <User size={16} className="text-white" />
        ) : (
          <Bot size={16} className="text-white" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={`group relative max-w-[80%] rounded-3xl px-5 py-3.5 ${
          isUser
            ? 'bg-gradient-to-br from-primary to-primary-hover text-white shadow-md shadow-primary/15'
            : 'border border-border bg-card text-text-primary shadow-sm'
        }`}
      >
        <div
          className={`text-sm leading-relaxed ${isUser ? 'text-white/95' : 'text-text-primary'}`}
          dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
        />

        {/* Voice button for assistant */}
        {!isUser && (
          <button
            type="button"
            onClick={() => (isSpeaking ? onStopSpeaking() : onSpeak(message.content))}
            className="mt-2.5 flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-[11px] font-medium text-text-muted transition-all duration-200 hover:bg-primary-light hover:text-primary"
            aria-label={isSpeaking ? 'Stop reading' : 'Read aloud'}
          >
            {isSpeaking ? <VolumeX size={11} /> : <Volume2 size={11} />}
            {isSpeaking ? t('assistant.stop') : t('assistant.listen')}
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default ChatBubble;
