import { useState } from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, Save, Trash2, User, Droplets, AlertCircle, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';
import useMedicalProfile from '../hooks/useMedicalProfile';
import { BLOOD_TYPES, type IMedicalProfile } from '../types/medicalProfile';

function MedicalProfilePage() {
  const { t } = useTranslation();
  const { profile, saveProfile, clearProfile } = useMedicalProfile();

  const [form, setForm] = useState<IMedicalProfile>(
    profile ?? {
      name: '',
      age: '',
      bloodType: '',
      allergies: '',
      medications: '',
      medicalConditions: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
    },
  );

  const handleChange = (field: keyof IMedicalProfile, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    saveProfile(form);
    toast.success(t('profile.saved', 'Medical profile saved'));
  };

  const handleClear = () => {
    clearProfile();
    setForm({
      name: '',
      age: '',
      bloodType: '',
      allergies: '',
      medications: '',
      medicalConditions: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
    });
    toast.success(t('profile.cleared', 'Medical profile cleared'));
  };

  return (
    <div className="flex flex-1 flex-col gap-4 px-3 py-5 sm:gap-6 sm:px-4 sm:py-8 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-danger-light">
            <HeartPulse size={20} className="text-danger" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary sm:text-2xl">
              {t('profile.title', 'Medical Profile')}
            </h1>
            <p className="text-xs text-text-muted">
              {t('profile.subtitle', 'Your emergency medical information')}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {profile && (
            <Button variant="ghost" size="sm" icon={<Trash2 size={14} />} onClick={handleClear} aria-label="Clear profile">
              {t('profile.clear', 'Clear')}
            </Button>
          )}
          <Button size="sm" icon={<Save size={14} />} onClick={handleSave} aria-label="Save profile">
            {t('profile.save', 'Save')}
          </Button>
        </div>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto w-full max-w-2xl space-y-6"
      >
        {/* Personal Info */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <User size={16} className="text-primary" />
            <h2 className="text-sm font-bold text-text-primary">{t('profile.personalInfo', 'Personal Information')}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="profile-name" className="mb-1.5 block text-xs font-medium text-text-muted">
                {t('profile.name', 'Name')}
              </label>
              <input
                id="profile-name"
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="profile-age" className="mb-1.5 block text-xs font-medium text-text-muted">
                {t('profile.age', 'Age')}
              </label>
              <input
                id="profile-age"
                type="number"
                value={form.age}
                onChange={(e) => handleChange('age', e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="30"
              />
            </div>
          </div>
        </section>

        {/* Medical Info */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Droplets size={16} className="text-danger" />
            <h2 className="text-sm font-bold text-text-primary">{t('profile.medicalInfo', 'Medical Information')}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="profile-blood" className="mb-1.5 block text-xs font-medium text-text-muted">
                {t('profile.bloodType', 'Blood Type')}
              </label>
              <select
                id="profile-blood"
                value={form.bloodType}
                onChange={(e) => handleChange('bloodType', e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">{t('profile.selectBloodType', 'Select...')}</option>
                {BLOOD_TYPES.map((bt) => (
                  <option key={bt} value={bt}>{bt}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="profile-allergies" className="mb-1.5 block text-xs font-medium text-text-muted">
                {t('profile.allergies', 'Allergies')}
              </label>
              <input
                id="profile-allergies"
                type="text"
                value={form.allergies}
                onChange={(e) => handleChange('allergies', e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Penicillin, Peanuts..."
              />
            </div>
            <div>
              <label htmlFor="profile-medications" className="mb-1.5 block text-xs font-medium text-text-muted">
                {t('profile.medications', 'Medications')}
              </label>
              <input
                id="profile-medications"
                type="text"
                value={form.medications}
                onChange={(e) => handleChange('medications', e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Insulin, Aspirin..."
              />
            </div>
            <div>
              <label htmlFor="profile-conditions" className="mb-1.5 block text-xs font-medium text-text-muted">
                {t('profile.conditions', 'Medical Conditions')}
              </label>
              <input
                id="profile-conditions"
                type="text"
                value={form.medicalConditions}
                onChange={(e) => handleChange('medicalConditions', e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Diabetes, Asthma..."
              />
            </div>
          </div>
        </section>

        {/* Emergency Contact */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Phone size={16} className="text-success" />
            <h2 className="text-sm font-bold text-text-primary">{t('profile.emergencyContact', 'Emergency Contact')}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="profile-ec-name" className="mb-1.5 block text-xs font-medium text-text-muted">
                {t('profile.contactName', 'Contact Name')}
              </label>
              <input
                id="profile-ec-name"
                type="text"
                value={form.emergencyContactName}
                onChange={(e) => handleChange('emergencyContactName', e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label htmlFor="profile-ec-phone" className="mb-1.5 block text-xs font-medium text-text-muted">
                {t('profile.contactPhone', 'Contact Phone')}
              </label>
              <input
                id="profile-ec-phone"
                type="tel"
                value={form.emergencyContactPhone}
                onChange={(e) => handleChange('emergencyContactPhone', e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="+1 234 567 8900"
              />
            </div>
          </div>
        </section>

        {/* Info notice */}
        <div className="flex items-center gap-2 rounded-xl bg-primary-light/50 px-4 py-3">
          <AlertCircle size={14} className="shrink-0 text-primary" />
          <p className="text-xs text-text-secondary">
            {t('profile.localNotice', 'This information is stored only on your device. No data is sent to any server.')}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default MedicalProfilePage;
