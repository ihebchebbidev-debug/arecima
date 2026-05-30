import { useLanguage } from '@/contexts/LanguageContext';
import SEOHead from '@/components/SEOHead';

const content = {
  en: {
    title: 'Shipping Policy',
    sections: [
      { heading: 'Delivery Areas', text: 'We deliver across all of Tunisia. International shipping is available upon request via our customer service.' },
      { heading: 'Delivery Times', text: 'Orders are processed within 24-48 hours. Standard delivery within Tunisia takes 2-5 business days. Express delivery is available for orders placed before 12:00 PM (1-2 business days).' },
      { heading: 'Shipping Costs', text: 'Standard shipping: 7 TND. Free shipping on all orders over 150 TND. Express shipping: 15 TND.' },
      { heading: 'Order Tracking', text: 'Once your order is shipped, you will receive a confirmation email with a tracking number. You can track your order status at any time.' },
      { heading: 'Delivery Issues', text: 'If you experience any issues with your delivery, please contact our customer service within 48 hours of the expected delivery date at contact@arecima.com or +216 50 454 000.' },
    ]
  },
  fr: {
    title: 'Politique de Livraison',
    sections: [
      { heading: 'Zones de Livraison', text: 'Nous livrons dans toute la Tunisie. La livraison internationale est disponible sur demande via notre service client.' },
      { heading: 'Délais de Livraison', text: 'Les commandes sont traitées sous 24 à 48 heures. La livraison standard en Tunisie prend 2 à 5 jours ouvrables. La livraison express est disponible pour les commandes passées avant 12h00 (1-2 jours ouvrables).' },
      { heading: 'Frais de Livraison', text: 'Livraison standard : 7 TND. Livraison gratuite pour toute commande supérieure à 150 TND. Livraison express : 15 TND.' },
      { heading: 'Suivi de Commande', text: 'Dès l\'expédition de votre commande, vous recevrez un email de confirmation avec un numéro de suivi. Vous pouvez suivre l\'état de votre commande à tout moment.' },
      { heading: 'Problèmes de Livraison', text: 'En cas de problème avec votre livraison, veuillez contacter notre service client dans les 48 heures suivant la date de livraison prévue à contact@arecima.com ou au +216 50 454 000.' },
    ]
  },
  ar: {
    title: 'سياسة التوصيل',
    sections: [
      { heading: 'مناطق التوصيل', text: 'نوصل إلى جميع أنحاء تونس. التوصيل الدولي متاح عند الطلب عبر خدمة العملاء.' },
      { heading: 'مواعيد التوصيل', text: 'تُعالج الطلبات خلال 24 إلى 48 ساعة. التوصيل القياسي داخل تونس يستغرق 2-5 أيام عمل. التوصيل السريع متاح للطلبات قبل الساعة 12:00 (1-2 أيام عمل).' },
      { heading: 'تكاليف التوصيل', text: 'التوصيل القياسي: 7 دينار. توصيل مجاني للطلبات فوق 150 دينار. التوصيل السريع: 15 دينار.' },
      { heading: 'تتبع الطلب', text: 'بمجرد شحن طلبك، ستتلقين بريدًا إلكترونيًا للتأكيد مع رقم التتبع. يمكنك متابعة حالة طلبك في أي وقت.' },
      { heading: 'مشاكل التوصيل', text: 'إذا واجهتِ أي مشكلة في التوصيل، يرجى الاتصال بخدمة العملاء خلال 48 ساعة من تاريخ التوصيل المتوقع على contact@arecima.com أو +216 50 454 000.' },
    ]
  }
};

const ShippingPolicy = () => {
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

export default ShippingPolicy;
