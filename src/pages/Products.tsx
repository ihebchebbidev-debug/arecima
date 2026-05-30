import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, Check, ArrowUpDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApiProducts, useApiCategories } from '@/hooks/useApiProducts';
import ProductCard from '@/components/ProductCard';
import SEOHead from '@/components/SEOHead';
import { sitePath } from '@/lib/site';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

type SortKey = 'featured' | 'price-low' | 'price-high' | 'rating' | 'new';

const Products = () => {
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  const [sortBy, setSortBy] = useState<SortKey>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyOnSale, setOnlyOnSale] = useState(false);
  const { products, loading } = useApiProducts();
  const { categories } = useApiCategories();

  const filteredProducts = useMemo(() => {
    let filtered = activeCategory === 'all'
      ? products
      : products.filter(p => p.category === activeCategory);

    if (onlyInStock) filtered = filtered.filter(p => p.inStock);
    if (onlyOnSale) filtered = filtered.filter(p => p.originalPrice);

    switch (sortBy) {
      case 'price-low': return [...filtered].sort((a, b) => a.price - b.price);
      case 'price-high': return [...filtered].sort((a, b) => b.price - a.price);
      case 'rating': return [...filtered].sort((a, b) => b.rating - a.rating);
      case 'new': return [...filtered].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      default: return filtered;
    }
  }, [activeCategory, sortBy, products, onlyInStock, onlyOnSale]);

  const activeCatName = activeCategory === 'all'
    ? t('products.all')
    : categories.find(c => c.id === activeCategory)?.name[language] || '';

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Arecima — ${activeCatName}`,
    description: t('hero.description'),
    url: sitePath(`/products${activeCategory !== 'all' ? `?category=${activeCategory}` : ''}`),
    numberOfItems: filteredProducts.length,
  };

  const sortLabels: Record<SortKey, string> = {
    featured: language === 'fr' ? 'En vedette' : language === 'ar' ? 'مميزة' : 'Featured',
    'price-low': language === 'fr' ? 'Prix : croissant' : language === 'ar' ? 'السعر: تصاعدي' : 'Price: low to high',
    'price-high': language === 'fr' ? 'Prix : décroissant' : language === 'ar' ? 'السعر: تنازلي' : 'Price: high to low',
    rating: language === 'fr' ? 'Mieux notés' : language === 'ar' ? 'الأعلى تقييماً' : 'Top rated',
    new: language === 'fr' ? 'Nouveautés' : language === 'ar' ? 'الجديد' : 'Newest',
  };

  const activeFilterCount = (activeCategory !== 'all' ? 1 : 0) + (onlyInStock ? 1 : 0) + (onlyOnSale ? 1 : 0);

  const clearAll = () => {
    setSearchParams({});
    setOnlyInStock(false);
    setOnlyOnSale(false);
  };

  // Reusable filter sidebar content (used on desktop + mobile sheet)
  const FilterPanel = ({ onSelect }: { onSelect?: () => void }) => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-sm tracking-wide">{language === 'fr' ? 'Catégories' : language === 'ar' ? 'الفئات' : 'Categories'}</h3>
          <span className="h-px flex-1 ml-4 bg-gradient-to-r from-gold/40 to-transparent" />
        </div>
        <ul className="space-y-1.5">
          <li>
            <button
              onClick={() => { setSearchParams({}); onSelect?.(); }}
              className={`group w-full flex items-center justify-between py-2 px-3 -mx-3 rounded-sm transition-all ${
                activeCategory === 'all' ? 'bg-champagne/60 text-foreground' : 'hover:bg-secondary/60 text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="font-body text-[13px] tracking-wide flex items-center gap-2">
                {activeCategory === 'all' && <span className="text-gold text-xs">✦</span>}
                {t('products.all')}
              </span>
              <span className="font-body text-[10px] text-muted-foreground tabular-nums">{products.length}</span>
            </button>
          </li>
          {categories.map(cat => {
            const count = products.filter(p => p.category === cat.id).length;
            const isActive = activeCategory === cat.id;
            return (
              <li key={cat.id}>
                <button
                  onClick={() => { setSearchParams({ category: cat.id }); onSelect?.(); }}
                  className={`group w-full flex items-center justify-between py-2 px-3 -mx-3 rounded-sm transition-all ${
                    isActive ? 'bg-champagne/60 text-foreground' : 'hover:bg-secondary/60 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="font-body text-[13px] tracking-wide flex items-center gap-2">
                    {isActive && <span className="text-gold text-xs">✦</span>}
                    {cat.name[language]}
                  </span>
                  <span className="font-body text-[10px] text-muted-foreground tabular-nums">{count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Refine */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-sm tracking-wide">{language === 'fr' ? 'Affiner' : language === 'ar' ? 'تحسين' : 'Refine'}</h3>
          <span className="h-px flex-1 ml-4 bg-gradient-to-r from-gold/40 to-transparent" />
        </div>
        <div className="space-y-3">
          {[
            { checked: onlyInStock, set: setOnlyInStock, label: language === 'fr' ? 'En stock uniquement' : language === 'ar' ? 'متوفر فقط' : 'In stock only' },
            { checked: onlyOnSale, set: setOnlyOnSale, label: language === 'fr' ? 'En promotion' : language === 'ar' ? 'تخفيضات' : 'On sale' },
          ].map((f, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer group">
              <span className={`relative flex items-center justify-center w-4 h-4 border transition-colors ${f.checked ? 'bg-gold border-gold' : 'border-border group-hover:border-foreground'}`}>
                {f.checked && <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />}
              </span>
              <span className="font-body text-[13px] text-muted-foreground group-hover:text-foreground transition-colors">{f.label}</span>
              <input type="checkbox" checked={f.checked} onChange={e => f.set(e.target.checked)} className="sr-only" />
            </label>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button
          onClick={() => { clearAll(); onSelect?.(); }}
          className="w-full font-body text-[11px] tracking-[0.2em] uppercase py-3 border border-border hover:border-gold hover:text-gold transition-all"
        >
          {language === 'fr' ? 'Réinitialiser' : language === 'ar' ? 'إعادة تعيين' : 'Clear all'} ({activeFilterCount})
        </button>
      )}

      {/* Editorial note */}
      <div className="hidden lg:block pt-6 border-t border-border/60">
        <p className="font-body text-[11px] text-gold tracking-[0.25em] uppercase mb-2">✦ {language === 'fr' ? 'Notre promesse' : language === 'ar' ? 'وعدنا' : 'Our promise'}</p>
        <p className="font-body text-xs leading-relaxed text-muted-foreground">
          {language === 'fr'
            ? 'Chaque produit est formulé en petites séries avec des ingrédients tunisiens d\'exception.'
            : language === 'ar'
            ? 'كل منتج مصنوع بكميات صغيرة بمكونات تونسية استثنائية.'
            : 'Every product is crafted in small batches with exceptional Tunisian ingredients.'}
        </p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen">
      <SEOHead
        title={language === 'fr' ? `${activeCatName} — Notre Collection` : language === 'ar' ? `${activeCatName} — مجموعتنا` : `${activeCatName} — Our Collection`}
        description={language === 'fr' ? 'Découvrez notre collection premium de soins de luxe tunisiens.' : language === 'ar' ? 'اكتشفي مجموعتنا الفاخرة من منتجات العناية التونسية.' : 'Discover our premium collection of luxury Tunisian skincare.'}
        schema={collectionSchema}
      />

      {/* Page Header */}
      <div className="bg-gradient-to-b from-champagne via-champagne to-champagne/50 py-14 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, hsl(38, 72%, 52%) 0%, transparent 50%), radial-gradient(circle at 80% 70%, hsl(38, 72%, 52%) 0%, transparent 50%)' }} />
        <div className="container mx-auto px-4 lg:px-8 text-center relative">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-10 bg-gold/50" />
            <span className="text-gold text-xs">✦</span>
            <span className="h-px w-10 bg-gold/50" />
          </div>
          <p className="font-body text-[10px] tracking-[0.4em] uppercase text-gold mb-3">{t('products.subtitle')}</p>
          <h1 className="font-display text-4xl lg:text-6xl mb-4 leading-tight">{activeCategory === 'all' ? t('products.title') : activeCatName}</h1>
          <p className="font-body text-sm text-muted-foreground tracking-wide">
            <span className="font-display text-foreground">{filteredProducts.length}</span> {language === 'fr' ? (filteredProducts.length === 1 ? 'produit' : 'produits') : language === 'ar' ? 'منتج' : filteredProducts.length === 1 ? 'product' : 'products'}
          </p>
        </div>
      </div>

      {/* Sticky Mobile Filter / Sort Bar */}
      <div className="lg:hidden sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-border hover:border-gold transition-colors font-body text-[11px] tracking-[0.2em] uppercase">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                {language === 'fr' ? 'Filtres' : language === 'ar' ? 'تصفية' : 'Filters'}
                {activeFilterCount > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center h-4 min-w-4 px-1 text-[9px] bg-gold text-primary-foreground rounded-full">{activeFilterCount}</span>
                )}
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] max-w-sm overflow-y-auto">
              <SheetHeader className="text-left mb-6">
                <SheetTitle className="font-display text-2xl">{language === 'fr' ? 'Filtres' : language === 'ar' ? 'تصفية' : 'Filters'}</SheetTitle>
              </SheetHeader>
              <FilterPanel />
            </SheetContent>
          </Sheet>

          <div className="flex-1 relative">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortKey)}
              className="w-full appearance-none font-body text-[11px] tracking-[0.15em] uppercase pl-9 pr-4 py-2.5 border border-border bg-background focus:outline-none focus:border-gold cursor-pointer"
            >
              {(Object.keys(sortLabels) as SortKey[]).map(k => (
                <option key={k} value={k}>{sortLabels[k]}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] xl:grid-cols-[280px_1fr] gap-8 lg:gap-12">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <FilterPanel />
            </div>
          </aside>

          <div>
            {/* Desktop sort bar */}
            <div className="hidden lg:flex items-center justify-between mb-8 pb-5 border-b border-border">
              <div className="flex items-center gap-3">
                {activeFilterCount > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {activeCategory !== 'all' && (
                      <button onClick={() => setSearchParams({})} className="group inline-flex items-center gap-1.5 px-3 py-1.5 bg-champagne/60 hover:bg-champagne font-body text-[11px] tracking-wide transition-colors">
                        {categories.find(c => c.id === activeCategory)?.name[language]}
                        <X className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                      </button>
                    )}
                    {onlyInStock && (
                      <button onClick={() => setOnlyInStock(false)} className="group inline-flex items-center gap-1.5 px-3 py-1.5 bg-champagne/60 hover:bg-champagne font-body text-[11px] tracking-wide transition-colors">
                        {language === 'fr' ? 'En stock' : language === 'ar' ? 'متوفر' : 'In stock'}
                        <X className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                      </button>
                    )}
                    {onlyOnSale && (
                      <button onClick={() => setOnlyOnSale(false)} className="group inline-flex items-center gap-1.5 px-3 py-1.5 bg-champagne/60 hover:bg-champagne font-body text-[11px] tracking-wide transition-colors">
                        {language === 'fr' ? 'Promo' : language === 'ar' ? 'تخفيض' : 'On sale'}
                        <X className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-body text-[11px] tracking-[0.2em] uppercase text-muted-foreground">{language === 'fr' ? 'Trier' : language === 'ar' ? 'ترتيب' : 'Sort'}</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as SortKey)}
                    className="appearance-none font-body text-[11px] tracking-[0.15em] uppercase pl-4 pr-9 py-2 border border-border bg-background focus:outline-none focus:border-gold cursor-pointer hover:border-foreground transition-colors"
                  >
                    {(Object.keys(sortLabels) as SortKey[]).map(k => (
                      <option key={k} value={k}>{sortLabels[k]}</option>
                    ))}
                  </select>
                  <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Loading skeleton */}
            {loading && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-secondary/60 mb-4 rounded-sm" />
                    <div className="h-3 bg-secondary/60 w-1/3 mb-2 rounded-sm" />
                    <div className="h-4 bg-secondary/60 w-2/3 mb-2 rounded-sm" />
                    <div className="h-3 bg-secondary/60 w-1/4 rounded-sm" />
                  </div>
                ))}
              </div>
            )}

            {/* Product Grid */}
            {!loading && (
              <AnimatePresence mode="popLayout">
                <motion.div
                  layout
                  className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-8"
                >
                  {filteredProducts.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}

            {!loading && filteredProducts.length === 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20 lg:py-32">
                <div className="text-gold text-2xl mb-4">✦</div>
                <p className="font-display text-xl mb-2">{language === 'fr' ? 'Aucun produit trouvé' : language === 'ar' ? 'لا توجد منتجات' : 'No products found'}</p>
                <p className="font-body text-sm text-muted-foreground mb-6">{language === 'fr' ? 'Essayez d\'ajuster vos filtres.' : language === 'ar' ? 'حاول تعديل عوامل التصفية.' : 'Try adjusting your filters.'}</p>
                <button onClick={clearAll} className="font-body text-[11px] tracking-[0.2em] uppercase px-6 py-3 border border-gold text-gold hover:bg-gold hover:text-primary-foreground transition-all">
                  {language === 'fr' ? 'Réinitialiser les filtres' : language === 'ar' ? 'إعادة تعيين' : 'Clear filters'}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* SEO Text */}
      <section className="bg-champagne py-14 lg:py-20 mt-8 border-t border-border/40">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-8 bg-gold/40" />
            <span className="text-gold text-xs">✦</span>
            <span className="h-px w-8 bg-gold/40" />
          </div>
          <h2 className="font-display text-2xl lg:text-3xl mb-5">
            {language === 'fr' ? 'Soins de Luxe Tunisiens — Arecima' : language === 'ar' ? 'العناية الفاخرة التونسية — أريسيما' : 'Luxury Tunisian Skincare — Arecima'}
          </h2>
          <p className="font-body text-sm leading-[1.8] text-muted-foreground">
            {language === 'fr'
              ? 'Chaque produit Arecima est formulé avec des ingrédients naturels premium sourcés en Tunisie. De l\'huile d\'olive extra vierge de nos oliveraies centenaires à l\'eau de rose de Damas des collines de Nabeul, nous capturons le meilleur du patrimoine botanique tunisien dans chaque formulation.'
              : language === 'ar'
              ? 'كل منتج من أريسيما مصمم بمكونات طبيعية فاخرة من تونس. من زيت الزيتون البكر الممتاز من بساتيننا العريقة إلى ماء الورد الدمشقي من تلال نابل، نلتقط أفضل ما في التراث النباتي التونسي في كل تركيبة.'
              : 'Every Arecima product is formulated with premium natural ingredients sourced from Tunisia. From extra virgin olive oil from our centuries-old groves to Damask rose water from the hills of Nabeul, we capture the best of Tunisian botanical heritage in every formulation.'}
          </p>
        </div>
      </section>
    </main>
  );
};

export default Products;
