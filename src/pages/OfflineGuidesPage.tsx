import { motion } from 'framer-motion';
import { BookOpen, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FIRST_AID_GUIDES } from '../constants/firstAidGuides';
import { getLastKnownLocation } from '../hooks/useLastKnownLocation';

function OfflineGuidesPage() {
  const { i18n } = useTranslation();
  const isEs = i18n.language === 'es';
  const lastLocation = getLastKnownLocation();

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-8 pb-28 md:pb-8 lg:px-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-success-light">
          <BookOpen size={20} className="text-success" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-text-primary sm:text-2xl">
            {isEs ? 'Guías de Primeros Auxilios' : 'First Aid Guides'}
          </h1>
          <p className="text-xs text-text-muted">
            {isEs ? 'Disponible sin conexión' : 'Available offline'}
          </p>
        </div>
      </div>

      {/* Last known location */}
      {lastLocation && (
        <div className="flex items-center gap-2 rounded-xl bg-primary-light/50 px-4 py-2.5">
          <MapPin size={14} className="text-primary" />
          <span className="text-xs font-medium text-text-secondary">
            {isEs ? 'Última ubicación:' : 'Last known location:'} {lastLocation.latitude.toFixed(5)}, {lastLocation.longitude.toFixed(5)}
          </span>
        </div>
      )}

      {/* Guides */}
      <div className="mx-auto grid w-full max-w-3xl gap-4 sm:grid-cols-2">
        {FIRST_AID_GUIDES.map((guide) => (
          <motion.details
            key={guide.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="group rounded-2xl border border-border bg-card shadow-sm"
          >
            <summary className="flex cursor-pointer items-center gap-3 px-5 py-4 text-sm font-semibold text-text-primary marker:content-none">
              <BookOpen size={16} className="shrink-0 text-success" />
              <span>{isEs ? guide.titleEs : guide.titleEn}</span>
              <span className="ml-auto text-text-muted transition-transform group-open:rotate-90">›</span>
            </summary>
            <ol className="border-t border-border px-5 py-4">
              {(isEs ? guide.stepsEs : guide.stepsEn).map((step, i) => (
                <li key={i} className="flex gap-3 py-1.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success-light text-[10px] font-bold text-success">
                    {i + 1}
                  </span>
                  <span className="text-xs leading-relaxed text-text-secondary">{step}</span>
                </li>
              ))}
            </ol>
          </motion.details>
        ))}
      </div>
    </div>
  );
}

export default OfflineGuidesPage;
