import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Download, Maximize2, X, AlertCircle } from 'lucide-react';
import QRCode from 'qrcode';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';
import useMedicalProfile from '../hooks/useMedicalProfile';
import { ROUTES } from '../constants';
import { Link } from 'react-router-dom';

function QRCardPage() {
  const { t } = useTranslation();
  const { profile } = useMedicalProfile();
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const qrContent = profile
    ? JSON.stringify({
        name: profile.name || undefined,
        blood: profile.bloodType || undefined,
        allergies: profile.allergies || undefined,
        medications: profile.medications || undefined,
        emergencyContact: profile.emergencyContactPhone
          ? `${profile.emergencyContactName || ''} ${profile.emergencyContactPhone}`.trim()
          : undefined,
      })
    : null;

  useEffect(() => {
    if (!qrContent) {
      setQrDataUrl(null);
      return;
    }

    QRCode.toDataURL(qrContent, {
      width: 300,
      margin: 2,
      color: { dark: '#0f172a', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null));
  }, [qrContent]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = 'emergency-qr-card.png';
    link.href = qrDataUrl;
    link.click();
  };

  const hasProfile = profile && (profile.name || profile.bloodType || profile.allergies || profile.medications || profile.emergencyContactPhone);

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-8 pb-28 md:pb-8 lg:px-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-light">
          <QrCode size={20} className="text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-text-primary sm:text-2xl">
            {t('qr.title', 'Emergency QR Card')}
          </h1>
          <p className="text-xs text-text-muted">
            {t('qr.subtitle', 'Show this QR code to first responders')}
          </p>
        </div>
      </div>

      {/* No profile state */}
      {!hasProfile && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center"
        >
          <QrCode size={48} className="text-text-muted/30" />
          <div>
            <p className="text-lg font-semibold text-text-primary">
              {t('qr.noProfile', 'No medical profile found')}
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              {t('qr.noProfileDesc', 'Create a medical profile first to generate your emergency QR card.')}
            </p>
          </div>
          <Link to={ROUTES.PROFILE}>
            <Button size="md" aria-label="Go to medical profile">
              {t('qr.createProfile', 'Create Profile')}
            </Button>
          </Link>
        </motion.div>
      )}

      {/* QR Card */}
      {hasProfile && qrDataUrl && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto w-full max-w-sm"
        >
          <div className="rounded-2xl border border-border bg-card p-6 shadow-md">
            {/* QR Image */}
            <div className="flex justify-center">
              <img
                src={qrDataUrl}
                alt="Emergency QR Code"
                className="h-64 w-64 rounded-xl"
              />
            </div>

            {/* Profile summary */}
            <div className="mt-5 space-y-2 rounded-xl bg-background p-4">
              {profile.name && (
                <p className="text-sm font-semibold text-text-primary">{profile.name}</p>
              )}
              {profile.bloodType && (
                <p className="text-xs text-text-secondary">
                  <span className="font-semibold text-danger">{profile.bloodType}</span>
                </p>
              )}
              {profile.allergies && (
                <p className="text-xs text-text-secondary">
                  {t('profile.allergies', 'Allergies')}: {profile.allergies}
                </p>
              )}
              {profile.medications && (
                <p className="text-xs text-text-secondary">
                  {t('profile.medications', 'Medications')}: {profile.medications}
                </p>
              )}
              {profile.emergencyContactPhone && (
                <p className="text-xs text-text-secondary">
                  {t('profile.emergencyContact', 'Contact')}: {profile.emergencyContactName} {profile.emergencyContactPhone}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="mt-5 flex gap-3">
              <Button
                size="sm"
                className="flex-1"
                icon={<Maximize2 size={14} />}
                onClick={() => setIsFullscreen(true)}
                aria-label={t('qr.fullscreen', 'Fullscreen')}
              >
                {t('qr.fullscreen', 'Fullscreen')}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                icon={<Download size={14} />}
                onClick={handleDownload}
                aria-label={t('qr.download', 'Download')}
              >
                {t('qr.download', 'Download')}
              </Button>
            </div>
          </div>

          {/* Notice */}
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-warning-light/50 px-4 py-3">
            <AlertCircle size={14} className="shrink-0 text-warning" />
            <p className="text-xs text-text-secondary">
              {t('qr.notice', 'Only essential medical information is encoded. No sensitive data is shared.')}
            </p>
          </div>
        </motion.div>
      )}

      {/* Fullscreen overlay */}
      {isFullscreen && qrDataUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-background text-text-muted shadow-md"
            aria-label="Close fullscreen"
          >
            <X size={20} />
          </button>
          <img src={qrDataUrl} alt="Emergency QR Code" className="h-[80vmin] w-[80vmin] max-h-[500px] max-w-[500px]" />
        </motion.div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

export default QRCardPage;
