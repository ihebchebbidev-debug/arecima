import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ugc1 from '@/assets/ugc-1.jpg';
import ugc2 from '@/assets/ugc-2.jpg';
import ugc3 from '@/assets/ugc-3.jpg';
import ugc4 from '@/assets/ugc-4.jpg';
import soleveilProtect from '@/assets/soleveil-protect.jpg';
import silkShield from '@/assets/silk-shield.jpg';

const INSTAGRAM_URL = 'https://instagram.com/arecima.tn';

const UGCGrid = () => {
  const { t } = useLanguage();

  const posts = [ugc1, ugc2, ugc3, ugc4, soleveilProtect, silkShield];

  return (
    <section className="bg-champagne py-14 lg:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 lg:mb-12">
          <p className="font-body text-[10px] lg:text-xs tracking-[0.3em] uppercase text-gold mb-3">
            {t('ugc.hashtag')}
          </p>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl mb-3">
            {t('ugc.title')}
          </h2>
          <p className="font-body text-sm text-muted-foreground max-w-md mx-auto">
            {t('ugc.description')}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {posts.map((img, i) => (
            <motion.a
              key={i}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              viewport={{ once: true }}
              className="group relative aspect-square overflow-hidden rounded-sm block"
            >
              <img
                src={img}
                alt={`Arecima community ${i + 1}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                width={400}
                height={400}
              />
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/60 transition-colors duration-500 flex flex-col items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                <Instagram className="h-5 w-5 lg:h-6 lg:w-6 text-champagne" strokeWidth={1.5} />
                <span className="font-body text-[10px] lg:text-xs text-champagne tracking-wide">@arecima.tn</span>
              </div>
              <div className="absolute inset-0 ring-1 ring-inset ring-foreground/[0.05] pointer-events-none" />
            </motion.a>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-10">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 font-body text-[11px] tracking-[0.2em] uppercase border border-foreground hover:bg-foreground hover:text-background transition-all duration-300"
          >
            <Instagram className="h-4 w-4" strokeWidth={1.5} />
            {t('ugc.followUs')}
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default UGCGrid;
