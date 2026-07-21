import { useState } from 'react';
import { Navigation } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import type { ICoordinates } from '../../types';

interface IGetDirectionsButtonProps {
  origin: ICoordinates | null;
  destination: { latitude: number; longitude: number };
  label?: string;
  compact?: boolean;
  className?: string;
}

function GetDirectionsButton({
  origin,
  destination,
  label,
  compact = false,
  className = '',
}: IGetDirectionsButtonProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const buttonLabel = label ?? t('dashboard.getDirections');

  const handleClick = () => {
    if (!origin) {
      toast.error(t('errors.locationUnavailable', 'Location not available. Enable GPS first.'));
      return;
    }

    if (!destination.latitude || !destination.longitude) {
      toast.error(t('errors.locationUnavailable', 'Destination coordinates unavailable.'));
      return;
    }

    setIsLoading(true);

    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&travelmode=driving`;

    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
      toast.success(t('dashboard.openingNavigation', 'Opening navigation...'));
      setIsLoading(false);
    }, 300);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={`inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-primary font-semibold text-white shadow-md shadow-primary/20 transition-all duration-200 hover:scale-[1.03] hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/30 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&]:text-white [&_span]:text-white [&_svg]:text-white ${
        compact ? 'h-9 px-3 text-xs' : 'h-10 px-4 text-sm'
      } ${className}`}
      aria-label={buttonLabel}
    >
      {isLoading ? (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : (
        <Navigation size={compact ? 13 : 15} />
      )}
      {!compact && <span>{buttonLabel}</span>}
      {compact && <span className="hidden sm:inline">{buttonLabel}</span>}
    </button>
  );
}

export default GetDirectionsButton;
