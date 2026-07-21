import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, MapPin, Clock, Share2, Trash2, FileText, Image, X } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';
import useGeolocation from '../hooks/useGeolocation';
import { useCountry } from '../contexts/CountryContext';
import { getAllReports, saveReport, deleteReport } from '../lib/db';
import type { IPhotoReport } from '../types/photoReport';

function PhotoReportPage() {
  const { t } = useTranslation();
  const { coordinates } = useGeolocation();
  const { location } = useCountry();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [reports, setReports] = useState<IPhotoReport[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getAllReports().then(setReports).catch(() => {});
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error(t('report.selectImage'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSave = async () => {
    if (!imagePreview) { toast.error(t('report.selectImage')); return; }
    setIsSaving(true);

    const locationName = location
      ? [location.city, location.state, location.country].filter(Boolean).join(', ')
      : null;

    const report: IPhotoReport = {
      id: crypto.randomUUID(),
      imageDataUrl: imagePreview,
      description,
      latitude: coordinates?.latitude ?? null,
      longitude: coordinates?.longitude ?? null,
      locationName,
      createdAt: new Date().toISOString(),
    };

    try {
      await saveReport(report);
      setReports((prev) => [report, ...prev]);
      setImagePreview(null);
      setDescription('');
      toast.success(t('report.saved', 'Report saved'));
    } catch {
      toast.error(t('report.failedSave'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async (report: IPhotoReport) => {
    const text = `Emergency Photo Report\n${report.description}\nLocation: ${report.locationName ?? 'Unknown'}\nCoordinates: ${report.latitude?.toFixed(5)}, ${report.longitude?.toFixed(5)}\nDate: ${new Date(report.createdAt).toLocaleString()}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Emergency Report', text });
        return;
      } catch { /* fallback */ }
    }

    try {
      await navigator.clipboard.writeText(text);
      toast.success(t('report.copied'));
    } catch {
      toast.error(t('report.unableToShare'));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteReport(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
      toast.success(t('report.deleted'));
    } catch {
      toast.error(t('report.failedDelete'));
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 px-3 py-5 pb-20 sm:gap-6 sm:px-4 sm:py-8 md:pb-8 lg:px-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary-light">
          <Camera size={20} className="text-secondary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-text-primary sm:text-2xl">
            {t('report.title', 'Photo Report')}
          </h1>
          <p className="text-xs text-text-muted">
            {t('report.subtitle', 'Document an emergency with photo and description')}
          </p>
        </div>
      </div>

      {/* Create Report */}
      <div className="mx-auto w-full max-w-xl rounded-2xl border border-border bg-card p-5 shadow-md">
        {/* Image capture */}
        {!imagePreview ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-border bg-background px-6 py-10 transition-colors hover:border-primary/30"
            aria-label="Capture or upload photo"
          >
            <Image size={32} className="text-text-muted" />
            <p className="text-sm font-medium text-text-secondary">{t('report.capturePhoto', 'Capture or upload a photo')}</p>
          </button>
        ) : (
          <div className="relative">
            <img src={imagePreview} alt="Report preview" className="w-full rounded-2xl object-cover" />
            <button
              type="button"
              onClick={() => setImagePreview(null)}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-xl bg-black/50 text-white"
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Description */}
        <div className="mt-4">
          <label htmlFor="report-desc" className="mb-1.5 block text-xs font-medium text-text-muted">
            {t('report.description', 'Description')}
          </label>
          <textarea
            id="report-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder={t('report.descPlaceholder', 'Describe what happened...')}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Context info */}
        <div className="mt-4 flex flex-wrap gap-2">
          {coordinates && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary-light px-2.5 py-1 text-[10px] font-medium text-primary">
              <MapPin size={10} /> {coordinates.latitude.toFixed(4)}, {coordinates.longitude.toFixed(4)}
            </span>
          )}
          {location && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-success-light px-2.5 py-1 text-[10px] font-medium text-success">
              <MapPin size={10} /> {location.city ?? location.country}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-background px-2.5 py-1 text-[10px] font-medium text-text-muted">
            <Clock size={10} /> {new Date().toLocaleString()}
          </span>
        </div>

        {/* Save */}
        <div className="mt-5">
          <Button
            className="w-full"
            onClick={handleSave}
            loading={isSaving}
            disabled={!imagePreview}
            icon={<FileText size={15} />}
            aria-label="Save report"
          >
            {t('report.save', 'Save Report')}
          </Button>
        </div>
      </div>

      {/* Saved Reports */}
      {reports.length > 0 && (
        <div className="mx-auto w-full max-w-xl">
          <h2 className="mb-3 text-sm font-bold text-text-primary">{t('report.savedReports', 'Saved Reports')}</h2>
          <AnimatePresence>
            <ul className="flex flex-col gap-3">
              {reports.map((report) => (
                <motion.li
                  key={report.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <div className="flex gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm">
                    <img src={report.imageDataUrl} alt="Report" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-xs font-semibold text-text-primary">
                        {report.description || t('report.noDescription')}
                      </p>
                      <p className="mt-0.5 text-[10px] text-text-muted">
                        {report.locationName ?? t('report.unknownLocation')}
                      </p>
                      <p className="text-[10px] text-text-muted">
                        {new Date(report.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => handleShare(report)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-light text-primary hover:bg-primary/20"
                        aria-label="Share report"
                      >
                        <Share2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(report.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-danger-light text-danger hover:bg-danger/20"
                        aria-label="Delete report"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default PhotoReportPage;
