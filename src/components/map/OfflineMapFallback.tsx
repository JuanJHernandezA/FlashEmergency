import { MapPin, WifiOff, Navigation } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ICoordinates, IEmergencyService } from '../../types';
import { useCountry } from '../../contexts/CountryContext';
import { formatDistance } from '../../utils/locationFormatter';

interface IOfflineMapFallbackProps {
  coordinates: ICoordinates;
  services: IEmergencyService[];
}

function OfflineMapFallback({ coordinates, services }: IOfflineMapFallbackProps) {
  const { t } = useTranslation();
  const { measurementSystem } = useCountry();
  const nearby = services.slice(0, 5);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-5 rounded-2xl bg-card p-6">
      {/* Offline indicator */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-warning-light">
          <WifiOff size={24} className="text-warning" />
        </div>
        <p className="text-sm font-semibold text-text-primary">
          {t('offline.mapUnavailable', 'Map unavailable offline')}
        </p>
        <p className="text-xs text-text-muted">
          {t('offline.usingCached', 'Showing cached data from your last session')}
        </p>
      </div>

      {/* Coordinates */}
      <div className="flex items-center gap-2 rounded-xl bg-primary-light px-4 py-2.5">
        <MapPin size={14} className="text-primary" />
        <span className="font-mono text-xs font-semibold text-primary">
          {coordinates.latitude.toFixed(5)}, {coordinates.longitude.toFixed(5)}
        </span>
      </div>

      {/* Cached services list */}
      {nearby.length > 0 && (
        <div className="w-full max-w-sm">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">
            {t('offline.cachedServices', 'Cached nearby services')}
          </p>
          <ul className="flex flex-col gap-2">
            {nearby.map((service) => (
              <li key={service.id} className="flex items-center justify-between gap-2 rounded-xl bg-background px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-text-primary">{service.name}</p>
                  {service.distance !== undefined && (
                    <p className="text-[10px] text-text-muted">{formatDistance(service.distance, measurementSystem)}</p>
                  )}
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${coordinates.latitude},${coordinates.longitude}&destination=${service.latitude},${service.longitude}&travelmode=driving`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white"
                  aria-label={`${t('dashboard.getDirections')} - ${service.name}`}
                >
                  <Navigation size={12} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default OfflineMapFallback;
