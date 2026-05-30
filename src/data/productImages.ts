/**
 * Bundled product photos — served from the frontend build, no server upload required.
 * Keys match product slugs (and legacy DB asset keys for backward compatibility).
 */
import soleveilProtect from '@/assets/soleveil-protect.jpg';
import silkShield from '@/assets/silk-shield.jpg';
import rituelCheveuxDuo from '@/assets/rituel-cheveux-duo.jpg';

export const PRODUCT_IMAGE_KEYS = {
  soleveil: 'soleveil-protect-kpf30',
  silkShield: 'silk-shield-spray',
  duo: 'rituel-cheveux-duo',
} as const;

export const productImages: Record<string, string> = {
  [PRODUCT_IMAGE_KEYS.soleveil]: soleveilProtect,
  [PRODUCT_IMAGE_KEYS.silkShield]: silkShield,
  [PRODUCT_IMAGE_KEYS.duo]: rituelCheveuxDuo,
  // Legacy DB keys (still resolve to bundled assets)
  'product-oil': soleveilProtect,
  'product-toner': silkShield,
  'product-hair-duo': rituelCheveuxDuo,
};

/** Default image key per catalog slug. */
export const defaultProductImageKey = (slug: string): string | undefined => {
  if (slug in productImages) return slug;
  const map: Record<string, string> = {
    'soleveil-protect-kpf30': PRODUCT_IMAGE_KEYS.soleveil,
    'silk-shield-spray': PRODUCT_IMAGE_KEYS.silkShield,
    'rituel-cheveux-duo': PRODUCT_IMAGE_KEYS.duo,
  };
  return map[slug];
};
