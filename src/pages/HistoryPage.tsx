import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Trash2, Bot, Clock, AlertCircle, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';
import { getAllConversations, deleteConversation, clearConversations } from '../lib/db';
import { ROUTES } from '../constants';
import type { IConversation } from '../types/conversation';

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(date: string): string {
  return new Date(date).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function HistoryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllConversations()
      .then(setConversations)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleOpen = (conv: IConversation) => {
    navigate(`${ROUTES.ASSISTANT}?id=${conv.id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      toast.success(t('history.entryRemoved'));
    } catch {
      toast.error(t('history.failedDelete'));
    }
  };

  const handleClearAll = async () => {
    try {
      await clearConversations();
      setConversations([]);
      toast.success(t('history.historyCleared'));
    } catch {
      toast.error(t('history.failedClear'));
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 px-3 py-5 sm:gap-6 sm:px-4 sm:py-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
            <History size={20} className="text-warning" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">{t('history.title')}</h1>
            <p className="mt-0.5 text-sm text-text-secondary">{t('history.subtitle')}</p>
          </div>
        </div>
        {conversations.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            icon={<Trash2 size={14} />}
            onClick={handleClearAll}
            aria-label={t('history.clearAll')}
          >
            {t('history.clearAll')}
          </Button>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-border/50" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && conversations.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center"
        >
          <Clock size={48} className="text-text-secondary/30" />
          <div>
            <p className="text-lg font-semibold text-text-primary">{t('history.noHistory')}</p>
            <p className="mt-1 text-sm text-text-secondary">{t('history.noHistoryDesc')}</p>
          </div>
        </motion.div>
      )}

      {/* Conversation list */}
      {!isLoading && conversations.length > 0 && (
        <div className="mx-auto w-full max-w-3xl">
          <AnimatePresence>
            <ul className="flex flex-col gap-3">
              {conversations.map((conv) => (
                <motion.li
                  key={conv.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <div
                    onClick={() => handleOpen(conv)}
                    className="group flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/20 hover:shadow-md"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleOpen(conv); }}
                    aria-label={`Open conversation: ${conv.title}`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success/10">
                      <Bot size={16} className="text-success" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-text-primary">{conv.title}</p>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-text-secondary">
                        <span>{formatDate(conv.updatedAt)}</span>
                        <span className="text-text-muted">·</span>
                        <span>{formatTime(conv.updatedAt)}</span>
                        <span className="text-text-muted">·</span>
                        <span className="inline-flex items-center gap-1">
                          <MessageSquare size={10} />
                          {conv.messages.length}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleDelete(conv.id); }}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-text-secondary opacity-0 transition-all hover:bg-danger/10 hover:text-danger group-hover:opacity-100"
                      aria-label={`Delete conversation: ${conv.title}`}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </motion.li>
              ))}
            </ul>
          </AnimatePresence>

          <div className="mt-4 flex items-center gap-2 rounded-xl bg-warning/5 px-4 py-3">
            <AlertCircle size={14} className="shrink-0 text-warning" />
            <p className="text-xs text-text-secondary">{t('history.localOnly')}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default HistoryPage;
