import { useEffect, useRef, useCallback, useState } from 'react';

const EMERGENCY_PHRASES = [
  'help',
  'help me',
  'emergency',
  'ayuda',
  'necesito ayuda',
  'socorro',
  'emergencia',
];

interface IUseVoiceActivationReturn {
  isListening: boolean;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
}

interface ISpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: { results: SpeechRecognitionResultList }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

function useVoiceActivation(onActivate: () => void): IUseVoiceActivationReturn {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<ISpeechRecognitionInstance | null>(null);
  const isActiveRef = useRef(false);

  const SpeechRecognitionAPI =
    typeof window !== 'undefined'
      ? (window.SpeechRecognition || window.webkitSpeechRecognition) as (new () => ISpeechRecognitionInstance) | undefined
      : undefined;

  const isSupported = !!SpeechRecognitionAPI;

  const startListening = useCallback(() => {
    if (!SpeechRecognitionAPI || isActiveRef.current) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'es-ES';

    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1];
      if (!lastResult?.[0]) return;

      const transcript = lastResult[0].transcript.toLowerCase().trim();

      const isEmergency = EMERGENCY_PHRASES.some(
        (phrase) => transcript.includes(phrase),
      );

      if (isEmergency) {
        onActivate();
        recognition.stop();
        isActiveRef.current = false;
        setIsListening(false);
      }
    };

    recognition.onerror = () => {
      isActiveRef.current = false;
      setIsListening(false);
    };

    recognition.onend = () => {
      // Restart if still active (continuous listening)
      if (isActiveRef.current) {
        try {
          recognition.start();
        } catch {
          isActiveRef.current = false;
          setIsListening(false);
        }
      }
    };

    recognitionRef.current = recognition;
    isActiveRef.current = true;

    try {
      recognition.start();
      setIsListening(true);
    } catch {
      isActiveRef.current = false;
    }
  }, [SpeechRecognitionAPI, onActivate]);

  const stopListening = useCallback(() => {
    isActiveRef.current = false;
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  useEffect(() => {
    return () => {
      isActiveRef.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  return { isListening, isSupported, startListening, stopListening };
}

export default useVoiceActivation;
