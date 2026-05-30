import { motion } from 'framer-motion';
import { Leaf, HeartHandshake, MapPin, FlaskConical, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const WhyArecima = () => {
  const { t } = useLanguage();

  const pillars = [
    { icon: Leaf, key: 'pillar1' },
    { icon: HeartHandshake, key: 'pillar2' },
    { icon: MapPin, key: 'pillar3' },
    { icon: FlaskConical, key: 'pillar4' },
    { icon: Sparkles, key: 'pillar5' },
  ];

  return (
    <section className="bg-ivory py-14 lg:py-20 border-y border-border/50">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 lg:mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="h-px w-8 bg-gold/40" />
            <span className="text-gold text-xs">✦</span>
            <span className="h-px w-8 bg-gold/40" />
          </div>
          <p className="font-body text-[10px] lg:text-xs tracking-[0.3em] uppercase text-gold mb-3">
            {t('why.subtitle')}
          </p>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl">
            {t('why.title')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {pillars.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              className="group flex flex-col items-center text-center px-2"
            >
              <div className="relative mb-4 lg:mb-5">
                <div className="absolute inset-0 bg-gold/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-14 h-14 lg:w-16 lg:h-16 rounded-full border border-gold/40 flex items-center justify-center group-hover:border-gold group-hover:bg-gold/5 transition-all duration-500">
                  <p.icon className="h-5 w-5 lg:h-6 lg:w-6 text-gold" strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="font-display text-sm lg:text-base mb-1.5 group-hover:text-gold transition-colors">
                {t(`why.${p.key}.title`)}
              </h3>
              <p className="font-body text-[11px] lg:text-xs text-muted-foreground leading-relaxed">
                {t(`why.${p.key}.desc`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyArecima;
