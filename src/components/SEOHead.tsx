import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { SITE_URL } from '@/lib/site';
import {
  OG_IMAGE,
  absoluteUrl,
  formatPageTitle,
  getDefaultSeoDescription,
  getSeoKeywords,
  type SeoLang,
} from '@/lib/seo';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  type?: string;
  image?: string;
  schema?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
  /** Override canonical path (include query string if needed, e.g. /products?category=hair-care) */
  canonicalPath?: string;
}

const SEOHead = ({
  title,
  description,
  keywords,
  type = 'website',
  image,
  schema,
  noindex = false,
  canonicalPath,
}: SEOHeadProps) => {
  const { language } = useLanguage();
  const location = useLocation();
  const lang = (language === 'ar' ? 'ar' : language === 'en' ? 'en' : 'fr') as SeoLang;

  const pathForCanonical = canonicalPath ?? (location.pathname.replace(/\/+$/, '') || '/');
  const fullUrl = pathForCanonical.startsWith('http')
    ? pathForCanonical
    : `${SITE_URL}${pathForCanonical.startsWith('/') ? pathForCanonical : `/${pathForCanonical}`}`;

  const pageTitle = formatPageTitle(title, lang);
  const pageDescription = description || getDefaultSeoDescription(lang);
  const pageKeywords = keywords || getSeoKeywords(lang);
  const pageImage = absoluteUrl(image || OG_IMAGE);
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
      const selector = hreflang
        ? `link[rel="${rel}"][hreflang="${hreflang}"]`
        : `link[rel="${rel}"]:not([hreflang])`;
      let el = document.querySelector(selector) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement('link');
        el.rel = rel;
        if (hreflang) el.setAttribute('hreflang', hreflang);
        document.head.appendChild(el);
      }
      el.href = href;
    };

    setMeta('description', pageDescription);
    setMeta('keywords', pageKeywords);
    setMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1');
    setMeta('googlebot', noindex ? 'noindex, nofollow' : 'index, follow');

    setMeta('og:title', pageTitle, 'property');
    setMeta('og:description', pageDescription, 'property');
    setMeta('og:url', fullUrl, 'property');
    setMeta('og:type', type, 'property');
    setMeta('og:site_name', 'Arecima', 'property');
    setMeta('og:locale', ogLocale, 'property');
    setMeta('og:image', pageImage, 'property');
    setMeta('og:image:width', '1200', 'property');
    setMeta('og:image:height', '630', 'property');
    setMeta('og:image:alt', title || 'Arecima — Luxury Tunisian Hair Care', 'property');

    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:site', '@arecima_tn');
    setMeta('twitter:title', pageTitle);
    setMeta('twitter:description', pageDescription);
    setMeta('twitter:image', pageImage);

    setLink('canonical', fullUrl);
    setLink('alternate', fullUrl, 'fr');
    setLink('alternate', fullUrl, 'en');
    setLink('alternate', fullUrl, 'ar');
    setLink('alternate', fullUrl, 'x-default');

    document.documentElement.lang = language === 'ar' ? 'ar' : language === 'fr' ? 'fr' : 'en';
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';

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
      document.querySelectorAll('script[data-seo-schema]').forEach(s => s.remove());
    };
  }, [pageTitle, pageDescription, pageKeywords, fullUrl, type, pageImage, schema, language, ogLocale, noindex, title]);

  return null;
};

export default SEOHead;
