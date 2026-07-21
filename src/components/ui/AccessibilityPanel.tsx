import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Accessibility, Sun, Moon, Monitor, RotateCcw, Eye, Volume2, X, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, fontSize, highContrast, setTheme, setFontSize, setHighContrast } = useTheme();
  const { t, i18n } = useTranslation();

  const currentLang = i18n.language.startsWith('es') ? 'es' : 'en';

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const fontSizes: Array<{ key: 'small' | 'normal' | 'large' | 'xl'; label: string }> = [
    { key: 'small', label: 'S' },
    { key: 'normal', label: 'M' },
    { key: 'large', label: 'L' },
    { key: 'xl', label: 'XL' },
  ];

  const handleReadAloud = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const mainContent = document.getElementById('main-content');
      const text = mainContent?.textContent ?? '';
      if (text) {
        const utterance = new SpeechSynthesisUtterance(text.slice(0, 3000));
        utterance.rate = 0.9;
        utterance.lang = i18n.language === 'es' ? 'es-ES' : 'en-US';
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <>
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-28 left-3 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-text-secondary shadow-lg transition-colors hover:bg-primary-light hover:text-primary md:bottom-8 md:left-8 md:h-12 md:w-12"
        aria-label={t('accessibility.title')}
      >
        <Accessibility size={20} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] overflow-y-auto border-r border-border bg-card p-6 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Accessibility size={20} className="text-primary" />
                  <h2 className="text-base font-bold text-text-primary">{t('accessibility.title')}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-text-muted hover:bg-background"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Language */}
              <div className="mt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">{t('accessibility.language')}</p>
                <div className="flex gap-2">
                  {([
                    { key: 'en', label: 'English' },
                    { key: 'es', label: 'Español' },
                  ] as const).map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleLanguageChange(key)}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-xs font-medium transition-all ${
                        currentLang === key
                          ? 'border-primary bg-primary-light text-primary'
                          : 'border-border bg-background text-text-secondary hover:border-primary/30'
                      }`}
                      aria-label={label}
                    >
                      <Globe size={14} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme */}
              <div className="mt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">{t('accessibility.theme')}</p>
                <div className="flex gap-2">
                  {([
                    { key: 'light', icon: Sun, label: t('accessibility.light') },
                    { key: 'dark', icon: Moon, label: t('accessibility.dark') },
                    { key: 'system', icon: Monitor, label: t('accessibility.system') },
                  ] as const).map(({ key, icon: Icon, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTheme(key)}
                      className={`flex flex-1 flex-col items-center gap-1.5 rounded-2xl border px-3 py-3 text-xs font-medium transition-all ${
                        theme === key
                          ? 'border-primary bg-primary-light text-primary'
                          : 'border-border bg-background text-text-secondary hover:border-primary/30'
                      }`}
                      aria-label={label}
                    >
                      <Icon size={18} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Size */}
              <div className="mt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">{t('accessibility.textSize')}</p>
                <div className="flex gap-2">
                  {fontSizes.map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFontSize(key)}
                      className={`flex h-10 flex-1 items-center justify-center rounded-2xl border text-sm font-bold transition-all ${
                        fontSize === key
                          ? 'border-primary bg-primary-light text-primary'
                          : 'border-border bg-background text-text-secondary hover:border-primary/30'
                      }`}
                      aria-label={key}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* High Contrast */}
              <div className="mt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">{t('accessibility.contrast')}</p>
                <button
                  type="button"
                  onClick={() => setHighContrast(!highContrast)}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-all ${
                    highContrast
                      ? 'border-primary bg-primary-light text-primary'
                      : 'border-border bg-background text-text-secondary hover:border-primary/30'
                  }`}
                  aria-label={t('accessibility.highContrast')}
                >
                  <Eye size={18} />
                  {t('accessibility.highContrast')}
                  <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${highContrast ? 'bg-primary text-white' : 'bg-border text-text-muted'}`}>
                    {highContrast ? t('accessibility.on') : t('accessibility.off')}
                  </span>
                </button>
              </div>

              {/* Read Aloud */}
              <div className="mt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">{t('accessibility.readAloud')}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleReadAloud}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-text-secondary transition-all hover:border-primary/30 hover:text-primary"
                    aria-label={t('accessibility.readScreen')}
                  >
                    <Volume2 size={16} />
                    {t('accessibility.readScreen')}
                  </button>
                  <button
                    type="button"
                    onClick={() => window.speechSynthesis.cancel()}
                    className="flex items-center justify-center rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-text-secondary transition-all hover:border-danger/30 hover:text-danger"
                    aria-label={t('accessibility.stop')}
                  >
                    {t('accessibility.stop')}
                  </button>
                </div>
              </div>

              {/* Reset */}
              <div className="mt-8 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setTheme('system');
                    setFontSize('normal');
                    setHighContrast(false);
                    handleLanguageChange('en');
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-background py-3 text-sm font-medium text-text-secondary transition-all hover:border-danger/30 hover:text-danger"
                  aria-label={t('accessibility.resetAll')}
                >
                  <RotateCcw size={14} />
                  {t('accessibility.resetAll')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default AccessibilityPanel;
