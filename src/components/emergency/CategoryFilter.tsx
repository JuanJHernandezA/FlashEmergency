import { motion } from 'framer-motion';
import { Hospital, Pill, Shield, Flame, Stethoscope } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { EmergencyCategory } from '../../types';

interface ICategoryFilterProps {
  selected: EmergencyCategory | 'all';
  onChange: (category: EmergencyCategory | 'all') => void;
  counts: Record<EmergencyCategory | 'all', number>;
}

const CATEGORIES: Array<{ key: EmergencyCategory | 'all'; icon: typeof Hospital }> = [
  { key: 'all', icon: Stethoscope },
  { key: 'hospital', icon: Hospital },
  { key: 'clinic', icon: Stethoscope },
  { key: 'pharmacy', icon: Pill },
  { key: 'police', icon: Shield },
  { key: 'fire_station', icon: Flame },
];

function CategoryFilter({ selected, onChange, counts }: ICategoryFilterProps) {
  const { t } = useTranslation();

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-0.5">
      {CATEGORIES.map(({ key, icon: Icon }) => {
        const isActive = selected === key;
        const label = key === 'all' ? t('categories.all') : t(`categories.${key}`);
        const count = counts[key] ?? 0;

        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            aria-label={`Filter by ${label}`}
            className={`relative flex shrink-0 items-center gap-1.5 rounded-2xl px-3 py-2 text-[11px] font-semibold transition-all duration-200 ${
              isActive
                ? 'text-primary'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="category-filter-active"
                className="absolute inset-0 rounded-2xl bg-primary-light"
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              />
            )}
            <Icon size={12} className="relative z-10" />
            <span className="relative z-10">{label}</span>
            <span className={`relative z-10 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${isActive ? 'bg-primary/10 text-primary' : 'bg-background text-text-muted'}`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default CategoryFilter;
