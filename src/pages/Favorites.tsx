import { Link } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useApiProducts } from '@/hooks/useApiProducts';
import ProductCard from '@/components/ProductCard';
import SEOHead from '@/components/SEOHead';

const Favorites = () => {
  const { language } = useLanguage();
  const { favorites } = useFavorites();
  const { products, loading } = useApiProducts();

  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  const title = language === 'fr' ? 'Mes Favoris' : language === 'ar' ? 'مفضلاتي' : 'My Favorites';
  const emptyText = language === 'fr'
    ? 'Vous n\'avez pas encore de favoris. Parcourez notre collection et cliquez sur le cœur pour sauvegarder vos produits préférés.'
    : language === 'ar'
    ? 'ليس لديك مفضلات بعد. تصفحي مجموعتنا وانقري على القلب لحفظ منتجاتك المفضلة.'
    : 'You have no favorites yet. Browse our collection and click the heart to save your favorite products.';

  return (
    <main className="min-h-screen">
      <SEOHead title={title} description={title} noindex />

      <div className="bg-champagne py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Heart className="h-6 w-6 text-gold" />
            <h1 className="font-display text-3xl lg:text-5xl">{title}</h1>
          </div>
          <p className="font-body text-sm text-muted-foreground">
            {favoriteProducts.length} {language === 'fr' ? 'produit(s) sauvegardé(s)' : language === 'ar' ? 'منتج(ات) محفوظة' : 'saved product(s)'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
        {loading ? (
          <p className="text-center text-muted-foreground font-body text-sm">Loading…</p>
        ) : favoriteProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 max-w-md mx-auto"
          >
            <Heart className="h-16 w-16 mx-auto mb-6 text-muted-foreground/30" />
            <p className="font-body text-sm text-muted-foreground mb-8">{emptyText}</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 font-body text-xs tracking-[0.2em] uppercase border border-foreground hover:bg-foreground hover:text-background transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {language === 'fr' ? 'Découvrir la collection' : language === 'ar' ? 'اكتشفي المجموعة' : 'Browse Collection'}
            </Link>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
            {favoriteProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
};

export default Favorites;
