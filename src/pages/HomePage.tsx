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
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { ROUTES, APP_NAME } from '../constants';

const FEATURES = [
  {
    icon: MapPin,
    title: 'Nearby Services',
    description: 'Find hospitals, clinics, pharmacies, police and fire stations near you instantly.',
    color: 'text-primary',
    bg: 'bg-primary-light',
  },
  {
    icon: Bot,
    title: 'AI First Aid',
    description: 'Get step-by-step emergency guidance powered by artificial intelligence.',
    color: 'text-success',
    bg: 'bg-success-light',
  },
  {
    icon: Share2,
    title: 'Share Location',
    description: 'Send your exact GPS coordinates to emergency contacts with one tap.',
    color: 'text-secondary',
    bg: 'bg-secondary-light',
  },
  {
    icon: Mic,
    title: 'Voice Control',
    description: 'Speak your emergency and listen to instructions hands-free.',
    color: 'text-warning',
    bg: 'bg-warning-light',
  },
  {
    icon: ShieldCheck,
    title: 'Offline Mode',
    description: 'Access saved contacts, guides, and your last known location without internet.',
    color: 'text-danger',
    bg: 'bg-danger-light',
  },
  {
    icon: Siren,
    title: 'SOS Button',
    description: 'One-tap emergency alert that vibrates, shares location, and notifies contacts.',
    color: 'text-primary',
    bg: 'bg-primary-light',
  },
  {
    icon: Users,
    title: 'Emergency Contacts',
    description: 'Save trusted contacts for quick access during emergencies.',
    color: 'text-secondary',
    bg: 'bg-secondary-light',
  },
  {
    icon: Clock,
    title: 'History',
    description: 'Review previous searches and AI conversations for future reference.',
    color: 'text-warning',
    bg: 'bg-warning-light',
  },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function HomePage() {
  return (
    <div className="flex flex-col pb-20 md:pb-0">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:pb-24 sm:pt-20 lg:pb-32 lg:pt-28">
        {/* Background gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary-light/40 via-background to-background" />
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-secondary/5 blur-3xl" />
        <div className="pointer-events-none absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-danger/3 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-4 py-2 shadow-sm"
            >
              <Heart size={14} className="fill-danger text-danger" />
              <span className="text-xs font-semibold text-text-secondary">Emergency Assistant App</span>
            </motion.div>

            {/* Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-primary-hover shadow-2xl shadow-primary/30 sm:h-28 sm:w-28"
            >
              <ShieldCheck size={48} className="text-white sm:h-14 sm:w-14" />
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-text-primary sm:text-5xl lg:text-6xl"
            >
              Emergency Help,{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Instantly
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg"
            >
              {APP_NAME} combines AI-powered guidance, GPS location, and nearby emergency services
              to help you act fast when every second counts.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <Link to={ROUTES.DASHBOARD}>
                <Button size="lg" icon={<MapPin size={18} />} aria-label="Start finding help now">
                  Start Now
                  <ArrowRight size={16} className="ml-1" />
                </Button>
              </Link>
              <Link to={ROUTES.ASSISTANT}>
                <Button size="lg" variant="outline" icon={<Bot size={18} />} aria-label="Talk to AI assistant">
                  AI Assistant
                </Button>
              </Link>
            </motion.div>

            {/* Trust indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-8 flex items-center gap-4 text-xs text-text-muted"
            >
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-success" />
                Free & Open
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Works Offline
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-secondary" />
                No Sign-up
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
              Features
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Everything You Need in an Emergency
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-text-secondary">
              Critical tools combined in one place to reduce response time and save lives.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {FEATURES.map(({ icon: Icon, title, description, color, bg }) => (
              <motion.div key={title} variants={itemVariants}>
                <Card hoverable className="h-full">
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${bg}`}>
                    <Icon size={22} className={color} />
                  </div>
                  <h3 className="text-base font-semibold text-text-primary">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">{description}</p>
                </Card>
              </motion.div>
            ))}
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
            {/* Decorative */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/5 blur-2xl" />

            <div className="relative">
              <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                Be Prepared, Not Scared
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm text-white/80 sm:text-base">
                Emergencies happen without warning. {APP_NAME} equips you with the tools to stay calm,
                act fast, and get the right help.
              </p>
              <div className="mt-8">
                <Link to={ROUTES.DASHBOARD}>
                  <Button
                    size="lg"
                    variant="ghost"
                    icon={<Siren size={18} />}
                    className="bg-white text-primary hover:bg-white/90 hover:text-primary shadow-lg"
                    aria-label="Open emergency dashboard"
                  >
                    Open Dashboard
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
          {APP_NAME} is an informational emergency assistant. It does not replace doctors, hospitals,
          ambulances, or emergency services. Always contact your local emergency number in life-threatening situations.
        </p>
      </section>
    </div>
  );
}

export default HomePage;
