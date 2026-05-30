import { useLanguage } from '@/contexts/LanguageContext';
import SEOHead from '@/components/SEOHead';

const content = {
  en: {
    title: 'Terms & Conditions',
    lastUpdated: 'Last updated: April 2026',
    sections: [
      { heading: 'General', text: 'These terms and conditions govern your use of the Arecima website and the purchase of products. By accessing our website or placing an order, you agree to be bound by these terms.' },
      { heading: 'Products & Pricing', text: 'All prices are displayed in Tunisian Dinars (TND) and include applicable taxes. We reserve the right to modify prices at any time. The price applicable is the one displayed at the time of order placement.' },
      { heading: 'Orders', text: 'An order is considered confirmed once you receive an order confirmation email. We reserve the right to refuse or cancel any order in case of product unavailability, payment issues, or suspected fraud.' },
      { heading: 'Payment', text: 'We accept cash on delivery, bank transfer, and credit card payments (Visa, Mastercard). All online payments are processed through secure, encrypted channels.' },
      { heading: 'Intellectual Property', text: 'All content on the Arecima website, including logos, text, images, and product formulations, is the exclusive property of Arecima and is protected by intellectual property laws. Any unauthorized use is strictly prohibited.' },
      { heading: 'Limitation of Liability', text: 'Arecima shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our liability is limited to the purchase price of the product in question.' },
      { heading: 'Governing Law', text: 'These terms are governed by the laws of the Republic of Tunisia. Any disputes shall be resolved by the competent courts of Tunis.' },
      { heading: 'Contact', text: 'For any questions regarding these terms, please contact us at contact@arecima.tn or +216 71 000 000.' },
    ]
  },
  fr: {
    title: 'Conditions Générales',
    lastUpdated: 'Dernière mise à jour : Avril 2026',
    sections: [
      { heading: 'Généralités', text: 'Les présentes conditions générales régissent votre utilisation du site Arecima et l\'achat de produits. En accédant à notre site ou en passant une commande, vous acceptez d\'être lié par ces conditions.' },
      { heading: 'Produits & Tarification', text: 'Tous les prix sont affichés en Dinars Tunisiens (TND) et incluent les taxes applicables. Nous nous réservons le droit de modifier les prix à tout moment. Le prix applicable est celui affiché au moment de la commande.' },
      { heading: 'Commandes', text: 'Une commande est considérée comme confirmée dès la réception d\'un email de confirmation. Nous nous réservons le droit de refuser ou d\'annuler toute commande en cas d\'indisponibilité du produit, de problème de paiement ou de fraude suspectée.' },
      { heading: 'Paiement', text: 'Nous acceptons le paiement à la livraison, le virement bancaire et les paiements par carte de crédit (Visa, Mastercard). Tous les paiements en ligne sont traités via des canaux sécurisés et chiffrés.' },
      { heading: 'Propriété Intellectuelle', text: 'Tout le contenu du site Arecima, y compris les logos, textes, images et formulations de produits, est la propriété exclusive d\'Arecima et est protégé par les lois sur la propriété intellectuelle. Toute utilisation non autorisée est strictement interdite.' },
      { heading: 'Limitation de Responsabilité', text: 'Arecima ne saurait être tenue responsable de tout dommage indirect, accessoire ou consécutif résultant de l\'utilisation de nos produits ou de notre site. Notre responsabilité est limitée au prix d\'achat du produit en question.' },
      { heading: 'Droit Applicable', text: 'Les présentes conditions sont régies par les lois de la République Tunisienne. Tout litige sera résolu par les tribunaux compétents de Tunis.' },
      { heading: 'Contact', text: 'Pour toute question concernant ces conditions, contactez-nous à contact@arecima.tn ou au +216 71 000 000.' },
    ]
  },
  ar: {
    title: 'الشروط والأحكام',
    lastUpdated: 'آخر تحديث: أبريل 2026',
    sections: [
      { heading: 'عام', text: 'تحكم هذه الشروط والأحكام استخدامك لموقع أريسيما وشراء المنتجات. بالدخول إلى موقعنا أو تقديم طلب، فإنك توافق على الالتزام بهذه الشروط.' },
      { heading: 'المنتجات والأسعار', text: 'جميع الأسعار معروضة بالدينار التونسي وتشمل الضرائب المطبقة. نحتفظ بالحق في تعديل الأسعار في أي وقت. السعر المطبق هو السعر المعروض وقت تقديم الطلب.' },
      { heading: 'الطلبات', text: 'يُعتبر الطلب مؤكدًا بمجرد استلامك بريد تأكيد الطلب. نحتفظ بالحق في رفض أو إلغاء أي طلب في حالة عدم توفر المنتج أو مشاكل الدفع أو الاشتباه في الاحتيال.' },
      { heading: 'الدفع', text: 'نقبل الدفع عند التوصيل والتحويل البنكي ومدفوعات بطاقات الائتمان (فيزا، ماستركارد). جميع المدفوعات عبر الإنترنت تتم عبر قنوات آمنة ومشفرة.' },
      { heading: 'الملكية الفكرية', text: 'جميع محتويات موقع أريسيما، بما في ذلك الشعارات والنصوص والصور وتركيبات المنتجات، هي ملكية حصرية لأريسيما ومحمية بقوانين الملكية الفكرية. أي استخدام غير مصرح به ممنوع منعًا باتًا.' },
      { heading: 'تحديد المسؤولية', text: 'لا تتحمل أريسيما مسؤولية أي أضرار غير مباشرة أو عرضية أو تبعية ناتجة عن استخدام منتجاتنا أو موقعنا. مسؤوليتنا محدودة بسعر شراء المنتج المعني.' },
      { heading: 'القانون المطبق', text: 'تخضع هذه الشروط لقوانين الجمهورية التونسية. يتم حل أي نزاعات من قبل المحاكم المختصة في تونس.' },
      { heading: 'اتصل بنا', text: 'لأي أسئلة بخصوص هذه الشروط، تواصلوا معنا على contact@arecima.tn أو +216 71 000 000.' },
    ]
  }
};

const Terms = () => {
  const { language } = useLanguage();
  const c = content[language];

  return (
    <main className="min-h-screen pt-28 pb-16">
      <SEOHead title={c.title} description="Arecima terms and conditions for purchasing luxury skincare products." />
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <h1 className="font-display text-3xl lg:text-4xl text-center mb-3">{c.title}</h1>
        <p className="font-body text-xs text-muted-foreground text-center mb-12">{c.lastUpdated}</p>
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

export default Terms;
