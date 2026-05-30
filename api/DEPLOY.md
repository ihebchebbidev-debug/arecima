# Arecima API — deploy checklist

## 1. Upload files

Upload the whole `api/` folder to your server, e.g. `public_html/arecima/api/`.

## 2. Create MySQL database

In cPanel / phpMyAdmin:

1. Create a database and user with full rights.
2. Import `aurelia_database.sql` (24 tables, indexes, admin, shipping, 3 sample products, coupon WELCOME10, settings).

## 3. Configure database

```bash
cp config.local.php.example config.local.php
```

Edit `config.local.php` with your DB host, name, user, password.

## 4. Permissions

```bash
chmod 755 api/uploads
```

`api/uploads/` must be writable by PHP for product images.

## 5. Test

Open in browser:

`https://YOUR-DOMAIN/arecima/api/health.php`

You should see `"database": "connected"` and `"success": true`.

## 6. Admin login

| Field | Value |
|-------|--------|
| URL | `/admin` on your React site |
| Identifiant | `Admin` |
| Password | `Admin@2026` |

Change the password after first login.

## 7. Frontend API URL

Build the React app with the API on the same domain, or set in `.env`:

```
VITE_API_URL=https://YOUR-DOMAIN/arecima/api
```

## Endpoints used by the shop

| Endpoint | Used for |
|----------|----------|
| `products.php` | Catalog |
| `categories.php` | Categories |
| `orders.php` POST | Checkout |
| `coupons.php?code=` | Discount codes |
| `newsletter.php` POST | Newsletter |
| `blog.php` | Blog |
| `analytics.php` POST | Visitor stats |
| `tracking.php` GET | Facebook Pixel config (public, storefront) |
| `reviews.php?featured=1` | Homepage testimonials |
| `settings.php` PUT | Admin settings (Facebook Pixel, etc.) |
| `auth.php` | Admin login |

## Facebook Pixel

1. Admin → **Intégrations** → enable + paste Pixel ID → Save.
2. Upload **`tracking.php`** to the server (required — storefront reads config from here).
3. Verify: `https://YOUR-DOMAIN/arecima/api/tracking.php` → `{"success":true,"data":{"enabled":...}}`
4. Test with [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper) on the shop.

If `tracking.php` returns **404**, the pixel will never load on the storefront.

## Troubleshooting

- **Database connection failed** — check `config.local.php`.
- **CORS errors** — host frontend and API on same domain, or set `CORS_ALLOWED_ORIGINS`.
- **Upload failed** — chmod `api/uploads` to 755 or 775.
- **Order fails / product not found** — product IDs in DB are 32-character hex; add products in admin, don’t rely on mock IDs from the dev preview.
