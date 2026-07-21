import { motion } from 'framer-motion';
import { Phone, Siren } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCountry } from '../../contexts/CountryContext';

function EmergencyNumberCard() {
  const { t } = useTranslation();
  const { emergency, country } = useCountry();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-3 rounded-2xl border border-danger/20 bg-danger-light/50 px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-danger/10 sm:h-11 sm:w-11">
          <Siren size={18} className="text-danger" />
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-danger">
            {t('dashboard.emergencyNumber')}
          </p>
          <div className="flex items-center gap-1.5">
            <Phone size={16} className="text-text-primary" />
            <span className="text-xl font-bold text-text-primary sm:text-2xl">{emergency.primary}</span>
          </div>
          {country && (
            <p className="text-[10px] text-text-muted">{country.country}</p>
          )}
        </div>
      </div>
      <a
        href={`tel:${emergency.primary}`}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-danger to-danger/90 text-sm font-bold text-white shadow-lg shadow-danger/25 transition-all duration-200 hover:shadow-xl sm:h-12 sm:w-auto sm:px-6"
        aria-label={`${t('dashboard.call')} ${emergency.primary}`}
      >
        <Phone size={16} />
        {t('dashboard.call')} {emergency.primary}
      </a>
    </motion.div>
  );
}

export default EmergencyNumberCard;
