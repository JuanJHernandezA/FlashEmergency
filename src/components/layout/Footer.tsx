import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { APP_NAME } from '../../constants';

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="hidden border-t border-border/60 bg-card py-6 md:block">
      <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
        <div className="flex items-center justify-center gap-2 text-sm text-text-secondary">
          <span>&copy; {new Date().getFullYear()}</span>
          <Heart size={12} className="fill-danger text-danger" />
          <span className="font-medium text-text-primary">{APP_NAME}</span>
        </div>
        <p className="mt-2 text-xs text-text-muted">{t('footer.disclaimer')}</p>
      </div>
    </footer>
  );
}

export default Footer;
