import { Leaf, HeartHandshake, Beaker, Sprout, Droplets, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ProductAttributes = () => {
  const { language } = useLanguage();

  const attrs = [
    { icon: Leaf, label: { fr: 'Vegan', en: 'Vegan', ar: 'نباتي' } },
    { icon: HeartHandshake, label: { fr: 'Sans cruauté', en: 'Cruelty-free', ar: 'بدون قسوة' } },
    { icon: Beaker, label: { fr: 'Dermo-testé', en: 'Dermo-tested', ar: 'مُختبر طبيًا' } },
    { icon: Sprout, label: { fr: 'Sans parabènes', en: 'Paraben-free', ar: 'خالي من البارابين' } },
    { icon: Droplets, label: { fr: 'Hypoallergénique', en: 'Hypoallergenic', ar: 'لا يسبب الحساسية' } },
    { icon: ShieldCheck, label: { fr: 'Made in Tunisia', en: 'Made in Tunisia', ar: 'صُنع في تونس' } },
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 lg:gap-4 py-5 px-3 lg:px-4 bg-champagne/30 border-y border-border/50 mb-7">
      {attrs.map((a, i) => (
        <div key={i} className="flex flex-col items-center text-center gap-1.5">
          <a.icon className="h-4 w-4 lg:h-5 lg:w-5 text-gold flex-none" strokeWidth={1.5} />
          <span className="font-body text-[9px] lg:text-[10px] tracking-[0.05em] leading-tight text-foreground/80">
            {a.label[language]}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ProductAttributes;
