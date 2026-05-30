import { useLanguage } from '@/contexts/LanguageContext';
import SEOHead from '@/components/SEOHead';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqData = {
  en: {
    title: 'Frequently Asked Questions',
    items: [
      { q: 'Are Arecima products natural?', a: 'Yes, all Arecima products are formulated with 100% natural, premium ingredients sourced from Tunisian botanical heritage. We never use parabens, sulfates, or artificial fragrances.' },
      { q: 'Is Arecima cruelty-free?', a: 'Absolutely. Arecima is 100% cruelty-free. We never test on animals and all our ingredients are ethically sourced.' },
      { q: 'Do you offer free shipping?', a: 'Yes, we offer free standard shipping on all orders over 150 TND within Tunisia. Express shipping is available at 15 TND.' },
      { q: 'How long does delivery take?', a: 'Standard delivery takes 2-5 business days within Tunisia. Express delivery takes 1-2 business days for orders placed before 12:00 PM.' },
      { q: 'Can I return a product?', a: 'Yes, you can return any unopened product within 14 days of delivery. Please contact our customer service for return instructions.' },
      { q: 'What payment methods do you accept?', a: 'We accept cash on delivery, bank transfer, and major credit cards (Visa, Mastercard). Online payment is fully secured.' },
      { q: 'How should I store my products?', a: 'Store Arecima products in a cool, dry place away from direct sunlight. Serums and oils should be kept upright with caps tightly closed.' },
      { q: 'Are your products suitable for sensitive skin?', a: 'Our products are formulated to be gentle and are suitable for most skin types, including sensitive skin. We recommend doing a patch test before first use.' },
    ]
  },
  fr: {
    title: 'Questions Fréquentes',
    items: [
      { q: 'Les produits Arecima sont-ils naturels ?', a: 'Oui, tous les produits Arecima sont formulés avec des ingrédients 100% naturels et premium issus du patrimoine botanique tunisien. Nous n\'utilisons jamais de parabènes, sulfates ou parfums artificiels.' },
      { q: 'Arecima est-elle cruelty-free ?', a: 'Absolument. Arecima est 100% cruelty-free. Nous ne testons jamais sur les animaux et tous nos ingrédients sont d\'origine éthique.' },
      { q: 'Proposez-vous la livraison gratuite ?', a: 'Oui, nous offrons la livraison standard gratuite pour toute commande supérieure à 150 TND en Tunisie. La livraison express est disponible à 15 TND.' },
      { q: 'Combien de temps prend la livraison ?', a: 'La livraison standard prend 2 à 5 jours ouvrables en Tunisie. La livraison express prend 1-2 jours ouvrables pour les commandes passées avant 12h00.' },
      { q: 'Puis-je retourner un produit ?', a: 'Oui, vous pouvez retourner tout produit non ouvert dans les 14 jours suivant la livraison. Contactez notre service client pour les instructions de retour.' },
      { q: 'Quels modes de paiement acceptez-vous ?', a: 'Nous acceptons le paiement à la livraison, le virement bancaire et les principales cartes de crédit (Visa, Mastercard). Le paiement en ligne est entièrement sécurisé.' },
      { q: 'Comment conserver mes produits ?', a: 'Conservez les produits Arecima dans un endroit frais et sec, à l\'abri de la lumière directe du soleil. Les sérums et huiles doivent être conservés debout avec les bouchons bien fermés.' },
      { q: 'Vos produits conviennent-ils aux peaux sensibles ?', a: 'Nos produits sont formulés pour être doux et conviennent à la plupart des types de peau, y compris les peaux sensibles. Nous recommandons de faire un test cutané avant la première utilisation.' },
    ]
  },
  ar: {
    title: 'الأسئلة الشائعة',
    items: [
      { q: 'هل منتجات أريسيما طبيعية؟', a: 'نعم، جميع منتجات أريسيما مصنوعة من مكونات طبيعية 100% وفاخرة مصدرها التراث النباتي التونسي. لا نستخدم أبدًا البارابين أو الكبريتات أو العطور الاصطناعية.' },
      { q: 'هل أريسيما خالية من القسوة؟', a: 'بالتأكيد. أريسيما خالية من القسوة 100%. لا نختبر أبدًا على الحيوانات وجميع مكوناتنا من مصادر أخلاقية.' },
      { q: 'هل تقدمون توصيلًا مجانيًا؟', a: 'نعم، نقدم توصيلًا قياسيًا مجانيًا لجميع الطلبات فوق 150 دينار داخل تونس. التوصيل السريع متاح بـ 15 دينار.' },
      { q: 'كم يستغرق التوصيل؟', a: 'التوصيل القياسي يستغرق 2-5 أيام عمل داخل تونس. التوصيل السريع يستغرق 1-2 أيام عمل للطلبات قبل الساعة 12:00.' },
      { q: 'هل يمكنني إرجاع منتج؟', a: 'نعم، يمكنك إرجاع أي منتج غير مفتوح خلال 14 يومًا من التوصيل. تواصلي مع خدمة العملاء لتعليمات الإرجاع.' },
      { q: 'ما هي طرق الدفع المقبولة؟', a: 'نقبل الدفع عند التوصيل، التحويل البنكي، وبطاقات الائتمان الرئيسية (فيزا، ماستركارد). الدفع عبر الإنترنت مؤمن بالكامل.' },
      { q: 'كيف أحفظ منتجاتي؟', a: 'احفظي منتجات أريسيما في مكان بارد وجاف بعيدًا عن أشعة الشمس المباشرة. يجب حفظ السيرومات والزيوت بشكل عمودي مع إغلاق الأغطية بإحكام.' },
      { q: 'هل منتجاتكم مناسبة للبشرة الحساسة؟', a: 'منتجاتنا مصممة لتكون لطيفة ومناسبة لمعظم أنواع البشرة، بما في ذلك البشرة الحساسة. ننصح بإجراء اختبار على منطقة صغيرة قبل الاستخدام الأول.' },
    ]
  }
};

const FAQ = () => {
  const { language } = useLanguage();
  const c = faqData[language];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.en.items.map((item, i) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a }
    }))
  };

  return (
    <main className="min-h-screen pt-28 pb-16">
      <SEOHead title={c.title} description="Answers about Arecima hair care products, shipping, returns, and orders." schema={schema} />
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <h1 className="font-display text-3xl lg:text-4xl text-center mb-12">{c.title}</h1>
        <div className="space-y-3">
          {c.items.map((item, i) => (
            <div key={i} className="border border-border overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-muted/30 transition-colors"
              >
                <span className="font-body text-sm font-medium pr-4">{item.q}</span>
                <span className="text-gold text-lg shrink-0">{openIndex === i ? '−' : '+'}</span>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 font-body text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default FAQ;
