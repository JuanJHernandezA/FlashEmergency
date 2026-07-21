import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Siren, Phone, MapPin, Share2, Copy, Navigation, X, Hospital, Volume2, Droplets } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import useGeolocation from '../../hooks/useGeolocation';
import useNearbyServices from '../../hooks/useNearbyServices';
import { useCountry } from '../../contexts/CountryContext';
import useMedicalProfile from '../../hooks/useMedicalProfile';
import {
  shareLocation,
  copyCoordinates,
  vibrate,
  speakConfirmation,
} from '../../utils/share';
import { formatDistance } from '../../utils/locationFormatter';

interface IEmergencyModeProps {
  onClose: () => void;
}

function EmergencyMode({ onClose }: IEmergencyModeProps) {
  const { t, i18n } = useTranslation();
  const { coordinates, requestLocation } = useGeolocation();
  const { data: services = [] } = useNearbyServices(coordinates);
  const { emergency, location, measurementSystem, detectCountry } = useCountry();
  const { profile } = useMedicalProfile();

  const nearbyHospitals = services.filter((s) => s.category === 'hospital' || s.category === 'clinic').slice(0, 3);

  useEffect(() => {
    vibrate([300, 100, 300]);
    if (coordinates) detectCountry(coordinates);
    else requestLocation();
  }, []);

  useEffect(() => {
    if (coordinates) detectCountry(coordinates);
  }, [coordinates, detectCountry]);

  const handleReadInstructions = () => {
    const locationText = location
      ? `${location.city ?? ''} ${location.state ?? ''} ${location.country}`
      : '';
    const text = i18n.language === 'es'
      ? `Modo de emergencia activado. Número de emergencia: ${emergency.primary}. Ubicación: ${locationText}. Coordenadas: ${coordinates?.latitude.toFixed(4)}, ${coordinates?.longitude.toFixed(4)}.`
      : `Emergency mode activated. Emergency number: ${emergency.primary}. Location: ${locationText}. Coordinates: ${coordinates?.latitude.toFixed(4)}, ${coordinates?.longitude.toFixed(4)}.`;
    speakConfirmation(text);
  };

  useEffect(() => {
    if (coordinates && location) {
      const timer = setTimeout(handleReadInstructions, 600);
      return () => clearTimeout(timer);
    }
  }, [coordinates, location]);

  const handleShare = async () => {
    if (!coordinates) { toast.error(t('sos.locationError')); return; }
    try { await shareLocation(coordinates); toast.success(t('sos.locationShared')); }
    catch { toast.error(t('sos.failedCopy')); }
  };

  const handleCopy = async () => {
    if (!coordinates) { toast.error(t('sos.locationError')); return; }
    try { await copyCoordinates(coordinates); toast.success(t('sos.coordsCopied')); }
    catch { toast.error(t('sos.failedCopy')); }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-[#1a0000]"
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-danger px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Siren size={24} className="text-white" />
          <h1 className="text-lg font-bold text-white">EMERGENCY MODE</h1>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white transition-colors hover:bg-white/30"
          aria-label="Close emergency mode"
        >
          <X size={20} />
        </button>
      </div>

      {/* Emergency Number - Prominent */}
      <div className="bg-danger/90 px-4 py-6 text-center sm:px-6">
        <p className="text-xs font-bold uppercase tracking-widest text-white/70">
          {t('dashboard.emergencyNumber')}
        </p>
        <a
          href={`tel:${emergency.primary}`}
          className="mt-2 inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 shadow-2xl transition-transform active:scale-95"
          aria-label={`${t('dashboard.call')} ${emergency.primary}`}
        >
          <Phone size={28} className="text-danger" />
          <span className="text-4xl font-black text-danger">{emergency.primary}</span>
        </a>
        {location && (
          <p className="mt-3 text-sm text-white/80">{location.country}</p>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-4 bg-[#1a0000] px-4 py-5 sm:px-6">
        {/* GPS Coordinates */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-danger-light" />
            <span className="text-xs font-bold uppercase tracking-wider text-white/60">GPS</span>
          </div>
          {coordinates ? (
            <p className="mt-2 font-mono text-lg font-bold text-white">
              {coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)}
            </p>
          ) : (
            <p className="mt-2 text-sm text-white/50">{t('dashboard.gettingLocation')}</p>
          )}
          {location && (
            <p className="mt-1 text-sm text-white/70">
              {[location.city, location.state, location.country].filter(Boolean).join(', ')}
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <a
            href={`tel:${emergency.primary}`}
            className="flex flex-col items-center gap-2 rounded-2xl bg-danger p-4 text-white shadow-lg transition-transform active:scale-95"
            aria-label={`${t('dashboard.call')} ${emergency.primary}`}
          >
            <Phone size={24} />
            <span className="text-[11px] font-bold">{t('dashboard.call')}</span>
          </a>

          <button
            type="button"
            onClick={handleShare}
            className="flex flex-col items-center gap-2 rounded-2xl bg-white/10 p-4 text-white transition-transform active:scale-95"
            aria-label={t('sos.shareLocation')}
          >
            <Share2 size={24} />
            <span className="text-[11px] font-bold">{t('sos.shareLocation')}</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="flex flex-col items-center gap-2 rounded-2xl bg-white/10 p-4 text-white transition-transform active:scale-95"
            aria-label={t('sos.copyCoords')}
          >
            <Copy size={24} />
            <span className="text-[11px] font-bold">{t('sos.copyCoords')}</span>
          </button>

          <button
            type="button"
            onClick={handleReadInstructions}
            className="flex flex-col items-center gap-2 rounded-2xl bg-white/10 p-4 text-white transition-transform active:scale-95"
            aria-label="Read aloud"
          >
            <Volume2 size={24} />
            <span className="text-[11px] font-bold">Read Aloud</span>
          </button>
        </div>

        {/* Nearby Services */}
        {nearbyHospitals.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2">
              <Hospital size={16} className="text-danger-light" />
              <span className="text-xs font-bold uppercase tracking-wider text-white/60">
                {t('dashboard.nearbyPlaces')}
              </span>
            </div>
            <ul className="mt-3 flex flex-col gap-2">
              {nearbyHospitals.map((service) => (
                <li key={service.id} className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{service.name}</p>
                    {service.distance !== undefined && (
                      <p className="text-xs text-white/60">{formatDistance(service.distance, measurementSystem)}</p>
                    )}
                  </div>
                  {coordinates && (
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&origin=${coordinates.latitude},${coordinates.longitude}&destination=${service.latitude},${service.longitude}&travelmode=driving`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white"
                      aria-label={`${t('dashboard.getDirections')} - ${service.name}`}
                    >
                      <Navigation size={14} />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Medical Profile */}
        {profile && (profile.bloodType || profile.allergies || profile.medications || profile.medicalConditions) && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2">
              <Droplets size={16} className="text-danger-light" />
              <span className="text-xs font-bold uppercase tracking-wider text-white/60">
                {t('profile.title', 'Medical Profile')}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {profile.bloodType && (
                <div className="rounded-xl bg-white/5 px-3 py-2">
                  <p className="text-[9px] font-bold uppercase text-white/50">{t('profile.bloodType', 'Blood Type')}</p>
                  <p className="text-sm font-bold text-white">{profile.bloodType}</p>
                </div>
              )}
              {profile.allergies && (
                <div className="rounded-xl bg-white/5 px-3 py-2">
                  <p className="text-[9px] font-bold uppercase text-white/50">{t('profile.allergies', 'Allergies')}</p>
                  <p className="truncate text-sm font-bold text-danger-light">{profile.allergies}</p>
                </div>
              )}
              {profile.medications && (
                <div className="rounded-xl bg-white/5 px-3 py-2">
                  <p className="text-[9px] font-bold uppercase text-white/50">{t('profile.medications', 'Medications')}</p>
                  <p className="truncate text-sm font-bold text-white">{profile.medications}</p>
                </div>
              )}
              {profile.medicalConditions && (
                <div className="rounded-xl bg-white/5 px-3 py-2">
                  <p className="text-[9px] font-bold uppercase text-white/50">{t('profile.conditions', 'Conditions')}</p>
                  <p className="truncate text-sm font-bold text-warning-light">{profile.medicalConditions}</p>
                </div>
              )}
            </div>
            {profile.emergencyContactPhone && (
              <a
                href={`tel:${profile.emergencyContactPhone}`}
                className="mt-3 flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-white transition-transform active:scale-95"
                aria-label={`Call ${profile.emergencyContactName}`}
              >
                <Phone size={14} />
                <span className="text-xs font-bold">{profile.emergencyContactName || t('profile.emergencyContact', 'Emergency Contact')}</span>
                <span className="ml-auto text-xs text-white/60">{profile.emergencyContactPhone}</span>
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default EmergencyMode;
