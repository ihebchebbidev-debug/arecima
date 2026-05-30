import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApiCategories } from '@/hooks/useApiProducts';
import concernRadiance from '@/assets/concern-radiance.jpg';
import concernHydration from '@/assets/concern-hydration.jpg';
import concernAntiaging from '@/assets/concern-antiaging.jpg';
import concernSensitive from '@/assets/concern-sensitive.jpg';

const CONCERN_CATEGORY_SLUGS: Record<string, string> = {
  radiance: 'serums',
  hydration: 'cremes',
  antiaging: 'serums',
  sensitive: 'nettoyants',
};

const SkinConcerns = () => {
  const { t } = useLanguage();
  const { categories } = useApiCategories();

  const concernImages = [concernRadiance, concernHydration, concernAntiaging, concernSensitive];
  const concernKeys = ['radiance', 'hydration', 'antiaging', 'sensitive'] as const;

  const concerns = useMemo(() => concernKeys.map((key, i) => {
    const preferredSlug = CONCERN_CATEGORY_SLUGS[key];
    const category = categories.find(c => c.slug === preferredSlug) || categories[i];
    return {
      img: concernImages[i],
      key,
      to: category ? `/products?category=${category.slug}` : '/products',
    };
  }), [categories]);

  return (
    <section className="container mx-auto px-4 lg:px-8 py-14 lg:py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 lg:mb-14">
        <p className="font-body text-[10px] lg:text-xs tracking-[0.3em] uppercase text-gold mb-3">
          {t('concerns.subtitle')}
        </p>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl">
          {t('concerns.title')}
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {concerns.map((c, i) => (
          <motion.div
            key={c.key}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            viewport={{ once: true, margin: '-50px' }}
          >
            <Link to={c.to} className="group block relative overflow-hidden aspect-[3/4] rounded-sm">
              <img
                src={c.img}
                alt={t(`concerns.${c.key}.title`)}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                loading="lazy"
                width={600}
                height={800}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                <h3 className="font-display text-sm lg:text-lg mb-1" style={{ color: 'hsl(160, 20%, 95%)' }}>
                  {t(`concerns.${c.key}.title`)}
                </h3>
                <p className="font-body text-[10px] lg:text-xs opacity-80 mb-3 line-clamp-2" style={{ color: 'hsl(165, 15%, 75%)' }}>
                  {t(`concerns.${c.key}.desc`)}
                </p>
                <span className="inline-flex items-center gap-1 font-body text-[10px] tracking-[0.15em] uppercase text-gold opacity-0 group-hover:opacity-100 transition-opacity">
                  {t('concerns.explore')}
                  <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SkinConcerns;
