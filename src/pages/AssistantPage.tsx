import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Bot, ShieldCheck, Mic, Plus, Heart, Flame, Bone, Pill, Bug, Car, AlertTriangle, Brain } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import ChatBubble from '../components/chat/ChatBubble';
import ChatInput from '../components/chat/ChatInput';
import TypingIndicator from '../components/chat/TypingIndicator';
import Button from '../components/ui/Button';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';
import { sendMessage, cancelActiveRequest } from '../services/groq';
import { useCountry } from '../contexts/CountryContext';
import { saveConversation, getConversation } from '../lib/db';
import type { IChatMessage } from '../types';
import type { IConversation } from '../types/conversation';

const EMERGENCY_CATEGORIES = [
  { icon: Heart, labelEn: 'Heart Attack', labelEs: 'Infarto', prompt: { en: 'Someone is having a heart attack. What should I do immediately?', es: 'Alguien está teniendo un infarto. ¿Qué debo hacer inmediatamente?' }, color: 'text-danger', bg: 'bg-danger-light' },
  { icon: Brain, labelEn: 'Unconscious', labelEs: 'Inconsciente', prompt: { en: 'A person is unconscious and not responding. Help me.', es: 'Una persona está inconsciente y no responde. Ayúdame.' }, color: 'text-primary', bg: 'bg-primary-light' },
  { icon: Flame, labelEn: 'Burns', labelEs: 'Quemaduras', prompt: { en: 'Someone has a burn injury. What are the first aid steps?', es: 'Alguien tiene una quemadura. ¿Cuáles son los pasos de primeros auxilios?' }, color: 'text-warning', bg: 'bg-warning-light' },
  { icon: Bone, labelEn: 'Fracture', labelEs: 'Fractura', prompt: { en: 'I think someone has a broken bone. What should I do?', es: 'Creo que alguien tiene un hueso roto. ¿Qué debo hacer?' }, color: 'text-secondary', bg: 'bg-secondary-light' },
  { icon: AlertTriangle, labelEn: 'Choking', labelEs: 'Asfixia', prompt: { en: 'Someone is choking and cannot breathe. Help!', es: 'Alguien se está ahogando y no puede respirar. ¡Ayuda!' }, color: 'text-danger', bg: 'bg-danger-light' },
  { icon: Pill, labelEn: 'Poisoning', labelEs: 'Envenenamiento', prompt: { en: 'I suspect someone has been poisoned. What should I do?', es: 'Sospecho que alguien ha sido envenenado. ¿Qué debo hacer?' }, color: 'text-success', bg: 'bg-success-light' },
  { icon: Bug, labelEn: 'Bite/Sting', labelEs: 'Mordedura', prompt: { en: 'Someone was bitten by an animal or stung. What should I do?', es: 'Alguien fue mordido por un animal o picado. ¿Qué debo hacer?' }, color: 'text-warning', bg: 'bg-warning-light' },
  { icon: Car, labelEn: 'Accident', labelEs: 'Accidente', prompt: { en: 'There has been a car accident with injuries. What should I do first?', es: 'Ha habido un accidente de auto con heridos. ¿Qué debo hacer primero?' }, color: 'text-primary', bg: 'bg-primary-light' },
] as const;

function AssistantPage() {
  const { t, i18n } = useTranslation();
  const { country, emergency } = useCountry();
  const [searchParams, setSearchParams] = useSearchParams();
  const [conversationId, setConversationId] = useState<string | null>(searchParams.get('id'));
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isRequestInFlight = useRef(false);

  const QUICK_PROMPTS = [
    t('assistant.prompts.choking'),
    t('assistant.prompts.heartAttack'),
    t('assistant.prompts.burn'),
    t('assistant.prompts.fainted'),
  ];

  const {
    transcript,
    isListening,
    isSupported: isSpeechSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const { isSpeaking, speak, stop: stopSpeaking } = useSpeechSynthesis();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isLoading, scrollToBottom]);

  // Load existing conversation if ID is in URL
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setConversationId(id);
      getConversation(id).then((conv) => {
        if (conv) {
          setMessages(conv.messages.map((m) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            createdAt: new Date(m.timestamp),
          })));
        }
      }).catch(() => {});
    } else {
      // No ID — fresh state
      setConversationId(null);
      setMessages([]);
    }
  }, [searchParams]);

  useEffect(() => {
    isRequestInFlight.current = false;
    return () => {
      cancelActiveRequest();
      isRequestInFlight.current = false;
    };
  }, []);

  const persistConversation = useCallback(async (msgs: IChatMessage[], convId: string, title: string) => {
    const conversation: IConversation = {
      id: convId,
      title,
      messages: msgs.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: m.createdAt instanceof Date ? m.createdAt.toISOString() : String(m.createdAt),
      })),
      createdAt: msgs[0]?.createdAt instanceof Date ? msgs[0].createdAt.toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      language: i18n.language,
    };
    await saveConversation(conversation).catch(() => {});
  }, [i18n.language]);

  const handleSend = useCallback(async (userMessage: string) => {
    if (isRequestInFlight.current) return;
    isRequestInFlight.current = true;

    // Create or reuse conversation ID
    let currentConvId = conversationId;
    if (!currentConvId) {
      currentConvId = crypto.randomUUID();
      setConversationId(currentConvId);
      setSearchParams({ id: currentConvId }, { replace: true });
    }

    const userMsg: IChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userMessage,
      createdAt: new Date(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    // Persist user message immediately
    const title = messages.length === 0 ? userMessage.slice(0, 60) : messages[0].content.slice(0, 60);
    await persistConversation(updatedMessages, currentConvId, title);

    try {
      const response = await sendMessage(messages, userMessage, {
        country: country?.country,
        emergencyNumber: emergency.primary,
        language: i18n.language,
      });
      const assistantMsg: IChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        createdAt: new Date(),
      };

      const finalMessages = [...updatedMessages, assistantMsg];
      setMessages(finalMessages);

      // Persist AI response immediately
      await persistConversation(finalMessages, currentConvId, title);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get a response. Please try again.';
      if (errorMessage !== 'Request was cancelled.') {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
      isRequestInFlight.current = false;
    }
  }, [messages, conversationId, persistConversation, country, emergency, i18n.language, setSearchParams]);

  const handleNewConversation = () => {
    cancelActiveRequest();
    stopSpeaking();
    setMessages([]);
    setConversationId(null);
    setSearchParams({}, { replace: true });
    setIsLoading(false);
    isRequestInFlight.current = false;
  };

  return (
    <div className="flex flex-1 flex-col pb-20 md:pb-0">
      {/* Header */}
      <div className="border-b border-border/60 bg-card/80 px-4 py-4 backdrop-blur-sm lg:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-success to-success/80 shadow-md shadow-success/20">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-text-primary sm:text-lg">{t('assistant.title')}</h1>
              <p className="text-[11px] text-text-muted">{t('assistant.poweredBy')}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                icon={<Plus size={13} />}
                onClick={handleNewConversation}
                aria-label="New conversation"
              >
                New
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 py-8 lg:px-8">
          <div className="mx-auto flex max-w-4xl flex-col gap-5">
            {/* Empty state */}
            {messages.length === 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-8 text-center sm:py-12"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-primary-hover shadow-2xl shadow-primary/20">
                  <ShieldCheck size={28} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-text-primary sm:text-2xl">{t('assistant.howCanIHelp')}</h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-text-secondary">{t('assistant.describeEmergency')}</p>

                {/* Emergency number banner */}
                {emergency.primary && (
                  <div className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-danger-light px-4 py-2">
                    <Heart size={14} className="text-danger" />
                    <span className="text-xs font-bold text-danger">
                      {t('dashboard.emergencyNumber')}: {emergency.primary}
                    </span>
                    {country && <span className="text-[10px] text-danger/70">({country.country})</span>}
                  </div>
                )}

                {/* Emergency Categories */}
                <div className="mt-6 w-full max-w-lg">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    {i18n.language === 'es' ? 'Selecciona la emergencia' : 'Select emergency type'}
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {EMERGENCY_CATEGORIES.map(({ icon: Icon, labelEn, labelEs, prompt, color, bg }) => (
                      <button
                        key={labelEn}
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleSend(i18n.language === 'es' ? prompt.es : prompt.en)}
                        className={`flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-3 text-center shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md active:scale-95 disabled:opacity-50`}
                        aria-label={i18n.language === 'es' ? labelEs : labelEn}
                      >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
                          <Icon size={18} className={color} />
                        </div>
                        <span className="text-[10px] font-semibold text-text-primary">
                          {i18n.language === 'es' ? labelEs : labelEn}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick text prompts */}
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleSend(prompt)}
                      className="rounded-2xl border border-border bg-card px-3 py-2 text-[11px] font-medium text-text-secondary shadow-sm transition-all duration-200 hover:border-primary/30 hover:text-primary disabled:opacity-50"
                      aria-label={`Send: ${prompt}`}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                <p className="mt-8 text-[10px] text-text-muted">{t('assistant.disclaimer')}</p>
              </motion.div>
            )}

            {/* Messages */}
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                message={message}
                isSpeaking={isSpeaking}
                onSpeak={speak}
                onStopSpeaking={stopSpeaking}
              />
            ))}

            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="border-t border-border/60 bg-card/80 px-4 py-4 backdrop-blur-sm lg:px-8">
          <div className="mx-auto max-w-4xl">
            <ChatInput
              onSend={handleSend}
              disabled={isLoading}
              transcript={transcript}
              isListening={isListening}
              isSpeechSupported={isSpeechSupported}
              onStartListening={startListening}
              onStopListening={stopListening}
              onResetTranscript={resetTranscript}
            />
            {isListening && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 text-center text-xs font-semibold text-danger"
              >
                <span className="inline-flex items-center gap-1.5"><Mic size={12} /> {t('assistant.listening')}</span>
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssistantPage;
