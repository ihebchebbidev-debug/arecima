import type { Product } from '@/data/products';
import type { CartItem } from '@/contexts/CartContext';
import { getProductApiId } from '@/lib/productAdapter';
import { api } from '@/lib/api';

export interface FacebookPixelConfig {
  enabled: boolean;
  pixel_id?: string;
  track_page_view?: boolean;
  track_view_content?: boolean;
  track_add_to_cart?: boolean;
  track_initiate_checkout?: boolean;
  track_purchase?: boolean;
  track_add_to_wishlist?: boolean;
  test_event_code?: string | null;
}

type FbqFn = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[][];
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    fbq?: FbqFn;
    _fbq?: FbqFn;
  }
}

const SCRIPT_ID = 'facebook-pixel-script';
const PURCHASE_KEY = 'arecima_fb_purchases';
const CURRENCY = 'TND';

let config: FacebookPixelConfig | null = null;
let initializedPixelId: string | null = null;
let bootstrapPromise: Promise<boolean> | null = null;

type QueuedEvent = { method: 'track'; event: string; params: Record<string, unknown> };

const pendingEvents: QueuedEvent[] = [];

function productContentId(product: Product): string {
  return getProductApiId(product);
}

function cartContents(items: CartItem[]) {
  return items.map(i => ({
    id: productContentId(i.product),
    quantity: i.quantity,
    item_price: i.product.price,
  }));
}

/** Official Meta pixel stub — queues calls until fbevents.js loads. */
function installFbqStub(): void {
  if (typeof window === 'undefined') return;
  if (window.fbq && window.fbq.queue) return;

  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) {
      fbq.callMethod.apply(fbq, args);
    } else {
      fbq.queue!.push(args);
    }
  } as FbqFn;

  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = '2.0';
  window.fbq = fbq;
  if (!window._fbq) window._fbq = fbq;
}

function loadPixelScript(): Promise<void> {
  if (typeof document === 'undefined') return Promise.resolve();
  installFbqStub();

  if (document.getElementById(SCRIPT_ID)) return Promise.resolve();

  return new Promise(resolve => {
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    script.onload = () => resolve();
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });
}

function eventOptions(): Record<string, string> | undefined {
  if (!config?.test_event_code) return undefined;
  return { test_event_code: config.test_event_code };
}

function canTrack(flag: keyof FacebookPixelConfig): boolean {
  if (!config?.enabled || !config.pixel_id || !window.fbq) return false;
  return config[flag] !== false;
}

function flushPendingEvents(): void {
  if (!window.fbq || !config?.enabled) return;
  while (pendingEvents.length) {
    const { event, params } = pendingEvents.shift()!;
    if (!canTrack(getEventFlag(event))) continue;
    window.fbq('track', event, params, eventOptions());
  }
}

function dispatchTrack(event: string, params: Record<string, unknown>): void {
  const flag = getEventFlag(event);

  const fire = () => {
    if (!canTrack(flag)) return;
    window.fbq!('track', event, params, eventOptions());
  };

  if (!initializedPixelId || !config?.enabled) {
    pendingEvents.push({ method: 'track', event, params });
    void bootstrapFacebookPixel().then(ok => {
      if (ok) flushPendingEvents();
    });
    return;
  }

  fire();
}

function getEventFlag(event: string): keyof FacebookPixelConfig {
  switch (event) {
    case 'PageView': return 'track_page_view';
    case 'ViewContent': return 'track_view_content';
    case 'AddToCart': return 'track_add_to_cart';
    case 'InitiateCheckout': return 'track_initiate_checkout';
    case 'Purchase': return 'track_purchase';
    case 'AddToWishlist': return 'track_add_to_wishlist';
    default: return 'track_page_view';
  }
}

/** Fetch config from API, load script, init pixel — safe to call multiple times. */
export async function bootstrapFacebookPixel(retry = true): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (initializedPixelId && config?.enabled) return true;

  if (!bootstrapPromise) {
    bootstrapPromise = (async () => {
      try {
        const res = await api.getTrackingConfig();
        if (!res.success || !res.data?.enabled || !res.data.pixel_id) {
          config = res.data?.enabled === false ? { enabled: false } : config;
          if (!res.success && retry) {
            await new Promise(r => setTimeout(r, 1500));
            bootstrapPromise = null;
            return bootstrapFacebookPixel(false);
          }
          config = { enabled: false };
          return false;
        }

        config = res.data as FacebookPixelConfig;
        await loadPixelScript();

        if (!window.fbq) return false;

        const pixelId = String(config.pixel_id).replace(/\D/g, '');
        if (pixelId.length < 15) return false;

        if (initializedPixelId !== pixelId) {
          window.fbq('init', pixelId);
          initializedPixelId = pixelId;
        }

        flushPendingEvents();
        return true;
      } catch {
        if (retry) {
          await new Promise(r => setTimeout(r, 1500));
          bootstrapPromise = null;
          return bootstrapFacebookPixel(false);
        }
        return false;
      } finally {
        bootstrapPromise = null;
      }
    })();
  }

  return bootstrapPromise;
}

export function isFacebookPixelReady(): boolean {
  return Boolean(config?.enabled && initializedPixelId && window.fbq);
}

/** @deprecated use bootstrapFacebookPixel */
export async function initFacebookPixel(cfg: FacebookPixelConfig): Promise<void> {
  config = cfg;
  if (!cfg.enabled || !cfg.pixel_id) return;
  await loadPixelScript();
  if (!window.fbq) return;
  const pixelId = String(cfg.pixel_id).replace(/\D/g, '');
  if (initializedPixelId !== pixelId) {
    window.fbq('init', pixelId);
    initializedPixelId = pixelId;
  }
  flushPendingEvents();
}

export function trackPageView(): void {
  dispatchTrack('PageView', {});
}

export function trackViewContent(product: Product): void {
  dispatchTrack('ViewContent', {
    content_ids: [productContentId(product)],
    content_type: 'product',
    content_name: product.name.en || product.name.fr,
    content_category: product.category,
    value: product.price,
    currency: CURRENCY,
    contents: [{ id: productContentId(product), quantity: 1, item_price: product.price }],
  });
}

export function trackAddToCart(product: Product, quantity = 1): void {
  dispatchTrack('AddToCart', {
    content_ids: [productContentId(product)],
    content_type: 'product',
    content_name: product.name.en || product.name.fr,
    value: product.price * quantity,
    currency: CURRENCY,
    num_items: quantity,
    contents: [{ id: productContentId(product), quantity, item_price: product.price }],
  });
}

export function trackAddToWishlist(product: Product): void {
  dispatchTrack('AddToWishlist', {
    content_ids: [productContentId(product)],
    content_type: 'product',
    content_name: product.name.en || product.name.fr,
    value: product.price,
    currency: CURRENCY,
    contents: [{ id: productContentId(product), quantity: 1, item_price: product.price }],
  });
}

export function trackInitiateCheckout(items: CartItem[], value: number): void {
  const contentIds = items.map(i => productContentId(i.product));
  const numItems = items.reduce((sum, i) => sum + i.quantity, 0);
  dispatchTrack('InitiateCheckout', {
    content_ids: contentIds,
    content_type: 'product',
    value,
    currency: CURRENCY,
    num_items: numItems,
    contents: cartContents(items),
  });
}

export function trackPurchase(orderId: string, items: CartItem[], value: number): void {
  const safeOrderId = orderId || `order_${Date.now()}`;

  try {
    const tracked: string[] = JSON.parse(sessionStorage.getItem(PURCHASE_KEY) || '[]');
    if (tracked.includes(safeOrderId)) return;
    sessionStorage.setItem(PURCHASE_KEY, JSON.stringify([...tracked.slice(-20), safeOrderId]));
  } catch {
    // ignore
  }

  const contentIds = items.map(i => productContentId(i.product));
  const numItems = items.reduce((sum, i) => sum + i.quantity, 0);

  dispatchTrack('Purchase', {
    content_ids: contentIds,
    content_type: 'product',
    value,
    currency: CURRENCY,
    num_items: numItems,
    order_id: safeOrderId,
    contents: cartContents(items),
  });
}
