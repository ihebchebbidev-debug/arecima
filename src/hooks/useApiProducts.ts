import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { adaptProduct, adaptBlogPost } from '@/lib/productAdapter';
import type { Product } from '@/data/products';
import type { BlogPost } from '@/data/blogPosts';

export interface StoreCategory {
  id: string;
  slug: string;
  name: { en: string; fr: string; ar: string };
  productCount?: number;
}

export function adaptCategory(raw: Record<string, unknown>): StoreCategory {
  return {
    id: String(raw.slug || raw.id),
    slug: String(raw.slug || raw.id),
    name: {
      fr: String(raw.name_fr || ''),
      en: String(raw.name_en || raw.name_fr || ''),
      ar: String(raw.name_ar || raw.name_fr || ''),
    },
    productCount: raw.product_count != null ? Number(raw.product_count) : undefined,
  };
}

export function useApiCategories() {
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api.listCategories().then(res => {
      if (cancelled) return;
      if (res.success && Array.isArray(res.data)) {
        setCategories(res.data.map((c: Record<string, unknown>) => adaptCategory(c)));
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  return { categories, loading };
}

export function useApiProducts(query?: Record<string, unknown>) {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api.listProducts({ limit: 100, is_active: 1, ...query }).then(res => {
      if (cancelled) return;
      if (res.success && Array.isArray(res.data)) {
        setData(res.data.map(adaptProduct));
      } else {
        setError(res.error || 'Failed to load products');
        setData([]);
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [JSON.stringify(query)]);

  return { products: data, loading, error };
}

export function useApiProduct(slug?: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    api.getProductBySlug(slug).then(res => {
      if (cancelled) return;
      if (res.success && res.data) {
        setProduct(adaptProduct(res.data));
      } else {
        setProduct(null);
        setError(res.error || 'Product not found');
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [slug]);

  return { product, loading, error };
}

export function useApiBlogPosts() {
  const [data, setData] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api.listPosts({ limit: 50, is_published: 1 }).then(res => {
      if (cancelled) return;
      if (res.success && Array.isArray(res.data)) {
        setData(res.data.map(adaptBlogPost));
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  return { posts: data, loading };
}

export function useApiBlogPost(slug?: string) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    api.getPostBySlug(slug).then(res => {
      if (cancelled) return;
      if (res.success && res.data) {
        setPost(adaptBlogPost(res.data));
      } else {
        setPost(null);
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [slug]);

  return { post, loading };
}

export interface FeaturedReview {
  id: string;
  customerName: string;
  rating: number;
  title?: string;
  body: string;
  productSlug?: string;
  productName?: string;
}

function adaptFeaturedReview(raw: Record<string, unknown>): FeaturedReview {
  return {
    id: String(raw.id),
    customerName: String(raw.customer_name || ''),
    rating: Number(raw.rating) || 5,
    title: raw.title ? String(raw.title) : undefined,
    body: String(raw.body || ''),
    productSlug: raw.product_slug ? String(raw.product_slug) : undefined,
    productName: raw.product_name ? String(raw.product_name) : undefined,
  };
}

export function useApiFeaturedReviews(limit = 3) {
  const [reviews, setReviews] = useState<FeaturedReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api.listFeaturedReviews(limit).then(res => {
      if (cancelled) return;
      if (res.success && Array.isArray(res.data)) {
        setReviews(res.data.map((r: Record<string, unknown>) => adaptFeaturedReview(r)));
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [limit]);

  return { reviews, loading };
}
