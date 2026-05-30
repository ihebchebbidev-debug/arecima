-- ============================================================
-- AURELIA — Complete Database Schema
-- All tables prefixed with aurelia_
-- ============================================================

-- ========================
-- ENUMS
-- ========================

CREATE TYPE aurelia_user_role AS ENUM ('super_admin', 'admin', 'manager', 'viewer');
CREATE TYPE aurelia_order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE aurelia_payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE aurelia_device_type AS ENUM ('desktop', 'mobile', 'tablet');

-- ========================
-- ADMIN USERS
-- ========================

CREATE TABLE aurelia_admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role aurelia_user_role NOT NULL DEFAULT 'viewer',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ========================
-- CATEGORIES
-- ========================

CREATE TABLE aurelia_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_fr TEXT NOT NULL,
  name_en TEXT,
  name_ar TEXT,
  description_fr TEXT,
  description_en TEXT,
  description_ar TEXT,
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ========================
-- PRODUCTS
-- ========================

CREATE TABLE aurelia_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  sku TEXT UNIQUE,
  barcode TEXT,
  category_id UUID REFERENCES aurelia_categories(id) ON DELETE SET NULL,

  -- Multi-language names
  name_fr TEXT NOT NULL,
  name_en TEXT,
  name_ar TEXT,

  -- Multi-language rich text descriptions
  description_fr TEXT,
  description_en TEXT,
  description_ar TEXT,

  -- Multi-language ingredients
  ingredients_fr TEXT,
  ingredients_en TEXT,
  ingredients_ar TEXT,

  -- Pricing
  price NUMERIC(10,3) NOT NULL,
  original_price NUMERIC(10,3),
  cost_price NUMERIC(10,3) NOT NULL DEFAULT 0,

  -- Inventory
  stock INT NOT NULL DEFAULT 0,
  low_stock_threshold INT NOT NULL DEFAULT 10,
  weight_grams INT,

  -- Product info
  size TEXT,
  rating NUMERIC(2,1) NOT NULL DEFAULT 0,
  review_count INT NOT NULL DEFAULT 0,

  -- Flags
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_new BOOLEAN NOT NULL DEFAULT false,
  is_best_seller BOOLEAN NOT NULL DEFAULT false,

  -- SEO
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_aurelia_products_category ON aurelia_products(category_id);
CREATE INDEX idx_aurelia_products_slug ON aurelia_products(slug);
CREATE INDEX idx_aurelia_products_active ON aurelia_products(is_active);

-- ========================
-- PRODUCT IMAGES
-- ========================

CREATE TABLE aurelia_product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES aurelia_products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_aurelia_product_images_product ON aurelia_product_images(product_id);

-- ========================
-- PRODUCT TAGS
-- ========================

CREATE TABLE aurelia_product_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES aurelia_products(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  UNIQUE(product_id, tag)
);

-- ========================
-- CUSTOMERS
-- ========================

CREATE TABLE aurelia_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  city TEXT,
  address TEXT,
  postal_code TEXT,
  is_subscribed BOOLEAN NOT NULL DEFAULT false,
  total_orders INT NOT NULL DEFAULT 0,
  total_spent NUMERIC(12,3) NOT NULL DEFAULT 0,
  last_order_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_aurelia_customers_email ON aurelia_customers(email);

-- ========================
-- CUSTOMER TAGS
-- ========================

CREATE TABLE aurelia_customer_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES aurelia_customers(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  UNIQUE(customer_id, tag)
);

-- ========================
-- ORDERS
-- ========================

CREATE TABLE aurelia_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES aurelia_customers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,

  status aurelia_order_status NOT NULL DEFAULT 'pending',
  payment_status aurelia_payment_status NOT NULL DEFAULT 'pending',
  payment_method TEXT,

  subtotal NUMERIC(12,3) NOT NULL DEFAULT 0,
  shipping NUMERIC(10,3) NOT NULL DEFAULT 0,
  discount NUMERIC(10,3) NOT NULL DEFAULT 0,
  tax NUMERIC(10,3) NOT NULL DEFAULT 0,
  total NUMERIC(12,3) NOT NULL DEFAULT 0,

  shipping_address TEXT,
  shipping_city TEXT,
  shipping_country TEXT,
  shipping_postal_code TEXT,
  tracking_number TEXT,

  coupon_code TEXT,
  notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_aurelia_orders_customer ON aurelia_orders(customer_id);
CREATE INDEX idx_aurelia_orders_status ON aurelia_orders(status);
CREATE INDEX idx_aurelia_orders_number ON aurelia_orders(order_number);

-- ========================
-- ORDER ITEMS
-- ========================

CREATE TABLE aurelia_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES aurelia_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES aurelia_products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_sku TEXT,
  quantity INT NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,3) NOT NULL,
  total NUMERIC(10,3) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_aurelia_order_items_order ON aurelia_order_items(order_id);

-- ========================
-- ORDER TIMELINE / HISTORY
-- ========================

CREATE TABLE aurelia_order_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES aurelia_orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT,
  created_by UUID REFERENCES aurelia_admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_aurelia_order_timeline_order ON aurelia_order_timeline(order_id);

-- ========================
-- COUPONS
-- ========================

CREATE TABLE aurelia_coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10,3) NOT NULL,
  min_order_amount NUMERIC(10,3),
  max_uses INT,
  used_count INT NOT NULL DEFAULT 0,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ========================
-- PRODUCT REVIEWS
-- ========================

CREATE TABLE aurelia_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES aurelia_products(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES aurelia_customers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  body TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_aurelia_reviews_product ON aurelia_reviews(product_id);

-- ========================
-- BLOG POSTS
-- ========================

CREATE TABLE aurelia_blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  author_id UUID REFERENCES aurelia_admin_users(id) ON DELETE SET NULL,

  title_fr TEXT NOT NULL,
  title_en TEXT,
  title_ar TEXT,

  content_fr TEXT,
  content_en TEXT,
  content_ar TEXT,

  excerpt_fr TEXT,
  excerpt_en TEXT,
  excerpt_ar TEXT,

  category_fr TEXT,
  category_en TEXT,
  category_ar TEXT,

  image_url TEXT,
  read_time INT NOT NULL DEFAULT 5,
  is_published BOOLEAN NOT NULL DEFAULT false,

  seo_title TEXT,
  seo_description TEXT,

  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_aurelia_blog_posts_slug ON aurelia_blog_posts(slug);

-- ========================
-- BLOG TAGS
-- ========================

CREATE TABLE aurelia_blog_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES aurelia_blog_posts(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  UNIQUE(post_id, tag)
);

-- ========================
-- NEWSLETTER SUBSCRIBERS
-- ========================

CREATE TABLE aurelia_newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  source TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ
);

-- ========================
-- FAVORITES / WISHLIST
-- ========================

CREATE TABLE aurelia_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES aurelia_customers(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES aurelia_products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(customer_id, product_id)
);

-- ========================
-- CART (persistent)
-- ========================

CREATE TABLE aurelia_cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES aurelia_customers(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES aurelia_products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(customer_id, product_id)
);

-- ========================
-- VISITOR SESSIONS (analytics)
-- ========================

CREATE TABLE aurelia_visitor_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL,
  ip_address TEXT,
  device aurelia_device_type,
  browser TEXT,
  os TEXT,
  country TEXT,
  city TEXT,
  referrer_source TEXT,
  landing_page TEXT,
  pages_viewed INT NOT NULL DEFAULT 0,
  duration_seconds INT NOT NULL DEFAULT 0,
  is_bounce BOOLEAN NOT NULL DEFAULT false,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_aurelia_visitor_sessions_started ON aurelia_visitor_sessions(started_at);

-- ========================
-- PAGE VIEWS (analytics detail)
-- ========================

CREATE TABLE aurelia_page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES aurelia_visitor_sessions(id) ON DELETE CASCADE,
  page_path TEXT NOT NULL,
  page_title TEXT,
  time_on_page_seconds INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_aurelia_page_views_session ON aurelia_page_views(session_id);

-- ========================
-- INVENTORY LOG
-- ========================

CREATE TABLE aurelia_inventory_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES aurelia_products(id) ON DELETE CASCADE,
  change_amount INT NOT NULL,
  reason TEXT NOT NULL,
  reference_id UUID,
  created_by UUID REFERENCES aurelia_admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_aurelia_inventory_log_product ON aurelia_inventory_log(product_id);

-- ========================
-- SETTINGS (key-value store)
-- ========================

CREATE TABLE aurelia_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  updated_by UUID REFERENCES aurelia_admin_users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ========================
-- NOTIFICATIONS
-- ========================

CREATE TABLE aurelia_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES aurelia_admin_users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_aurelia_notifications_user ON aurelia_notifications(admin_user_id);

-- ========================
-- SHIPPING ZONES
-- ========================

CREATE TABLE aurelia_shipping_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  countries TEXT[] NOT NULL DEFAULT '{}',
  base_cost NUMERIC(10,3) NOT NULL DEFAULT 0,
  free_threshold NUMERIC(10,3),
  estimated_days_min INT,
  estimated_days_max INT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ========================
-- ACTIVITY LOG (audit trail)
-- ========================

CREATE TABLE aurelia_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES aurelia_admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_aurelia_activity_log_user ON aurelia_activity_log(admin_user_id);
CREATE INDEX idx_aurelia_activity_log_entity ON aurelia_activity_log(entity_type, entity_id);
