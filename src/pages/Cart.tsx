import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { resolveImage } from '@/lib/productAdapter';
import SEOHead from '@/components/SEOHead';

const Cart = () => {
  const { t, language } = useLanguage();
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

  const shippingCost = totalPrice >= 150 ? 0 : 7;
  const finalTotal = totalPrice + shippingCost;
  const freeShippingProgress = Math.min(100, (totalPrice / 150) * 100);
  const remainingForFreeShipping = Math.max(0, 150 - totalPrice);

  if (items.length === 0) {
    return (
      <main className="min-h-screen relative overflow-hidden">
        <SEOHead title={t('cart.title')} description="Your shopping bag" noindex />
        {/* Soft gold radial backdrop */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-20 lg:py-32 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative mb-8"
          >
            <div className="absolute inset-0 bg-gold/10 blur-2xl rounded-full" />
            <div className="relative w-28 h-28 rounded-full bg-champagne flex items-center justify-center border border-gold/20">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-gold">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold/60" />
              <span className="text-gold text-xs">✦</span>
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold/60" />
            </div>
            <h1 className="font-display text-3xl lg:text-4xl mb-4">{t('cart.empty')}</h1>
            <p className="font-body text-sm text-muted-foreground max-w-sm mx-auto mb-8">
              {language === 'fr'
                ? 'Votre rituel de beauté commence ici. Découvrez notre collection de soins luxueux.'
                : language === 'ar'
                ? 'تبدأ طقوس جمالك من هنا. اكتشفي مجموعتنا الفاخرة من العناية بالبشرة.'
                : 'Your beauty ritual begins here. Discover our curated collection of luxurious skincare.'}
            </p>
            <Link
              to="/products"
              className="inline-block px-10 py-4 font-body text-xs tracking-[0.25em] uppercase bg-charcoal text-primary-foreground hover:bg-gold transition-colors"
            >
              {t('cart.continueShopping')}
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <SEOHead title={t('cart.title')} description="Your shopping bag — Arecima" noindex />

      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold/60" />
            <span className="text-gold text-xs tracking-[0.3em] uppercase font-body">{t('cart.title')}</span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold/60" />
          </div>
          <h1 className="font-display text-3xl lg:text-4xl">
            {items.length} {items.length === 1
              ? (language === 'fr' ? 'article' : language === 'ar' ? 'منتج' : 'item')
              : (language === 'fr' ? 'articles' : language === 'ar' ? 'منتجات' : 'items')}
          </h1>
        </div>

        {/* Free shipping progress */}
        {shippingCost > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-10 bg-champagne/60 border border-gold/20 px-5 py-4"
          >
            <div className="flex items-center justify-between font-body text-xs mb-2">
              <span className="tracking-wider">
                {language === 'fr'
                  ? `Plus que ${remainingForFreeShipping} TND pour la livraison offerte`
                  : language === 'ar'
                  ? `أضيفي ${remainingForFreeShipping} د.ت للحصول على شحن مجاني`
                  : `Add ${remainingForFreeShipping} TND more for free shipping`}
              </span>
              <span className="text-gold font-medium">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="h-1 bg-border/60 overflow-hidden rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${freeShippingProgress}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-gold/70 to-gold rounded-full"
              />
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Items */}
          <div className="lg:col-span-2 space-y-5">
            <AnimatePresence mode="popLayout">
              {items.map((item, idx) => (
                <motion.div
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: idx * 0.05, duration: 0.35 }}
                  className="group relative bg-background border border-border hover:border-gold/40 transition-all duration-300 p-4 sm:p-5"
                >
                  <div className="flex gap-3 sm:gap-5">
                    <Link to={`/product/${item.product.id}`} className="shrink-0 overflow-hidden bg-champagne/40">
                      <img
                        src={resolveImage(item.product.image)}
                        alt={item.product.name[language]}
                        className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </Link>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <Link to={`/product/${item.product.id}`} className="min-w-0 flex-1">
                          <h3 className="font-display text-base sm:text-lg hover:text-gold transition-colors line-clamp-2 leading-snug">
                            {item.product.name[language]}
                          </h3>
                          <p className="font-body text-[11px] tracking-wider uppercase text-muted-foreground mt-1">
                            {item.product.size}
                          </p>
                        </Link>
                        <p className="font-display text-base sm:text-lg whitespace-nowrap shrink-0">
                          {item.product.price * item.quantity} <span className="text-xs text-muted-foreground">{t('general.currency')}</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-3 mt-auto pt-3">
                        <div className="flex items-center border border-border bg-background">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center font-body text-sm hover:bg-gold/10 hover:text-gold transition-colors"
                            aria-label="Decrease"
                          >−</button>
                          <span className="w-8 h-8 flex items-center justify-center font-body text-xs border-x border-border tabular-nums">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center font-body text-sm hover:bg-gold/10 hover:text-gold transition-colors"
                            aria-label="Increase"
                          >+</button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="font-body text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1.5"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                          </svg>
                          {t('cart.remove')}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 mt-2 font-body text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-gold transition-colors"
            >
              <span>←</span> {t('cart.continueShopping')}
            </Link>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-champagne p-7 lg:p-8 sticky top-24 border border-gold/15 relative overflow-hidden"
            >
              {/* decorative corner */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gold/10 to-transparent pointer-events-none" />

              <div className="flex items-center gap-3 mb-6">
                <span className="h-px flex-1 bg-gold/40" />
                <h3 className="font-display text-base tracking-wider uppercase text-xs">{t('checkout.orderSummary')}</h3>
                <span className="h-px flex-1 bg-gold/40" />
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                  <span className="tabular-nums">{totalPrice} {t('general.currency')}</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">{t('cart.shipping')}</span>
                  <span className={shippingCost === 0 ? 'text-gold font-medium' : 'tabular-nums'}>
                    {shippingCost === 0 ? t('cart.free') : `${shippingCost} ${t('general.currency')}`}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-5 border-t border-gold/30 mb-6">
                <span className="font-display text-lg">{t('cart.total')}</span>
                <span className="font-display text-2xl tabular-nums">
                  {finalTotal} <span className="text-sm text-muted-foreground">{t('general.currency')}</span>
                </span>
              </div>

              <Link
                to="/checkout"
                className="group relative block w-full py-4 text-center font-body text-xs tracking-[0.25em] uppercase bg-charcoal text-primary-foreground hover:bg-gold transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10">{t('cart.checkout')}</span>
              </Link>

              {/* Trust strip */}
              <div className="mt-6 pt-5 border-t border-gold/20 flex flex-wrap justify-center gap-x-4 gap-y-2">
                <span className="flex items-center gap-1.5 font-body text-[10px] text-muted-foreground tracking-wider">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="hsl(38, 72%, 52%)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  {language === 'fr' ? 'Sécurisé' : language === 'ar' ? 'آمن' : 'Secure'}
                </span>
                <span className="flex items-center gap-1.5 font-body text-[10px] text-muted-foreground tracking-wider">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="hsl(38, 72%, 52%)" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  {language === 'fr' ? 'Garanti' : language === 'ar' ? 'مضمون' : 'Guaranteed'}
                </span>
                <span className="flex items-center gap-1.5 font-body text-[10px] text-muted-foreground tracking-wider">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="hsl(38, 72%, 52%)" strokeWidth="2"><path d="M3 9h18M9 3v6M3 15h18M9 15v6"/></svg>
                  {language === 'fr' ? 'Livraison rapide' : language === 'ar' ? 'توصيل سريع' : 'Fast delivery'}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;
