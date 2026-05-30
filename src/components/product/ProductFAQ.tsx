import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ProductFAQItem } from '@/data/productDetails';

interface ProductFAQProps {
  faqs: ProductFAQItem[];
}

const ProductFAQ = ({ faqs }: ProductFAQProps) => {
  const { language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs.length) return null;

  return (
    <section className="container mx-auto px-4 lg:px-8 py-14 lg:py-20 max-w-3xl">
      <div className="text-center mb-10 lg:mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="h-px w-8 bg-gold/40" />
          <span className="text-gold text-xs">✦</span>
          <span className="h-px w-8 bg-gold/40" />
        </div>
        <p className="font-body text-[10px] lg:text-xs tracking-[0.3em] uppercase text-gold mb-3">
          {language === 'fr' ? 'À VOUS DE SAVOIR' : language === 'ar' ? 'لكِ أن تعرفي' : 'GOOD TO KNOW'}
        </p>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl">
          {language === 'fr' ? 'Questions fréquentes' : language === 'ar' ? 'الأسئلة الشائعة' : 'Frequently asked'}
        </h2>
      </div>

      <div className="divide-y divide-border/60 border-y border-border/60">
        {faqs.map((faq, i) => {
          const open = openIndex === i;
          return (
            <div key={i}>
              <button
                onClick={() => setOpenIndex(open ? null : i)}
                className="w-full flex items-center justify-between gap-4 py-5 lg:py-6 text-left group"
              >
                <span className="font-display text-base lg:text-lg pr-4 group-hover:text-gold transition-colors">
                  {faq.q[language]}
                </span>
                <span className={`flex-none w-8 h-8 rounded-full border border-border flex items-center justify-center transition-all ${open ? 'bg-gold border-gold rotate-180' : 'group-hover:border-gold'}`}>
                  {open ? <Minus className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={2} /> : <Plus className="h-3.5 w-3.5 text-foreground" strokeWidth={2} />}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <p className="font-body text-sm leading-relaxed text-muted-foreground pb-6 pr-12">
                      {faq.a[language]}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProductFAQ;
