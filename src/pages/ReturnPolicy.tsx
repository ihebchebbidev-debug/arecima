import { useLanguage } from '@/contexts/LanguageContext';
import SEOHead from '@/components/SEOHead';

const content = {
  en: {
    title: 'Return Policy',
    sections: [
      { heading: 'Return Period', text: 'You may return any unopened product within 14 days of delivery. The product must be in its original packaging and in perfect condition.' },
      { heading: 'Non-Returnable Items', text: 'For hygiene reasons, opened or used skincare products cannot be returned or exchanged. Gift sets with broken seals are also non-returnable.' },
      { heading: 'How to Return', text: 'Contact our customer service at contact@arecima.com with your order number. We will provide you with return instructions and a prepaid shipping label for eligible returns.' },
      { heading: 'Refund Process', text: 'Once we receive and inspect the returned item, your refund will be processed within 5-7 business days. The refund will be credited to your original payment method.' },
      { heading: 'Exchanges', text: 'We offer free exchanges for size or product changes. Contact our team and we will arrange the exchange with priority shipping.' },
    ]
  },
  fr: {
    title: 'Politique de Retour',
    sections: [
      { heading: 'Délai de Retour', text: 'Vous pouvez retourner tout produit non ouvert dans les 14 jours suivant la livraison. Le produit doit être dans son emballage d\'origine et en parfait état.' },
      { heading: 'Articles Non Retournables', text: 'Pour des raisons d\'hygiène, les produits de soins ouverts ou utilisés ne peuvent être ni retournés ni échangés. Les coffrets cadeaux dont les sceaux sont brisés ne sont pas non plus retournables.' },
      { heading: 'Comment Retourner', text: 'Contactez notre service client à contact@arecima.com avec votre numéro de commande. Nous vous fournirons les instructions de retour et une étiquette d\'expédition prépayée pour les retours éligibles.' },
      { heading: 'Processus de Remboursement', text: 'Une fois que nous recevons et inspectons l\'article retourné, votre remboursement sera traité sous 5 à 7 jours ouvrables. Le remboursement sera crédité sur votre moyen de paiement original.' },
      { heading: 'Échanges', text: 'Nous offrons des échanges gratuits pour les changements de taille ou de produit. Contactez notre équipe et nous organiserons l\'échange avec une livraison prioritaire.' },
    ]
  },
  ar: {
    title: 'سياسة الإرجاع',
    sections: [
      { heading: 'مدة الإرجاع', text: 'يمكنك إرجاع أي منتج غير مفتوح خلال 14 يومًا من التوصيل. يجب أن يكون المنتج في عبوته الأصلية وبحالة ممتازة.' },
      { heading: 'منتجات غير قابلة للإرجاع', text: 'لأسباب صحية، لا يمكن إرجاع أو استبدال منتجات العناية المفتوحة أو المستخدمة. علب الهدايا ذات الأختام المكسورة غير قابلة للإرجاع أيضًا.' },
      { heading: 'كيفية الإرجاع', text: 'تواصلي مع خدمة العملاء على contact@arecima.com مع رقم طلبك. سنوفر لك تعليمات الإرجاع وملصق شحن مدفوع مسبقًا للإرجاعات المؤهلة.' },
      { heading: 'عملية الاسترداد', text: 'بمجرد استلامنا وفحصنا للمنتج المرتجع، سيتم معالجة استردادك خلال 5-7 أيام عمل. سيُضاف المبلغ إلى وسيلة الدفع الأصلية.' },
      { heading: 'الاستبدال', text: 'نقدم استبدالات مجانية لتغيير الحجم أو المنتج. تواصلي مع فريقنا وسنرتب الاستبدال مع شحن أولوي.' },
    ]
  }
};

const ReturnPolicy = () => {
  const { language } = useLanguage();
  const c = content[language];

  return (
    <main className="min-h-screen pt-28 pb-16">
      <SEOHead title={c.title} description={c.sections[0].text} />
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <h1 className="font-display text-3xl lg:text-4xl text-center mb-12">{c.title}</h1>
        <div className="space-y-10">
          {c.sections.map((s, i) => (
            <div key={i}>
              <h2 className="font-display text-lg lg:text-xl mb-3 text-gold">{s.heading}</h2>
              <p className="font-body text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default ReturnPolicy;
