import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { resolveImage } from '@/lib/productAdapter';
import type { Product } from '@/data/products';
import type { ProductPageMeta } from '@/data/productDetails';

interface BundleContentsProps {
  meta: ProductPageMeta;
  allProducts: Product[];
  savingsLabel?: string;
}

const BundleContents = ({ meta, allProducts, savingsLabel }: BundleContentsProps) => {
  const { language, t } = useLanguage();
  if (!meta.bundleItems?.length) return null;

  const items = meta.bundleItems
    .map(b => ({
      ...b,
      product: allProducts.find(p => p.id === b.slug),
    }))
    .filter(x => x.product);

  if (!items.length) return null;

  const separateTotal = items.reduce((s, i) => s + (i.product?.price || 0), 0);

  return (
    <section className="mb-8 p-5 lg:p-6 border border-gold/30 bg-gradient-to-br from-champagne/50 to-champagne/20 rounded-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="font-display text-lg lg:text-xl">
          {language === 'fr' ? 'Contenu du coffret' : language === 'ar' ? 'محتويات المجموعة' : 'What\'s in the set'}
        </h2>
        {savingsLabel && (
          <span className="font-body text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 bg-gold text-primary-foreground">
            {savingsLabel}
          </span>
        )}
      </div>

      <div className="space-y-4">
        {items.map(({ step, role, when, product }, i) => (
          <motion.div
            key={product!.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex gap-4 p-4 bg-background/80 border border-border/60 rounded-sm group hover:border-gold/40 transition-colors"
          >
            <div className="flex-none w-10 h-10 rounded-full bg-charcoal text-champagne flex items-center justify-center font-display text-sm">
              {step}
            </div>
            <Link to={`/product/${product!.id}`} className="flex-none w-20 h-20 overflow-hidden bg-champagne/40 rounded-sm">
              <img
                src={resolveImage(product!.image)}
                alt={product!.name[language]}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <p className="font-body text-[10px] tracking-[0.2em] uppercase text-gold mb-1">{role[language]}</p>
              <Link to={`/product/${product!.id}`} className="font-display text-base hover:text-gold transition-colors line-clamp-2">
                {product!.name[language]}
              </Link>
              <p className="font-body text-xs text-muted-foreground mt-1">{when[language]}</p>
              <p className="font-body text-xs text-muted-foreground mt-0.5">{product!.size}</p>
            </div>
            <div className="flex-none text-right">
              <p className="font-display text-sm">{product!.price} {t('general.currency')}</p>
              <Link to={`/product/${product!.id}`} className="inline-flex items-center gap-1 font-body text-[10px] uppercase text-gold mt-2 hover:underline">
                {language === 'fr' ? 'Voir' : language === 'ar' ? 'عرض' : 'View'}
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {separateTotal > 0 && (
        <div className="mt-5 pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="font-body text-muted-foreground">
            {language === 'fr' ? 'Valeur à l\'unité :' : language === 'ar' ? 'القيمة منفصلة:' : 'Bought separately:'}
            <span className="line-through ml-2">{separateTotal} {t('general.currency')}</span>
          </span>
          <span className="flex items-center gap-1.5 font-body text-foreground">
            <Check className="h-4 w-4 text-gold" />
            {language === 'fr' ? 'Inclus dans le Duo' : language === 'ar' ? 'مشمول في الثنائي' : 'Included in Duo'}
          </span>
        </div>
      )}
    </section>
  );
};

export default BundleContents;
