import { motion } from 'framer-motion';
import { ExternalLink, Hospital, Pill, Shield, Flame, Stethoscope, MapPin } from 'lucide-react';
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

const CATEGORY_COLORS: Record<EmergencyCategory, { text: string; bg: string; border: string }> = {
  hospital: { text: 'text-danger', bg: 'bg-danger-light', border: 'border-danger/20' },
  clinic: { text: 'text-success', bg: 'bg-success-light', border: 'border-success/20' },
  pharmacy: { text: 'text-primary', bg: 'bg-primary-light', border: 'border-primary/20' },
  police: { text: 'text-primary-hover', bg: 'bg-primary-light', border: 'border-primary/20' },
  fire_station: { text: 'text-warning', bg: 'bg-warning-light', border: 'border-warning/20' },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.03 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0 },
};

function ServiceList({ services, isLoading, userCoordinates, selectedServiceId, onSelectService }: IServiceListProps) {
  const { t } = useTranslation();
  const { measurementSystem } = useCountry();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border/60 bg-card p-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-border/50" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-3.5 w-3/4 animate-pulse rounded bg-border/50" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-border/40" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-border/30">
          <Stethoscope size={20} className="text-text-muted" />
        </div>
        <p className="mt-3 text-sm font-medium text-text-secondary">
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
      className="flex w-full min-w-0 flex-col gap-2"
    >
      {services.map((service) => {
        const Icon = CATEGORY_ICONS[service.category];
        const colors = CATEGORY_COLORS[service.category];
        const isSelected = selectedServiceId === service.id;

        return (
          <motion.li key={service.id} variants={itemVariants}>
            <div
              onClick={() => onSelectService?.(service)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') onSelectService?.(service); }}
              className={`group w-full min-w-0 cursor-pointer rounded-2xl border p-3 transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? `${colors.border} ${colors.bg}/20 shadow-md`
                  : 'border-border/50 bg-card hover:border-primary/20'
              }`}
            >
              {/* Top row: Icon + Name + Distance */}
              <div className="flex items-start gap-2.5">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${colors.bg}`}>
                  <Icon size={16} className={colors.text} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold leading-tight text-text-primary">
                    {service.name}
                  </p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="text-[10px] font-medium text-text-muted">
                      {t(`categories.${service.category}`)}
                    </span>
                    {service.distance !== undefined && (
                      <span className="text-[10px] font-bold text-primary">
                        {formatDistance(service.distance, measurementSystem)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Address row */}
              {service.address && (
                <div className="mt-1.5 flex items-center gap-1.5 pl-[44px]">
                  <MapPin size={10} className="shrink-0 text-text-muted/60" />
                  <p className="min-w-0 break-words text-[10px] leading-tight text-text-muted">{service.address}</p>
                </div>
              )}

              {/* Actions row */}
              <div className="mt-2 flex items-center gap-2 pl-[44px]">
                <GetDirectionsButton
                  origin={userCoordinates ?? null}
                  destination={{ latitude: service.latitude, longitude: service.longitude }}
                  compact
                  className="flex-1 sm:flex-none"
                />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${service.latitude},${service.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-background text-text-muted transition-colors hover:bg-secondary-light hover:text-secondary"
                  aria-label={`${t('dashboard.openInMaps')} - ${service.name}`}
                  onClick={(e) => e.stopPropagation()}
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
