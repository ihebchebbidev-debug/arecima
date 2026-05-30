import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProductFAQProps {
  productName?: string;
}

const ProductFAQ = ({ productName = '' }: ProductFAQProps) => {
  const { language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: { fr: 'Comment utiliser ce produit ?', en: 'How do I use this product?', ar: 'كيف أستخدم هذا المنتج؟' },
      a: {
        fr: 'Appliquez matin et soir sur peau propre et sèche. Massez délicatement en mouvements circulaires jusqu\'à pénétration complète. Suivez avec votre crème hydratante habituelle.',
        en: 'Apply morning and evening on clean, dry skin. Massage gently in circular motions until fully absorbed. Follow with your usual moisturizer.',
        ar: 'ضعيه صباحًا ومساءً على بشرة نظيفة وجافة. دلكي بلطف بحركات دائرية حتى الامتصاص الكامل. اتبعي بمرطبكِ المعتاد.',
      },
    },
    {
      q: { fr: 'Convient-il à toutes les peaux ?', en: 'Is it suitable for all skin types?', ar: 'هل يناسب جميع أنواع البشرة؟' },
      a: {
        fr: 'Oui, sa formule douce et naturelle convient à tous les types de peau, y compris les peaux sensibles. Nous recommandons toujours un test de tolérance dans le pli du coude avant la première utilisation.',
        en: 'Yes, its gentle natural formula suits all skin types, including sensitive skin. We always recommend a patch test on the inner elbow before first use.',
        ar: 'نعم، تركيبته الطبيعية اللطيفة تناسب جميع أنواع البشرة، بما في ذلك الحساسة. ننصح دائمًا باختبار صغير على كوع اليد قبل الاستخدام الأول.',
      },
    },
    {
      q: { fr: 'Combien de temps pour voir des résultats ?', en: 'How long until I see results?', ar: 'متى أرى النتائج؟' },
      a: {
        fr: 'Les premières améliorations sont visibles dès 7 à 14 jours d\'utilisation régulière. Pour des résultats optimaux, intégrez le produit dans votre rituel quotidien pendant au moins 4 à 6 semaines.',
        en: 'First improvements appear after 7 to 14 days of regular use. For optimal results, integrate the product into your daily ritual for at least 4 to 6 weeks.',
        ar: 'تظهر التحسينات الأولى بعد 7 إلى 14 يومًا من الاستخدام المنتظم. للحصول على أفضل النتائج، أدمجي المنتج في طقسك اليومي لمدة 4 إلى 6 أسابيع على الأقل.',
      },
    },
    {
      q: { fr: 'Est-il vegan et cruelty-free ?', en: 'Is it vegan and cruelty-free?', ar: 'هل هو نباتي وبدون قسوة؟' },
      a: {
        fr: 'Absolument. Tous nos produits Arecima sont 100% vegan, sans cruauté et formulés sans ingrédients d\'origine animale. Nous ne testons jamais sur les animaux.',
        en: 'Absolutely. All Arecima products are 100% vegan, cruelty-free and formulated without animal-derived ingredients. We never test on animals.',
        ar: 'بالتأكيد. جميع منتجات أريسيما نباتية 100%، خالية من القسوة، ومصنوعة بدون مكونات حيوانية. لا نختبر على الحيوانات أبدًا.',
      },
    },
    {
      q: { fr: 'Quelle est la durée de conservation ?', en: 'What is the shelf life?', ar: 'ما هي مدة الصلاحية؟' },
      a: {
        fr: '24 mois à compter de la date de fabrication, et 6 mois après ouverture. Conservez dans un endroit frais et sec, à l\'abri de la lumière directe.',
        en: '24 months from manufacturing date, and 6 months after opening. Store in a cool, dry place away from direct sunlight.',
        ar: '24 شهرًا من تاريخ التصنيع، و6 أشهر بعد الفتح. احفظيه في مكان بارد وجاف بعيدًا عن أشعة الشمس المباشرة.',
      },
    },
  ];

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
