import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Bot,
  Share2,
  ShieldCheck,
  Siren,
  Clock,
  Mic,
  Users,
  ArrowRight,
  Heart,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { ROUTES } from '../constants';

const FEATURE_ICONS = [MapPin, Bot, Share2, Mic, ShieldCheck, Siren, Users, Clock] as const;
const FEATURE_COLORS = [
  { color: 'text-primary', bg: 'bg-primary-light' },
  { color: 'text-success', bg: 'bg-success-light' },
  { color: 'text-secondary', bg: 'bg-secondary-light' },
  { color: 'text-warning', bg: 'bg-warning-light' },
  { color: 'text-danger', bg: 'bg-danger-light' },
  { color: 'text-primary', bg: 'bg-primary-light' },
  { color: 'text-secondary', bg: 'bg-secondary-light' },
  { color: 'text-warning', bg: 'bg-warning-light' },
] as const;

const FEATURE_KEYS = [
  'nearbyServices',
  'aiFirstAid',
  'shareLocation',
  'voiceControl',
  'offlineMode',
  'sosButton',
  'emergencyContacts',
  'historyFeature',
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col pb-16 md:pb-0">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-3 pb-12 pt-8 sm:px-4 sm:pb-24 sm:pt-20 lg:pb-32 lg:pt-28">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary-light/40 via-background to-background" />
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-secondary/5 blur-3xl" />
        <div className="pointer-events-none absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-danger/3 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-4 py-2 shadow-sm"
            >
              <Heart size={14} className="fill-danger text-danger" />
              <span className="text-xs font-semibold text-text-secondary">{t('app.badge')}</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-primary-hover shadow-2xl shadow-primary/30 sm:h-28 sm:w-28"
            >
              <ShieldCheck size={48} className="text-white sm:h-14 sm:w-14" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-text-primary sm:text-5xl lg:text-6xl"
            >
              {t('hero.title')}{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {t('hero.titleHighlight')}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <Link to={ROUTES.DASHBOARD}>
                <Button size="lg" icon={<MapPin size={18} />} aria-label={t('hero.startNow')}>
                  {t('hero.startNow')}
                  <ArrowRight size={16} className="ml-1" />
                </Button>
              </Link>
              <Link to={ROUTES.ASSISTANT}>
                <Button size="lg" variant="outline" icon={<Bot size={18} />} aria-label={t('hero.aiAssistant')}>
                  {t('hero.aiAssistant')}
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-8 flex items-center gap-4 text-xs text-text-muted"
            >
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-success" />
                {t('hero.free')}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary" />
                {t('hero.offline')}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-secondary" />
                {t('hero.noSignup')}
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-16 text-center"
          >
            <span className="mb-4 inline-block rounded-full bg-primary-light px-4 py-1.5 text-xs font-semibold text-primary">
              {t('features.label')}
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              {t('features.title')}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-text-secondary">
              {t('features.subtitle')}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {FEATURE_KEYS.map((key, i) => {
              const Icon = FEATURE_ICONS[i];
              const { color, bg } = FEATURE_COLORS[i];
              return (
                <motion.div key={key} variants={itemVariants}>
                  <Card hoverable className="h-full">
                    <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${bg}`}>
                      <Icon size={22} className={color} />
                    </div>
                    <h3 className="text-base font-semibold text-text-primary">{t(`features.${key}`)}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">{t(`features.${key}Desc`)}</p>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-hover px-8 py-16 text-center shadow-2xl shadow-primary/20 sm:px-16"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/5 blur-2xl" />

            <div className="relative">
              <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                {t('cta.title')}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm text-white/80 sm:text-base">
                {t('cta.subtitle')}
              </p>
              <div className="mt-8">
                <Link to={ROUTES.DASHBOARD}>
                  <Button
                    size="lg"
                    variant="ghost"
                    icon={<Siren size={18} />}
                    className="bg-white text-primary hover:bg-white/90 hover:text-primary shadow-lg"
                    aria-label={t('cta.openDashboard')}
                  >
                    {t('cta.openDashboard')}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-border/60 px-4 py-8">
        <p className="mx-auto max-w-2xl text-center text-xs leading-relaxed text-text-muted">
          {t('disclaimer')}
        </p>
      </section>
    </div>
  );
}

export default HomePage;
