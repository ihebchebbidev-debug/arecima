import blogSoleveilKpf30 from '@/assets/blog-soleveil-kpf30.jpg';
import blogSilkShieldSpray from '@/assets/blog-silk-shield-spray.jpg';
import blogHairRitualDuo from '@/assets/blog-hair-ritual-duo.jpg';
import blogSummerBeach from '@/assets/blog-summer-beach.jpg';
import blogHeatStyling from '@/assets/blog-heat-styling.jpg';
import blogAntiFrizz from '@/assets/blog-anti-frizz.jpg';

type Tri = { en: string; fr: string; ar: string };

export interface BlogSection { heading: Tri; body: Tri; }
export interface BlogFAQ { q: Tri; a: Tri; }

export interface BlogPost {
  id: string;
  title: Tri;
  excerpt: Tri;
  content: Tri;
  sections?: BlogSection[];
  faq?: BlogFAQ[];
  metaDescription?: Tri;
  tags?: Tri[];
  image: string;
  category: Tri;
  date: string;
  readTime: number;
  author?: string;
}

const CAT_HAIR: Tri = { en: 'Hair Care', fr: 'Soin Cheveux', ar: 'العناية بالشعر' };
const CAT_RITUAL: Tri = { en: 'Rituals', fr: 'Rituels', ar: 'الطقوس' };
const CAT_SUMMER: Tri = { en: 'Summer', fr: 'Été', ar: 'الصيف' };

export const blogPosts: BlogPost[] = [
  {
    id: 'soleveil-protect-kpf30-explained',
    title: {
      en: 'Soleveil Protect KPF 30: The First Hair Sunscreen Inspired by Solar Science',
      fr: 'Soleveil Protect KPF 30 : Le Premier Écran Capillaire Inspiré de la Science Solaire',
      ar: 'سولفيل بروتكت KPF 30: أول واقٍ للشعر مستوحى من علم الشمس'
    },
    excerpt: {
      en: 'Just as SPF protects your skin, KPF 30™ shields your hair from UV, heat, salt and chlorine. Here is how Soleveil Protect works — and why your hair needs it daily.',
      fr: 'Comme le SPF protège votre peau, le KPF 30™ protège vos cheveux des UV, de la chaleur, du sel et du chlore. Voici comment Soleveil Protect agit — et pourquoi vos cheveux en ont besoin chaque jour.',
      ar: 'كما يحمي SPF بشرتك، يحمي KPF 30™ شعرك من الأشعة فوق البنفسجية والحرارة والملح والكلور. إليك كيف يعمل سولفيل بروتكت.'
    },
    content: {
      en: 'UV rays do to your hair what they do to your skin — they break disulfide bonds in keratin, oxidize melanin (causing color to fade), and dry out the cuticle. Soleveil Protect is the first Arecima leave-in cream built around a Keratin Protection Factor (KPF 30™), combining UV filters, heat protectants up to 230°C, and anti-salt/anti-chlorine actives in a single weightless step.',
      fr: 'Les UV abîment les cheveux comme la peau — ils brisent les ponts disulfure de la kératine, oxydent la mélanine (la couleur s\'éclaircit) et assèchent la cuticule. Soleveil Protect est la première crème leave-in Arecima construite autour d\'un Keratin Protection Factor (KPF 30™), associant filtres UV, thermoprotecteurs jusqu\'à 230°C et actifs anti-sel/anti-chlore en une seule étape légère.',
      ar: 'تؤثر الأشعة فوق البنفسجية على الشعر كما تؤثر على البشرة — تكسر روابط الكيراتين، تؤكسد الميلانين (يفقد اللون لمعانه)، وتجفف الحراشف. سولفيل بروتكت هو أول كريم Arecima بدون شطف مبني حول Keratin Protection Factor (KPF 30™).'
    },
    sections: [
      {
        heading: { en: 'What KPF 30™ Actually Means', fr: 'Ce que Signifie Réellement KPF 30™', ar: 'ماذا يعني KPF 30™ فعليًا' },
        body: {
          en: 'KPF (Keratin Protection Factor) measures how well a formula preserves the keratin structure of hair under UVA/UVB exposure. KPF 30™ blocks roughly 97% of damaging rays, preventing protein loss, color fade and the rough straw-like texture sun-exposed hair develops by August.',
          fr: 'Le KPF (Keratin Protection Factor) mesure la capacité d\'une formule à préserver la kératine sous UVA/UVB. KPF 30™ bloque environ 97% des rayons nocifs, prévenant la perte de protéines, la décoloration et la texture sèche typique de fin d\'été.',
          ar: 'يقيس KPF قدرة التركيبة على حماية بنية الكيراتين تحت الأشعة فوق البنفسجية. يحجب KPF 30™ حوالي 97% من الأشعة الضارة.'
        }
      },
      {
        heading: { en: 'Inside the Formula', fr: 'À l\'Intérieur de la Formule', ar: 'داخل التركيبة' },
        body: {
          en: 'Ethylhexyl Methoxycinnamate and Ethylhexyl Salicylate act as photostable UV filters. Amodimethicone, Polysilicone-29 and Quaternium-95 form a flexible heat-resistant film up to 230°C. Jojoba and avocado oils restore lipids stripped by sea salt and chlorine — without weighing the hair down.',
          fr: 'L\'Ethylhexyl Methoxycinnamate et le Salicylate jouent le rôle de filtres UV photostables. Amodimethicone, Polysilicone-29 et Quaternium-95 forment un film thermorésistant flexible jusqu\'à 230°C. Les huiles de jojoba et d\'avocat restaurent les lipides perdus à cause du sel et du chlore.',
          ar: 'تعمل فلاتر UV الثابتة ضوئيًا مع طبقة سيليكون مرنة تتحمل حتى 230°م، وزيوت الجوجوبا والأفوكادو لاستعادة الدهون.'
        }
      },
      {
        heading: { en: 'How to Use It in 10 Seconds', fr: 'Comment l\'Utiliser en 10 Secondes', ar: 'كيفية استخدامه في 10 ثوانٍ' },
        body: {
          en: 'On damp or dry hair, dispense one pump (more for long or thick hair) into your palms, rub them together, and run through lengths and ends. Reapply before swimming, beach time, or heat tools. No rinse.',
          fr: 'Sur cheveux humides ou secs, une pression (plus pour cheveux longs/épais) au creux des mains, frottez et passez sur les longueurs et pointes. Réappliquez avant baignade, plage ou outils chauffants. Sans rinçage.',
          ar: 'على شعر رطب أو جاف، ضخة واحدة بين الراحتين ومرريها على الأطوال والأطراف. أعيدي التطبيق قبل السباحة أو الحرارة. بدون شطف.'
        }
      }
    ],
    faq: [
      {
        q: { en: 'Can I use Soleveil Protect daily?', fr: 'Puis-je utiliser Soleveil Protect chaque jour ?', ar: 'هل يمكنني استخدامه يوميًا؟' },
        a: { en: 'Yes. Soleveil Protect is leave-in and lightweight enough for daily UV and pollution defense, even on fine hair.', fr: 'Oui. Soleveil Protect est leave-in et assez léger pour une utilisation quotidienne, même sur cheveux fins.', ar: 'نعم. خفيف بما يكفي للاستخدام اليومي حتى على الشعر الناعم.' }
      },
      {
        q: { en: 'Does it replace my heat protectant?', fr: 'Remplace-t-il mon thermoprotecteur ?', ar: 'هل يغني عن حماية الحرارة؟' },
        a: { en: 'Yes — Soleveil Protect is rated for heat tools up to 230°C, so it doubles as a heat shield for blow-dries and straighteners.', fr: 'Oui — Soleveil Protect résiste à 230°C et fait office de bouclier thermique pour brushing et lisseur.', ar: 'نعم — يحمي حتى 230°م ويعمل كحماية حرارية.' }
      }
    ],
    image: blogSoleveilKpf30,
    category: CAT_HAIR,
    date: '2026-05-22',
    readTime: 6,
    tags: [
      { en: 'soleveil protect', fr: 'soleveil protect', ar: 'سولفيل بروتكت' },
      { en: 'kpf 30', fr: 'kpf 30', ar: 'KPF 30' },
      { en: 'uv protection', fr: 'protection uv', ar: 'حماية UV' }
    ]
  },
  {
    id: 'silk-shield-anti-humidity-spray',
    title: {
      en: 'Silk Shield: The Heat-Activated Spray That Beats Humidity for 24 Hours',
      fr: 'Silk Shield : Le Spray Thermo-Activé Qui Bat l\'Humidité Pendant 24 Heures',
      ar: 'سيلك شيلد: البخاخ الذي يُفعَّل بالحرارة ويقاوم الرطوبة 24 ساعة'
    },
    excerpt: {
      en: 'A blow-dry that survives a Mediterranean summer? Silk Shield uses heat-activated polymers and hydrolyzed keratin to lock in smoothness even at 80%+ humidity.',
      fr: 'Un brushing qui survit à un été méditerranéen ? Silk Shield utilise des polymères thermo-activés et de la kératine hydrolysée pour verrouiller le lissé, même à 80% d\'humidité.',
      ar: 'تصفيف يدوم في صيف البحر الأبيض المتوسط؟ يستخدم سيلك شيلد بوليمرات تُفعَّل بالحرارة وكيراتين متحلل لتثبيت النعومة حتى في رطوبة 80%.'
    },
    content: {
      en: 'Frizz is not a hair flaw — it is a physics problem. Dry hair absorbs ambient moisture, swells, and lifts its cuticle. Silk Shield places a double anti-humidity and anti-friction film around the fiber the moment heat touches it. The result: blow-dries that stay sleek from morning coffee to evening dinner — even when the air is heavy.',
      fr: 'Le frisottis n\'est pas un défaut, c\'est de la physique. Le cheveu sec absorbe l\'humidité ambiante, gonfle, soulève sa cuticule. Silk Shield dépose un double film anti-humidité et anti-friction dès que la chaleur l\'active. Brushing impeccable du matin au soir, même quand l\'air est lourd.',
      ar: 'التجعد ليس عيبًا بل فيزياء. الشعر الجاف يمتص الرطوبة ويتمدد. يضع سيلك شيلد طبقة مزدوجة ضد الرطوبة والاحتكاك بمجرد لمس الحرارة لها.'
    },
    sections: [
      {
        heading: { en: 'Why "Heat-Activated" Changes Everything', fr: 'Pourquoi "Thermo-Activé" Change Tout', ar: 'لماذا يغيّر التفعيل الحراري كل شيء' },
        body: {
          en: 'Polysilicone-29 is dormant at room temperature, then cross-links into a sleek film as soon as your dryer or iron reaches 130°C+. That cross-linked film is what actually blocks humidity from reaching the cuticle — not just coating it, but sealing it.',
          fr: 'Le Polysilicone-29 reste dormant à température ambiante, puis se réticule en film lisse dès que votre sèche-cheveux ou lisseur atteint 130°C+. Ce film verrouille la cuticule au lieu de simplement l\'enrober.',
          ar: 'يبقى Polysilicone-29 خاملًا في درجة حرارة الغرفة ثم يتشابك في طبقة ناعمة عند 130°م+، فيغلق الحراشف بدلًا من تغطيتها فقط.'
        }
      },
      {
        heading: { en: 'Keratin Repair as You Style', fr: 'Une Réparation Kératine Pendant le Coiffage', ar: 'إصلاح كيراتيني أثناء التصفيف' },
        body: {
          en: 'Hydrolyzed keratin in Silk Shield is small enough to enter micro-cracks in the cuticle and rebuild missing protein structure. Use after use, hair becomes measurably stronger — not just smoother on day one.',
          fr: 'La kératine hydrolysée de Silk Shield est assez fine pour entrer dans les micro-fissures de la cuticule et reconstruire la protéine manquante. Au fil des utilisations, le cheveu devient plus fort, pas seulement plus lisse.',
          ar: 'الكيراتين المتحلل في سيلك شيلد صغير بما يكفي ليدخل الشقوق الدقيقة ويعيد بناء البروتين المفقود.'
        }
      },
      {
        heading: { en: 'Your 5-Second Pre-Style Step', fr: 'Votre Étape Pré-Coiffage en 5 Secondes', ar: 'خطوتك قبل التصفيف في 5 ثوانٍ' },
        body: {
          en: 'On damp hair: 4–6 mists across mid-lengths and ends, comb through, then blow-dry or iron as usual. On dry hair touch-ups: 2 mists, run a warm iron once.',
          fr: 'Sur cheveux humides : 4 à 6 pulvérisations des longueurs aux pointes, démêlez, puis brushing ou lisseur. Sur retouche à sec : 2 pulvérisations, un passage de lisseur tiède.',
          ar: 'على شعر رطب: 4-6 رشات على الأطوال والأطراف، مشّطي ثم استخدمي المجفف أو المكواة.'
        }
      }
    ],
    faq: [
      {
        q: { en: 'Will Silk Shield weigh down fine hair?', fr: 'Silk Shield alourdit-il les cheveux fins ?', ar: 'هل يثقل الشعر الناعم؟' },
        a: { en: 'No — the spray is featherweight and the film only forms with heat, so it never feels sticky or greasy on fine hair.', fr: 'Non — le spray est ultra-léger et le film ne se forme qu\'avec la chaleur, jamais collant.', ar: 'لا — البخاخ خفيف جدًا ولا تتكون الطبقة إلا مع الحرارة.' }
      },
      {
        q: { en: 'Can I use it without heat?', fr: 'Puis-je l\'utiliser sans chaleur ?', ar: 'هل يمكن استخدامه بدون حرارة؟' },
        a: { en: 'You can, but the anti-humidity film needs heat to fully form. For air-dry days, pair it with Soleveil Protect instead.', fr: 'Oui, mais le film anti-humidité a besoin de chaleur pour se former. Pour séchage à l\'air, préférez Soleveil Protect.', ar: 'يمكن، لكن الطبقة الكاملة تحتاج حرارة. للتجفيف الطبيعي، استخدمي سولفيل بروتكت.' }
      }
    ],
    image: blogSilkShieldSpray,
    category: CAT_HAIR,
    date: '2026-05-18',
    readTime: 5,
    tags: [
      { en: 'silk shield', fr: 'silk shield', ar: 'سيلك شيلد' },
      { en: 'anti-frizz', fr: 'anti-frisottis', ar: 'ضد التجعد' },
      { en: 'heat protection', fr: 'thermoprotection', ar: 'حماية حرارية' }
    ]
  },
  {
    id: 'arecima-hair-ritual-duo',
    title: {
      en: 'The Arecima Hair Ritual Duo: One AM Step, One PM Step, Zero Bad Hair Days',
      fr: 'Le Duo Rituel Cheveux Arecima : Une Étape AM, Une Étape PM, Zéro Mauvais Jour',
      ar: 'ثنائي طقس الشعر Arecima: خطوة صباحية وأخرى مسائية وصفر أيام شعر سيئ'
    },
    excerpt: {
      en: 'Soleveil Protect protects what you have. Silk Shield perfects how it looks. Together they are the only two products your hair actually needs.',
      fr: 'Soleveil Protect protège ce que vous avez. Silk Shield sublime ce que vous voyez. Ensemble, les deux seuls soins dont vos cheveux ont besoin.',
      ar: 'سولفيل بروتكت يحمي شعرك، وسيلك شيلد يجمّله. معًا هما المنتجان الوحيدان اللذان يحتاجهما شعرك فعلًا.'
    },
    content: {
      en: 'Most haircare routines fail because they ask too much: shampoo, conditioner, mask, oil, leave-in, serum, mist. The Arecima Duo replaces that pile with two intelligent steps designed to layer perfectly. Soleveil Protect builds the defense layer. Silk Shield builds the finish layer. Two products. Five seconds each. Every benefit your hair can have in one ritual.',
      fr: 'La plupart des routines capillaires échouent parce qu\'elles exigent trop : shampoing, conditionneur, masque, huile, leave-in, sérum, brume. Le Duo Arecima remplace tout par deux étapes intelligentes conçues pour se superposer parfaitement. Soleveil Protect crée la défense. Silk Shield crée la finition.',
      ar: 'معظم روتينات الشعر تفشل لأنها تطلب الكثير. ثنائي Arecima يستبدل كل ذلك بخطوتين مصممتين للعمل معًا: سولفيل بروتكت للحماية، سيلك شيلد للتنعيم.'
    },
    sections: [
      {
        heading: { en: 'Step 1 — Morning Defense', fr: 'Étape 1 — Défense du Matin', ar: 'الخطوة 1 — حماية الصباح' },
        body: {
          en: 'After shower, on damp hair, apply one pump of Soleveil Protect from mid-length to ends. This shields against UV, sea salt, chlorine and city pollution for the whole day.',
          fr: 'Après la douche, sur cheveux humides, appliquez une pression de Soleveil Protect des longueurs aux pointes. Bouclier UV, sel, chlore et pollution toute la journée.',
          ar: 'بعد الاستحمام، على شعر رطب، ضخة من سولفيل بروتكت من المنتصف إلى الأطراف. حماية لليوم كله.'
        }
      },
      {
        heading: { en: 'Step 2 — Style with Silk Shield', fr: 'Étape 2 — Coiffez avec Silk Shield', ar: 'الخطوة 2 — صفّفي مع سيلك شيلد' },
        body: {
          en: 'Before your dryer or iron, mist 4–6 sprays of Silk Shield across the lengths. The heat activates the anti-humidity film and locks in smoothness for 24 hours.',
          fr: 'Avant brushing ou lisseur, 4 à 6 pulvérisations de Silk Shield sur les longueurs. La chaleur active le film anti-humidité, lissé verrouillé 24h.',
          ar: 'قبل التصفيف الحراري، 4-6 رشات من سيلك شيلد. الحرارة تُفعّل الطبقة وتحبس النعومة 24 ساعة.'
        }
      },
      {
        heading: { en: 'Why The Order Matters', fr: 'Pourquoi l\'Ordre Compte', ar: 'لماذا الترتيب مهم' },
        body: {
          en: 'Soleveil Protect is a cream that bonds to the cuticle. Silk Shield is a spray that builds its film on top with heat. Reverse the order and the cream blocks the spray from forming its barrier. Cream first. Spray second. Every time.',
          fr: 'Soleveil Protect est une crème qui s\'ancre à la cuticule. Silk Shield est un spray qui forme son film par-dessus avec la chaleur. Crème d\'abord, spray ensuite. Toujours.',
          ar: 'الكريم يلتصق بالحراشف، والبخاخ يبني طبقته فوقه بالحرارة. الكريم أولًا، البخاخ ثانيًا.'
        }
      }
    ],
    faq: [
      {
        q: { en: 'Is the Duo cheaper than buying them separately?', fr: 'Le Duo est-il moins cher qu\'à l\'unité ?', ar: 'هل الثنائي أرخص من الشراء منفصلًا؟' },
        a: { en: 'Yes — the Hair Ritual Duo saves you compared to purchasing each bottle individually, and ships in our signature gift packaging.', fr: 'Oui — le Duo Rituel Cheveux est plus avantageux que l\'achat séparé, livré dans notre packaging signature.', ar: 'نعم — الثنائي أوفر من شراء كل عبوة على حدة ويأتي بتغليف الهدية المميز.' }
      }
    ],
    image: blogHairRitualDuo,
    category: CAT_RITUAL,
    date: '2026-05-12',
    readTime: 5,
    tags: [
      { en: 'hair ritual', fr: 'rituel cheveux', ar: 'طقس الشعر' },
      { en: 'duo', fr: 'duo', ar: 'ثنائي' }
    ]
  },
  {
    id: 'summer-hair-beach-pool-protection',
    title: {
      en: 'Beach, Pool, Sun: How to Protect Your Hair All Summer Long',
      fr: 'Plage, Piscine, Soleil : Comment Protéger Vos Cheveux Tout l\'Été',
      ar: 'البحر والمسبح والشمس: كيف تحمين شعرك طوال الصيف'
    },
    excerpt: {
      en: 'Sea salt dehydrates. Chlorine oxidizes. UV burns. One pump of Soleveil Protect before you leave the house neutralizes all three.',
      fr: 'Le sel déshydrate. Le chlore oxyde. Les UV brûlent. Une pression de Soleveil Protect avant de sortir neutralise les trois.',
      ar: 'الملح يجفف، الكلور يؤكسد، الشمس تحرق. ضخة واحدة من سولفيل بروتكت تحمي من الثلاثة.'
    },
    content: {
      en: 'A summer of holidays should not cost you a winter of breakage. Sea salt pulls moisture out of the hair fiber by osmosis. Chlorine binds with copper in pool water and turns light or color-treated hair brassy. UV degrades melanin and keratin. Soleveil Protect was designed for exactly these three Tunisian summer enemies at the same time.',
      fr: 'Un été de vacances ne devrait pas coûter un hiver de casse. Le sel marin pompe l\'eau de la fibre par osmose. Le chlore s\'oxyde avec le cuivre de la piscine et jaunit les cheveux clairs ou colorés. Les UV dégradent la mélanine et la kératine. Soleveil Protect a été conçu pour ces trois ennemis tunisiens à la fois.',
      ar: 'عطلة صيف لا يجب أن تكلفك شعرًا متضررًا في الشتاء. صُمم سولفيل بروتكت لمواجهة الثلاثة في وقت واحد.'
    },
    sections: [
      {
        heading: { en: 'Before The Beach', fr: 'Avant la Plage', ar: 'قبل البحر' },
        body: {
          en: 'On dry or damp hair, apply 1–2 pumps of Soleveil Protect. The anti-sel polymer film prevents salt crystals from binding to keratin — which is why your hair feels straw-stiff after a swim.',
          fr: 'Sur cheveux secs ou humides, 1 à 2 pressions de Soleveil Protect. Le film anti-sel empêche les cristaux de se fixer à la kératine — raison de la sensation paille après la baignade.',
          ar: 'على شعر جاف أو رطب، ضخة أو اثنتان من سولفيل بروتكت. الطبقة تمنع بلورات الملح من الالتصاق بالكيراتين.'
        }
      },
      {
        heading: { en: 'Before The Pool', fr: 'Avant la Piscine', ar: 'قبل المسبح' },
        body: {
          en: 'Pre-soak hair in fresh water first — saturated strands cannot absorb as much chlorine. Then apply Soleveil Protect. The anti-chlorine actives block oxidation that fades color and dries out blondes.',
          fr: 'Mouillez d\'abord à l\'eau douce — un cheveu saturé absorbe moins de chlore. Puis Soleveil Protect. Les actifs anti-chlore bloquent l\'oxydation qui ternit la couleur.',
          ar: 'بللي شعرك بالماء العذب أولًا، ثم ضعي سولفيل بروتكت. المكونات تمنع الأكسدة.'
        }
      },
      {
        heading: { en: 'After Sun Exposure', fr: 'Après l\'Exposition Solaire', ar: 'بعد التعرض للشمس' },
        body: {
          en: 'Rinse with cool water, blot (do not rub), then reapply Soleveil Protect on damp hair. The jojoba and avocado oils replace the lipids the sun pulled out and rebuild softness overnight.',
          fr: 'Rincez à l\'eau froide, tamponnez (ne frottez pas), puis Soleveil Protect sur cheveux humides. Les huiles de jojoba et d\'avocat restaurent les lipides perdus.',
          ar: 'اشطفي بماء بارد ثم اربتي بمنشفة، ثم أعيدي وضع سولفيل بروتكت. زيوت الجوجوبا والأفوكادو تستعيد الدهون المفقودة.'
        }
      }
    ],
    faq: [
      {
        q: { en: 'How often should I reapply at the beach?', fr: 'À quelle fréquence réappliquer à la plage ?', ar: 'كم مرة أعيد التطبيق على الشاطئ؟' },
        a: { en: 'Reapply after every swim or every 2 hours of direct sun — same logic as SPF for skin.', fr: 'Réappliquez après chaque baignade ou toutes les 2 heures au soleil — comme le SPF.', ar: 'بعد كل سباحة أو كل ساعتين تحت الشمس.' }
      }
    ],
    image: blogSummerBeach,
    category: CAT_SUMMER,
    date: '2026-05-05',
    readTime: 6,
    tags: [
      { en: 'summer hair', fr: 'cheveux été', ar: 'شعر الصيف' },
      { en: 'beach', fr: 'plage', ar: 'البحر' },
      { en: 'chlorine', fr: 'chlore', ar: 'كلور' }
    ]
  },
  {
    id: 'heat-styling-up-to-230',
    title: {
      en: 'Up to 230°C: Why Heat Protection Is Non-Negotiable (And How Arecima Solves It)',
      fr: 'Jusqu\'à 230°C : Pourquoi la Thermoprotection N\'est Pas Négociable',
      ar: 'حتى 230°م: لماذا الحماية الحرارية ليست خيارًا'
    },
    excerpt: {
      en: 'Your flat iron reaches 200°C in 30 seconds. Without a heat shield, that is enough to vaporize moisture inside the cortex. Soleveil Protect and Silk Shield are rated for the highest setting.',
      fr: 'Votre lisseur atteint 200°C en 30 secondes. Sans bouclier thermique, c\'est suffisant pour vaporiser l\'eau du cortex. Soleveil Protect et Silk Shield supportent la chaleur maximale.',
      ar: 'مكواة الشعر تصل إلى 200°م في 30 ثانية. بدون حماية، يكفي ذلك لتبخير الماء داخل الشعرة.'
    },
    content: {
      en: 'Heat damage is cumulative and invisible until it is too late. The bonds between keratin chains denature above 175°C; water trapped in the cortex turns to steam and fractures the fiber from inside. A proper heat protectant does two things: it absorbs heat (raising the temperature at which damage starts) and it forms a barrier that slows heat transfer. Both Arecima formulas do this — up to 230°C, the highest setting on most professional tools.',
      fr: 'Les dommages thermiques sont cumulatifs et invisibles jusqu\'à ce qu\'il soit trop tard. Les ponts de kératine se dénaturent au-dessus de 175°C ; l\'eau du cortex se vaporise et fracture la fibre de l\'intérieur. Un bon thermoprotecteur absorbe la chaleur et forme une barrière. Les deux formules Arecima le font, jusqu\'à 230°C.',
      ar: 'الضرر الحراري تراكمي وغير مرئي حتى فوات الأوان. روابط الكيراتين تتفكك فوق 175°م. كلتا تركيبتي Arecima تحمي حتى 230°م.'
    },
    sections: [
      {
        heading: { en: 'When to Use Cream vs Spray', fr: 'Quand Utiliser Crème vs Spray', ar: 'متى الكريم ومتى البخاخ' },
        body: {
          en: 'Use Soleveil Protect cream when you also need UV/sea/chlorine defense (beach holiday, sunny day, outdoor brunch). Use Silk Shield spray when your priority is sleek finish and humidity resistance from a blow-dry or iron. Use both — cream first, spray second — when you want everything.',
          fr: 'Crème Soleveil Protect quand vous voulez aussi UV/sel/chlore (plage, jour ensoleillé). Spray Silk Shield quand la priorité est lissé et anti-humidité au coiffage. Les deux — crème puis spray — quand vous voulez tout.',
          ar: 'الكريم للحماية الشاملة UV/بحر/كلور. البخاخ للنعومة وحماية الرطوبة عند التصفيف. كلاهما معًا لكل شيء.'
        }
      },
      {
        heading: { en: 'The Right Way to Blow-Dry', fr: 'La Bonne Façon de Faire un Brushing', ar: 'الطريقة الصحيحة للتجفيف' },
        body: {
          en: 'Towel-dry hair until it stops dripping. Apply Soleveil Protect, then mist Silk Shield. Comb through. Start drying with medium heat, finish with a cool blast to seal the cuticle and lock the film.',
          fr: 'Séchez à la serviette jusqu\'à arrêt du dégoulinement. Soleveil Protect, puis Silk Shield. Démêlez. Chaleur moyenne, finition air froid pour sceller la cuticule.',
          ar: 'جففي بالمنشفة، ضعي سولفيل بروتكت ثم سيلك شيلد، مشّطي، ابدئي بحرارة متوسطة وانتهي بنفخ بارد.'
        }
      }
    ],
    faq: [
      {
        q: { en: 'Can I iron without any product?', fr: 'Puis-je lisser sans produit ?', ar: 'هل أمكنني التصفيف بدون منتج؟' },
        a: { en: 'You can, but every unprotected pass at 200°C+ damages the cuticle. Even a single mist of Silk Shield reduces measured fiber damage by over 50%.', fr: 'Vous pouvez, mais chaque passage non protégé à 200°C+ abîme la cuticule. Même une seule pulvérisation de Silk Shield réduit les dommages mesurés de plus de 50%.', ar: 'يمكن، لكن كل تمريرة فوق 200°م تضر الشعرة. حتى رشّة واحدة تقلل الضرر أكثر من 50%.' }
      }
    ],
    image: blogHeatStyling,
    category: CAT_HAIR,
    date: '2026-04-28',
    readTime: 6,
    tags: [
      { en: 'heat protection', fr: 'thermoprotection', ar: 'حماية حرارية' },
      { en: '230°c', fr: '230°c', ar: '230°م' }
    ]
  },
  {
    id: 'mediterranean-humidity-frizz',
    title: {
      en: 'The Mediterranean Humidity Trick: How to Keep Your Hair Sleek in Tunis Summer',
      fr: 'L\'Astuce Méditerranéenne : Garder des Cheveux Lisses sous l\'Été de Tunis',
      ar: 'حيلة شعر الصيف في تونس: نعومة تدوم رغم الرطوبة'
    },
    excerpt: {
      en: 'Tunis hits 85% humidity by 9 AM in July. Here is the two-product routine that holds a blow-dry from morning meeting to seaside dinner.',
      fr: 'Tunis grimpe à 85% d\'humidité dès 9h en juillet. Voici la routine deux produits qui tient un brushing du matin au dîner.',
      ar: 'في يوليو، رطوبة تونس تصل إلى 85% منذ الصباح. إليك روتين من منتجين يحافظ على تصفيفك من اجتماع الصباح إلى عشاء البحر.'
    },
    content: {
      en: 'A blow-dry that lasted 6 hours in November dies in 20 minutes in July. The variable is humidity. The fix is to seal the hair shaft before the moisture has a chance to enter it. Silk Shield is engineered for exactly this — heat-activated polymers that cross-link into a humidity-resistant film, locked in by your iron.',
      fr: 'Un brushing qui tenait 6 heures en novembre meurt en 20 minutes en juillet. Variable : l\'humidité. Solution : sceller la fibre avant qu\'elle n\'entre. Silk Shield est conçu pour ça — polymères thermo-activés qui se réticulent en film anti-humidité, verrouillé au lisseur.',
      ar: 'تصفيف يصمد 6 ساعات في نوفمبر ينهار في 20 دقيقة في يوليو. السبب: الرطوبة. الحل: تغليف الشعر قبل أن تدخله الرطوبة.'
    },
    sections: [
      {
        heading: { en: 'The 3-Minute Routine', fr: 'La Routine en 3 Minutes', ar: 'الروتين في 3 دقائق' },
        body: {
          en: '1. On damp hair, one pump of Soleveil Protect on lengths. 2. Six mists of Silk Shield from mid-length to ends. 3. Blow-dry on medium heat with a round brush, cool shot at the end. Hair stays sleek 24 hours, even with sea breeze.',
          fr: '1. Sur cheveux humides, une pression de Soleveil Protect. 2. Six pulvérisations de Silk Shield. 3. Brushing chaleur moyenne, brosse ronde, jet d\'air froid en fin. Lissé 24h, même brise marine.',
          ar: '1. ضخة سولفيل بروتكت. 2. ست رشات سيلك شيلد. 3. تجفيف بحرارة متوسطة وفرشاة دائرية ونفخ بارد في النهاية.'
        }
      },
      {
        heading: { en: 'Refreshing Mid-Day', fr: 'Rafraîchir en Milieu de Journée', ar: 'تجديد منتصف اليوم' },
        body: {
          en: 'If frizz starts to creep in by 5 PM, do a quick re-shape: 2 mists of Silk Shield, one warm iron pass on the visible top layer. Five seconds, full reset.',
          fr: 'Si le frisottis revient vers 17h, retouche express : 2 pulvérisations Silk Shield, un passage de lisseur tiède sur la couche visible. 5 secondes, réinitialisation totale.',
          ar: 'إذا عاد التجعد مساءً، رشّتان سيلك شيلد وتمريرة مكواة دافئة. 5 ثوانٍ وانتهيت.'
        }
      }
    ],
    faq: [
      {
        q: { en: 'Will this work on curly hair too?', fr: 'Ça marche aussi sur cheveux bouclés ?', ar: 'هل يعمل على الشعر المجعد؟' },
        a: { en: 'Yes — for curls, skip the iron and diffuse instead. Silk Shield still forms its anti-humidity film at diffuser temperature, preserving curl definition.', fr: 'Oui — sur boucles, utilisez le diffuseur. Silk Shield forme son film à température de diffuseur, préservant la définition.', ar: 'نعم — للشعر المجعد، استخدمي الدفيوزر. تتشكل الطبقة بنفس الفعالية.' }
      }
    ],
    image: blogAntiFrizz,
    category: CAT_HAIR,
    date: '2026-04-22',
    readTime: 5,
    tags: [
      { en: 'humidity', fr: 'humidité', ar: 'رطوبة' },
      { en: 'frizz', fr: 'frisottis', ar: 'تجعد' },
      { en: 'tunis', fr: 'tunis', ar: 'تونس' }
    ]
  }
];
