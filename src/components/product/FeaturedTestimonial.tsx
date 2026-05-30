import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import testimonialPortrait from '@/assets/testimonial-portrait.jpg';
import type { ProductPageMeta } from '@/data/productDetails';

interface FeaturedTestimonialProps {
  testimonial: ProductPageMeta['testimonial'];
}

const FeaturedTestimonial = ({ testimonial }: FeaturedTestimonialProps) => {
  const { language } = useLanguage();

  return (
    <section className="bg-champagne py-14 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 lg:gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative w-44 h-44 sm:w-52 sm:h-52 lg:w-72 lg:h-72 mx-auto lg:mx-0 flex-none"
          >
            <div className="absolute -inset-2 border border-gold/30 rounded-full" />
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <img
                src={testimonialPortrait}
                alt="Arecima customer testimonial"
                className="w-full h-full object-cover"
                width={400}
                height={400}
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-3 -right-3 lg:-bottom-4 lg:-right-4 w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-gold flex items-center justify-center shadow-luxury">
              <span className="font-display text-2xl lg:text-3xl text-primary-foreground leading-none">&ldquo;</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            <div className="flex items-center gap-1 justify-center lg:justify-start mb-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="hsl(174, 42%, 42%)" stroke="hsl(174, 42%, 42%)" strokeWidth="1">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <blockquote className="font-elegant italic text-xl sm:text-2xl lg:text-3xl text-foreground leading-relaxed mb-6">
              {testimonial.quote[language]}
            </blockquote>
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <span className="h-px w-8 bg-gold" />
              <div>
                <p className="font-body text-sm font-medium text-foreground">{testimonial.author}</p>
                <p className="font-body text-[11px] tracking-wide text-muted-foreground">
                  {language === 'fr' ? 'Cliente vérifiée · ' : language === 'ar' ? 'عميلة موثقة · ' : 'Verified customer · '}
                  {testimonial.location[language]}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTestimonial;
