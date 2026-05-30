import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import beforeAfter from '@/assets/before-after.jpg';

const BeforeAfter = () => {
  const { language } = useLanguage();
  const [pos, setPos] = useState(50);

  return (
    <div className="relative aspect-[3/2] overflow-hidden rounded-sm bg-champagne/30 select-none group">
      {/* Single image, revealed via clip — gives an interactive split feel */}
      <img
        src={beforeAfter}
        alt="Before and after Arecima hair care results"
        className="absolute inset-0 w-full h-full object-cover"
        width={1200}
        height={800}
      />

      {/* Tinted "before" half overlay */}
      <div
        className="absolute inset-y-0 left-0 bg-charcoal/15 backdrop-grayscale-[30%] pointer-events-none transition-[width] duration-150"
        style={{ width: `${pos}%` }}
      />

      {/* Labels */}
      <div className="absolute top-3 left-3 lg:top-4 lg:left-4">
        <span className="font-body text-[9px] lg:text-[10px] tracking-[0.25em] uppercase px-3 py-1.5 bg-charcoal/80 text-champagne backdrop-blur-sm">
          {language === 'fr' ? 'Avant' : language === 'ar' ? 'قبل' : 'Before'}
        </span>
      </div>
      <div className="absolute top-3 right-3 lg:top-4 lg:right-4">
        <span className="font-body text-[9px] lg:text-[10px] tracking-[0.25em] uppercase px-3 py-1.5 bg-gold text-primary-foreground backdrop-blur-sm">
          {language === 'fr' ? 'Après · 2 semaines' : language === 'ar' ? 'بعد · أسبوعين' : 'After · 2 weeks'}
        </span>
      </div>

      {/* Divider line */}
      <div
        className="absolute inset-y-0 w-[2px] bg-gold pointer-events-none transition-[left] duration-150"
        style={{ left: `${pos}%`, transform: 'translateX(-1px)' }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 w-9 h-9 rounded-full bg-gold flex items-center justify-center shadow-luxury">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary-foreground">
            <polyline points="15 18 9 12 15 6" />
            <polyline points="9 18 15 12 9 6" transform="translate(8 0)" />
          </svg>
        </div>
      </div>

      {/* Slider input — covers full surface */}
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Compare before and after"
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
      />

      {/* Caption */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        viewport={{ once: true }}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 font-body text-[10px] tracking-[0.2em] uppercase text-champagne bg-charcoal/70 backdrop-blur-sm px-3 py-1.5 pointer-events-none"
      >
        {language === 'fr' ? '← Glissez pour comparer →' : language === 'ar' ? '← اسحبي للمقارنة →' : '← Drag to compare →'}
      </motion.p>
    </div>
  );
};

export default BeforeAfter;
