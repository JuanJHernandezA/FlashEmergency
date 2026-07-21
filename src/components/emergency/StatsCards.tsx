import { motion } from 'framer-motion';
import { Hospital, Pill, Shield, Flame, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { IEmergencyService } from '../../types';
import { useCountry } from '../../contexts/CountryContext';
import { formatDistance } from '../../utils/locationFormatter';

interface IStatsCardsProps {
  services: IEmergencyService[];
  isLoading: boolean;
}

const STATS_CONFIG = [
  { key: 'hospital', labelKey: 'dashboard.hospitals', icon: Hospital, color: 'text-danger', bg: 'bg-danger-light' },
  { key: 'pharmacy', labelKey: 'dashboard.pharmacies', icon: Pill, color: 'text-primary', bg: 'bg-primary-light' },
  { key: 'police', labelKey: 'dashboard.police', icon: Shield, color: 'text-primary-hover', bg: 'bg-primary-light' },
  { key: 'fire_station', labelKey: 'dashboard.fireStations', icon: Flame, color: 'text-warning', bg: 'bg-warning-light' },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

function StatsCards({ services, isLoading }: IStatsCardsProps) {
  const { t } = useTranslation();
  const { measurementSystem } = useCountry();
  const nearest = services[0];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
    >
      {/* Nearest service card */}
      <motion.div
        variants={itemVariants}
        className="col-span-2 flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-md sm:col-span-1"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-success-light">
          <MapPin size={20} className="text-success" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            {t('dashboard.nearest')}
          </p>
          {isLoading ? (
            <div className="mt-1.5 h-4 w-14 animate-pulse rounded-lg bg-border" />
          ) : nearest ? (
            <p className="truncate text-sm font-bold text-text-primary">
              {nearest.distance !== undefined
                ? formatDistance(nearest.distance, measurementSystem)
                : '—'}
            </p>
          ) : (
            <p className="text-sm font-bold text-text-muted">—</p>
          )}
        </div>
      </motion.div>

      {/* Category count cards */}
      {STATS_CONFIG.map(({ key, labelKey, icon: Icon, color, bg }) => {
        const count = services.filter((s) => s.category === key).length;

        return (
          <motion.div
            key={key}
            variants={itemVariants}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-md"
          >
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${bg}`}>
              <Icon size={20} className={color} />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                {t(labelKey)}
              </p>
              {isLoading ? (
                <div className="mt-1.5 h-4 w-6 animate-pulse rounded-lg bg-border" />
              ) : (
                <p className="text-lg font-bold text-text-primary">{count}</p>
              )}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default StatsCards;
