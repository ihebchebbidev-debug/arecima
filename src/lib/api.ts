// ============================================================
// ARECIMA — API CLIENT (production)
// https://luccibyey.com.tn/arecima/api/
// ============================================================

export const API_BASE_URL = 'https://luccibyey.com.tn/arecima/api';

const TOKEN_KEY = 'arecima_admin_token';
const USER_KEY = 'arecima_admin_user';
const VISITOR_KEY = 'arecima_visitor_id';

// ---------- Auth helpers ----------
export const getToken = (): string | null => {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
};
export const setToken = (token: string) => {
  try { localStorage.setItem(TOKEN_KEY, token); } catch {}
};
export const clearAuth = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {}
};
export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};
export const setStoredUser = (user: any) => {
  try { localStorage.setItem(USER_KEY, JSON.stringify(user)); } catch {}
};

export const getVisitorId = (): string => {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = 'v_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return 'v_anon';
  }
};

// ---------- Core request helper ----------
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: { page: number; limit: number; total: number; pages: number };
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  query?: Record<string, any>;
  auth?: boolean;
  formData?: FormData;
  signal?: AbortSignal;
}

const buildUrl = (endpoint: string, query?: Record<string, any>) => {
  const url = new URL(`${API_BASE_URL}/${endpoint.replace(/^\//, '')}`);
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
};

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, query, auth = false, formData, signal } = options;
  const headers: Record<string, string> = {};

  if (!formData) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      // OVH / Apache often strips Authorization — X-Auth-Token is read by config.php
      headers['X-Auth-Token'] = token;
    }
  }

  const init: RequestInit = { method, headers, signal };
  if (formData) init.body = formData;
  else if (body !== undefined) init.body = JSON.stringify(body);

  try {
    const res = await fetch(buildUrl(endpoint, query), init);
    const text = await res.text();
    let data: ApiResponse<T>;
    try { data = text ? JSON.parse(text) : { success: res.ok }; }
    catch { data = { success: false, error: text || `HTTP ${res.status}` }; }

    if (!res.ok && !data.error) data.error = `HTTP ${res.status}`;
    return data;
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network error — unable to reach the API',
    };
  }
}

// ---------- Strongly-typed API surface ----------
export const api = {
  // AUTH
  login: (email: string, password: string) =>
    apiRequest<{ token: string; user: any }>('/auth.php', {
      method: 'POST', body: { action: 'login', email, password },
    }),
  me: () =>
    apiRequest('/auth.php', { method: 'POST', body: { action: 'me' }, auth: true }),
  changePassword: (current_password: string, new_password: string) =>
    apiRequest('/auth.php', {
      method: 'POST', auth: true,
      body: { action: 'change_password', current_password, new_password },
    }),

  // PRODUCTS
  listProducts: (q?: Record<string, any>) =>
    apiRequest<any[]>('/products.php', { query: q }),
  getProduct: (id: string) =>
    apiRequest<any>('/products.php', { query: { id } }),
  getProductBySlug: (slug: string) =>
    apiRequest<any>('/products.php', { query: { slug } }),
  createProduct: (body: any) =>
    apiRequest('/products.php', { method: 'POST', body, auth: true }),
  updateProduct: (body: any) =>
    apiRequest('/products.php', { method: 'PUT', body, auth: true }),
  deleteProduct: (id: string) =>
    apiRequest('/products.php', { method: 'DELETE', query: { id }, auth: true }),

  // CATEGORIES
  listCategories: () => apiRequest<any[]>('/categories.php'),
  createCategory: (body: any) =>
    apiRequest('/categories.php', { method: 'POST', body, auth: true }),
  updateCategory: (body: any) =>
    apiRequest('/categories.php', { method: 'PUT', body, auth: true }),
  deleteCategory: (id: string) =>
    apiRequest('/categories.php', { method: 'DELETE', query: { id }, auth: true }),

  // ORDERS
  listOrders: (q?: Record<string, any>) =>
    apiRequest<any[]>('/orders.php', { query: q }),
  getOrder: (id: string) =>
    apiRequest<any>('/orders.php', { query: { id } }),
  createOrder: (body: any) =>
    apiRequest('/orders.php', { method: 'POST', body }),
  updateOrderStatus: (id: string, status: string, payment_status?: string, note?: string) =>
    apiRequest('/orders.php', {
      method: 'PATCH', auth: true,
      body: { id, status, payment_status, note },
    }),
  deleteOrder: (id: string) =>
    apiRequest('/orders.php', { method: 'DELETE', query: { id }, auth: true }),

  // CUSTOMERS
  listCustomers: (q?: Record<string, any>) =>
    apiRequest<any[]>('/customers.php', { query: q }),
  getCustomer: (id: string) =>
    apiRequest<any>('/customers.php', { query: { id } }),
  createCustomer: (body: any) =>
    apiRequest('/customers.php', { method: 'POST', body }),
  updateCustomer: (body: any) =>
    apiRequest('/customers.php', { method: 'PUT', body, auth: true }),
  deleteCustomer: (id: string) =>
    apiRequest('/customers.php', { method: 'DELETE', query: { id }, auth: true }),

  // DASHBOARD
  dashboardStats: () =>
    apiRequest<any>('/dashboard.php', { query: { action: 'stats' }, auth: true }),
  dashboardRecentOrders: () =>
    apiRequest<any[]>('/dashboard.php', { query: { action: 'recent_orders' }, auth: true }),
  dashboardTopProducts: () =>
    apiRequest<any[]>('/dashboard.php', { query: { action: 'top_products' }, auth: true }),
  dashboardRevenueChart: (period: '7days' | '30days' | '12months' = '30days') =>
    apiRequest<any[]>('/dashboard.php', { query: { action: 'revenue_chart', period }, auth: true }),
  dashboardLowStock: () =>
    apiRequest<any[]>('/dashboard.php', { query: { action: 'low_stock' }, auth: true }),

  // ANALYTICS
  analyticsOverview: (period = '30') =>
    apiRequest<any>('/analytics.php', { query: { action: 'overview', period }, auth: true }),
  analyticsVisitors: (period = '30') =>
    apiRequest<any[]>('/analytics.php', { query: { action: 'visitors', period }, auth: true }),
  analyticsPages: () =>
    apiRequest<any[]>('/analytics.php', { query: { action: 'pages' }, auth: true }),
  analyticsDevices: () =>
    apiRequest<any[]>('/analytics.php', { query: { action: 'devices' }, auth: true }),
  analyticsCountries: () =>
    apiRequest<any[]>('/analytics.php', { query: { action: 'countries' }, auth: true }),
  analyticsReferrers: () =>
    apiRequest<any[]>('/analytics.php', { query: { action: 'referrers' }, auth: true }),
  trackSession: (body: any) =>
    apiRequest('/analytics.php', { method: 'POST', body }),

  // BLOG
  listPosts: (q?: Record<string, any>) =>
    apiRequest<any[]>('/blog.php', { query: q }),
  getPost: (id: string) =>
    apiRequest<any>('/blog.php', { query: { id } }),
  getPostBySlug: (slug: string) =>
    apiRequest<any>('/blog.php', { query: { slug } }),
  createPost: (body: any) =>
    apiRequest('/blog.php', { method: 'POST', body, auth: true }),
  updatePost: (body: any) =>
    apiRequest('/blog.php', { method: 'PUT', body, auth: true }),
  deletePost: (id: string) =>
    apiRequest('/blog.php', { method: 'DELETE', query: { id }, auth: true }),

  // REVIEWS
  listReviews: (q?: Record<string, any>) =>
    apiRequest<any[]>('/reviews.php', { query: q, auth: true }),
  getProductReviews: (product_id: string) =>
    apiRequest<any[]>('/reviews.php', { query: { product_id } }),
  listFeaturedReviews: (limit = 3) =>
    apiRequest<any[]>('/reviews.php', { query: { featured: 1, limit } }),
  createReview: (body: any) =>
    apiRequest('/reviews.php', { method: 'POST', body }),
  updateReview: (body: any) =>
    apiRequest('/reviews.php', { method: 'PUT', body, auth: true }),
  deleteReview: (id: string) =>
    apiRequest('/reviews.php', { method: 'DELETE', query: { id }, auth: true }),

  // NEWSLETTER
  subscribe: (email: string, first_name?: string, source = 'website') =>
    apiRequest('/newsletter.php', { method: 'POST', body: { email, first_name, source } }),
  listSubscribers: () =>
    apiRequest<any[]>('/newsletter.php', { auth: true }),
  unsubscribe: (email: string) =>
    apiRequest('/newsletter.php', { method: 'DELETE', query: { email } }),

  // COUPONS
  listCoupons: () => apiRequest<any[]>('/coupons.php', { auth: true }),
  validateCoupon: (code: string) =>
    apiRequest<any>('/coupons.php', { query: { code } }),
  createCoupon: (body: any) =>
    apiRequest('/coupons.php', { method: 'POST', body, auth: true }),
  updateCoupon: (body: any) =>
    apiRequest('/coupons.php', { method: 'PUT', body, auth: true }),
  deleteCoupon: (id: string) =>
    apiRequest('/coupons.php', { method: 'DELETE', query: { id }, auth: true }),

  // SHIPPING
  listShippingZones: () => apiRequest<any[]>('/shipping.php', { auth: true }),
  shippingForCountry: (country: string) =>
    apiRequest<any[]>('/shipping.php', { query: { country } }),

  // SETTINGS
  getSettings: () => apiRequest<any>('/settings.php', { auth: true }),
  updateSetting: (key: string, value: any) =>
    apiRequest('/settings.php', { method: 'PUT', body: { key, value }, auth: true }),

  // TRACKING (public — storefront pixel config)
  getTrackingConfig: () => apiRequest<any>('/tracking.php'),

  // PRODUCT IMAGES
  listProductImages: (product_id: string) =>
    apiRequest<any[]>('/product-images.php', { query: { product_id } }),
  addProductImage: (body: any) =>
    apiRequest('/product-images.php', { method: 'POST', body, auth: true }),
  updateProductImage: (body: any) =>
    apiRequest('/product-images.php', { method: 'PUT', body, auth: true }),
  deleteProductImage: (id: string) =>
    apiRequest('/product-images.php', { method: 'DELETE', query: { id }, auth: true }),

  // UPLOAD
  uploadFile: (file: File, extra: Record<string, string> = {}) => {
    const fd = new FormData();
    fd.append('file', file);
    Object.entries(extra).forEach(([k, v]) => fd.append(k, v));
    return apiRequest<{ url: string; filename: string }>('/upload.php', {
      method: 'POST', formData: fd, auth: true,
    });
  },
};

// ---------- Browser fingerprint helpers ----------
export function detectDevice(): 'desktop' | 'mobile' | 'tablet' {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent;
  if (/iPad|tablet/i.test(ua)) return 'tablet';
  if (/Mobi|Android|iPhone/i.test(ua)) return 'mobile';
  return 'desktop';
}
export function detectBrowser(): string {
  if (typeof navigator === 'undefined') return 'Unknown';
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua)) return 'Edge';
  if (/Chrome\//.test(ua)) return 'Chrome';
  if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) return 'Safari';
  if (/Firefox\//.test(ua)) return 'Firefox';
  return 'Other';
}
export function detectOS(): string {
  if (typeof navigator === 'undefined') return 'Unknown';
  const ua = navigator.userAgent;
  if (/Windows/.test(ua)) return 'Windows';
  if (/Mac OS X/.test(ua)) return 'macOS';
  if (/Android/.test(ua)) return 'Android';
  if (/iPhone|iPad|iOS/.test(ua)) return 'iOS';
  if (/Linux/.test(ua)) return 'Linux';
  return 'Other';
}
export function detectReferrerSource(): string {
  if (typeof document === 'undefined') return 'Direct';
  const ref = document.referrer;
  if (!ref) return 'Direct';
  try {
    const host = new URL(ref).hostname.toLowerCase();
    if (host.includes('google')) return 'Google';
    if (host.includes('facebook') || host.includes('fb.com')) return 'Facebook';
    if (host.includes('instagram')) return 'Instagram';
    if (host.includes('tiktok')) return 'TikTok';
    if (host.includes('twitter') || host.includes('x.com')) return 'Twitter';
    if (host.includes('youtube')) return 'YouTube';
    return host;
  } catch { return 'Direct'; }
}
