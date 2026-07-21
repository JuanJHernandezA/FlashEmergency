import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Heart,
  LayoutDashboard,
  Bot,
  Users,
  History,
  HeartPulse,
  Camera,
  Menu,
  X,
} from 'lucide-react';
import { ROUTES, APP_NAME } from '../../constants';

function Navbar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NAV_ITEMS = [
    { to: ROUTES.HOME, label: t('nav.home'), icon: Heart },
    { to: ROUTES.DASHBOARD, label: t('nav.dashboard'), icon: LayoutDashboard },
    { to: ROUTES.ASSISTANT, label: t('nav.assistant'), icon: Bot },
    { to: ROUTES.CONTACTS, label: t('nav.contacts'), icon: Users },
    { to: ROUTES.REPORT, label: t('nav.report', 'Report'), icon: Camera },
    { to: ROUTES.HISTORY, label: t('nav.history'), icon: History },
    { to: ROUTES.PROFILE, label: t('nav.profile', 'Profile'), icon: HeartPulse },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/60 bg-card/70 shadow-sm backdrop-blur-xl" role="banner">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8" aria-label="Main navigation">
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5" aria-label={t('nav.home')}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-hover shadow-md shadow-primary/20">
              <Heart size={18} className="fill-white text-white" />
            </div>
            <span className="text-lg font-bold text-text-primary">{APP_NAME}</span>
          </Link>

          <ul className="hidden gap-1 md:flex">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <Link
                  to={to}
                  aria-label={label}
                  className={`relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    pathname === to ? 'text-primary' : 'text-text-secondary hover:text-primary'
                  }`}
                >
                  {pathname === to && (
                    <motion.span layoutId="navbar-active" className="absolute inset-0 rounded-xl bg-primary-light" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                  )}
                  <Icon size={16} className="relative z-10" />
                  <span className="relative z-10">{label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-text-secondary transition-colors hover:bg-primary-light hover:text-primary md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-border/60 bg-card md:hidden"
            >
              <ul className="flex flex-col gap-1 px-4 py-3">
                {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      aria-label={label}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                        pathname === to ? 'bg-primary-light text-primary' : 'text-text-secondary hover:bg-primary-light/50 hover:text-primary'
                      }`}
                    >
                      <Icon size={18} />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

export default Navbar;
