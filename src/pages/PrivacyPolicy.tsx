import { useLanguage } from '@/contexts/LanguageContext';
import SEOHead from '@/components/SEOHead';

const content = {
  en: {
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: April 2026',
    sections: [
      { heading: 'Information We Collect', text: 'We collect personal information you provide when placing an order, creating an account, or subscribing to our newsletter. This includes your name, email address, phone number, shipping address, and payment information.' },
      { heading: 'How We Use Your Information', text: 'Your information is used to process orders, deliver products, send order confirmations, respond to customer service requests, and send marketing communications (with your consent). We never sell your data to third parties.' },
      { heading: 'Data Protection', text: 'We implement industry-standard security measures to protect your personal information. All payment transactions are encrypted using SSL technology. Your data is stored on secure servers within Tunisia.' },
      { heading: 'Cookies', text: 'Our website uses cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can manage your cookie preferences through your browser settings.' },
      { heading: 'Your Rights', text: 'You have the right to access, correct, or delete your personal information at any time. You may also opt out of marketing communications by clicking "unsubscribe" in any email or contacting us directly.' },
      { heading: 'Contact', text: 'For any questions regarding our privacy practices, please contact us at contact@arecima.tn or +216 71 000 000.' },
    ]
  },
  fr: {
    title: 'Politique de Confidentialité',
    lastUpdated: 'Dernière mise à jour : Avril 2026',
    sections: [
      { heading: 'Informations Collectées', text: 'Nous collectons les informations personnelles que vous fournissez lors d\'une commande, de la création d\'un compte ou de l\'inscription à notre newsletter. Cela inclut votre nom, adresse email, numéro de téléphone, adresse de livraison et informations de paiement.' },
      { heading: 'Utilisation de Vos Informations', text: 'Vos informations sont utilisées pour traiter les commandes, livrer les produits, envoyer les confirmations de commande, répondre aux demandes du service client et envoyer des communications marketing (avec votre consentement). Nous ne vendons jamais vos données à des tiers.' },
      { heading: 'Protection des Données', text: 'Nous mettons en œuvre des mesures de sécurité conformes aux normes de l\'industrie pour protéger vos informations personnelles. Toutes les transactions de paiement sont chiffrées via la technologie SSL. Vos données sont stockées sur des serveurs sécurisés en Tunisie.' },
      { heading: 'Cookies', text: 'Notre site utilise des cookies pour améliorer votre expérience de navigation, analyser le trafic du site et personnaliser le contenu. Vous pouvez gérer vos préférences de cookies via les paramètres de votre navigateur.' },
      { heading: 'Vos Droits', text: 'Vous avez le droit d\'accéder, de corriger ou de supprimer vos informations personnelles à tout moment. Vous pouvez également vous désinscrire des communications marketing en cliquant sur « se désabonner » dans tout email ou en nous contactant directement.' },
      { heading: 'Contact', text: 'Pour toute question concernant nos pratiques de confidentialité, contactez-nous à contact@arecima.tn ou au +216 71 000 000.' },
    ]
  },
  ar: {
    title: 'سياسة الخصوصية',
    lastUpdated: 'آخر تحديث: أبريل 2026',
    sections: [
      { heading: 'المعلومات التي نجمعها', text: 'نجمع المعلومات الشخصية التي تقدمينها عند تقديم طلب أو إنشاء حساب أو الاشتراك في نشرتنا الإخبارية. يشمل ذلك اسمك وعنوان بريدك الإلكتروني ورقم هاتفك وعنوان الشحن ومعلومات الدفع.' },
      { heading: 'كيف نستخدم معلوماتك', text: 'تُستخدم معلوماتك لمعالجة الطلبات وتوصيل المنتجات وإرسال تأكيدات الطلبات والرد على طلبات خدمة العملاء وإرسال اتصالات تسويقية (بموافقتك). لا نبيع بياناتك أبدًا لأطراف ثالثة.' },
      { heading: 'حماية البيانات', text: 'نطبق إجراءات أمنية وفقًا لمعايير الصناعة لحماية معلوماتك الشخصية. جميع معاملات الدفع مشفرة باستخدام تقنية SSL. بياناتك مخزنة على خوادم آمنة في تونس.' },
      { heading: 'ملفات تعريف الارتباط', text: 'يستخدم موقعنا ملفات تعريف الارتباط لتحسين تجربة التصفح وتحليل حركة المرور وتخصيص المحتوى. يمكنك إدارة تفضيلاتك من خلال إعدادات المتصفح.' },
      { heading: 'حقوقك', text: 'لديك الحق في الوصول إلى معلوماتك الشخصية أو تصحيحها أو حذفها في أي وقت. يمكنك أيضًا إلغاء الاشتراك في الاتصالات التسويقية بالنقر على "إلغاء الاشتراك" في أي بريد إلكتروني أو الاتصال بنا مباشرة.' },
      { heading: 'اتصل بنا', text: 'لأي أسئلة بخصوص ممارسات الخصوصية لدينا، تواصلي معنا على contact@arecima.tn أو +216 71 000 000.' },
    ]
  }
};

const PrivacyPolicy = () => {
  const { language } = useLanguage();
  const c = content[language];

  return (
    <main className="min-h-screen pt-28 pb-16">
      <SEOHead title={c.title} description="Arecima privacy policy — how we collect, use, and protect your personal information." />
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

export default PrivacyPolicy;
