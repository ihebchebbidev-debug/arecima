import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useMemo } from 'react';
import { Leaf, Sparkles, Flower2, Droplets } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApiProducts, useApiBlogPosts, useApiFeaturedReviews } from '@/hooks/useApiProducts';
import ProductCard from '@/components/ProductCard';
import SEOHead from '@/components/SEOHead';
import WhyArecima from '@/components/home/WhyArecima';
import SkinConcerns from '@/components/home/SkinConcerns';
import UGCGrid from '@/components/home/UGCGrid';
import NewsletterCapture from '@/components/home/NewsletterCapture';
import { Skeleton } from '@/components/ui/skeleton';
import { SITE_URL, siteProductUrl } from '@/lib/site';
import heroBanner from '@/assets/hero-banner.jpg';
import heroBannerMobile from '@/assets/hero-banner-mobile.jpg';
import routineSection from '@/assets/routine-section.jpg';

const FALLBACK_TESTIMONIALS = [
  { key: 'r1', rating: 5 },
  { key: 'r2', rating: 5 },
  { key: 'r3', rating: 5 },
] as const;

const Index = () => {
  const { t, language } = useLanguage();
  const { products, loading: productsLoading } = useApiProducts();
  const { posts: blogPosts } = useApiBlogPosts();
  const { reviews: apiReviews, loading: reviewsLoading } = useApiFeaturedReviews(3);

  const bestSellers = useMemo(() => {
    const flagged = products.filter(p => p.isBestSeller);
    const list = flagged.length > 0 ? flagged : products;
    return list.slice(0, 4);
  }, [products]);

  const latestPosts = blogPosts.slice(0, 3);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const routineSteps = [
    { step: '01', key: 'step1', productSlug: 'soleveil-protect-kpf30' },
    { step: '02', key: 'step2', productSlug: 'silk-shield-spray' },
    { step: '03', key: 'step3', productSlug: 'rituel-cheveux-duo' },
  ];

  const ingredients = [
    { key: 'olive', Icon: Leaf },
    { key: 'gold', Icon: Sparkles },
    { key: 'rose', Icon: Flower2 },
    { key: 'pricklypear', Icon: Droplets },
  ];

  const homeSchema = [
    {
      '@context': 'https://schema.org', '@type': 'WebSite', name: 'Arecima', url: SITE_URL,
      potentialAction: { '@type': 'SearchAction', target: `${SITE_URL}/products?q={search_term_string}`, 'query-input': 'required name=search_term_string' }
    },
    {
      '@context': 'https://schema.org', '@type': 'Organization', name: 'Arecima', url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      sameAs: ['https://instagram.com/arecima.tn', 'https://facebook.com/arecima.tn', 'https://tiktok.com/@arecima.tn'],
      contactPoint: { '@type': 'ContactPoint', telephone: '+216-50-454-000', contactType: 'customer service', availableLanguage: ['French', 'English', 'Arabic'] },
      address: { '@type': 'PostalAddress', addressLocality: 'Tunis', addressCountry: 'TN' }
    },
    {
      '@context': 'https://schema.org', '@type': 'Store', name: 'Arecima', image: `${SITE_URL}/og-image.jpg`,
      url: SITE_URL, telephone: '+216-50-454-000', priceRange: 'TND',
      address: { '@type': 'PostalAddress', addressLocality: 'Tunis', addressCountry: 'TN' },
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Produits', item: `${SITE_URL}/products` },
      ],
    },
    ...(bestSellers.length ? [{
      '@context': 'https://schema.org', '@type': 'ItemList', name: 'Best Sellers',
      itemListElement: bestSellers.map((p, i) => ({
        '@type': 'ListItem', position: i + 1,
        url: siteProductUrl(p.id),
        name: p.name[language] || p.name.fr,
      })),
    }] : []),
  ];

  const showApiReviews = !reviewsLoading && apiReviews.length > 0;

  return (
    <main>
      <SEOHead
        title={language === 'fr' ? 'Soins de Luxe Tunisiens' : language === 'ar' ? 'العناية الفاخرة التونسية' : 'Luxury Tunisian Skincare'}
        description={t('hero.description')}
        schema={homeSchema}
      />

      {/* Hero with Parallax */}
      <section ref={heroRef} className="relative min-h-[68vh] lg:h-[72vh] overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <picture>
            <source media="(max-width: 1023px)" srcSet={heroBannerMobile} />
            <source media="(min-width: 1024px)" srcSet={heroBanner} />
            <img src={heroBanner} alt="Arecima Luxury Skincare — Premium Tunisian beauty products" className="absolute inset-0 w-full h-full object-cover scale-110" width={1920} height={1080} loading="eager" fetchPriority="high" decoding="async" />
          </picture>
        </motion.div>
        <div className="absolute inset-0 lg:hidden" style={{ background: 'linear-gradient(180deg, rgba(12,10,8,0.85) 0%, rgba(12,10,8,0.6) 50%, rgba(12,10,8,0.45) 100%)' }} />
        <div className="absolute inset-0 hidden lg:block" style={{ background: 'linear-gradient(135deg, rgba(12,10,8,0.75) 0%, rgba(12,10,8,0.35) 55%, transparent 100%)' }} />
        <motion.div style={{ opacity: heroOpacity }} className="relative h-full min-h-[68vh] lg:min-h-0 flex items-center py-14 lg:py-0">
          <div className="container mx-auto px-5 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: 'easeOut' }} className="max-w-xl">
              <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="font-body text-[10px] lg:text-xs tracking-[0.35em] lg:tracking-[0.4em] uppercase mb-4 lg:mb-5" style={{ color: 'hsl(28, 50%, 78%)' }}>
                {t('hero.subtitle')}
              </motion.p>
              <h1 className="font-display text-[2.5rem] leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl lg:leading-[1.1] mb-5 lg:mb-6" style={{ color: 'hsl(32, 30%, 97%)' }}>
                {t('hero.title')}
              </h1>
              <div className="w-12 lg:w-16 h-[2px] mb-5 lg:mb-6" style={{ background: 'hsl(25, 50%, 65%)' }} />
              <p className="font-body text-sm lg:text-base leading-relaxed mb-8 lg:mb-10 max-w-md" style={{ color: 'hsl(30, 20%, 88%)' }}>{t('hero.description')}</p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link to="/products" className="group inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-4 font-body text-xs tracking-[0.2em] uppercase bg-charcoal hover:bg-gold transition-all duration-300 hover:shadow-gold shadow-lg" style={{ color: 'hsl(32, 30%, 97%)' }}>
                  {t('hero.cta')}
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
                <a href="#best-sellers" className="inline-flex items-center justify-center px-7 sm:px-8 py-4 font-body text-xs tracking-[0.2em] uppercase border backdrop-blur-sm hover:bg-white/10 transition-all duration-300" style={{ borderColor: 'hsl(28, 50%, 78%)', color: 'hsl(32, 30%, 97%)' }}>{t('hero.secondary')}</a>
              </div>

              <div className="flex items-center gap-5 mt-8 lg:hidden">
                <span className="font-body text-[10px] tracking-[0.15em] uppercase" style={{ color: 'hsl(28, 50%, 78%)' }}>{t('hero.trustRated')}</span>
                <span className="w-px h-3" style={{ background: 'hsl(30, 15%, 50%)' }} />
                <span className="font-body text-[10px] tracking-[0.15em] uppercase" style={{ color: 'hsl(28, 50%, 78%)' }}>{t('hero.trustNatural')}</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2"
        >
          <span className="font-body text-[10px] tracking-[0.2em] uppercase" style={{ color: 'hsl(28, 50%, 78%)' }}>{t('hero.scroll')}</span>
          <div className="w-px h-8" style={{ background: 'linear-gradient(to bottom, hsl(28, 50%, 78%), transparent)' }} />
        </motion.div>
      </section>

      {/* Marquee Trust Banner */}
      <section className="border-y border-border overflow-hidden bg-champagne">
        <div className="flex animate-marquee whitespace-nowrap py-2.5 sm:py-3">
          {Array.from({ length: 3 }).map((_, rep) => (
            <div key={rep} className="flex items-center gap-5 sm:gap-8 mx-5 sm:mx-8">
              {[
                { icon: '✦', text: t('marquee.natural') },
                { icon: '◇', text: t('marquee.crueltyFree') },
                { icon: '❋', text: t('marquee.madeIn') },
                { icon: '▹', text: t('marquee.freeShipping') },
                { icon: '✧', text: t('marquee.returns') },
              ].map((item, i) => (
                <span key={i} className="font-body text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] text-foreground/70 flex items-center gap-2 sm:gap-3">
                  <span className="text-gold text-[11px] sm:text-xs">{item.icon}</span>
                  {item.text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <WhyArecima />

      {/* Best Sellers */}
      <section id="best-sellers" className="container mx-auto px-4 lg:px-8 py-14 lg:py-24 scroll-mt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-8 lg:mb-12 gap-3">
          <div>
            <p className="font-body text-[10px] lg:text-xs tracking-[0.3em] uppercase text-gold mb-2 lg:mb-3">{t('products.subtitle')}</p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl">{t('products.bestSellers')}</h2>
          </div>
          <Link to="/products" className="font-body text-[11px] lg:text-xs tracking-[0.15em] uppercase text-foreground hover:text-gold transition-colors flex items-center gap-2 group self-start lg:self-auto">
            {t('products.all')}
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {productsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[3/4] w-full rounded-sm" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          ) : bestSellers.length > 0 ? (
            bestSellers.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))
          ) : (
            <p className="col-span-full font-body text-sm text-muted-foreground text-center py-12">{t('products.empty')}</p>
          )}
        </div>
      </section>

      {/* Skincare Routine */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={routineSection} alt="Arecima hair ritual — Soleveil Protect and Silk Shield" className="w-full h-full object-cover" loading="lazy" width={1920} height={900} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(12,10,8,0.88) 0%, rgba(12,10,8,0.55) 50%, rgba(12,10,8,0.15) 100%)' }} />
        </div>
        <div className="relative container mx-auto px-4 lg:px-8 py-20 lg:py-32">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="font-body text-xs tracking-[0.3em] uppercase mb-4" style={{ color: 'hsl(168, 35%, 62%)' }}>{t('routine.subtitle')}</p>
              <h2 className="font-display text-3xl lg:text-5xl mb-12" style={{ color: 'hsl(160, 20%, 95%)' }}>{t('routine.title')}</h2>
            </motion.div>
            <div className="space-y-8">
              {routineSteps.map((step, i) => {
                const stepContent = (
                  <>
                    <h3 className="font-display text-lg lg:text-xl mb-1 group-hover:text-gold transition-colors" style={{ color: 'hsl(160, 20%, 95%)' }}>{t(`routine.${step.key}.title`)}</h3>
                    <p className="font-body text-sm" style={{ color: 'hsl(165, 15%, 70%)' }}>{t(`routine.${step.key}.desc`)}</p>
                  </>
                );
                return (
                  <motion.div key={step.step} initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12, duration: 0.5 }} viewport={{ once: true }} className="flex items-start gap-6 group">
                    <div className="relative">
                      <span className="font-display text-3xl lg:text-4xl font-light" style={{ color: 'hsl(174, 42%, 42%)' }}>{step.step}</span>
                      {i < routineSteps.length - 1 && <div className="absolute left-1/2 top-full w-px h-8" style={{ background: 'hsla(174, 42%, 42%, 0.3)' }} />}
                    </div>
                    <div className="pb-2">
                      {step.productSlug ? (
                        <Link to={`/product/${step.productSlug}`} className="block hover:opacity-90 transition-opacity">
                          {stepContent}
                        </Link>
                      ) : (
                        stepContent
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.7 }} viewport={{ once: true }} className="mt-12">
              <Link to="/product/rituel-cheveux-duo" className="group inline-flex items-center gap-2 px-8 py-4 font-body text-xs tracking-[0.2em] uppercase bg-gold hover:bg-gold-dark transition-all duration-300" style={{ color: 'hsl(160, 20%, 98%)' }}>
                {t('routine.cta')}
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ingredient Spotlight */}
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-3">
            {t('ingredients.subtitle')}
          </p>
          <h2 className="font-display text-3xl lg:text-4xl mb-4">
            {t('ingredients.title')}
          </h2>
          <p className="font-body text-sm text-muted-foreground max-w-lg mx-auto">
            {t('ingredients.description')}
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ingredients.map((ing, i) => (
            <motion.div key={ing.key} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }} viewport={{ once: true }}
              className="border border-border p-8 lg:p-10 text-center hover:border-gold hover:shadow-gold transition-all duration-500 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-champagne/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <ing.Icon className="w-8 h-8 mx-auto mb-5 text-gold transform group-hover:scale-110 transition-transform duration-500" strokeWidth={1.25} />
                <h3 className="font-display text-sm lg:text-base mb-2 group-hover:text-gold transition-colors">{t(`ingredients.${ing.key}.name`)}</h3>
                <p className="font-body text-xs text-muted-foreground">{t(`ingredients.${ing.key}.desc`)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <SkinConcerns />

      {/* Testimonials */}
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-3">{t('testimonials.subtitle')}</p>
          <h2 className="font-display text-3xl lg:text-4xl">{t('testimonials.title')}</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          {reviewsLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border border-border p-8 lg:p-10 space-y-4">
                <Skeleton className="h-4 w-24 mx-auto" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-4 w-32 mx-auto" />
              </div>
            ))
          ) : showApiReviews ? (
            apiReviews.map((review, i) => (
              <motion.div key={review.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} viewport={{ once: true }}
                className="border border-border p-8 lg:p-10 text-center hover:border-gold/50 transition-all duration-500 relative group">
                <div className="absolute top-6 left-8 font-display text-5xl text-gold/20">"</div>
                <div className="relative">
                  <div className="flex justify-center gap-1 mb-5">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill="hsl(174, 42%, 42%)" stroke="hsl(174, 42%, 42%)" strokeWidth="1">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <p className="font-elegant text-lg lg:text-xl italic leading-relaxed mb-6 text-foreground">&ldquo;{review.body}&rdquo;</p>
                  <div className="w-8 h-px bg-gold mx-auto mb-4" />
                  <p className="font-body text-sm font-medium">{review.customerName}</p>
                  {review.productSlug && (
                    <Link to={`/product/${review.productSlug}`} className="font-body text-xs text-muted-foreground hover:text-gold transition-colors">
                      {review.productName}
                    </Link>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            FALLBACK_TESTIMONIALS.map((review, i) => (
              <motion.div key={review.key} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} viewport={{ once: true }}
                className="border border-border p-8 lg:p-10 text-center hover:border-gold/50 transition-all duration-500 relative group">
                <div className="absolute top-6 left-8 font-display text-5xl text-gold/20">"</div>
                <div className="relative">
                  <div className="flex justify-center gap-1 mb-5">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill="hsl(174, 42%, 42%)" stroke="hsl(174, 42%, 42%)" strokeWidth="1">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <p className="font-elegant text-lg lg:text-xl italic leading-relaxed mb-6 text-foreground">{t(`testimonials.${review.key}.text`)}</p>
                  <div className="w-8 h-px bg-gold mx-auto mb-4" />
                  <p className="font-body text-sm font-medium">{t(`testimonials.${review.key}.name`)}</p>
                  <p className="font-body text-xs text-muted-foreground">{t(`testimonials.${review.key}.location`)}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {latestPosts.length > 0 && (
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12">
          <div>
            <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-3">{t('blog.subtitle')}</p>
            <h2 className="font-display text-3xl lg:text-4xl">{t('blog.homeTitle')}</h2>
          </div>
          <Link to="/blog" className="mt-4 lg:mt-0 font-body text-xs tracking-[0.15em] uppercase text-foreground hover:text-gold transition-colors flex items-center gap-2 group">
            {t('blog.viewAll')}
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          {latestPosts.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
              <Link to={`/blog/${post.id}`} className="group block">
                <div className="relative overflow-hidden aspect-[4/3] mb-4">
                  <img src={post.image} alt={post.title[language]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" width={400} height={300} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className="font-body text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 bg-charcoal" style={{ color: 'hsl(168, 35%, 62%)' }}>{post.category[language]}</span>
                  </div>
                </div>
                <p className="font-body text-[10px] tracking-wider uppercase text-muted-foreground mb-2">{post.readTime} {t('blog.minRead')}</p>
                <h3 className="font-display text-base lg:text-lg mb-2 group-hover:text-gold transition-colors">{post.title[language]}</h3>
                <p className="font-body text-sm text-muted-foreground line-clamp-2">{post.excerpt[language]}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
      )}

      <section className="bg-charcoal py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-gold/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-gold/20" />
        </div>
        <div className="container mx-auto px-4 lg:px-8 text-center max-w-3xl relative">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="font-body text-xs tracking-[0.4em] uppercase mb-8" style={{ color: 'hsl(168, 35%, 62%)' }}>{t('brandStory.label')}</p>
            <h2 className="font-elegant text-2xl lg:text-5xl italic leading-relaxed mb-10" style={{ color: 'hsl(160, 20%, 90%)' }}>
              {t('brandStory.quote')}
            </h2>
            <div className="w-16 h-px mx-auto" style={{ background: 'hsl(174, 42%, 42%)' }} />
          </motion.div>
        </div>
      </section>

      <UGCGrid />
      <NewsletterCapture />
    </main>
  );
};

export default Index;
