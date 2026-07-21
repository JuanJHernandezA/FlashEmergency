import { lazy, Suspense, useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, AlertTriangle, WifiOff, List, LayoutDashboard, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useGeolocation from '../hooks/useGeolocation';
import useNearbyServices from '../hooks/useNearbyServices';
import useLastKnownLocation from '../hooks/useLastKnownLocation';
import useOnlineStatus from '../hooks/useOnlineStatus';
import { useCountry } from '../contexts/CountryContext';
import Button from '../components/ui/Button';
import DeviceStatus from '../components/ui/DeviceStatus';
import ServiceList from '../components/emergency/ServiceList';
import StatsCards from '../components/emergency/StatsCards';
import CategoryFilter from '../components/emergency/CategoryFilter';
import EmergencyNumberCard from '../components/emergency/EmergencyNumberCard';
import CurrentLocationCard from '../components/emergency/CurrentLocationCard';
import GetDirectionsButton from '../components/ui/GetDirectionsButton';
import ReadableSection from '../components/ui/ReadableSection';
import type { EmergencyCategory, IEmergencyService } from '../types';

const EmergencyMap = lazy(() => import('../components/map/EmergencyMap'));
const OfflineMapFallback = lazy(() => import('../components/map/OfflineMapFallback'));

function DashboardPage() {
  const { t, i18n } = useTranslation();
  const isOnline = useOnlineStatus();
  const { coordinates, status, error, isLoading, requestLocation } = useGeolocation();
  const { data: services = [], isLoading: servicesLoading } = useNearbyServices(coordinates);
  const { detectCountry, location, emergency } = useCountry();
  useLastKnownLocation(coordinates);
  const [selectedCategory, setSelectedCategory] = useState<EmergencyCategory | 'all'>('all');
  const [selectedService, setSelectedService] = useState<IEmergencyService | null>(null);

  // Detect country when coordinates become available
  useEffect(() => {
    if (coordinates) {
      detectCountry(coordinates);
    }
  }, [coordinates, detectCountry]);

  const filteredServices = useMemo(() => {
    if (selectedCategory === 'all') return services;
    return services.filter((s) => s.category === selectedCategory);
  }, [services, selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<EmergencyCategory | 'all', number> = {
      all: services.length, hospital: 0, clinic: 0, pharmacy: 0, police: 0, fire_station: 0,
    };
    services.forEach((s) => { counts[s.category]++; });
    return counts;
  }, [services]);

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-8 pb-28 md:pb-8 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-light">
            <LayoutDashboard size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary sm:text-2xl">{t('dashboard.title')}</h1>
            <p className="text-xs text-text-muted">{t('dashboard.subtitle')}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" icon={<RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />} onClick={requestLocation} disabled={isLoading} aria-label={t('dashboard.refresh')}>
          {t('dashboard.refresh')}
        </Button>
      </div>

      {/* Device Status */}
      <DeviceStatus />

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 rounded-3xl border border-border bg-card p-12 shadow-md">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-light border-t-primary" />
          <p className="text-sm font-medium text-text-secondary">{t('dashboard.gettingLocation')}</p>
        </div>
      )}

      {/* Error */}
      {(status === 'denied' || status === 'unavailable' || status === 'error') && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-1 flex-col items-center justify-center gap-5 rounded-3xl border border-border bg-card p-12 shadow-md">
          <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${status === 'denied' ? 'bg-warning-light' : 'bg-danger-light'}`}>
            {status === 'denied' ? <AlertTriangle size={32} className="text-warning" /> : <WifiOff size={32} className="text-danger" />}
          </div>
          <p className="max-w-sm text-center text-sm text-text-secondary">{error}</p>
          <Button variant="primary" size="sm" icon={<RefreshCw size={14} />} onClick={requestLocation} aria-label={t('dashboard.tryAgain')}>{t('dashboard.tryAgain')}</Button>
        </motion.div>
      )}

      {/* Content */}
      {coordinates && (
        <>
          {/* Current Location Card (merged with coordinates + actions) */}
          <ReadableSection
            text={`Current location: ${location?.city ?? ''} ${location?.state ?? ''} ${location?.country ?? ''}. Coordinates: ${coordinates.latitude.toFixed(4)}, ${coordinates.longitude.toFixed(4)}`}
            lang={i18n.language === 'es' ? 'es-ES' : 'en-US'}
          >
            <CurrentLocationCard coordinates={coordinates} />
          </ReadableSection>

          {/* Emergency Number */}
          <ReadableSection
            text={`Emergency number: ${emergency.primary}. ${location?.country ?? ''}`}
            lang={i18n.language === 'es' ? 'es-ES' : 'en-US'}
          >
            <EmergencyNumberCard />
          </ReadableSection>

          <StatsCards services={services} isLoading={servicesLoading} />

          {/* Map + Sidebar */}
          <div className="grid flex-1 gap-6 lg:grid-cols-3">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="overflow-hidden rounded-3xl border border-border shadow-lg lg:col-span-2">
              <Suspense fallback={<div className="flex min-h-[450px] items-center justify-center bg-card"><div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-light border-t-primary" /></div>}>
                {isOnline ? (
                  <EmergencyMap coordinates={coordinates} services={filteredServices} selectedServiceId={selectedService?.id ?? null} />
                ) : (
                  <OfflineMapFallback coordinates={coordinates} services={filteredServices} />
                )}
              </Suspense>
            </motion.div>

            <motion.aside initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="flex flex-col rounded-3xl border border-border bg-card shadow-md lg:max-h-[600px]">
              <div className="border-b border-border px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <List size={16} className="text-primary" />
                  <h2 className="text-sm font-bold text-text-primary">{t('dashboard.nearbyPlaces')}</h2>
                  <span className="ml-auto rounded-full bg-primary-light px-2.5 py-0.5 text-[10px] font-bold text-primary">{filteredServices.length}</span>
                </div>
              </div>
              <div className="border-b border-border px-5 py-3">
                <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} counts={categoryCounts} />
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <ServiceList services={filteredServices} isLoading={servicesLoading} userCoordinates={coordinates} selectedServiceId={selectedService?.id ?? null} onSelectService={setSelectedService} />
              </div>
            </motion.aside>
          </div>

          {/* Selected Service Detail */}
          {selectedService && coordinates && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-primary/20 bg-card p-5 shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-text-primary">{selectedService.name}</h3>
                  <p className="text-xs text-text-muted">{t(`categories.${selectedService.category}`)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="text-xs font-medium text-text-muted hover:text-text-primary"
                  aria-label="Deselect service"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {selectedService.distance !== undefined && (
                  <div className="rounded-xl bg-background px-3 py-2">
                    <p className="text-[9px] font-bold uppercase text-text-muted">{t('dashboard.distance', 'Distance')}</p>
                    <p className="text-sm font-bold text-text-primary">
                      {selectedService.distance < 1000 ? `${selectedService.distance}m` : `${(selectedService.distance / 1000).toFixed(1)}km`}
                    </p>
                  </div>
                )}
                <div className="rounded-xl bg-background px-3 py-2">
                  <p className="text-[9px] font-bold uppercase text-text-muted">Lat</p>
                  <p className="font-mono text-xs font-bold text-text-primary">{selectedService.latitude.toFixed(5)}</p>
                </div>
                <div className="rounded-xl bg-background px-3 py-2">
                  <p className="text-[9px] font-bold uppercase text-text-muted">Lng</p>
                  <p className="font-mono text-xs font-bold text-text-primary">{selectedService.longitude.toFixed(5)}</p>
                </div>
                {selectedService.address && (
                  <div className="rounded-xl bg-background px-3 py-2">
                    <p className="text-[9px] font-bold uppercase text-text-muted">{t('dashboard.address', 'Address')}</p>
                    <p className="truncate text-xs font-medium text-text-primary">{selectedService.address}</p>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <GetDirectionsButton origin={coordinates} destination={{ latitude: selectedService.latitude, longitude: selectedService.longitude }} />
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}

export default DashboardPage;
