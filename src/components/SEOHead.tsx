import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface SEOHeadProps {
  title?: string;
  description?: string;
  type?: string;
  image?: string;
  schema?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
}

import { SITE_URL } from '@/lib/site';

const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

const SEOHead = ({ title, description, type = 'website', image, schema, noindex = false }: SEOHeadProps) => {
  const { language } = useLanguage();
  const location = useLocation();

  // Strip query strings from canonical for cleanliness, but keep path
  const cleanPath = location.pathname.replace(/\/+$/, '') || '/';
  const fullUrl = `${SITE_URL}${cleanPath}`;

  const defaultTitle = 'Arecima — Soins de Luxe Tunisiens | Luxury Skincare';
  const defaultDescription =
    'Arecima, marque tunisienne de soins de luxe. Sérums, crèmes et huiles premium aux ingrédients naturels. Livraison gratuite dès 150 TND.';

  const pageTitle = title ? `${title} | Arecima` : defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageImage = image || DEFAULT_OG_IMAGE;
  const ogLocale = language === 'ar' ? 'ar_TN' : language === 'en' ? 'en_US' : 'fr_TN';

  useEffect(() => {
    document.title = pageTitle;

    const setMeta = (name: string, content: string, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const setLink = (rel: string, href: string, hreflang?: string) => {
      const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
      let el = document.querySelector(selector) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement('link');
        el.rel = rel;
        if (hreflang) el.setAttribute('hreflang', hreflang);
        document.head.appendChild(el);
      }
      el.href = href;
    };

    // Core
    setMeta('description', pageDescription);
    setMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');

    // Open Graph
    setMeta('og:title', pageTitle, 'property');
    setMeta('og:description', pageDescription, 'property');
    setMeta('og:url', fullUrl, 'property');
    setMeta('og:type', type, 'property');
    setMeta('og:site_name', 'Arecima', 'property');
    setMeta('og:locale', ogLocale, 'property');
    setMeta('og:image', pageImage, 'property');
    setMeta('og:image:alt', title || 'Arecima Luxury Skincare', 'property');

    // Twitter
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', pageTitle);
    setMeta('twitter:description', pageDescription);
    setMeta('twitter:image', pageImage);

    // Canonical & hreflang
    setLink('canonical', fullUrl);
    setLink('alternate', fullUrl, 'fr');
    setLink('alternate', fullUrl, 'en');
    setLink('alternate', fullUrl, 'ar');
    setLink('alternate', fullUrl, 'x-default');

    // Language / direction
    document.documentElement.lang = language === 'ar' ? 'ar' : language === 'fr' ? 'fr' : 'en';
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';

    // JSON-LD schemas
    const existingScripts = document.querySelectorAll('script[data-seo-schema]');
    existingScripts.forEach(s => s.remove());

    if (schema) {
      const schemas = Array.isArray(schema) ? schema : [schema];
      schemas.forEach(s => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-seo-schema', 'true');
        script.textContent = JSON.stringify(s);
        document.head.appendChild(script);
      });
    }

    return () => {
      const scripts = document.querySelectorAll('script[data-seo-schema]');
      scripts.forEach(s => s.remove());
    };
  }, [pageTitle, pageDescription, fullUrl, type, pageImage, schema, language, ogLocale, noindex]);

  return null;
};

export default SEOHead;
