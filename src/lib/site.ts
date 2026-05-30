/** Public storefront domain — never use hosting/API URLs in SEO or canonical links. */
export const SITE_URL = 'https://arecima.tn';

export function sitePath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function siteProductUrl(slug: string): string {
  return sitePath(`/product/${slug}`);
}
