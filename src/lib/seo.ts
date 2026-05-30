import { SITE_URL, sitePath, siteProductUrl } from '@/lib/site';
import { STOREFRONT_CATALOG_SLUGS } from '@/lib/storefrontCatalog';
import { productImages } from '@/data/productImages';
import type { Product } from '@/data/products';

export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const LOGO_URL = `${SITE_URL}/logo.png`;

export const PRODUCT_SLUGS = [...STOREFRONT_CATALOG_SLUGS];

export const BLOG_SLUGS = [
  'soleveil-protect-kpf30-explained',
  'silk-shield-anti-humidity-spray',
  'arecima-hair-ritual-duo',
  'summer-hair-beach-pool-protection',
  'heat-styling-up-to-230',
  'mediterranean-humidity-frizz',
] as const;

export const CATEGORY_QUERIES = ['hair-care', 'gift-sets'] as const;

export type SeoLang = 'en' | 'fr' | 'ar';

const KEYWORDS: Record<SeoLang, string> = {
  fr: 'Arecima, soins capillaires Tunisie, Soleveil Protect, KPF 30, Silk Shield, anti-humidité, thermoprotection cheveux, coffret cheveux, leave-in, spray cheveux, rituel capillaire',
  en: 'Arecima, Tunisian hair care, Soleveil Protect, KPF 30, Silk Shield, anti-humidity hair spray, heat protection 230C, hair ritual duo, leave-in, Tunisia',
  ar: 'أريسيما, العناية بالشعر تونس, سولفيل بروتكت, سيلك شيلد, حماية الشعر, ضد الرطوبة, حماية حرارية, طقس الشعر',
};

const DEFAULT_TITLE: Record<SeoLang, string> = {
  fr: 'Soins Capillaires de Luxe Tunisiens',
  en: 'Luxury Tunisian Hair Care',
  ar: 'العناية الفاخرة بالشعر — تونس',
};

const DEFAULT_DESCRIPTION: Record<SeoLang, string> = {
  fr: 'Arecima — Soleveil Protect KPF 30 et Silk Shield. Protection UV, chaleur 230°C, mer et humidité. Rituel capillaire premium made in Tunisia. Livraison en Tunisie.',
  en: 'Arecima — Soleveil Protect KPF 30 & Silk Shield spray. UV, 230°C heat, sea & humidity protection. Premium Tunisian hair ritual. Shipping across Tunisia.',
  ar: 'أريسيما — سولفيل بروتكت KPF 30 وسيلك شيلد. حماية من UV والحرارة والبحر والرطوبة. طقس شعري فاخر made in Tunisia.',
};

export function getSeoKeywords(lang: SeoLang): string {
  return KEYWORDS[lang];
}

export function getDefaultSeoTitle(lang: SeoLang): string {
  return DEFAULT_TITLE[lang];
}

export function getDefaultSeoDescription(lang: SeoLang): string {
  return DEFAULT_DESCRIPTION[lang];
}

/** Build absolute URL for OG/Twitter (works with Vite asset paths). */
export function absoluteUrl(path?: string | null): string {
  if (!path) return OG_IMAGE;
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function formatPageTitle(title: string | undefined, lang: SeoLang): string {
  if (!title) {
    return `Arecima — ${DEFAULT_TITLE[lang]}`;
  }
  if (/arecima/i.test(title)) return title;
  return `${title} | Arecima`;
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Arecima',
    alternateName: 'Arecima Tunisia',
    description: 'Luxury Tunisian hair care brand — Soleveil Protect & Silk Shield',
    url: SITE_URL,
    logo: LOGO_URL,
    image: OG_IMAGE,
    address: { '@type': 'PostalAddress', addressLocality: 'Tunis', addressCountry: 'TN' },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+216-50-454-000',
      contactType: 'customer service',
      availableLanguage: ['French', 'English', 'Arabic'],
    },
    sameAs: [
      'https://instagram.com/arecima.tn',
      'https://facebook.com/arecima.tn',
      'https://tiktok.com/@arecima.tn',
    ],
  };
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Arecima',
    url: SITE_URL,
    inLanguage: ['fr-TN', 'en-US', 'ar-TN'],
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/products?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildItemListSchema(
  name: string,
  products: Product[],
  lang: SeoLang,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: siteProductUrl(p.id),
      name: p.name[lang] || p.name.fr,
    })),
  };
}

export function buildProductOfferCatalog(products: Product[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'Arecima Hair Care',
    url: sitePath('/products'),
    itemListElement: products.map(p => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Product',
        name: p.name.en,
        url: siteProductUrl(p.id),
        image: productImages[p.image] ? absoluteUrl(productImages[p.image]) : OG_IMAGE,
      },
      price: p.price,
      priceCurrency: 'TND',
      availability: p.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    })),
  };
}

/** All indexable paths for sitemap.xml generation. */
export function getSitemapEntries(): Array<{ loc: string; changefreq: string; priority: string }> {
  const today = new Date().toISOString().slice(0, 10);
  void today;

  const entries = [
    { loc: `${SITE_URL}/`, changefreq: 'daily', priority: '1.0' },
    { loc: sitePath('/products'), changefreq: 'daily', priority: '0.9' },
    ...CATEGORY_QUERIES.map(cat => ({
      loc: sitePath(`/products?category=${cat}`),
      changefreq: 'weekly',
      priority: '0.85',
    })),
    ...PRODUCT_SLUGS.map(slug => ({
      loc: siteProductUrl(slug),
      changefreq: 'weekly',
      priority: '0.95',
    })),
    { loc: sitePath('/blog'), changefreq: 'weekly', priority: '0.75' },
    ...BLOG_SLUGS.map(slug => ({
      loc: sitePath(`/blog/${slug}`),
      changefreq: 'monthly',
      priority: '0.7',
    })),
    { loc: sitePath('/faq'), changefreq: 'monthly', priority: '0.5' },
    { loc: sitePath('/shipping-policy'), changefreq: 'monthly', priority: '0.4' },
    { loc: sitePath('/return-policy'), changefreq: 'monthly', priority: '0.4' },
    { loc: sitePath('/privacy-policy'), changefreq: 'yearly', priority: '0.3' },
    { loc: sitePath('/terms'), changefreq: 'yearly', priority: '0.3' },
  ];

  return entries;
}
