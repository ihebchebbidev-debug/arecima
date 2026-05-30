import { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Check, Truck, ShieldCheck, MapPin, Minus, Plus, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useApiProduct, useApiProducts } from '@/hooks/useApiProducts';
import { resolveImage } from '@/lib/productAdapter';
import ProductCard from '@/components/ProductCard';
import SEOHead from '@/components/SEOHead';
import { SITE_URL, siteProductUrl, sitePath } from '@/lib/site';
import { trackViewContent, trackAddToWishlist } from '@/lib/facebookPixel';
import ProductAttributes from '@/components/product/ProductAttributes';
import PairItWith from '@/components/product/PairItWith';
import FeaturedTestimonial from '@/components/product/FeaturedTestimonial';
import ProductFAQ from '@/components/product/ProductFAQ';
import BeforeAfter from '@/components/product/BeforeAfter';

const ProductDetail = () => {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'howToUse'>('description');
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  const { product, loading } = useApiProduct(id);
  const { products: allProducts } = useApiProducts();
  const viewedProductRef = useRef<string | null>(null);

  useEffect(() => {
    if (!product || viewedProductRef.current === product.id) return;
    viewedProductRef.current = product.id;
    trackViewContent(product);
  }, [product]);

  const gallery = useMemo(() => {
    if (!product) return [];
    const list = (product.images && product.images.length ? product.images : [product.image]).map(resolveImage);
    return Array.from(new Set(list));
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground">Loading</p>
        </div>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="font-display text-2xl">Product not found</p>
        <Link to="/products" className="font-body text-xs tracking-[0.2em] uppercase text-gold hover:underline underline-offset-4">Browse our collection</Link>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const relatedProducts = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const productSchema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name.en,
      description: product.description.en,
      image: resolveImage(product.image),
      brand: { '@type': 'Brand', name: 'Arecima' },
      sku: product.id,
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'TND',
        availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        url: siteProductUrl(product.id),
        seller: { '@type': 'Organization', name: 'Arecima' }
      },
      ...(product.reviewCount > 0 ? {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviewCount,
          bestRating: 5,
          worstRating: 1
        }
      } : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Products', item: sitePath('/products') },
        { '@type': 'ListItem', position: 3, name: product.name.en, item: siteProductUrl(product.id) },
      ]
    }
  ];

  return (
    <main className="min-h-screen">
      <SEOHead
        title={product.name[language]}
        description={product.shortDescription[language]}
        type="product"
        schema={productSchema}
      />

      {/* Breadcrumb */}
      <nav className="container mx-auto px-4 lg:px-8 pt-6 pb-2 lg:pt-8" aria-label="Breadcrumb">
        <ol className="font-body text-[11px] tracking-wide text-muted-foreground flex items-center flex-wrap gap-1.5" itemScope itemType="https://schema.org/BreadcrumbList">
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link to="/" className="hover:text-gold transition-colors" itemProp="item"><span itemProp="name">{t('nav.home')}</span></Link>
            <meta itemProp="position" content="1" />
          </li>
          <ChevronRight className="h-3 w-3 opacity-50" />
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link to="/products" className="hover:text-gold transition-colors" itemProp="item"><span itemProp="name">{t('nav.products')}</span></Link>
            <meta itemProp="position" content="2" />
          </li>
          <ChevronRight className="h-3 w-3 opacity-50" />
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="truncate max-w-[180px] sm:max-w-none">
            <span className="text-foreground font-medium" itemProp="name">{product.name[language]}</span>
            <meta itemProp="position" content="3" />
          </li>
        </ol>
      </nav>

      {/* Product */}
      <div className="container mx-auto px-4 lg:px-8 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-16 xl:gap-20">
          {/* Gallery */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="lg:sticky lg:top-24">
              <div className="aspect-square bg-gradient-to-br from-champagne/40 via-secondary/30 to-champagne/20 overflow-hidden relative group rounded-sm">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    src={gallery[activeImage] || resolveImage(product.image)}
                    alt={`${product.name[language]} — Arecima ${product.size}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    width={1000}
                    height={1000}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                </AnimatePresence>
                {/* Subtle inner highlight */}
                <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-foreground/[0.04]" />
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isBestSeller && (
                    <span className="font-body text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 bg-charcoal text-champagne shadow-md">Best Seller</span>
                  )}
                  {product.isNew && (
                    <span className="font-body text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 bg-gold text-primary-foreground shadow-md">New</span>
                  )}
                  {product.originalPrice && (
                    <span className="font-body text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 bg-destructive text-destructive-foreground shadow-md">
                      −{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              {gallery.length > 1 && (
                <div className="mt-4 grid grid-cols-5 gap-2 sm:gap-3">
                  {gallery.slice(0, 5).map((src, i) => (
                    <button
                      key={src + i}
                      onClick={() => setActiveImage(i)}
                      aria-label={`View image ${i + 1}`}
                      className={`aspect-square overflow-hidden rounded-sm relative transition-all ${
                        activeImage === i ? 'ring-2 ring-gold ring-offset-2 ring-offset-background' : 'opacity-70 hover:opacity-100 ring-1 ring-border'
                      }`}
                    >
                      <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}

              {/* Before / After interactive slider */}
              <div className="mt-5 lg:mt-6">
                <BeforeAfter />
              </div>
            </div>
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px flex-none w-8 bg-gold" />
              <p className="font-body text-[10px] tracking-[0.35em] uppercase text-gold">ARECIMA</p>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] mb-4">{product.name[language]}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex gap-0.5" aria-label={`${product.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill={i < Math.round(product.rating) ? 'hsl(38, 72%, 52%)' : 'none'} stroke="hsl(38, 72%, 52%)" strokeWidth="1.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span className="font-body text-xs text-muted-foreground">
                <span className="text-foreground font-medium">{product.rating}</span> · {product.reviewCount.toLocaleString()} {t('detail.reviews')}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-border/60">
              <span className="font-display text-3xl lg:text-4xl text-foreground">{product.price}<span className="font-body text-base text-muted-foreground ml-1.5">{t('general.currency')}</span></span>
              {product.originalPrice && (
                <span className="font-body text-base text-muted-foreground line-through">{product.originalPrice} {t('general.currency')}</span>
              )}
            </div>

            <p className="font-body text-[15px] leading-relaxed text-muted-foreground mb-7">{product.shortDescription[language]}</p>

            {/* Stock & Size */}
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <div className="flex items-center gap-2">
                <span className={`relative flex h-2 w-2`}>
                  {product.inStock && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${product.inStock ? 'bg-green-500' : 'bg-destructive'}`} />
                </span>
                <span className="font-body text-xs tracking-[0.1em] uppercase font-medium">{product.inStock ? t('detail.inStock') : t('detail.outOfStock')}</span>
              </div>
              {product.size && (
                <>
                  <span className="font-body text-xs text-border">|</span>
                  <span className="font-body text-xs text-muted-foreground tracking-wide">{product.size}</span>
                </>
              )}
            </div>

            {/* Quantity + Add to Cart + Wishlist */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex items-center border border-border bg-background">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3.5 hover:bg-secondary transition-colors" aria-label="Decrease quantity">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-5 py-3.5 font-display text-base min-w-[56px] text-center border-x border-border">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="p-3.5 hover:bg-secondary transition-colors" aria-label="Increase quantity">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={handleAdd}
                disabled={!product.inStock}
                className="group relative flex-1 py-4 font-body text-xs tracking-[0.25em] uppercase bg-charcoal text-primary-foreground hover:bg-gold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-md hover:shadow-gold"
              >
                <span className={`flex items-center justify-center gap-2 transition-all ${added ? 'opacity-0 -translate-y-2' : ''}`}>
                  {t('detail.addToCart')}
                  <span className="font-display text-sm normal-case tracking-normal opacity-70">· {(product.price * quantity).toFixed(0)} {t('general.currency')}</span>
                </span>
                <span className={`absolute inset-0 flex items-center justify-center gap-2 transition-all ${added ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                  <Check className="h-4 w-4" /> {language === 'fr' ? 'Ajouté' : language === 'ar' ? 'تمت الإضافة' : 'Added'}
                </span>
              </button>
              <button
                onClick={() => {
                  if (!isFavorite(product.id)) trackAddToWishlist(product);
                  toggleFavorite(product.id);
                }}
                className="p-4 border border-border hover:border-gold hover:bg-gold/5 transition-all"
                aria-label={isFavorite(product.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              >
                <Heart
                  className={`h-[18px] w-[18px] transition-all ${isFavorite(product.id) ? 'fill-gold text-gold scale-110' : 'text-foreground'}`}
                />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 pb-8 border-b border-border/60">
              {[
                { icon: Truck, label: t('detail.freeShipping') },
                { icon: ShieldCheck, label: language === 'fr' ? 'Paiement sécurisé' : language === 'ar' ? 'دفع آمن' : 'Secure payment' },
                { icon: MapPin, label: language === 'fr' ? 'Expédié de Tunisie' : language === 'ar' ? 'يُشحن من تونس' : 'Shipped from Tunisia' },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2.5 p-3 bg-champagne/30 rounded-sm">
                  <b.icon className="h-4 w-4 text-gold flex-none" strokeWidth={1.5} />
                  <span className="font-body text-[11px] text-foreground/80 leading-tight">{b.label}</span>
                </div>
              ))}
            </div>

            {/* Product Attributes — quick-scan trust icons */}
            <ProductAttributes />

            {product.benefits[language].length > 0 && (
              <div className="mb-8">
                <h2 className="font-display text-lg mb-4 flex items-center gap-3">
                  <span className="text-gold">✦</span>
                  {t('detail.whyLoveIt')}
                </h2>
                <ul className="space-y-2.5">
                  {product.benefits[language].map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1 flex-none w-5 h-5 rounded-full bg-gold/15 flex items-center justify-center">
                        <Check className="h-3 w-3 text-gold" strokeWidth={2.5} />
                      </span>
                      <span className="font-body text-sm leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pair it with — cross-sell upsell */}
            <PairItWith products={relatedProducts.slice(0, 3)} />

            {/* Tabs */}
            <div className="border-t border-border pt-6 mt-2">
              <div className="flex gap-6 mb-5 border-b border-border/40">
                {(['description', 'ingredients', 'howToUse'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative font-body text-[11px] tracking-[0.2em] uppercase pb-3 transition-colors ${
                      activeTab === tab ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {t(`detail.${tab}`)}
                    {activeTab === tab && (
                      <motion.span layoutId="tab-underline" className="absolute -bottom-px left-0 right-0 h-[2px] bg-gold" />
                    )}
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="font-body text-[15px] leading-[1.7] text-muted-foreground"
                >
                  {activeTab === 'description' && <p>{product.description[language]}</p>}
                  {activeTab === 'ingredients' && <p>{product.ingredients[language]}</p>}
                  {activeTab === 'howToUse' && <p>{product.howToUse[language]}</p>}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Featured pull-quote testimonial */}
      <FeaturedTestimonial />

      {/* Product-specific FAQ */}
      <ProductFAQ productName={product.name[language]} />

      <div className="container mx-auto px-4 lg:px-8 pb-16 lg:pb-24">
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="pt-4 lg:pt-8 border-t border-border">
            <div className="text-center mb-10 lg:mb-14">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="h-px w-10 bg-gold/40" />
                <span className="text-gold text-xs">✦</span>
                <span className="h-px w-10 bg-gold/40" />
              </div>
              <p className="font-body text-[10px] tracking-[0.35em] uppercase text-gold mb-3">{language === 'fr' ? 'À DÉCOUVRIR' : language === 'ar' ? 'اكتشف المزيد' : 'DISCOVER MORE'}</p>
              <h2 className="font-display text-3xl lg:text-4xl">{t('detail.relatedProducts')}</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default ProductDetail;
