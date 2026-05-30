/**
 * Generates public/sitemap.xml from canonical SEO routes.
 * Run: node scripts/generate-sitemap.mjs
 */
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_URL = 'https://arecima.tn';
const lastmod = new Date().toISOString().slice(0, 10);

const PRODUCT_SLUGS = [
  'soleveil-protect-kpf30',
  'silk-shield-spray',
  'rituel-cheveux-duo',
];

const BLOG_SLUGS = [
  'soleveil-protect-kpf30-explained',
  'silk-shield-anti-humidity-spray',
  'arecima-hair-ritual-duo',
  'summer-hair-beach-pool-protection',
  'heat-styling-up-to-230',
  'mediterranean-humidity-frizz',
];

const urls = [
  { loc: `${SITE_URL}/`, priority: '1.0', changefreq: 'daily' },
  { loc: `${SITE_URL}/products`, priority: '0.9', changefreq: 'daily' },
  { loc: `${SITE_URL}/products?category=hair-care`, priority: '0.85', changefreq: 'weekly' },
  { loc: `${SITE_URL}/products?category=gift-sets`, priority: '0.85', changefreq: 'weekly' },
  ...PRODUCT_SLUGS.map(slug => ({
    loc: `${SITE_URL}/product/${slug}`,
    priority: '0.95',
    changefreq: 'weekly',
  })),
  { loc: `${SITE_URL}/blog`, priority: '0.75', changefreq: 'weekly' },
  ...BLOG_SLUGS.map(slug => ({
    loc: `${SITE_URL}/blog/${slug}`,
    priority: '0.7',
    changefreq: 'monthly',
  })),
  { loc: `${SITE_URL}/faq`, priority: '0.5', changefreq: 'monthly' },
  { loc: `${SITE_URL}/shipping-policy`, priority: '0.4', changefreq: 'monthly' },
  { loc: `${SITE_URL}/return-policy`, priority: '0.4', changefreq: 'monthly' },
  { loc: `${SITE_URL}/privacy-policy`, priority: '0.3', changefreq: 'yearly' },
  { loc: `${SITE_URL}/terms`, priority: '0.3', changefreq: 'yearly' },
];

const hreflangLinks = (loc) => `
    <xhtml:link rel="alternate" hreflang="fr" href="${loc}" />
    <xhtml:link rel="alternate" hreflang="en" href="${loc}" />
    <xhtml:link rel="alternate" hreflang="ar" href="${loc}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}" />`;

const body = urls.map(({ loc, priority, changefreq }) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${hreflangLinks(loc)}
  </url>`).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>
`;

const outPath = join(__dirname, '..', 'public', 'sitemap.xml');
writeFileSync(outPath, xml, 'utf8');
console.log(`Sitemap written: ${outPath} (${urls.length} URLs)`);
