export interface Product {
  /** URL slug — used in routes and favorites */
  id: string;
  /** MySQL product id — required for checkout / orders API */
  apiId?: string;
  name: { en: string; fr: string; ar: string };
  description: { en: string; fr: string; ar: string };
  shortDescription: { en: string; fr: string; ar: string };
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  size: string;
  ingredients: { en: string; fr: string; ar: string };
  howToUse: { en: string; fr: string; ar: string };
  benefits: { en: string[]; fr: string[]; ar: string[] };
}

export const products: Product[] = [
  {
    id: 'soleveil-protect-kpf30',
    name: {
      en: 'Soleveil Protect — KPF 30',
      fr: 'Soleveil Protect — KPF 30',
      ar: 'سولفيل بروتكت — KPF 30'
    },
    description: {
      en: 'The first hair shield inspired by solar KPF technology. A leave-in protective cream that simultaneously shields hair from UV rays, heat up to 230°C, sea salt, chlorine and humidity — while preserving keratin, softness and shine.',
      fr: 'Le premier écran protecteur capillaire inspiré de la technologie KPF solaire. Une crème leave-in qui protège simultanément les cheveux contre les UV, la chaleur jusqu\'à 230°C, le sel marin, le chlore et l\'humidité, tout en préservant la kératine, la douceur et la brillance.',
      ar: 'أول واقٍ شعري مستوحى من تقنية KPF الشمسية. كريم بدون شطف يحمي الشعر في آنٍ واحد من الأشعة فوق البنفسجية والحرارة حتى 230°م وملح البحر والكلور والرطوبة، مع الحفاظ على الكيراتين والنعومة واللمعان.'
    },
    shortDescription: {
      en: 'Leave-in hair shield · UV + Heat + Sea + Chlorine (KPF 30™)',
      fr: 'Écran capillaire sans rinçage · UV + Chaleur + Mer + Chlore (KPF 30™)',
      ar: 'واقٍ للشعر بدون شطف · UV + حرارة + بحر + كلور (KPF 30™)'
    },
    price: 129,
    image: 'soleveil-protect-kpf30',
    category: 'hair-care',
    rating: 4.9,
    reviewCount: 412,
    inStock: true,
    isBestSeller: true,
    isNew: true,
    size: '200ml',
    ingredients: {
      en: 'Amodimethicone, Polysilicone-29, Quaternium-95, Jojoba Seed Oil, Avocado Oil, Ethylhexyl Methoxycinnamate, Ethylhexyl Salicylate',
      fr: 'Amodimethicone, Polysilicone-29, Quaternium-95, Huile de jojoba, Huile d\'avocat, Ethylhexyl Methoxycinnamate, Ethylhexyl Salicylate',
      ar: 'أموديميثيكون، بوليسيليكون-29، كواترنيوم-95، زيت الجوجوبا، زيت الأفوكادو، إيثيل هكسيل ميثوكسي سيناميت، إيثيل هكسيل ساليسيلات'
    },
    howToUse: {
      en: 'Apply a small amount of the leave-in cream evenly on damp or dry hair, lengths and ends, before sun, beach, pool or heat styling. Do not rinse.',
      fr: 'Appliquez une noisette de crème leave-in sur cheveux humides ou secs, longueurs et pointes, avant exposition au soleil, à la mer, à la piscine ou au coiffage chaud. Ne pas rincer.',
      ar: 'وزّعي كمية صغيرة من الكريم على الشعر الرطب أو الجاف، من الأطوال إلى الأطراف، قبل التعرض للشمس أو البحر أو المسبح أو أدوات التصفيف الحرارية. بدون شطف.'
    },
    benefits: {
      en: ['UV UVA/UVB protection (KPF 30™)', 'Heat protection up to 230°C', 'Anti-salt & anti-chlorine shield', 'Anti-frizz & color-preserving shine'],
      fr: ['Protection UV UVA/UVB (KPF 30™)', 'Thermoprotection jusqu\'à 230°C', 'Bouclier anti-sel & anti-chlore', 'Anti-frisottis & brillance protectrice couleur'],
      ar: ['حماية UVA/UVB (KPF 30™)', 'حماية حرارية حتى 230°م', 'درع ضد الملح والكلور', 'مضاد للهيشان وحماية لمعان اللون']
    }
  },
  {
    id: 'silk-shield-spray',
    name: {
      en: 'Silk Shield — Anti-Humidity & Anti-Frizz Heat Protect Spray',
      fr: 'Silk Shield — Spray Anti-Humidité & Anti-Frisottis Thermoprotecteur',
      ar: 'سيلك شيلد — بخاخ ضد الرطوبة والهيشان وحماية حرارية'
    },
    description: {
      en: 'A heat-activated leave-in spray that forms a double anti-humidity and anti-friction shield around the hair fiber, while offering thermal protection up to 230°C and progressive light repair. Smooth, disciplined, long-lasting results — even in extreme humidity.',
      fr: 'Un spray leave-in thermo-activé qui forme un double bouclier anti-humidité et anti-friction autour de la fibre capillaire, tout en offrant une protection thermique jusqu\'à 230°C et un effet réparateur progressif léger. Des cheveux lisses, disciplinés et longue tenue — même sous humidité extrême.',
      ar: 'بخاخ بدون شطف يُفعَّل بالحرارة، يشكّل درعًا مزدوجًا ضد الرطوبة والاحتكاك حول خصلة الشعر، مع حماية حرارية حتى 230°م وإصلاح تدريجي خفيف. شعر ناعم ومنضبط لوقت طويل، حتى في الرطوبة العالية.'
    },
    shortDescription: {
      en: 'Heat-activated anti-humidity & anti-frizz spray (230°C)',
      fr: 'Spray thermo-activé anti-humidité & anti-frisottis (230°C)',
      ar: 'بخاخ حراري ضد الرطوبة والهيشان (230°م)'
    },
    price: 69,
    image: 'silk-shield-spray',
    category: 'hair-care',
    rating: 4.8,
    reviewCount: 318,
    inStock: true,
    isBestSeller: true,
    isNew: true,
    size: '200ml',
    ingredients: {
      en: 'PEG-12 Dimethicone, Polysilicone-29, Hydrolyzed Keratin, Dextran Hydroxypropyltrimonium Chloride, PEG-8',
      fr: 'PEG-12 Diméthicone, Polysilicone-29, Kératine hydrolysée, Dextran Hydroxypropyltrimonium Chloride, PEG-8',
      ar: 'PEG-12 ديميثيكون، بوليسيليكون-29، كيراتين متحلل، Dextran Hydroxypropyltrimonium Chloride، PEG-8'
    },
    howToUse: {
      en: 'Spray evenly on damp or dry hair, lengths and ends, before blow-drying or heat styling. Comb through and style as usual. Do not rinse.',
      fr: 'Vaporisez uniformément sur cheveux humides ou secs, longueurs et pointes, avant brushing ou outils chauffants. Démêlez et coiffez comme d\'habitude. Ne pas rincer.',
      ar: 'رشّيه بالتساوي على الشعر الرطب أو الجاف من الأطوال إلى الأطراف قبل التجفيف أو التصفيف الحراري. مشّطي وصفّفي كالمعتاد. بدون شطف.'
    },
    benefits: {
      en: ['Long-lasting anti-humidity & frizz control', 'Heat protection up to 230°C', 'Smoothing & shine enhancement', 'Reduces friction-related breakage'],
      fr: ['Contrôle durable du frisottis & anti-humidité', 'Thermoprotection jusqu\'à 230°C', 'Lissage & brillance renforcée', 'Réduit la casse liée au frottement'],
      ar: ['تحكم طويل الأمد بالهيشان والرطوبة', 'حماية حرارية حتى 230°م', 'تنعيم ولمعان معزز', 'يقلل الكسر الناتج عن الاحتكاك']
    }
  },
  {
    id: 'rituel-cheveux-duo',
    name: {
      en: 'Hair Ritual Duo — Soleveil Protect + Silk Shield',
      fr: 'Duo Rituel Cheveux — Soleveil Protect + Silk Shield',
      ar: 'ثنائي طقس الشعر — سولفيل بروتكت + سيلك شيلد'
    },
    description: {
      en: 'The complete Arecima hair ritual: Soleveil Protect KPF 30 leave-in cream shields hair from UV, heat (230°C), sea salt and chlorine, while Silk Shield heat-activated spray locks in smoothness with a double anti-humidity and anti-friction barrier. Together, they deliver disciplined, luminous and protected hair — every day, every climate.',
      fr: 'Le rituel capillaire Arecima complet : la crème leave-in Soleveil Protect KPF 30 protège les cheveux des UV, de la chaleur (230°C), du sel marin et du chlore, tandis que le spray thermo-activé Silk Shield verrouille le lissé grâce à un double bouclier anti-humidité et anti-friction. Ensemble, ils offrent des cheveux disciplinés, lumineux et protégés — chaque jour, sous tous les climats.',
      ar: 'طقس العناية الكامل من أريسيما: كريم سولفيل بروتكت KPF 30 بدون شطف يحمي الشعر من الأشعة فوق البنفسجية والحرارة (230°م) وملح البحر والكلور، بينما يثبّت بخاخ سيلك شيلد المُفعَّل بالحرارة النعومة بفضل درع مزدوج ضد الرطوبة والاحتكاك. معًا، يمنحان شعرًا منضبطًا ومضيئًا ومحميًا كل يوم وفي كل المناخات.'
    },
    shortDescription: {
      en: 'The complete hair ritual: UV/heat shield + anti-humidity spray',
      fr: 'Le rituel cheveux complet : bouclier UV/chaleur + spray anti-humidité',
      ar: 'طقس العناية الكامل: درع UV/حرارة + بخاخ ضد الرطوبة'
    },
    price: 179,
    originalPrice: 198,
    image: 'rituel-cheveux-duo',
    category: 'hair-care',
    rating: 4.9,
    reviewCount: 264,
    inStock: true,
    isBestSeller: true,
    isNew: true,
    size: '2 × 200ml',
    ingredients: {
      en: 'Soleveil Protect: Amodimethicone, Polysilicone-29, Quaternium-95, Jojoba & Avocado Oils, UV filters. Silk Shield: PEG-12 Dimethicone, Polysilicone-29, Hydrolyzed Keratin, Dextran Hydroxypropyltrimonium Chloride, PEG-8.',
      fr: 'Soleveil Protect : Amodimethicone, Polysilicone-29, Quaternium-95, Huiles de jojoba & avocat, filtres UV. Silk Shield : PEG-12 Diméthicone, Polysilicone-29, Kératine hydrolysée, Dextran Hydroxypropyltrimonium Chloride, PEG-8.',
      ar: 'سولفيل بروتكت: أموديميثيكون، بوليسيليكون-29، كواترنيوم-95، زيتا الجوجوبا والأفوكادو، فلاتر UV. سيلك شيلد: PEG-12 ديميثيكون، بوليسيليكون-29، كيراتين متحلل، Dextran Hydroxypropyltrimonium Chloride، PEG-8.'
    },
    howToUse: {
      en: 'Step 1 — Apply Soleveil Protect on damp or dry hair before sun, sea, pool or heat styling. Step 2 — Mist Silk Shield through lengths before blow-drying or heat styling. Comb through and style. Do not rinse.',
      fr: 'Étape 1 — Appliquez Soleveil Protect sur cheveux humides ou secs avant exposition au soleil, à la mer, à la piscine ou aux outils chauffants. Étape 2 — Vaporisez Silk Shield sur les longueurs avant brushing ou coiffage thermique. Démêlez et coiffez. Ne pas rincer.',
      ar: 'الخطوة 1 — ضعي سولفيل بروتكت على الشعر الرطب أو الجاف قبل التعرض للشمس أو البحر أو المسبح أو الحرارة. الخطوة 2 — رشّي سيلك شيلد على الأطوال قبل التجفيف أو التصفيف الحراري. مشّطي وصفّفي. بدون شطف.'
    },
    benefits: {
      en: ['Complete UV + Heat + Sea + Chlorine protection', 'Long-lasting anti-frizz & anti-humidity', 'Heat shield up to 230°C', 'Smoother, shinier, stronger hair'],
      fr: ['Protection complète UV + Chaleur + Mer + Chlore', 'Anti-frisottis & anti-humidité longue tenue', 'Bouclier thermique jusqu\'à 230°C', 'Cheveux plus lisses, brillants et renforcés'],
      ar: ['حماية كاملة من UV + الحرارة + البحر + الكلور', 'مقاومة طويلة للرطوبة والهيشان', 'درع حراري حتى 230°م', 'شعر أنعم وأكثر لمعانًا وقوة']
    }
  },
];

export const categories = [
  { id: 'hair-care', name: { en: 'Hair Care', fr: 'Soin Cheveux', ar: 'العناية بالشعر' } },
  { id: 'gift-sets', name: { en: 'Gift Sets', fr: 'Coffrets', ar: 'علب الهدايا' } },
];
