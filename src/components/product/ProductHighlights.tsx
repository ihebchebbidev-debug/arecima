import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Flame, Droplets, Wind, Sparkles, Shield, Gift, Layers } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ProductHighlight } from '@/data/productDetails';

const ICONS: Record<ProductHighlight['icon'], LucideIcon> = {
  sun: Sun,
  flame: Flame,
  droplets: Droplets,
  wind: Wind,
  sparkles: Sparkles,
  shield: Shield,
  gift: Gift,
  layers: Layers,
};

interface ProductHighlightsProps {
  highlights: ProductHighlight[];
}

const ProductHighlights = ({ highlights }: ProductHighlightsProps) => {
  const { language } = useLanguage();
  if (!highlights.length) return null;

  return (
    <div className="grid grid-cols-2 gap-3 mb-8">
      {highlights.map((h, i) => {
        const Icon = ICONS[h.icon];
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-3 p-3.5 border border-border/70 bg-champagne/20 rounded-sm"
          >
            <Icon className="h-5 w-5 text-gold flex-none" strokeWidth={1.5} />
            <span className="font-body text-xs leading-snug text-foreground/90">{h.label[language]}</span>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ProductHighlights;
