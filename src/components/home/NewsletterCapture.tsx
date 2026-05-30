import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const NewsletterCapture = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    const res = await api.subscribe(email, undefined, 'website-landing');
    setSubmitting(false);
    if (res.success) {
      setDone(true);
      toast.success(t('newsletter.successToast'));
      setEmail('');
    } else {
      toast.error(res.error || t('footer.subscribeFail'));
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-charcoal via-charcoal to-[hsl(200,28%,18%)] py-16 lg:py-24">
      {/* Decorative golden circles */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-gold" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-gold" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-gold" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-gold/50" />
            <span className="text-gold text-xs">✦</span>
            <span className="h-px w-8 bg-gold/50" />
          </div>
          <p className="font-body text-[10px] lg:text-xs tracking-[0.4em] uppercase text-gold-light mb-4">
            {t('newsletter.eyebrow')}
          </p>
          <h2 className="font-elegant italic text-3xl sm:text-4xl lg:text-5xl text-champagne leading-tight mb-5">
            {t('newsletter.title')}
          </h2>
          <p className="font-body text-sm text-champagne/70 mb-8 lg:mb-10 max-w-md mx-auto leading-relaxed">
            {t('newsletter.description')}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-0 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-champagne/50 pointer-events-none" strokeWidth={1.5} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('newsletter.placeholder')}
                className="w-full bg-background/5 border border-champagne/20 hover:border-champagne/40 focus:border-gold pl-11 pr-4 py-3.5 font-body text-sm text-champagne placeholder:text-champagne/40 outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={submitting || done}
              className="relative inline-flex items-center justify-center gap-2 px-6 py-3.5 font-body text-[11px] tracking-[0.25em] uppercase bg-gold hover:bg-gold-dark text-primary-foreground transition-all duration-300 disabled:opacity-70 sm:min-w-[140px]"
            >
              {done ? (
                <>
                  <Check className="h-4 w-4" /> {t('newsletter.done')}
                </>
              ) : submitting ? (
                <span className="font-body text-[11px]">...</span>
              ) : (
                t('newsletter.submit')
              )}
            </button>
          </form>

          <p className="font-body text-[10px] tracking-wide text-champagne/40 mt-5">
            {t('newsletter.privacyNote')}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterCapture;
