import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { resolveImage, getProductApiId } from '@/lib/productAdapter';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { trackInitiateCheckout, trackPurchase } from '@/lib/facebookPixel';
import SEOHead from '@/components/SEOHead';

const Checkout = () => {
  const { t, tf, language } = useLanguage();
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Controlled form state — survives across steps (step-1 inputs unmount on step 2/3).
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', zip: '', country: 'Tunisia',
  });
  const setField = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(s => ({ ...s, [k]: e.target.value }));

  // Coupon
  const [couponOpen, setCouponOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const checkoutTrackedRef = useRef(false);

  const shippingCost = totalPrice >= 150 ? 0 : 7;
  const discount = appliedCoupon?.discount || 0;
  const finalTotal = Math.max(0, totalPrice + shippingCost - discount);

  useEffect(() => {
    if (items.length === 0 || checkoutTrackedRef.current) return;
    checkoutTrackedRef.current = true;
    trackInitiateCheckout(items, finalTotal);
  }, [items, finalTotal]);

  const submitOrder = async () => {
    const customer_name = `${form.firstName} ${form.lastName}`.trim();
    const payload = {
      customer_name,
      customer_email: form.email.trim(),
      customer_phone: form.phone.trim(),
      payment_method: 'cod',
      shipping_address: form.address.trim(),
      shipping_city: form.city.trim(),
      shipping_country: form.country || 'Tunisia',
      shipping_postal_code: form.zip.trim(),
      coupon_code: appliedCoupon?.code || null,
      notes: null,
      items: items.map(i => ({
        product_id: getProductApiId(i.product),
        product_name: i.product.name[language] || i.product.name.fr,
        quantity: i.quantity,
      })),
    };

    setSubmitting(true);
    const res = await api.createOrder(payload);
    setSubmitting(false);

    if (res.success && res.data) {
      const orderData = res.data as { order_number?: string; total?: number };
      const orderNum = orderData.order_number || '';
      trackPurchase(orderNum, items, Number(orderData.total ?? finalTotal));
      toast.success(tf('checkout.orderConfirmed', { n: orderNum }));
      clearCart();
      navigate('/');
    } else {
      toast.error(res.error || t('checkout.orderFailed'));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      // Manually validate the controlled fields before advancing.
      const required: Array<keyof typeof form> = ['firstName', 'lastName', 'email', 'phone', 'address', 'city'];
      for (const k of required) {
        if (!form[k].trim()) { toast.error(t('checkout.validationError')); return; }
      }
      if (!/^\S+@\S+\.\S+$/.test(form.email)) { toast.error(t('checkout.validationError')); return; }
      if (!/^\+?[0-9 ]{8,16}$/.test(form.phone)) { toast.error(t('checkout.validationError')); return; }
    }
    if (step < 3) {
      setStep(step + 1);
    } else {
      submitOrder();
    }
  };

  const applyCoupon = async () => {
    const code = couponCode.trim();
    if (!code) return;
    setCouponLoading(true);
    try {
      const res = await api.validateCoupon(code);
      if (res.success && res.data) {
        const c: any = res.data;
        // Enforce min order amount client-side to avoid surprising the user at submission.
        if (c.min_order_amount && totalPrice < Number(c.min_order_amount)) {
          toast.error(`${t('checkout.invalidCoupon')} — min ${Number(c.min_order_amount).toFixed(2)} ${t('general.currency')}`);
          return;
        }
        const isPercent = c.discount_type === 'percent' || c.discount_type === 'percentage';
        const value = Number(c.discount_value || 0);
        let discount = isPercent ? totalPrice * (value / 100) : value;
        discount = Math.min(discount, totalPrice);
        setAppliedCoupon({ code, discount });
        toast.success(tf('checkout.codeApplied', { v: discount.toFixed(2), c: t('general.currency') }));
      } else {
        toast.error(t('checkout.invalidCoupon'));
      }
    } catch {
      toast.error(t('checkout.validationError'));
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-20">
        <SEOHead title={t('checkout.title')} description="Secure checkout — Arecima" noindex />
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gold/10 blur-2xl rounded-full" />
          <div className="relative w-24 h-24 rounded-full bg-champagne flex items-center justify-center border border-gold/20">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-gold">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
        </div>
        <h1 className="font-display text-2xl lg:text-3xl mb-3">{t('cart.empty')}</h1>
        <p className="font-body text-sm text-muted-foreground mb-6 max-w-sm">
          {t('checkout.addBeforeCheckout')}
        </p>
        <button
          onClick={() => navigate('/products')}
          className="px-8 py-3.5 font-body text-xs tracking-[0.25em] uppercase bg-charcoal text-primary-foreground hover:bg-gold transition-colors"
        >
          {t('cart.continueShopping')}
        </button>
      </main>
    );
  }

  const steps = [
    { num: 1, label: t('checkout.shipping') },
    { num: 2, label: t('checkout.payment') },
    { num: 3, label: t('checkout.review') },
  ];

  const continueLabel = t('checkout.continue');

  return (
    <main className="min-h-screen">
      <SEOHead title={t('checkout.title')} description="Secure checkout — Arecima hair care" noindex />

      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <h1 className="font-display text-3xl lg:text-4xl mb-3 text-center">{t('checkout.title')}</h1>

        <p className="text-center font-body text-sm text-muted-foreground mb-8">
          {t('checkout.amountDue')}{' '}
          <span className="font-display text-lg text-foreground">{finalTotal.toFixed(2)} {t('general.currency')}</span>
          {shippingCost === 0 && totalPrice > 0 && (
            <span className="ml-2 text-gold font-body text-xs tracking-wider uppercase">
              · {t('checkout.freeShipping')}
            </span>
          )}
        </p>

        {/* Steps */}
        <div className="flex items-center justify-center gap-4 mb-12 max-w-lg mx-auto">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2 flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-body text-xs transition-colors ${
                  step >= s.num ? 'bg-gold' : 'bg-secondary text-muted-foreground'
                }`} style={step >= s.num ? { color: 'hsl(30, 10%, 12%)' } : undefined}>
                  {step > s.num ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                  ) : s.num}
                </div>
                <span className="hidden md:block font-body text-[10px] tracking-wider mt-2 text-center">{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className={`w-full h-px mt-[-20px] md:mt-[-28px] ${step > s.num ? 'bg-gold' : 'bg-border'}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} noValidate>
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="font-display text-xl mb-4">{t('checkout.shipping')}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-body text-xs tracking-wider text-muted-foreground block mb-1.5">{t('checkout.firstName')} *</label>
                      <input value={form.firstName} onChange={setField('firstName')} type="text" required maxLength={80} className="w-full px-4 py-3 border border-border bg-background font-body text-sm focus:outline-none focus:border-gold transition-colors" />
                    </div>
                    <div>
                      <label className="font-body text-xs tracking-wider text-muted-foreground block mb-1.5">{t('checkout.lastName')} *</label>
                      <input value={form.lastName} onChange={setField('lastName')} type="text" required maxLength={80} className="w-full px-4 py-3 border border-border bg-background font-body text-sm focus:outline-none focus:border-gold transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="font-body text-xs tracking-wider text-muted-foreground block mb-1.5">{t('checkout.email')} *</label>
                    <input value={form.email} onChange={setField('email')} type="email" required maxLength={160} className="w-full px-4 py-3 border border-border bg-background font-body text-sm focus:outline-none focus:border-gold transition-colors" />
                  </div>
                  <div>
                    <label className="font-body text-xs tracking-wider text-muted-foreground block mb-1.5">{t('checkout.phone')} *</label>
                    <input
                      value={form.phone}
                      onChange={setField('phone')}
                      type="tel"
                      required
                      maxLength={20}
                      pattern="^\+?[0-9 ]{8,16}$"
                      className="w-full px-4 py-3 border border-border bg-background font-body text-sm focus:outline-none focus:border-gold transition-colors"
                      placeholder="+216 XX XXX XXX"
                    />
                    <p className="font-body text-[10px] text-muted-foreground mt-1">
                      {t('checkout.phoneHint')}
                    </p>
                  </div>
                  <div>
                    <label className="font-body text-xs tracking-wider text-muted-foreground block mb-1.5">{t('checkout.address')} *</label>
                    <input value={form.address} onChange={setField('address')} type="text" required maxLength={240} className="w-full px-4 py-3 border border-border bg-background font-body text-sm focus:outline-none focus:border-gold transition-colors" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="font-body text-xs tracking-wider text-muted-foreground block mb-1.5">{t('checkout.city')} *</label>
                      <input value={form.city} onChange={setField('city')} type="text" required maxLength={120} className="w-full px-4 py-3 border border-border bg-background font-body text-sm focus:outline-none focus:border-gold transition-colors" />
                    </div>
                    <div>
                      <label className="font-body text-xs tracking-wider text-muted-foreground block mb-1.5">{t('checkout.zip')}</label>
                      <input value={form.zip} onChange={setField('zip')} type="text" maxLength={20} className="w-full px-4 py-3 border border-border bg-background font-body text-sm focus:outline-none focus:border-gold transition-colors" />
                    </div>
                    <div>
                      <label className="font-body text-xs tracking-wider text-muted-foreground block mb-1.5">{t('checkout.country')}</label>
                      <select value={form.country} onChange={setField('country')} className="w-full px-4 py-3 border border-border bg-background font-body text-sm focus:outline-none focus:border-gold transition-colors">
                        <option value="Tunisia">{t('checkout.tunisia')}</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="font-display text-xl mb-4">{t('checkout.payment')}</h2>
                  <div className="border border-gold p-6 bg-gold/5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-5 h-5 rounded-full border-2 border-gold flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-gold" />
                      </div>
                      <span className="font-body text-sm font-medium">
                        {t('checkout.cod')}
                      </span>
                      <span className="ml-auto font-body text-[10px] tracking-wider uppercase text-gold">
                        {t('checkout.available')}
                      </span>
                    </div>
                    <p className="font-body text-xs text-muted-foreground ml-8">
                      {t('checkout.codDesc')}
                    </p>
                  </div>
                  <p className="font-body text-[11px] text-muted-foreground text-center pt-2">
                    {t('checkout.cardSoon')}
                  </p>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="font-display text-xl mb-4">{t('checkout.review')}</h2>
                  <div className="space-y-4">
                    {items.map(item => (
                      <div key={item.product.id} className="flex gap-4 pb-4 border-b border-border">
                        <img src={resolveImage(item.product.image)} alt={item.product.name[language]} className="w-20 h-20 object-cover" loading="lazy" />
                        <div className="flex-1">
                          <h4 className="font-display text-sm">{item.product.name[language]}</h4>
                          <p className="font-body text-xs text-muted-foreground">{item.product.size} — x{item.quantity}</p>
                        </div>
                        <p className="font-body text-sm font-medium">{item.product.price * item.quantity} {t('general.currency')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-8 w-full py-4 font-body text-xs tracking-[0.2em] uppercase bg-charcoal text-primary-foreground hover:bg-gold transition-colors disabled:opacity-60"
              >
                {submitting
                  ? t('checkout.submitting')
                  : step === 3 ? `${t('checkout.placeOrder')} · ${finalTotal.toFixed(2)} ${t('general.currency')}` : continueLabel}
              </button>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                <span className="flex items-center gap-1.5 font-body text-[10px] text-muted-foreground tracking-wider">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="hsl(38, 72%, 52%)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  {t('checkout.trustSecure')}
                </span>
                <span className="flex items-center gap-1.5 font-body text-[10px] text-muted-foreground tracking-wider">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="hsl(38, 72%, 52%)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  {t('checkout.trustData')}
                </span>
                <span className="flex items-center gap-1.5 font-body text-[10px] text-muted-foreground tracking-wider">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="hsl(38, 72%, 52%)" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  {t('checkout.trustGuarantee')}
                </span>
              </div>

              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="mt-3 w-full py-3 font-body text-xs tracking-wider text-muted-foreground hover:text-foreground text-center transition-colors"
                >
                  ← {t('checkout.back')}
                </button>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-champagne p-7 lg:p-8 sticky top-24 border border-gold/15 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gold/10 to-transparent pointer-events-none" />

              <div className="flex items-center gap-3 mb-6">
                <span className="h-px flex-1 bg-gold/40" />
                <h3 className="font-display text-xs tracking-[0.2em] uppercase">{t('checkout.orderSummary')}</h3>
                <span className="h-px flex-1 bg-gold/40" />
              </div>

              <div className="space-y-3 mb-5 max-h-64 overflow-y-auto pr-1">
                {items.map(item => (
                  <div key={item.product.id} className="flex gap-3 items-start">
                    <div className="relative shrink-0">
                      <img src={resolveImage(item.product.image)} alt={item.product.name[language]} className="w-14 h-14 object-cover bg-background" loading="lazy" />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-charcoal text-primary-foreground text-[10px] font-body flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-xs leading-snug line-clamp-2">{item.product.name[language]}</p>
                      <p className="font-body text-[10px] text-muted-foreground tracking-wider mt-0.5">{item.product.size}</p>
                    </div>
                    <p className="font-body text-xs font-medium tabular-nums whitespace-nowrap">
                      {item.product.price * item.quantity} {t('general.currency')}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-gold/20 mb-4">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                  <span className="tabular-nums">{totalPrice} {t('general.currency')}</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">{t('cart.shipping')}</span>
                  <span className={shippingCost === 0 ? 'text-gold font-medium' : 'tabular-nums'}>{shippingCost === 0 ? t('cart.free') : `${shippingCost} ${t('general.currency')}`}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between font-body text-sm text-gold">
                    <span className="flex items-center gap-1">
                      {t('checkout.discount')} ({appliedCoupon.code})
                      <button type="button" onClick={removeCoupon} className="text-muted-foreground hover:text-destructive ml-1" aria-label={t('checkout.removeCoupon')}>×</button>
                    </span>
                    <span className="tabular-nums">−{appliedCoupon.discount.toFixed(2)} {t('general.currency')}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-baseline pt-4 border-t border-gold/30">
                <span className="font-display text-lg">{t('cart.total')}</span>
                <span className="font-display text-2xl tabular-nums">
                  {finalTotal.toFixed(2)} <span className="text-sm text-muted-foreground">{t('general.currency')}</span>
                </span>
              </div>

              {/* Coupon */}
              <div className="mt-5 pt-4 border-t border-gold/20">
                {!appliedCoupon && (
                  <>
                    <button
                      type="button"
                      onClick={() => setCouponOpen(o => !o)}
                      className="font-body text-xs tracking-wider text-muted-foreground hover:text-gold transition-colors flex items-center gap-1.5"
                    >
                      <span className="text-gold">{couponOpen ? '−' : '+'}</span>
                      {t('checkout.havePromo')}
                    </button>
                    {couponOpen && (
                      <div className="mt-3 flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={e => setCouponCode(e.target.value.toUpperCase())}
                          placeholder={t('checkout.promoPlaceholder')}
                          className="flex-1 min-w-0 px-3 py-2 border border-border bg-background font-body text-xs tracking-wider focus:outline-none focus:border-gold uppercase"
                        />
                        <button
                          type="button"
                          onClick={applyCoupon}
                          disabled={couponLoading || !couponCode.trim()}
                          className="px-4 py-2 font-body text-[10px] tracking-[0.15em] uppercase bg-charcoal text-primary-foreground hover:bg-gold transition-colors disabled:opacity-50"
                        >
                          {couponLoading ? '…' : t('checkout.apply')}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
