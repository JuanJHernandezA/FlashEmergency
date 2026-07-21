import { motion } from 'framer-motion';
import { MapPin, Ruler, Thermometer, Phone, Globe, Share2, Copy, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useCountry } from '../../contexts/CountryContext';
import { getDistanceUnitLabel, getTemperatureUnitLabel } from '../../utils/locationFormatter';
import { shareLocation, copyCoordinates } from '../../utils/share';
import type { ICoordinates } from '../../types';

interface ICurrentLocationCardProps {
  coordinates: ICoordinates;
}

function CurrentLocationCard({ coordinates }: ICurrentLocationCardProps) {
  const { t, i18n } = useTranslation();
  const { location, measurementSystem, emergency, isDetecting } = useCountry();

  const cityDisplay = location?.city ?? null;
  const stateDisplay = location?.state ?? null;
  const countryDisplay = location?.country ?? null;
  const locationParts = [cityDisplay, stateDisplay, countryDisplay].filter(Boolean);
  const languageLabel = i18n.language === 'es' ? 'Español' : 'English';

  const handleShare = async () => {
    try {
      await shareLocation(coordinates);
      toast.success(t('sos.locationShared'));
    } catch {
      toast.error(t('sos.failedCopy'));
    }
  };

  const handleCopy = async () => {
    try {
      await copyCoordinates(coordinates);
      toast.success(t('sos.coordsCopied'));
    } catch {
      toast.error(t('sos.failedCopy'));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-md"
    >
      {/* Blue header */}
      <div className="bg-gradient-to-r from-primary to-primary-hover px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <MapPin size={20} className="text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
              {t('dashboard.currentLocation', 'Current Location')}
            </p>
            {isDetecting ? (
              <div className="mt-1 h-4 w-32 animate-pulse rounded bg-white/20" />
            ) : locationParts.length > 0 ? (
              <p className="truncate text-sm font-bold text-white">{locationParts.join(', ')}</p>
            ) : (
              <p className="text-sm font-bold text-white/70">{t('dashboard.unknownLocation', 'Unknown Location')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4">
        {/* Coordinates */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold text-text-primary">
            {coordinates.latitude.toFixed(5)}, {coordinates.longitude.toFixed(5)}
          </span>
          {coordinates.accuracy && (
            <span className="rounded-lg bg-background px-2 py-0.5 text-[10px] font-medium text-text-muted">
              ±{Math.round(coordinates.accuracy)}m
            </span>
          )}
        </div>

        {/* Info grid */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="flex items-center gap-2 rounded-xl bg-background px-3 py-2">
            <Ruler size={13} className="shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="text-[8px] font-bold uppercase text-text-muted">Unit</p>
              <p className="truncate text-[11px] font-semibold text-text-primary">{getDistanceUnitLabel(measurementSystem)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-background px-3 py-2">
            <Thermometer size={13} className="shrink-0 text-warning" />
            <div className="min-w-0">
              <p className="text-[8px] font-bold uppercase text-text-muted">Temp</p>
              <p className="truncate text-[11px] font-semibold text-text-primary">{getTemperatureUnitLabel(measurementSystem)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-background px-3 py-2">
            <Phone size={13} className="shrink-0 text-danger" />
            <div className="min-w-0">
              <p className="text-[8px] font-bold uppercase text-text-muted">SOS</p>
              <p className="truncate text-[11px] font-semibold text-text-primary">{emergency.primary}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-background px-3 py-2">
            <Globe size={13} className="shrink-0 text-secondary" />
            <div className="min-w-0">
              <p className="text-[8px] font-bold uppercase text-text-muted">Lang</p>
              <p className="truncate text-[11px] font-semibold text-text-primary">{languageLabel}</p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="flex h-9 flex-1 items-center justify-center gap-2 rounded-xl bg-primary-light text-xs font-semibold text-primary transition-all duration-200 hover:bg-primary/15 focus:outline-none focus:ring-2 focus:ring-primary/30"
            aria-label={t('sos.shareLocation')}
          >
            <Share2 size={14} />
            {t('sos.shareLocation')}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="flex h-9 flex-1 items-center justify-center gap-2 rounded-xl bg-secondary-light text-xs font-semibold text-secondary transition-all duration-200 hover:bg-secondary/15 focus:outline-none focus:ring-2 focus:ring-secondary/30"
            aria-label={t('sos.copyCoords')}
          >
            <Copy size={14} />
            {t('sos.copyCoords')}
          </button>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${coordinates.latitude},${coordinates.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-background text-text-muted transition-all duration-200 hover:bg-success-light hover:text-success focus:outline-none focus:ring-2 focus:ring-success/30"
            aria-label={t('dashboard.openInMaps', 'Open in Maps')}
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default CurrentLocationCard;
