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
      className="flex items-center justify-between gap-4 rounded-2xl border border-danger/20 bg-danger-light/50 px-5 py-4 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-danger/10">
          <Siren size={20} className="text-danger" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-danger">
            {t('dashboard.emergencyNumber')}
          </p>
          <div className="flex items-center gap-2">
            <Phone size={18} className="text-text-primary" />
            <span className="text-2xl font-bold text-text-primary">{emergency.primary}</span>
          </div>
          {country && (
            <p className="text-[10px] text-text-muted">{country.country}</p>
          )}
        </div>
      </div>
      <a
        href={`tel:${emergency.primary}`}
        className="flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-b from-danger to-danger/90 px-6 text-sm font-bold text-white shadow-lg shadow-danger/25 transition-all duration-200 hover:shadow-xl hover:shadow-danger/30 focus:outline-none focus:ring-2 focus:ring-danger/30 focus:ring-offset-2"
        aria-label={`${t('dashboard.call')} ${emergency.primary}`}
      >
        <Phone size={16} />
        {t('dashboard.call')}
      </a>
    </motion.div>
  );
}

export default EmergencyNumberCard;
