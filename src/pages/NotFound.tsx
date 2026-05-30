import { Link, useLocation } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';

const NotFound = () => {
  const location = useLocation();
  const { language } = useLanguage();

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <SEOHead
        title={language === 'fr' ? 'Page introuvable' : language === 'ar' ? 'الصفحة غير موجودة' : 'Page not found'}
        description="The page you requested could not be found on Arecima."
        noindex
      />
      <div className="text-center">
        <h1 className="mb-4 font-display text-4xl">404</h1>
        <p className="mb-4 font-body text-muted-foreground">
          {language === 'fr' ? 'Cette page n\'existe pas.' : language === 'ar' ? 'هذه الصفحة غير موجودة.' : 'This page does not exist.'}
        </p>
        <p className="mb-6 font-body text-xs text-muted-foreground">{location.pathname}</p>
        <Link to="/" className="font-body text-xs tracking-[0.2em] uppercase text-gold hover:underline">
          {language === 'fr' ? 'Retour à l\'accueil' : language === 'ar' ? 'العودة للرئيسية' : 'Back to home'}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
