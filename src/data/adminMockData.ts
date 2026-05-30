// ============================================================
// ADMIN MOCK DATA - Static data for all admin interfaces
// ============================================================

export interface AdminProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  costPrice: number;
  stock: number;
  lowStockThreshold: number;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  size: string;
  createdAt: string;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  items: { productName: string; quantity: number; unitPrice: number; total: number }[];
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
  shippingAddress: string;
  trackingNumber?: string;
  notes?: string;
  timeline: { status: string; note: string; date: string }[];
  createdAt: string;
}

export interface AdminCustomer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderAt: string;
  tags: string[];
  isSubscribed: boolean;
  country: string;
  city: string;
  createdAt: string;
}

export interface VisitorSession {
  id: string;
  visitorId: string;
  ipAddress: string;
  device: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  country: string;
  city: string;
  referrerSource: string;
  landingPage: string;
  pagesViewed: number;
  duration: number;
  isBounce: boolean;
  startedAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: 'super_admin' | 'admin' | 'manager' | 'viewer';
  isActive: boolean;
  lastLoginAt: string;
  createdAt: string;
}

// PRODUCTS
export const mockProducts: AdminProduct[] = [
  { id: '1', slug: 'golden-radiance-serum', name: 'Golden Radiance Serum', category: 'Face Care', price: 189, costPrice: 45, stock: 234, lowStockThreshold: 20, rating: 4.9, reviewCount: 2847, isActive: true, isNew: false, isBestSeller: true, size: '30ml', createdAt: '2024-01-15' },
  { id: '2', slug: 'royal-face-cream', name: 'Royal Face Cream', category: 'Face Care', price: 159, costPrice: 38, stock: 189, lowStockThreshold: 20, rating: 4.8, reviewCount: 1923, isActive: true, isNew: false, isBestSeller: true, size: '50ml', createdAt: '2024-01-20' },
  { id: '3', slug: 'silk-cleanser', name: 'Silk Purifying Cleanser', category: 'Face Care', price: 89, costPrice: 22, stock: 312, lowStockThreshold: 30, rating: 4.7, reviewCount: 1456, isActive: true, isNew: false, isBestSeller: false, size: '200ml', createdAt: '2024-02-01' },
  { id: '4', slug: 'liquid-gold-oil', name: 'Liquid Gold Body Oil', category: 'Body Care', price: 129, costPrice: 32, stock: 156, lowStockThreshold: 15, rating: 4.9, reviewCount: 2134, isActive: true, isNew: false, isBestSeller: true, size: '100ml', createdAt: '2024-02-10' },
  { id: '5', slug: 'youth-eye-elixir', name: 'Youth Eye Elixir', category: 'Face Care', price: 139, costPrice: 35, stock: 8, lowStockThreshold: 10, rating: 4.6, reviewCount: 987, isActive: true, isNew: true, isBestSeller: false, size: '15ml', createdAt: '2024-03-01' },
  { id: '6', slug: 'rose-radiance-mask', name: 'Rose Radiance Mask', category: 'Face Care', price: 109, originalPrice: 139, costPrice: 28, stock: 0, lowStockThreshold: 10, rating: 4.8, reviewCount: 1567, isActive: true, isNew: false, isBestSeller: false, size: '75ml', createdAt: '2024-03-15' },
  { id: '7', slug: 'mist-essence-toner', name: 'Mist Essence Toner', category: 'Face Care', price: 79, costPrice: 18, stock: 445, lowStockThreshold: 30, rating: 4.7, reviewCount: 834, isActive: true, isNew: true, isBestSeller: false, size: '150ml', createdAt: '2024-04-01' },
  { id: '8', slug: 'solar-shield-spf', name: 'Solar Shield SPF 50+', category: 'Sun Care', price: 99, costPrice: 25, stock: 267, lowStockThreshold: 25, rating: 4.8, reviewCount: 1245, isActive: true, isNew: false, isBestSeller: true, size: '50ml', createdAt: '2024-04-10' },
];

// ORDERS
export const mockOrders: AdminOrder[] = [
  {
    id: '1', orderNumber: 'AUR-2024-0847', customerName: 'Amira Ben Salem', customerEmail: 'amira@email.com',
    status: 'delivered', paymentStatus: 'paid', paymentMethod: 'Credit Card',
    items: [
      { productName: 'Golden Radiance Serum', quantity: 2, unitPrice: 189, total: 378 },
      { productName: 'Royal Face Cream', quantity: 1, unitPrice: 159, total: 159 },
    ],
    subtotal: 537, shipping: 0, discount: 53.7, tax: 48.33, total: 531.63,
    shippingAddress: '12 Rue de la Liberté, Tunis 1000, Tunisia', trackingNumber: 'TN2024084700',
    timeline: [
      { status: 'pending', note: 'Order placed', date: '2024-11-01T10:30:00' },
      { status: 'confirmed', note: 'Payment confirmed', date: '2024-11-01T10:32:00' },
      { status: 'processing', note: 'Being prepared', date: '2024-11-02T09:00:00' },
      { status: 'shipped', note: 'Shipped via Aramex', date: '2024-11-03T14:20:00' },
      { status: 'delivered', note: 'Delivered successfully', date: '2024-11-05T11:15:00' },
    ],
    createdAt: '2024-11-01',
  },
  {
    id: '2', orderNumber: 'AUR-2024-0848', customerName: 'Sophie Martin', customerEmail: 'sophie@email.com',
    status: 'shipped', paymentStatus: 'paid', paymentMethod: 'PayPal',
    items: [{ productName: 'Liquid Gold Body Oil', quantity: 1, unitPrice: 129, total: 129 }],
    subtotal: 129, shipping: 12, discount: 0, tax: 11.61, total: 152.61,
    shippingAddress: '45 Avenue des Champs, Paris 75008, France', trackingNumber: 'FR2024084801',
    timeline: [
      { status: 'pending', note: 'Order placed', date: '2024-11-10T16:00:00' },
      { status: 'confirmed', note: 'Payment via PayPal', date: '2024-11-10T16:02:00' },
      { status: 'shipped', note: 'Shipped via DHL', date: '2024-11-12T10:30:00' },
    ],
    createdAt: '2024-11-10',
  },
  {
    id: '3', orderNumber: 'AUR-2024-0849', customerName: 'Yasmine Khelifi', customerEmail: 'yasmine@email.com',
    status: 'processing', paymentStatus: 'paid', paymentMethod: 'Credit Card',
    items: [
      { productName: 'Rose Radiance Mask', quantity: 2, unitPrice: 109, total: 218 },
      { productName: 'Mist Essence Toner', quantity: 1, unitPrice: 79, total: 79 },
      { productName: 'Silk Purifying Cleanser', quantity: 1, unitPrice: 89, total: 89 },
    ],
    subtotal: 386, shipping: 0, discount: 38.6, tax: 34.74, total: 382.14,
    shippingAddress: '8 Rue Habib Bourguiba, Sousse 4000, Tunisia',
    timeline: [
      { status: 'pending', note: 'Order placed', date: '2024-11-14T20:45:00' },
      { status: 'confirmed', note: 'Payment confirmed', date: '2024-11-14T20:47:00' },
      { status: 'processing', note: 'Preparing order', date: '2024-11-15T08:00:00' },
    ],
    createdAt: '2024-11-14',
  },
  {
    id: '4', orderNumber: 'AUR-2024-0850', customerName: 'Fatma Trabelsi', customerEmail: 'fatma@email.com',
    status: 'pending', paymentStatus: 'pending', paymentMethod: 'Cash on Delivery',
    items: [{ productName: 'Solar Shield SPF 50+', quantity: 3, unitPrice: 99, total: 297 }],
    subtotal: 297, shipping: 8, discount: 0, tax: 26.73, total: 331.73,
    shippingAddress: '22 Avenue de la République, Sfax 3000, Tunisia',
    timeline: [{ status: 'pending', note: 'Order placed, COD', date: '2024-11-15T14:20:00' }],
    createdAt: '2024-11-15',
  },
  {
    id: '5', orderNumber: 'AUR-2024-0851', customerName: 'Lina Bouzid', customerEmail: 'lina@email.com',
    status: 'cancelled', paymentStatus: 'refunded', paymentMethod: 'Credit Card',
    items: [{ productName: 'Youth Eye Elixir', quantity: 1, unitPrice: 139, total: 139 }],
    subtotal: 139, shipping: 12, discount: 0, tax: 12.51, total: 163.51,
    shippingAddress: '5 Rue de Marseille, Tunis 1002, Tunisia',
    notes: 'Customer requested cancellation - changed mind',
    timeline: [
      { status: 'pending', note: 'Order placed', date: '2024-11-12T09:00:00' },
      { status: 'confirmed', note: 'Payment confirmed', date: '2024-11-12T09:02:00' },
      { status: 'cancelled', note: 'Cancelled by customer', date: '2024-11-12T11:30:00' },
    ],
    createdAt: '2024-11-12',
  },
];

// CUSTOMERS
export const mockCustomers: AdminCustomer[] = [
  { id: '1', email: 'amira@email.com', firstName: 'Amira', lastName: 'Ben Salem', phone: '+216 55 123 456', totalOrders: 12, totalSpent: 2847.50, lastOrderAt: '2024-11-01', tags: ['VIP', 'Loyal'], isSubscribed: true, country: 'Tunisia', city: 'Tunis', createdAt: '2023-06-15' },
  { id: '2', email: 'sophie@email.com', firstName: 'Sophie', lastName: 'Martin', phone: '+33 6 12 34 56 78', totalOrders: 5, totalSpent: 945.00, lastOrderAt: '2024-11-10', tags: ['International'], isSubscribed: true, country: 'France', city: 'Paris', createdAt: '2024-01-20' },
  { id: '3', email: 'yasmine@email.com', firstName: 'Yasmine', lastName: 'Khelifi', phone: '+216 22 987 654', totalOrders: 8, totalSpent: 1623.40, lastOrderAt: '2024-11-14', tags: ['VIP'], isSubscribed: true, country: 'Tunisia', city: 'Sousse', createdAt: '2023-09-01' },
  { id: '4', email: 'fatma@email.com', firstName: 'Fatma', lastName: 'Trabelsi', phone: '+216 98 456 789', totalOrders: 3, totalSpent: 497.00, lastOrderAt: '2024-11-15', tags: [], isSubscribed: false, country: 'Tunisia', city: 'Sfax', createdAt: '2024-05-10' },
  { id: '5', email: 'lina@email.com', firstName: 'Lina', lastName: 'Bouzid', phone: '+216 50 321 654', totalOrders: 2, totalSpent: 328.00, lastOrderAt: '2024-11-12', tags: ['At Risk'], isSubscribed: true, country: 'Tunisia', city: 'Tunis', createdAt: '2024-08-01' },
  { id: '6', email: 'maria@email.com', firstName: 'Maria', lastName: 'Garcia', phone: '+34 612 345 678', totalOrders: 7, totalSpent: 1156.80, lastOrderAt: '2024-10-28', tags: ['International', 'Loyal'], isSubscribed: true, country: 'Spain', city: 'Madrid', createdAt: '2023-12-05' },
];

// VISITOR SESSIONS
export const mockVisitors: VisitorSession[] = [
  { id: '1', visitorId: 'v_abc123', ipAddress: '197.15.23.45', device: 'mobile', browser: 'Chrome', os: 'Android', country: 'Tunisia', city: 'Tunis', referrerSource: 'Google', landingPage: '/', pagesViewed: 7, duration: 342, isBounce: false, startedAt: '2024-11-15T10:30:00' },
  { id: '2', visitorId: 'v_def456', ipAddress: '86.247.112.30', device: 'desktop', browser: 'Safari', os: 'macOS', country: 'France', city: 'Paris', referrerSource: 'Instagram', landingPage: '/products', pagesViewed: 4, duration: 185, isBounce: false, startedAt: '2024-11-15T11:15:00' },
  { id: '3', visitorId: 'v_ghi789', ipAddress: '41.228.56.12', device: 'mobile', browser: 'Safari', os: 'iOS', country: 'Tunisia', city: 'Sousse', referrerSource: 'Facebook', landingPage: '/product/golden-radiance-serum', pagesViewed: 1, duration: 12, isBounce: true, startedAt: '2024-11-15T12:00:00' },
  { id: '4', visitorId: 'v_jkl012', ipAddress: '176.88.34.200', device: 'desktop', browser: 'Firefox', os: 'Windows', country: 'Germany', city: 'Berlin', referrerSource: 'Direct', landingPage: '/', pagesViewed: 11, duration: 580, isBounce: false, startedAt: '2024-11-15T13:20:00' },
  { id: '5', visitorId: 'v_mno345', ipAddress: '197.0.78.91', device: 'tablet', browser: 'Chrome', os: 'Android', country: 'Tunisia', city: 'Sfax', referrerSource: 'Google', landingPage: '/products', pagesViewed: 3, duration: 95, isBounce: false, startedAt: '2024-11-15T14:45:00' },
  { id: '6', visitorId: 'v_pqr678', ipAddress: '82.120.45.67', device: 'mobile', browser: 'Chrome', os: 'Android', country: 'Italy', city: 'Rome', referrerSource: 'TikTok', landingPage: '/product/liquid-gold-oil', pagesViewed: 5, duration: 210, isBounce: false, startedAt: '2024-11-15T15:30:00' },
  { id: '7', visitorId: 'v_stu901', ipAddress: '41.230.12.88', device: 'desktop', browser: 'Chrome', os: 'Windows', country: 'Tunisia', city: 'Bizerte', referrerSource: 'Google', landingPage: '/', pagesViewed: 2, duration: 35, isBounce: true, startedAt: '2024-11-15T16:10:00' },
  { id: '8', visitorId: 'v_vwx234', ipAddress: '185.76.23.11', device: 'mobile', browser: 'Safari', os: 'iOS', country: 'UAE', city: 'Dubai', referrerSource: 'Instagram', landingPage: '/products', pagesViewed: 9, duration: 445, isBounce: false, startedAt: '2024-11-15T17:00:00' },
];

// ADMIN USERS
export const mockAdminUsers: AdminUser[] = [
  { id: '1', email: 'admin@arecima.tn', fullName: 'Nour El Houda', role: 'super_admin', isActive: true, lastLoginAt: '2024-11-15T09:00:00', createdAt: '2023-01-01' },
  { id: '2', email: 'manager@arecima.tn', fullName: 'Sami Belkhodja', role: 'admin', isActive: true, lastLoginAt: '2024-11-14T18:30:00', createdAt: '2023-03-15' },
  { id: '3', email: 'support@arecima.tn', fullName: 'Ines Gharbi', role: 'manager', isActive: true, lastLoginAt: '2024-11-15T08:45:00', createdAt: '2023-06-01' },
  { id: '4', email: 'viewer@arecima.tn', fullName: 'Mehdi Dridi', role: 'viewer', isActive: false, lastLoginAt: '2024-10-01T12:00:00', createdAt: '2024-01-10' },
];

// DASHBOARD STATS
export const dashboardStats = {
  revenue: { value: 48520, change: 12.5, period: 'vs last month' },
  orders: { value: 342, change: 8.3, period: 'vs last month' },
  customers: { value: 1247, change: 15.2, period: 'vs last month' },
  conversionRate: { value: 3.8, change: -0.4, period: 'vs last month' },
  avgOrderValue: { value: 141.87, change: 5.1, period: 'vs last month' },
  visitors: { value: 9012, change: 22.1, period: 'vs last month' },
};

export const revenueChartData = [
  { month: 'Jun', revenue: 28400 }, { month: 'Jul', revenue: 31200 },
  { month: 'Aug', revenue: 35600 }, { month: 'Sep', revenue: 33100 },
  { month: 'Oct', revenue: 41800 }, { month: 'Nov', revenue: 48520 },
];

export const topCountries = [
  { country: 'Tunisia', visitors: 4520, orders: 189, revenue: 24300 },
  { country: 'France', visitors: 1845, orders: 67, revenue: 9870 },
  { country: 'UAE', visitors: 890, orders: 34, revenue: 5620 },
  { country: 'Germany', visitors: 678, orders: 22, revenue: 3450 },
  { country: 'Italy', visitors: 534, orders: 18, revenue: 2890 },
  { country: 'Spain', visitors: 345, orders: 12, revenue: 2390 },
];

export const trafficSources = [
  { source: 'Google', visitors: 3604, percentage: 40 },
  { source: 'Direct', visitors: 1802, percentage: 20 },
  { source: 'Instagram', visitors: 1622, percentage: 18 },
  { source: 'Facebook', visitors: 901, percentage: 10 },
  { source: 'TikTok', visitors: 541, percentage: 6 },
  { source: 'Other', visitors: 541, percentage: 6 },
];

export const deviceBreakdown = [
  { device: 'Mobile', count: 4867, percentage: 54 },
  { device: 'Desktop', count: 3154, percentage: 35 },
  { device: 'Tablet', count: 991, percentage: 11 },
];
