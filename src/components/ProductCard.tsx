import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import type { Product } from '@/data/products';
import { resolveImage } from '@/lib/productAdapter';
import { trackAddToWishlist } from '@/lib/facebookPixel';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { t, language } = useLanguage();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const wishlisted = isFavorite(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.4), ease: 'easeOut' }}
      viewport={{ once: true, margin: '-50px' }}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden bg-gradient-to-br from-champagne/40 via-secondary/30 to-champagne/20 aspect-[3/4] mb-4 rounded-sm">
          <img
            src={resolveImage(product.image, product.id)}
            alt={product.name[language]}
            className="w-full h-full object-cover transition-all duration-[900ms] ease-out group-hover:scale-110"
            loading="lazy"
            width={400}
            height={533}
          />

          {/* Soft hover veil */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Inset highlight */}
          <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-foreground/[0.04]" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isBestSeller && (
              <span className="font-body text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 bg-charcoal text-champagne shadow-sm">
                {t('products.bestSeller')}
              </span>
            )}
            {product.isNew && (
              <span className="font-body text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 bg-gold text-primary-foreground shadow-sm">
                {t('products.new')}
              </span>
            )}
            {product.originalPrice && (
              <span className="font-body text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 bg-destructive text-destructive-foreground shadow-sm">
                −{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </span>
            )}
          </div>

          {/* Heart / Favorite */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!wishlisted) trackAddToWishlist(product);
              toggleFavorite(product.id);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-background/90 backdrop-blur-md hover:bg-background hover:scale-110 transition-all duration-300 z-10 shadow-sm"
            aria-label={wishlisted ? t('aria.removeFromFav') : t('aria.addToFav')}
          >
            <Heart
              className={`h-4 w-4 transition-all ${wishlisted ? 'fill-gold text-gold scale-110' : 'text-foreground'}`}
            />
          </button>

          {/* Quick Add */}
          <button
            className="absolute bottom-0 inset-x-0 py-3 font-body text-[11px] tracking-[0.2em] uppercase bg-charcoal/95 backdrop-blur-sm text-champagne opacity-100 lg:opacity-0 lg:translate-y-2 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-300 hover:bg-gold hover:text-primary-foreground flex items-center justify-center gap-2"
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            {t('products.addToCart')}
          </button>

          {/* Out of stock overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px] flex items-center justify-center">
              <span className="font-body text-[10px] tracking-[0.25em] uppercase px-4 py-2 bg-charcoal text-champagne">
                {t('products.outOfStock')}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="space-y-1.5 px-0.5">
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={i < Math.round(product.rating) ? 'hsl(38, 72%, 52%)' : 'none'} stroke="hsl(38, 72%, 52%)" strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
          <span className="font-body text-[10px] text-muted-foreground">({product.reviewCount.toLocaleString()})</span>
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display text-sm lg:text-base leading-tight group-hover:text-gold transition-colors">{product.name[language]}</h3>
        </Link>
        <p className="font-body text-xs text-muted-foreground line-clamp-1">{product.shortDescription[language]}</p>
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="font-display text-base text-foreground">{product.price} <span className="font-body text-[11px] text-muted-foreground">{t('general.currency')}</span></span>
          {product.originalPrice && (
            <span className="font-body text-xs text-muted-foreground line-through">{product.originalPrice} {t('general.currency')}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
