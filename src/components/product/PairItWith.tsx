import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Check } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { resolveImage } from '@/lib/productAdapter';
import type { Product } from '@/data/products';

interface PairItWithProps {
  products: Product[];
}

const PairItWith = ({ products }: PairItWithProps) => {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  if (!products.length) return null;

  const handleAdd = (e: React.MouseEvent, p: Product) => {
    e.preventDefault();
    addToCart(p);
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="mt-8 pt-8 border-t border-border/60">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-gold text-xs">✦</span>
        <h3 className="font-display text-base lg:text-lg">
          {language === 'fr' ? 'Complétez le rituel' : language === 'ar' ? 'أكملي الطقس' : 'Complete the ritual'}
        </h3>
        <span className="h-px flex-1 bg-gradient-to-r from-gold/30 to-transparent" />
      </div>

      <div className="space-y-3">
        {products.slice(0, 3).map((p, i) => {
          const added = addedId === p.id;
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 lg:gap-4 p-3 border border-border/60 hover:border-gold/40 hover:bg-champagne/20 transition-all rounded-sm group"
            >
              <Link to={`/product/${p.id}`} className="flex-none w-16 h-16 lg:w-20 lg:h-20 overflow-hidden bg-champagne/40 rounded-sm">
                <img
                  src={resolveImage(p.image)}
                  alt={p.name[language]}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  width={120}
                  height={120}
                />
              </Link>

              <Link to={`/product/${p.id}`} className="flex-1 min-w-0">
                <h4 className="font-display text-sm lg:text-base leading-tight truncate group-hover:text-gold transition-colors">
                  {p.name[language]}
                </h4>
                <p className="font-body text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                  {p.shortDescription[language]}
                </p>
                <p className="font-display text-sm mt-1.5">
                  {p.price} <span className="font-body text-[10px] text-muted-foreground">TND</span>
                </p>
              </Link>

              <button
                onClick={(e) => handleAdd(e, p)}
                disabled={!p.inStock || added}
                aria-label={`Add ${p.name[language]} to cart`}
                className={`flex-none w-10 h-10 lg:w-11 lg:h-11 rounded-sm flex items-center justify-center transition-all duration-300 ${
                  added
                    ? 'bg-gold text-primary-foreground'
                    : 'bg-charcoal text-primary-foreground hover:bg-gold disabled:opacity-50'
                }`}
              >
                {added ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <Plus className="h-4 w-4" strokeWidth={2} />}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PairItWith;
