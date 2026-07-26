import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Download, Maximize2, X, AlertCircle, Share2, Copy, User } from 'lucide-react';
import QRCode from 'qrcode';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import Button from '../components/ui/Button';
import useMedicalProfile from '../hooks/useMedicalProfile';
import { ROUTES } from '../constants';
import { Link } from 'react-router-dom';

function QRCardPage() {
  const { t } = useTranslation();
  const { profile } = useMedicalProfile();
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const profileData = profile
    ? {
        name: profile.name || undefined,
        blood: profile.bloodType || undefined,
        allergies: profile.allergies || undefined,
        medications: profile.medications || undefined,
        conditions: profile.medicalConditions || undefined,
        emergencyContact: profile.emergencyContactPhone
          ? `${profile.emergencyContactName || ''} ${profile.emergencyContactPhone}`.trim()
          : undefined,
      }
    : null;

  const qrContent = profileData ? JSON.stringify(profileData) : null;

  const profileUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${ROUTES.QR_CARD}`
    : '';

  useEffect(() => {
    if (!qrContent) {
      setQrDataUrl(null);
      return;
    }

    QRCode.toDataURL(qrContent, {
      width: 320,
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
    link.download = `flashemergency-qr-${profile?.name?.replace(/\s+/g, '-').toLowerCase() || 'card'}.png`;
    link.href = qrDataUrl;
    link.click();
    toast.success(t('qr.downloaded', 'QR code downloaded'));
  };

  const handleShare = async () => {
    const shareText = profile
      ? `${profile.name || 'Emergency'} - Medical QR Card\nBlood: ${profile.bloodType || 'N/A'}\nAllergies: ${profile.allergies || 'None'}\nContact: ${profile.emergencyContactName || ''} ${profile.emergencyContactPhone || ''}`
      : '';

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FlashEmergency - Medical QR Card',
          text: shareText,
          url: profileUrl,
        });
        return;
      } catch {
        // User cancelled or share failed, fall through to copy
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${profileUrl}`);
      toast.success(t('qr.linkCopied', 'Profile info copied to clipboard'));
    } catch {
      toast.error(t('sos.failedCopy', 'Failed to copy'));
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success(t('qr.linkCopied', 'Link copied to clipboard'));
    } catch {
      toast.error(t('sos.failedCopy', 'Failed to copy'));
    }
  };

  const hasProfile = profile && (profile.name || profile.bloodType || profile.allergies || profile.medications || profile.emergencyContactPhone);

  return (
    <div className="flex flex-1 flex-col gap-4 px-3 py-5 sm:gap-6 sm:px-4 sm:py-8 lg:px-8">
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
          className="flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center sm:p-12"
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
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-md">
            {/* Card header with user info */}
            <div className="bg-gradient-to-r from-primary to-primary-hover px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-lg font-bold text-white">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : <User size={20} />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-white">
                    {profile.name || t('profile.name', 'Name')}
                  </p>
                  {profile.bloodType && (
                    <span className="mt-0.5 inline-block rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white">
                      {profile.bloodType}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* QR Image */}
            <div className="flex justify-center px-6 py-5">
              <img
                src={qrDataUrl}
                alt="Emergency QR Code"
                className="h-56 w-56 rounded-xl sm:h-64 sm:w-64"
              />
            </div>

            {/* Profile summary */}
            <div className="mx-5 mb-5 space-y-1.5 rounded-xl bg-background p-4">
              {profile.allergies && (
                <p className="text-xs text-text-secondary">
                  <span className="font-semibold text-danger">{t('profile.allergies', 'Allergies')}:</span> {profile.allergies}
                </p>
              )}
              {profile.medications && (
                <p className="text-xs text-text-secondary">
                  <span className="font-semibold text-primary">{t('profile.medications', 'Medications')}:</span> {profile.medications}
                </p>
              )}
              {profile.medicalConditions && (
                <p className="text-xs text-text-secondary">
                  <span className="font-semibold text-warning">{t('profile.conditions', 'Conditions')}:</span> {profile.medicalConditions}
                </p>
              )}
              {profile.emergencyContactPhone && (
                <p className="text-xs text-text-secondary">
                  <span className="font-semibold text-success">{t('profile.emergencyContact', 'Contact')}:</span> {profile.emergencyContactName} {profile.emergencyContactPhone}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="border-t border-border px-5 py-4">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Button
                  size="sm"
                  className="w-full"
                  icon={<Share2 size={13} />}
                  onClick={handleShare}
                  aria-label={t('qr.share', 'Share')}
                >
                  {t('qr.share', 'Share')}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  icon={<Copy size={13} />}
                  onClick={handleCopyLink}
                  aria-label={t('qr.copyLink', 'Copy Link')}
                >
                  {t('qr.copyLink', 'Link')}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full"
                  icon={<Download size={13} />}
                  onClick={handleDownload}
                  aria-label={t('qr.download', 'Download')}
                >
                  {t('qr.download', 'Download')}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full"
                  icon={<Maximize2 size={13} />}
                  onClick={() => setIsFullscreen(true)}
                  aria-label={t('qr.fullscreen', 'Fullscreen')}
                >
                  {t('qr.fullscreen', 'Full')}
                </Button>
              </div>
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
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white"
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
          {profile?.name && (
            <p className="mb-4 text-lg font-bold text-text-primary">{profile.name}</p>
          )}
          <img src={qrDataUrl} alt="Emergency QR Code" className="h-[70vmin] w-[70vmin] max-h-[400px] max-w-[400px] rounded-2xl" />
          {profile?.bloodType && (
            <p className="mt-4 rounded-lg bg-danger-light px-4 py-2 text-sm font-bold text-danger">{profile.bloodType}</p>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default QRCardPage;
