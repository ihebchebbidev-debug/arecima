import { Leaf, HeartHandshake, Flame, Sun, Droplets, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ProductKind } from '@/data/productDetails';

interface ProductAttributesProps {
  kind?: ProductKind;
}

const ProductAttributes = ({ kind = 'soleveil' }: ProductAttributesProps) => {
  const { language } = useLanguage();

  const hairAttrs = [
    { icon: Leaf, label: { fr: 'Vegan', en: 'Vegan', ar: 'نباتي' } },
    { icon: HeartHandshake, label: { fr: 'Sans cruauté', en: 'Cruelty-free', ar: 'بدون قسوة' } },
    { icon: Flame, label: { fr: '230°C thermoprotect', en: '230°C heat protect', ar: 'حماية 230°م' } },
    { icon: Sun, label: { fr: 'Made in Tunisia', en: 'Made in Tunisia', ar: 'صُنع في تونس' } },
    { icon: Droplets, label: { fr: 'Leave-in · sans rinçage', en: 'Leave-in · no rinse', ar: 'بدون شطف' } },
    { icon: ShieldCheck, label: { fr: 'Tous types de cheveux', en: 'All hair types', ar: 'كل أنواع الشعر' } },
  ];

  const soleveilAttrs = [
    ...hairAttrs.slice(0, 3),
    { icon: Sun, label: { fr: 'KPF 30™ UV', en: 'KPF 30™ UV', ar: 'KPF 30™ UV' } },
    { icon: Droplets, label: { fr: 'Anti-sel & chlore', en: 'Anti-salt & chlorine', ar: 'ضد الملح والكلور' } },
    hairAttrs[5],
  ];

  const silkAttrs = [
    ...hairAttrs.slice(0, 3),
    { icon: Droplets, label: { fr: 'Anti-humidité', en: 'Anti-humidity', ar: 'ضد الرطوبة' } },
    { icon: ShieldCheck, label: { fr: 'Thermo-activé', en: 'Heat-activated', ar: 'يُفعَّل بالحرارة' } },
    hairAttrs[5],
  ];

  const duoAttrs = hairAttrs;

  const attrs = kind === 'silk-shield' ? silkAttrs : kind === 'duo' ? duoAttrs : soleveilAttrs;

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
