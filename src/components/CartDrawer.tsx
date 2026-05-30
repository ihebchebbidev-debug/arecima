import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { resolveImage } from '@/lib/productAdapter';

const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice } = useCart();
  const { t, language } = useLanguage();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground z-[70]"
            onClick={() => setIsCartOpen(false)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-background z-[80] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display text-xl">{t('cart.title')}</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-1 text-foreground">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-muted-foreground mb-4">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  <p className="font-body text-muted-foreground mb-6">{t('cart.empty')}</p>
                  <Link
                    to="/products"
                    onClick={() => setIsCartOpen(false)}
                    className="font-body text-xs tracking-[0.15em] uppercase text-gold hover:underline"
                  >
                    {t('cart.continueShopping')}
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map(item => (
                    <div key={item.product.id} className="flex gap-4">
                      <img
                        src={resolveImage(item.product.image)}
                        alt={item.product.name[language]}
                        className="w-20 h-20 object-cover"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display text-sm mb-1">{item.product.name[language]}</h4>
                        <p className="font-body text-xs text-muted-foreground mb-2">{item.product.size}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-border">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="px-2 py-1 font-body text-xs hover:bg-secondary"
                            >−</button>
                            <span className="px-2 py-1 font-body text-xs min-w-[24px] text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="px-2 py-1 font-body text-xs hover:bg-secondary"
                            >+</button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="font-body text-[10px] tracking-wider text-muted-foreground hover:text-destructive uppercase"
                          >
                            {t('cart.remove')}
                          </button>
                        </div>
                      </div>
                      <p className="font-body text-sm font-medium">{item.product.price} {t('general.currency')}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="font-body text-sm">{t('cart.subtotal')}</span>
                  <span className="font-body text-sm font-medium">{totalPrice} {t('general.currency')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-sm">{t('cart.shipping')}</span>
                  <span className="font-body text-sm text-gold">{totalPrice >= 150 ? t('cart.free') : `7 ${t('general.currency')}`}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-border">
                  <span className="font-display text-lg">{t('cart.total')}</span>
                  <span className="font-display text-lg">{totalPrice >= 150 ? totalPrice : totalPrice + 7} {t('general.currency')}</span>
                </div>
                <Link
                  to="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="block w-full py-3.5 text-center font-body text-xs tracking-[0.2em] uppercase bg-charcoal text-primary-foreground hover:bg-gold transition-colors"
                >
                  {t('cart.checkout')}
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
