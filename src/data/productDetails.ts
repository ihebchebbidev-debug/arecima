import type { Product } from '@/data/products';

export type ProductKind = 'soleveil' | 'silk-shield' | 'duo';

export interface ProductHighlight {
  icon: 'sun' | 'flame' | 'droplets' | 'wind' | 'sparkles' | 'shield' | 'gift' | 'layers';
  label: { en: string; fr: string; ar: string };
}

export interface BundleItem {
  slug: string;
  step: number;
  role: { en: string; fr: string; ar: string };
  when: { en: string; fr: string; ar: string };
}

export interface ProductFAQItem {
  q: { en: string; fr: string; ar: string };
  a: { en: string; fr: string; ar: string };
}

export interface ProductPageMeta {
  kind: ProductKind;
  productType: 'single' | 'bundle';
  pairWithSlugs: string[];
  highlights: ProductHighlight[];
  bundleItems?: BundleItem[];
  savingsPercent?: number;
  faqs: ProductFAQItem[];
  testimonial: {
    quote: { en: string; fr: string; ar: string };
    author: string;
    location: { en: string; fr: string; ar: string };
  };
  showBeforeAfter: boolean;
  imageKey: string;
  galleryKeys?: string[];
}

const tri = (en: string, fr: string, ar: string) => ({ en, fr, ar });

/** Canonical catalog copy — merged onto API products by slug. */
export const CATALOG_PRODUCTS: Record<string, Omit<Product, 'apiId'>> = {
  'soleveil-protect-kpf30': {
    id: 'soleveil-protect-kpf30',
    name: tri('Soleveil Protect — KPF 30', 'Soleveil Protect — KPF 30', 'سولفيل بروتكت — KPF 30'),
    shortDescription: tri(
      'Leave-in hair shield · UV + Heat + Sea + Chlorine (KPF 30™)',
      'Écran capillaire sans rinçage · UV + Chaleur + Mer + Chlore (KPF 30™)',
      'واقٍ للشعر بدون شطف · UV + حرارة + بحر + كلور (KPF 30™)',
    ),
    description: tri(
      'The first hair shield inspired by solar KPF technology. A leave-in protective cream that simultaneously shields hair from UV rays, heat up to 230°C, sea salt, chlorine and humidity — while preserving keratin, softness and shine.',
      'Le premier écran protecteur capillaire inspiré de la technologie KPF solaire. Une crème leave-in qui protège simultanément les cheveux contre les UV, la chaleur jusqu\'à 230°C, le sel marin, le chlore et l\'humidité, tout en préservant la kératine, la douceur et la brillance.',
      'أول واقٍ شعري مستوحى من تقنية KPF الشمسية. كريم بدون شطف يحمي الشعر في آنٍ واحد من الأشعة فوق البنفسجية والحرارة حتى 230°م وملح البحر والكلور والرطوبة، مع الحفاظ على الكيراتين والنعومة واللمعان.',
    ),
    price: 129,
    image: 'product-oil',
    images: ['product-oil', 'product-sunscreen'],
    category: 'hair-care',
    rating: 4.9,
    reviewCount: 412,
    inStock: true,
    isBestSeller: true,
    isNew: true,
    size: '200 ml',
    ingredients: tri(
      'Amodimethicone, Polysilicone-29, Quaternium-95, Jojoba Seed Oil, Avocado Oil, Ethylhexyl Methoxycinnamate, Ethylhexyl Salicylate',
      'Amodimethicone, Polysilicone-29, Quaternium-95, Huile de jojoba, Huile d\'avocat, Ethylhexyl Methoxycinnamate, Ethylhexyl Salicylate',
      'أموديميثيكون، بوليسيليكون-29، كواترنيوم-95، زيت الجوجوبا، زيت الأفوكادو، إيثيل هكسيل ميثوكسي سيناميت، إيثيل هكسيل ساليسيلات',
    ),
    howToUse: tri(
      'Apply a small amount evenly on damp or dry hair, mid-lengths and ends, before sun, beach, pool or heat styling. Do not rinse. Reapply after swimming if needed.',
      'Appliquez une noisette uniformément sur cheveux humides ou secs, longueurs et pointes, avant le soleil, la plage, la piscine ou le coiffage chaud. Ne pas rincer. Réappliquez après la baignade si nécessaire.',
      'وزّعي كمية صغيرة بالتساوي على الشعر الرطب أو الجاف من الأطوال إلى الأطراف قبل الشمس أو البحر أو المسبح أو الحرارة. بدون شطف. أعيدي التطبيق بعد السباحة عند الحاجة.',
    ),
    benefits: {
      en: ['UV UVA/UVB protection (KPF 30™)', 'Heat protection up to 230°C', 'Anti-salt & anti-chlorine shield', 'Anti-frizz & color-preserving shine'],
      fr: ['Protection UV UVA/UVB (KPF 30™)', 'Thermoprotection jusqu\'à 230°C', 'Bouclier anti-sel & anti-chlore', 'Anti-frisottis & brillance protectrice couleur'],
      ar: ['حماية UVA/UVB (KPF 30™)', 'حماية حرارية حتى 230°م', 'درع ضد الملح والكلور', 'مضاد للهيشان وحماية لمعان اللون'],
    },
  },
  'silk-shield-spray': {
    id: 'silk-shield-spray',
    name: tri(
      'Silk Shield — Anti-Humidity & Anti-Frizz Heat Protect Spray',
      'Silk Shield — Spray Anti-Humidité & Anti-Frisottis Thermoprotecteur',
      'سيلك شيلد — بخاخ ضد الرطوبة والهيشان وحماية حرارية',
    ),
    shortDescription: tri(
      'Heat-activated anti-humidity & anti-frizz spray (230°C)',
      'Spray thermo-activé anti-humidité & anti-frisottis (230°C)',
      'بخاخ حراري ضد الرطوبة والهيشان (230°م)',
    ),
    description: tri(
      'A heat-activated leave-in spray that forms a double anti-humidity and anti-friction shield around the hair fiber, while offering thermal protection up to 230°C and progressive light repair. Smooth, disciplined, long-lasting results — even in extreme humidity.',
      'Un spray leave-in thermo-activé qui forme un double bouclier anti-humidité et anti-friction autour de la fibre capillaire, tout en offrant une protection thermique jusqu\'à 230°C et un effet réparateur progressif léger. Des cheveux lisses, disciplinés et longue tenue — même sous humidité extrême.',
      'بخاخ بدون شطف يُفعَّل بالحرارة، يشكّل درعًا مزدوجًا ضد الرطوبة والاحتكاك حول خصلة الشعر، مع حماية حرارية حتى 230°م وإصلاح تدريجي خفيف. شعر ناعم ومنضبط لوقت طويل، حتى في الرطوبة العالية.',
    ),
    price: 69,
    image: 'product-toner',
    images: ['product-toner'],
    category: 'hair-care',
    rating: 4.8,
    reviewCount: 318,
    inStock: true,
    isBestSeller: true,
    isNew: true,
    size: '200 ml',
    ingredients: tri(
      'PEG-12 Dimethicone, Polysilicone-29, Hydrolyzed Keratin, Dextran Hydroxypropyltrimonium Chloride, PEG-8',
      'PEG-12 Diméthicone, Polysilicone-29, Kératine hydrolysée, Dextran Hydroxypropyltrimonium Chloride, PEG-8',
      'PEG-12 ديميثيكون، بوليسيليكون-29، كيراتين متحلل، Dextran Hydroxypropyltrimonium Chloride، PEG-8',
    ),
    howToUse: tri(
      'Spray evenly on damp or dry hair, mid-lengths and ends, before blow-drying or heat styling. Comb through and style as usual. Do not rinse.',
      'Vaporisez uniformément sur cheveux humides ou secs, longueurs et pointes, avant brushing ou outils chauffants. Démêlez et coiffez comme d\'habitude. Ne pas rincer.',
      'رشّيه بالتساوي على الشعر الرطب أو الجاف من الأطوال إلى الأطراف قبل التجفيف أو التصفيف الحراري. مشّطي وصفّفي كالمعتاد. بدون شطف.',
    ),
    benefits: {
      en: ['Long-lasting anti-humidity & frizz control', 'Heat protection up to 230°C', 'Smoothing & shine enhancement', 'Reduces friction-related breakage'],
      fr: ['Contrôle durable du frisottis & anti-humidité', 'Thermoprotection jusqu\'à 230°C', 'Lissage & brillance renforcée', 'Réduit la casse liée au frottement'],
      ar: ['تحكم طويل الأمد بالهيشان والرطوبة', 'حماية حرارية حتى 230°م', 'تنعيم ولمعان معزز', 'يقلل الكسر الناتج عن الاحتكاك'],
    },
  },
  'rituel-cheveux-duo': {
    id: 'rituel-cheveux-duo',
    name: tri(
      'Hair Ritual Duo — Soleveil Protect + Silk Shield',
      'Duo Rituel Cheveux — Soleveil Protect + Silk Shield',
      'ثنائي طقس الشعر — سولفيل بروتكت + سيلك شيلد',
    ),
    shortDescription: tri(
      'The complete hair ritual: UV/heat shield + anti-humidity spray',
      'Le rituel cheveux complet : bouclier UV/chaleur + spray anti-humidité',
      'طقس العناية الكامل: درع UV/حرارة + بخاخ ضد الرطوبة',
    ),
    description: tri(
      'The complete Arecima hair ritual in one gift-ready set. Soleveil Protect KPF 30 leave-in cream shields hair from UV, heat (230°C), sea salt and chlorine. Silk Shield heat-activated spray locks in smoothness with a double anti-humidity and anti-friction barrier. Save compared to buying separately.',
      'Le rituel capillaire Arecima complet en coffret signature. La crème leave-in Soleveil Protect KPF 30 protège des UV, de la chaleur (230°C), du sel marin et du chlore. Le spray thermo-activé Silk Shield verrouille le lissé grâce à un double bouclier anti-humidité et anti-friction. Économisez par rapport à l\'achat séparé.',
      'طقس أريسيما الكامل في مجموعة جاهزة للإهداء. كريم سولفيل بروتكت KPF 30 بدون شطف يحمي من UV والحرارة (230°م) وملح البحر والكلور. بخاخ سيلك شيلد المُفعَّل بالحرارة يثبّت النعومة بدرع مزدوج ضد الرطوبة والاحتكاك. وفّري مقارنة بالشراء منفصلًا.',
    ),
    price: 179,
    originalPrice: 198,
    image: 'product-hair-duo',
    images: ['product-hair-duo', 'product-oil', 'product-toner'],
    category: 'gift-sets',
    rating: 4.9,
    reviewCount: 264,
    inStock: true,
    isBestSeller: true,
    isNew: true,
    size: '2 × 200 ml',
    ingredients: tri(
      'Soleveil Protect: Amodimethicone, Polysilicone-29, Quaternium-95, Jojoba & Avocado Oils, UV filters. Silk Shield: PEG-12 Dimethicone, Polysilicone-29, Hydrolyzed Keratin, Dextran Hydroxypropyltrimonium Chloride, PEG-8.',
      'Soleveil Protect : Amodimethicone, Polysilicone-29, Quaternium-95, Huiles de jojoba & avocat, filtres UV. Silk Shield : PEG-12 Diméthicone, Polysilicone-29, Kératine hydrolysée, Dextran Hydroxypropyltrimonium Chloride, PEG-8.',
      'سولفيل بروتكت: أموديميثيكون، بوليسيليكون-29، كواترنيوم-95، زيتا الجوجوبا والأفوكادو، فلاتر UV. سيلك شيلد: PEG-12 ديميثيكون، بوليسيليكون-29، كيراتين متحلل، Dextran Hydroxypropyltrimonium Chloride، PEG-8.',
    ),
    howToUse: tri(
      'Step 1 — Apply Soleveil Protect on damp or dry hair before sun, sea, pool or heat. Step 2 — Mist Silk Shield through lengths before blow-drying or styling. Comb through. Do not rinse either product.',
      'Étape 1 — Appliquez Soleveil Protect sur cheveux humides ou secs avant soleil, mer, piscine ou chaleur. Étape 2 — Vaporisez Silk Shield sur les longueurs avant brushing ou coiffage. Démêlez. Ne rincez aucun des deux produits.',
      'الخطوة 1 — ضعي سولفيل بروتكت قبل التعرض للشمس أو البحر أو الحرارة. الخطوة 2 — رشّي سيلك شيلد على الأطوال قبل التجفيف أو التصفيف. مشّطي. لا تشطفي أيًا من المنتجين.',
    ),
    benefits: {
      en: ['Complete UV + Heat + Sea + Chlorine protection', 'Long-lasting anti-frizz & anti-humidity', 'Heat shield up to 230°C on both steps', 'Save 10% vs buying separately'],
      fr: ['Protection complète UV + Chaleur + Mer + Chlore', 'Anti-frisottis & anti-humidité longue tenue', 'Bouclier thermique 230°C sur les deux étapes', 'Économisez 10 % vs l\'achat séparé'],
      ar: ['حماية كاملة UV + حرارة + بحر + كلور', 'مقاومة طويلة للرطوبة والهيشان', 'درع حراري 230°م في الخطوتين', 'وفّري 10% مقارنة بالشراء المنفصل'],
    },
  },
};

export const PRODUCT_PAGE_META: Record<string, ProductPageMeta> = {
  'soleveil-protect-kpf30': {
    kind: 'soleveil',
    productType: 'single',
    pairWithSlugs: ['silk-shield-spray', 'rituel-cheveux-duo'],
    imageKey: 'product-oil',
    galleryKeys: ['product-oil', 'product-sunscreen'],
    showBeforeAfter: true,
    highlights: [
      { icon: 'sun', label: tri('KPF 30™ UV shield', 'Bouclier UV KPF 30™', 'درع UV KPF 30™') },
      { icon: 'flame', label: tri('230°C heat protection', 'Thermoprotection 230°C', 'حماية حرارية 230°م') },
      { icon: 'droplets', label: tri('Anti-salt & chlorine', 'Anti-sel & anti-chlore', 'ضد الملح والكلور') },
      { icon: 'sparkles', label: tri('Color-safe shine', 'Brillance protectrice couleur', 'لمعان يحافظ على اللون') },
    ],
    faqs: [
      {
        q: tri('When should I apply Soleveil Protect?', 'Quand appliquer Soleveil Protect ?', 'متى أضع سولفيل بروتكت؟'),
        a: tri(
          'Before any exposure: sun, beach, pool, or before using hot tools. Works on damp or dry hair. Perfect as your daily defense layer.',
          'Avant toute exposition : soleil, plage, piscine, ou avant les outils chauffants. Convient aux cheveux humides ou secs. Votre couche de défense quotidienne.',
          'قبل أي تعرض: شمس، بحر، مسبح، أو قبل أدوات الحرارة. على الشعر الرطب أو الجاف. طبقة الحماية اليومية الم ideal.',
        ),
      },
      {
        q: tri('Can I use it with Silk Shield?', 'Puis-je l\'utiliser avec Silk Shield ?', 'هل يمكن الجمع مع سيلك شيلد؟'),
        a: tri(
          'Yes — Soleveil builds the protection layer; Silk Shield finishes with anti-humidity and heat-activated smoothness. Together they are the full Arecima ritual.',
          'Oui — Soleveil crée la couche de protection ; Silk Shield finalise avec anti-humidité et lissage thermo-activé. Ensemble, ils forment le rituel Arecima complet.',
          'نعم — سولفيل يبني طبقة الحماية؛ سيلك شيلد يثبّت النعومة ضد الرطوبة. معًا يشكلان طقس أريسيما الكامل.',
        ),
      },
      {
        q: tri('Is it suitable for colored hair?', 'Convient-il aux cheveux colorés ?', 'هل يناسب الشعر المصبوغ؟'),
        a: tri(
          'Absolutely. The formula helps preserve color vibrancy while protecting against UV fading and heat damage.',
          'Absolument. La formule aide à préserver l\'éclat de la couleur tout en protégeant contre la décoloration UV et les agressions thermiques.',
          'بالتأكيد. التركيبة تحافظ على حيوية اللون مع الحماية من البهتان بسبب الشمس والحرارة.',
        ),
      },
      {
        q: tri('Do I need to rinse?', 'Dois-je rincer ?', 'هل أشطف؟'),
        a: tri('No — this is a leave-in cream. Apply and style as usual.', 'Non — crème leave-in. Appliquez et coiffez.', 'لا — كريم بدون شطف. ضعيه وصفّفي.'),
      },
    ],
    testimonial: {
      quote: tri(
        '"My hair survived a Tunis summer — beach, sun, and daily straightening — without turning brittle. Soleveil is non-negotiable now."',
        '"Mes cheveux ont survécu à un été tunisien — plage, soleil et lissage quotidien — sans devenir cassants. Soleveil est devenu indispensable."',
        '"شعري صمد أمام صيف تونسي — بحر وشمس وتمليس يومي — دون أن يجف. سولفيل بروتكت أصبح لا غنى عنه."',
      ),
      author: 'Amira K.',
      location: tri('Sousse', 'Sousse', 'سوسة'),
    },
  },
  'silk-shield-spray': {
    kind: 'silk-shield',
    productType: 'single',
    pairWithSlugs: ['soleveil-protect-kpf30', 'rituel-cheveux-duo'],
    imageKey: 'product-toner',
    galleryKeys: ['product-toner'],
    showBeforeAfter: true,
    highlights: [
      { icon: 'wind', label: tri('Anti-humidity barrier', 'Barrière anti-humidité', 'حاجز ضد الرطوبة') },
      { icon: 'flame', label: tri('230°C heat protect', 'Thermoprotection 230°C', 'حماية حرارية 230°م') },
      { icon: 'layers', label: tri('Heat-activated formula', 'Formule thermo-activée', 'تركيبة تُفعَّل بالحرارة') },
      { icon: 'sparkles', label: tri('Silky, frizz-free finish', 'Finition soyeuse sans frisottis', 'لمسة حريرية بلا هيشان') },
    ],
    faqs: [
      {
        q: tri('Spray or cream — which first?', 'Spray ou crème — lequel en premier ?', 'البخاخ أم الكريم — أيهما أولًا؟'),
        a: tri(
          'Apply Soleveil Protect cream first for UV/sea/chlorine defense, then Silk Shield spray before blow-drying or heat styling for humidity control and finish.',
          'Appliquez d\'abord la crème Soleveil Protect pour la défense UV/mer/chlore, puis le spray Silk Shield avant le brushing pour le contrôle de l\'humidité et la finition.',
          'ضعي كريم سولفيل أولًا للحماية من UV والبحر، ثم بخاخ سيلك شيلد قبل التجفيف للتحكم بالرطوبة واللمسة النهائية.',
        ),
      },
      {
        q: tri('Will it weigh my hair down?', 'Est-ce que ça alourdit les cheveux ?', 'هل يثقل الشعر؟'),
        a: tri(
          'No — the lightweight spray is designed for fine to thick hair. Start with 2–3 mists and build if needed.',
          'Non — le spray léger convient des cheveux fins aux cheveux épais. Commencez par 2–3 vaporisations.',
          'لا — البخاخ خفيف ويناسب الشعر من الرفيع إلى الكثيف. ابدئي بـ 2–3 رشات.',
        ),
      },
      {
        q: tri('Does it work in humid weather?', 'Efficace par temps humide ?', 'هل يعمل في الجو الرطب؟'),
        a: tri(
          'Yes — the double anti-humidity and anti-friction shield is specifically engineered for Mediterranean humidity and frizz.',
          'Oui — le double bouclier anti-humidité et anti-friction est conçu pour l\'humidité méditerranéenne et les frisottis.',
          'نعم — الدرع المزدوج مصمم خصيصًا للرطوبة المتوسطية ومشكلة الهيشان.',
        ),
      },
    ],
    testimonial: {
      quote: tri(
        '"Humidity used to ruin my blow-dry by noon. Silk Shield keeps my hair smooth until evening — even in August in Tunis."',
        '"L\'humidité gâchait mon brushing dès midi. Silk Shield garde mes cheveux lisses jusqu\'au soir — même en août à Tunis."',
        '"الرطوبة كانت تفسد تصفيفتي قبل الظهر. سيلك شيلد يبقي شعري ناعمًا حتى المساء — حتى في أغسطس بتونس."',
      ),
      author: 'Leila M.',
      location: tri('Tunis', 'Tunis', 'تونس'),
    },
  },
  'rituel-cheveux-duo': {
    kind: 'duo',
    productType: 'bundle',
    pairWithSlugs: ['soleveil-protect-kpf30', 'silk-shield-spray'],
    savingsPercent: 10,
    imageKey: 'product-hair-duo',
    galleryKeys: ['product-hair-duo', 'product-oil', 'product-toner'],
    showBeforeAfter: true,
    bundleItems: [
      {
        slug: 'soleveil-protect-kpf30',
        step: 1,
        role: tri('Defense layer', 'Couche de défense', 'طبقة الحماية'),
        when: tri('Before sun, sea, pool or heat', 'Avant soleil, mer, piscine ou chaleur', 'قبل الشمس أو البحر أو الحرارة'),
      },
      {
        slug: 'silk-shield-spray',
        step: 2,
        role: tri('Finish & humidity lock', 'Finition & verrou anti-humidité', 'اللمسة النهائية ضد الرطوبة'),
        when: tri('Before blow-dry or styling', 'Avant brushing ou coiffage', 'قبل التجفيف أو التصفيف'),
      },
    ],
    highlights: [
      { icon: 'gift', label: tri('Gift-ready packaging', 'Coffret signature', 'تغليف جاهز للإهداء') },
      { icon: 'shield', label: tri('Full ritual in 2 steps', 'Rituel complet en 2 étapes', 'طقس كامل في خطوتين') },
      { icon: 'sparkles', label: tri('Save 19 TND', 'Économisez 19 TND', 'وفّري 19 د.ت') },
      { icon: 'flame', label: tri('230°C protection', 'Protection 230°C', 'حماية 230°م') },
    ],
    faqs: [
      {
        q: tri('What is included in the Duo?', 'Que contient le Duo ?', 'ماذا يتضمن الثنائي؟'),
        a: tri(
          'One full-size Soleveil Protect KPF 30 (200 ml) + one full-size Silk Shield spray (200 ml), in Arecima signature packaging.',
          'Un Soleveil Protect KPF 30 format 200 ml + un Silk Shield 200 ml, dans le coffret signature Arecima.',
          'عبوة سولفيل بروتكت 200 مل + عبوة سيلك شيلد 200 مل في تغليف أريسيما المميز.',
        ),
      },
      {
        q: tri('Is the Duo cheaper than buying separately?', 'Le Duo est-il moins cher ?', 'هل الثنائي أوفر؟'),
        a: tri(
          'Yes — 179 TND vs 198 TND purchased individually (129 + 69). You save 19 TND.',
          'Oui — 179 TND contre 198 TND à l\'unité (129 + 69). Vous économisez 19 TND.',
          'نعم — 179 د.ت مقابل 198 د.ت منفصلًا (129 + 69). توفير 19 د.ت.',
        ),
      },
      {
        q: tri('Can I gift this set?', 'Puis-je offrir ce coffret ?', 'هل يمكن إهداء المجموعة؟'),
        a: tri(
          'Perfect for gifting — the Duo ships in premium packaging ideal for birthdays, holidays, or treating yourself.',
          'Idéal en cadeau — le Duo est livré dans un coffret premium, parfait pour un anniversaire ou pour se faire plaisir.',
          'مثالي كهدية — يُشحن في علبة فاخرة، مناسب للأعياد أو لدلال نفسك.',
        ),
      },
    ],
    testimonial: {
      quote: tri(
        '"I bought the Duo for my sister and kept one for myself. Two products, zero bad hair days — the ritual actually works."',
        '"J\'ai acheté le Duo pour ma sœur et un pour moi. Deux produits, zéro mauvais jour capillaire — le rituel fonctionne vraiment."',
        '"اشتريت الثنائي لأختي وواحد لي. منتجان، لا أيام سيئة للشعر — الطقس فعّال فعلًا."',
      ),
      author: 'Yasmine B.',
      location: tri('Tunis', 'Tunis', 'تونس'),
    },
  },
};

export function getProductPageMeta(slug: string): ProductPageMeta | undefined {
  return PRODUCT_PAGE_META[slug];
}

export function enrichProduct(product: Product): Product {
  const catalog = CATALOG_PRODUCTS[product.id];
  if (!catalog) return product;

  const meta = PRODUCT_PAGE_META[product.id];
  const imageKey = meta?.imageKey || catalog.image;

  return {
    ...catalog,
    ...product,
    id: product.id,
    apiId: product.apiId,
    name: mergeTri(product.name, catalog.name),
    description: pickTri(product.description, catalog.description),
    shortDescription: pickTri(product.shortDescription, catalog.shortDescription),
    ingredients: pickTri(product.ingredients, catalog.ingredients),
    howToUse: pickTri(product.howToUse, catalog.howToUse),
    benefits: {
      en: catalog.benefits.en.length ? catalog.benefits.en : product.benefits.en,
      fr: catalog.benefits.fr.length ? catalog.benefits.fr : product.benefits.fr,
      ar: catalog.benefits.ar.length ? catalog.benefits.ar : product.benefits.ar,
    },
    price: product.price || catalog.price,
    originalPrice: product.originalPrice ?? catalog.originalPrice,
    inStock: product.inStock,
    rating: product.rating || catalog.rating,
    reviewCount: product.reviewCount || catalog.reviewCount,
    isNew: product.isNew ?? catalog.isNew,
    isBestSeller: product.isBestSeller ?? catalog.isBestSeller,
    size: product.size || catalog.size,
    category: product.category || catalog.category,
    image: imageKey,
    images: meta?.galleryKeys || catalog.images,
  };
}

function mergeTri(api: Product['name'], catalog: Product['name']) {
  return {
    en: api.en || catalog.en,
    fr: api.fr || catalog.fr,
    ar: api.ar || catalog.ar,
  };
}

function pickTri(api: Product['description'], catalog: Product['description']) {
  const hasApi = api.en?.length > 20 || api.fr?.length > 20;
  return hasApi ? api : catalog;
}
