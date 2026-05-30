import { products as staticProducts } from '@/data/products';
import { CATALOG_PRODUCTS, enrichProduct } from '@/data/productDetails';
import type { Product } from '@/data/products';

/** Storefront only sells these slugs — bundled images live in src/assets. */
export const STOREFRONT_CATALOG_SLUGS = Object.keys(CATALOG_PRODUCTS);

/** MySQL ids from aurelia_database.sql (checkout must use apiId). */
export const CATALOG_API_IDS: Record<string, string> = {
  'soleveil-protect-kpf30': 'f1111111111111111111111111111111',
  'silk-shield-spray': 'f2222222222222222222222222222222',
  'rituel-cheveux-duo': 'f3333333333333333333333333333333',
};

export function buildStaticCatalogProduct(slug: string): Product | null {
  const base = staticProducts.find(p => p.id === slug);
  if (!base) return null;
  return enrichProduct({
    ...base,
    apiId: CATALOG_API_IDS[slug],
  });
}

/**
 * Always return the 3 hair products for the storefront.
 * API data (price, stock) wins when slugs match; otherwise use bundled catalog + images.
 */
export function mergeStorefrontProducts(apiProducts: Product[]): Product[] {
  const bySlug = new Map(apiProducts.map(p => [p.id, p]));

  return STOREFRONT_CATALOG_SLUGS.map(slug => {
    const fromApi = bySlug.get(slug);
    if (fromApi) return enrichProduct(fromApi);
    return buildStaticCatalogProduct(slug);
  }).filter((p): p is Product => Boolean(p));
}

export function getStorefrontProductBySlug(slug: string, apiProduct?: Product | null): Product | null {
  if (!STOREFRONT_CATALOG_SLUGS.includes(slug)) {
    return apiProduct ?? null;
  }
  if (apiProduct) return enrichProduct(apiProduct);
  return buildStaticCatalogProduct(slug);
}
