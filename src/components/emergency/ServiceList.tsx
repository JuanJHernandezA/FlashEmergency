import { motion } from 'framer-motion';
import { ExternalLink, Hospital, Pill, Shield, Flame, Stethoscope } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { IEmergencyService, ICoordinates, EmergencyCategory } from '../../types';
import { useCountry } from '../../contexts/CountryContext';
import { formatDistance } from '../../utils/locationFormatter';
import GetDirectionsButton from '../ui/GetDirectionsButton';

interface IServiceListProps {
  services: IEmergencyService[];
  isLoading: boolean;
  userCoordinates?: ICoordinates | null;
  selectedServiceId?: string | null;
  onSelectService?: (service: IEmergencyService) => void;
}

const CATEGORY_ICONS: Record<EmergencyCategory, typeof Hospital> = {
  hospital: Hospital,
  clinic: Stethoscope,
  pharmacy: Pill,
  police: Shield,
  fire_station: Flame,
};

const CATEGORY_COLORS: Record<EmergencyCategory, { text: string; bg: string }> = {
  hospital: { text: 'text-danger', bg: 'bg-danger-light' },
  clinic: { text: 'text-success', bg: 'bg-success-light' },
  pharmacy: { text: 'text-primary', bg: 'bg-primary-light' },
  police: { text: 'text-primary-hover', bg: 'bg-primary-light' },
  fire_station: { text: 'text-warning', bg: 'bg-warning-light' },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.03 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -6 },
  visible: { opacity: 1, x: 0 },
};

function ServiceList({ services, isLoading, userCoordinates, selectedServiceId, onSelectService }: IServiceListProps) {
  const { t } = useTranslation();
  const { measurementSystem } = useCountry();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4">
            <div className="h-11 w-11 shrink-0 animate-pulse rounded-2xl bg-border/60" />
            <div className="flex-1 space-y-2.5">
              <div className="h-3.5 w-3/4 animate-pulse rounded-lg bg-border/60" />
              <div className="h-3 w-1/2 animate-pulse rounded-lg bg-border/40" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background p-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-border/30">
          <Stethoscope size={24} className="text-text-muted" />
        </div>
        <p className="mt-4 text-sm font-medium text-text-secondary">
          {t('dashboard.noServicesFound')}
        </p>
        <p className="mt-1 text-xs text-text-muted">
          {t('dashboard.tryRefreshing')}
        </p>
      </div>
    );
  }

  return (
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-2.5"
    >
      {services.map((service) => {
        const Icon = CATEGORY_ICONS[service.category];
        const colors = CATEGORY_COLORS[service.category];

        return (
          <motion.li key={service.id} variants={itemVariants}>
            <div
              onClick={() => onSelectService?.(service)}
              className={`group flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 transition-all duration-200 hover:border-primary/20 hover:shadow-md ${
                selectedServiceId === service.id
                  ? 'border-primary/40 bg-primary-light/30 shadow-md'
                  : 'border-border/60 bg-card'
              }`}
            >
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${colors.bg}`}>
                <Icon size={18} className={colors.text} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold text-text-primary">
                  {service.name}
                </p>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-[11px] text-text-muted">
                    {t(`categories.${service.category}`)}
                  </span>
                  {service.distance !== undefined && (
                    <>
                      <span className="text-text-muted/40">·</span>
                      <span className="text-[11px] font-semibold text-primary">
                        {formatDistance(service.distance, measurementSystem)}
                      </span>
                    </>
                  )}
                </div>
                {service.address && (
                  <p className="mt-0.5 truncate text-[10px] text-text-muted">{service.address}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex shrink-0 gap-1.5 opacity-60 transition-opacity duration-200 group-hover:opacity-100">
                <GetDirectionsButton
                  origin={userCoordinates ?? null}
                  destination={{ latitude: service.latitude, longitude: service.longitude }}
                  compact
                />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${service.latitude},${service.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary-light text-secondary transition-colors hover:bg-secondary/20"
                  aria-label={`${t('dashboard.openInMaps')} - ${service.name}`}
                >
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}

export default ServiceList;
