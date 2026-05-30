// Adapter: converts the PHP backend product/blog payloads into the
// trilingual `Product` / `BlogPost` shape that the storefront UI expects.
//
// This lets us swap the data source without rewriting every component.
import type { Product } from '@/data/products';
import type { BlogPost } from '@/data/blogPosts';
import { productImages } from '@/data/productImages';

const placeholder = '/placeholder.svg';

const pickImage = (raw: any): string => {
  // Backend may return: primary_image (URL), images: [{url, is_primary}], or image_key (legacy)
  if (raw?.primary_image) return raw.primary_image;
  if (Array.isArray(raw?.images) && raw.images.length) {
    const primary = raw.images.find((i: any) => i.is_primary) || raw.images[0];
    return primary?.url || placeholder;
  }
  if (raw?.image && productImages[raw.image]) return productImages[raw.image];
  if (raw?.image && /^https?:\/\//.test(raw.image)) return raw.image;
  return placeholder;
};

const tri = (fr?: string | null, en?: string | null, ar?: string | null) => ({
  en: en || fr || ar || '',
  fr: fr || en || ar || '',
  ar: ar || fr || en || '',
});

const triList = (fr?: string | null, en?: string | null, ar?: string | null): { en: string[]; fr: string[]; ar: string[] } => {
  const split = (s?: string | null) => (s ? s.split(/\r?\n|;|•/).map(x => x.trim()).filter(Boolean) : []);
  return { en: split(en) || [], fr: split(fr) || [], ar: split(ar) || [] };
};

const pickGallery = (raw: any): string[] => {
  if (Array.isArray(raw?.images) && raw.images.length) {
    const sorted = [...raw.images].sort((a: any, b: any) => {
      if (a.is_primary && !b.is_primary) return -1;
      if (!a.is_primary && b.is_primary) return 1;
      return (a.sort_order ?? 0) - (b.sort_order ?? 0);
    });
    return sorted.map((i: any) => i.url).filter(Boolean);
  }
  const single = pickImage(raw);
  return single ? [single] : [];
};

export function adaptProduct(raw: any): Product {
  const img = pickImage(raw);
  const gallery = pickGallery(raw);
  // If we got a URL we don't have in our local map, store the URL directly.
  // ProductCard / ProductDetail look up via productImages[product.image]; if missing they'd fail, so we keep url-as-key and patch the lookup.
  return {
    id: raw.slug || raw.id,
    apiId: String(raw.id),
    images: gallery,
    name: tri(raw.name_fr, raw.name_en, raw.name_ar),
    description: tri(raw.description_fr, raw.description_en, raw.description_ar),
    shortDescription: tri(raw.short_description_fr, raw.short_description_en, raw.short_description_ar)
      || tri(raw.description_fr, raw.description_en, raw.description_ar),
    price: Number(raw.price) || 0,
    originalPrice: raw.original_price ? Number(raw.original_price) : undefined,
    image: img, // store URL directly; we patch the image lookup to fall back to identity
    category: raw.category_slug || raw.category_id || '',
    rating: Number(raw.rating) || 5,
    reviewCount: Number(raw.review_count) || 0,
    inStock: Number(raw.stock ?? 1) > 0 && Number(raw.is_active ?? 1) === 1,
    isNew: Number(raw.is_new) === 1,
    isBestSeller: Number(raw.is_best_seller) === 1,
    size: raw.size || '',
    ingredients: tri(raw.ingredients_fr, raw.ingredients_en, raw.ingredients_ar),
    howToUse: tri(raw.how_to_use_fr, raw.how_to_use_en, raw.how_to_use_ar),
    benefits: triList(raw.benefits_fr, raw.benefits_en, raw.benefits_ar),
  };
}

export function adaptBlogPost(raw: any): BlogPost {
  return {
    id: raw.slug || raw.id,
    title: tri(raw.title_fr, raw.title_en, raw.title_ar),
    excerpt: tri(raw.excerpt_fr, raw.excerpt_en, raw.excerpt_ar),
    content: tri(raw.content_fr, raw.content_en, raw.content_ar),
    image: raw.image_url || raw.cover_image || raw.image || placeholder,
    category: tri(raw.category_fr || raw.category, raw.category_en || raw.category, raw.category_ar || raw.category),
    date: raw.published_at || raw.created_at || new Date().toISOString(),
    readTime: Number(raw.read_time) || 5,
  };
}

// Resolves an image key OR raw URL to a usable src for <img>.
// Existing code does `productImages[product.image]` — for API products that
// returns undefined, so callers should use this helper instead.
export function resolveImage(key: string): string {
  if (!key) return placeholder;
  if (/^(https?:|\/|data:)/i.test(key)) return key;
  return productImages[key] || placeholder;
}

/** MySQL id for orders API (never use slug here). */
export function getProductApiId(product: Product): string {
  return product.apiId || product.id;
}
