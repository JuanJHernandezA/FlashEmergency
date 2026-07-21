import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Trash2, Edit2, X, UserPlus, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import useContacts from '../hooks/useContacts';
import Button from '../components/ui/Button';
import type { IEmergencyContact } from '../types';

const contactSchema = z.object({
  name: z.string().min(1).max(50),
  phone: z.string().min(1).max(20),
  relation: z.string().max(30).optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

function ContactsPage() {
  const { t } = useTranslation();
  const { contacts, isLoading, addContact, updateContact, deleteContact } = useContacts();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<IEmergencyContact | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const openAddForm = () => {
    setEditingContact(null);
    reset({ name: '', phone: '', relation: '' });
    setIsFormOpen(true);
  };

  const openEditForm = (contact: IEmergencyContact) => {
    setEditingContact(contact);
    reset({ name: contact.name, phone: contact.phone, relation: contact.relation ?? '' });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingContact(null);
    reset();
  };

  const onSubmit = async (data: ContactFormData) => {
    try {
      if (editingContact) {
        await updateContact({
          ...editingContact,
          name: data.name,
          phone: data.phone,
          relation: data.relation || undefined,
        });
        toast.success(t('contacts.contactUpdated'));
      } else {
        await addContact({
          id: crypto.randomUUID(),
          name: data.name,
          phone: data.phone,
          relation: data.relation || undefined,
        });
        toast.success(t('contacts.contactAdded'));
      }
      closeForm();
    } catch {
      toast.error(t('contacts.failedSave'));
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteContact(id);
      toast.success(`${name} ${t('contacts.contactRemoved')}`);
    } catch {
      toast.error(t('contacts.failedDelete'));
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 px-3 py-5 sm:gap-6 sm:px-4 sm:py-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Users size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
              {t('contacts.title')}
            </h1>
            <p className="mt-0.5 text-sm text-text-secondary">
              {t('contacts.subtitle')}
            </p>
          </div>
        </div>
        <Button size="sm" icon={<Plus size={16} />} onClick={openAddForm} aria-label={t('contacts.add')}>
          {t('contacts.add')}
        </Button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-border/50" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && contacts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center"
        >
          <UserPlus size={48} className="text-text-secondary/30" />
          <div>
            <p className="text-lg font-semibold text-text-primary">{t('contacts.noContacts')}</p>
            <p className="mt-1 text-sm text-text-secondary">{t('contacts.noContactsDesc')}</p>
          </div>
          <Button size="md" icon={<Plus size={16} />} onClick={openAddForm} aria-label={t('contacts.addContact')}>
            {t('contacts.addContact')}
          </Button>
        </motion.div>
      )}

      {/* Contact list */}
      {!isLoading && contacts.length > 0 && (
        <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto grid w-full max-w-3xl gap-3 sm:grid-cols-2">
          <AnimatePresence>
            {contacts.map((contact) => (
              <motion.li key={contact.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <div className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-text-primary">{contact.name}</p>
                    <p className="truncate text-xs text-text-secondary">{contact.phone}</p>
                    {contact.relation && (
                      <span className="mt-1 inline-block rounded-md bg-secondary/10 px-2 py-0.5 text-[10px] font-medium text-secondary">{contact.relation}</span>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                    <a href={`tel:${contact.phone}`} className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success transition-colors hover:bg-success/20" aria-label={`Call ${contact.name}`}><Phone size={14} /></a>
                    <button type="button" onClick={() => openEditForm(contact)} className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors hover:bg-primary/20" aria-label={`Edit ${contact.name}`}><Edit2 size={14} /></button>
                    <button type="button" onClick={() => handleDelete(contact.id, contact.name)} className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger/10 text-danger transition-colors hover:bg-danger/20" aria-label={`Delete ${contact.name}`}><Trash2 size={14} /></button>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeForm} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.95 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }} className="fixed inset-x-3 top-1/2 z-50 mx-auto max-w-md -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-2xl sm:inset-x-4 sm:p-6" style={{ maxHeight: '90vh' }}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-text-primary">
                  {editingContact ? t('contacts.editContact') : t('contacts.addContact')}
                </h3>
                <button type="button" onClick={closeForm} className="flex h-10 w-10 items-center justify-center rounded-xl text-text-secondary hover:bg-border/50" aria-label="Close"><X size={18} /></button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-5 flex flex-col gap-4">
                <div>
                  <label htmlFor="contact-name" className="mb-1.5 block text-xs font-medium text-text-secondary">{t('contacts.name')} *</label>
                  <input id="contact-name" type="text" placeholder={t('contacts.namePlaceholder')} {...register('name')} className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
                </div>

                <div>
                  <label htmlFor="contact-phone" className="mb-1.5 block text-xs font-medium text-text-secondary">{t('contacts.phone')} *</label>
                  <input id="contact-phone" type="tel" placeholder={t('contacts.phonePlaceholder')} {...register('phone')} className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  {errors.phone && <p className="mt-1 text-xs text-danger">{errors.phone.message}</p>}
                </div>

                <div>
                  <label htmlFor="contact-relation" className="mb-1.5 block text-xs font-medium text-text-secondary">{t('contacts.relation')}</label>
                  <input id="contact-relation" type="text" placeholder={t('contacts.relationPlaceholder')} {...register('relation')} className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>

                <div className="mt-2 flex gap-3">
                  <Button type="button" variant="ghost" size="md" onClick={closeForm} className="flex-1" aria-label={t('contacts.cancel')}>{t('contacts.cancel')}</Button>
                  <Button type="submit" size="md" loading={isSubmitting} className="flex-1" aria-label={t('contacts.save')}>{editingContact ? t('contacts.save') : t('contacts.add')}</Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ContactsPage;
