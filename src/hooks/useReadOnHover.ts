import { useRef, useCallback } from 'react';

function useReadOnHover() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onMouseEnter = useCallback((text: string, lang?: string) => {
    if (!('speechSynthesis' in window)) return;

    timerRef.current = setTimeout(() => {
      window.speechSynthesis.cancel();
      const cleanText = text
        .replace(/\*\*/g, '')
        .replace(/#{1,6}\s?/g, '')
        .replace(/[-*]\s/g, '')
        .replace(/`/g, '')
        .slice(0, 500);

      if (!cleanText.trim()) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95;
      utterance.lang = lang ?? 'en-US';
      window.speechSynthesis.speak(utterance);
    }, 800);
  }, []);

  const onMouseLeave = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    window.speechSynthesis.cancel();
  }, []);

  return { onMouseEnter, onMouseLeave };
}

export default useReadOnHover;
