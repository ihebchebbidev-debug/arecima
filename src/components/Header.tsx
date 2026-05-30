import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useMemo, useState, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useApiCategories } from '@/hooks/useApiProducts';

import flagFr from '@/assets/flag-fr.png';
import flagEn from '@/assets/flag-en.png';
import flagAr from '@/assets/flag-ar.png';
import arecimaLogo from '@/assets/arecima-logo.png';
import type { Language } from '@/data/translations';

const flagImages: Record<Language, string> = {
  fr: flagFr,
  en: flagEn,
  ar: flagAr,
};

const languages: { code: Language; label: string }[] = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
];

const Header = () => {
  const { t, language, setLanguage } = useLanguage();
  const { totalItems, setIsCartOpen } = useCart();
  const { count: favCount } = useFavorites();
  const { categories } = useApiCategories();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  const currentLangIndex = languages.findIndex(l => l.code === language);
  const currentLang = languages[currentLangIndex];

  const cycleLanguage = useCallback(() => {
    const nextIndex = (currentLangIndex + 1) % languages.length;
    setLanguage(languages[nextIndex].code);
  }, [currentLangIndex, setLanguage]);

  const navLinks = useMemo(() => [
    { path: '/', label: t('nav.home') },
    { path: '/products', label: t('nav.products') },
    ...categories.slice(0, 2).map(c => ({
      path: `/products?category=${c.slug}`,
      label: c.name[language] || c.name.fr,
    })),
    { path: '/blog', label: t('nav.blog') },
  ], [categories, language, t]);

  return (
    <>
      <div className="bg-charcoal py-2 px-3 sm:px-4 text-center">
        <p className="font-body text-[9px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase truncate text-gold">
          {t('promo.freeDelivery')}
        </p>
      </div>

      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20 gap-2">

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-foreground"
                aria-label={t('aria.menu')}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  {isMenuOpen ? (
                    <path d="M18 6L6 18M6 6l12 12" />
                  ) : (
                    <path d="M3 8h18M3 16h18" />
                  )}
                </svg>
              </button>

              <Link to="/" className="flex-shrink-0" aria-label={t('aria.home')}>
                <img
                  src={arecimaLogo}
                  alt="Arecima"
                  className="h-12 sm:h-14 lg:h-20 w-auto object-contain"
                  width={280}
                  height={140}
                />
              </Link>
            </div>

            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => {
                const isActive = link.path === '/'
                  ? location.pathname === '/'
                  : link.path.includes('?')
                    ? `${location.pathname}${location.search}` === link.path
                    : location.pathname === link.path && !location.search;
                return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-body text-xs tracking-[0.15em] uppercase transition-colors hover:text-gold ${
                    isActive ? 'text-gold' : 'text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              );})}
            </nav>

            <div className="flex items-center gap-1 sm:gap-2 lg:gap-4">
              <button
                onClick={cycleLanguage}
                className="hidden lg:flex items-center gap-1.5 px-2 py-1.5 border border-border rounded-sm hover:border-gold transition-colors group"
                title={`${t('aria.switchLanguage')} → ${languages[(currentLangIndex + 1) % languages.length].label}`}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={language}
                    src={flagImages[language]}
                    alt={currentLang.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="w-5 h-4 object-cover rounded-[2px]"
                    width={20}
                    height={16}
                  />
                </AnimatePresence>
                <span className="font-body text-[10px] tracking-wider uppercase text-muted-foreground group-hover:text-foreground transition-colors">
                  {currentLang.code.toUpperCase()}
                </span>
              </button>

              <Link to="/favorites" className="relative p-2 text-foreground hover:text-gold transition-colors" aria-label={t('aria.favorites')}>
                <Heart className="h-5 w-5" />
                {favCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gold text-primary-foreground text-[10px] font-body font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {favCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-foreground hover:text-gold transition-colors"
                aria-label={t('aria.search')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-foreground hover:text-gold transition-colors"
                aria-label={t('nav.cart')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gold text-primary-foreground text-[10px] font-body font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute inset-x-0 top-full bg-background border-b border-border p-4"
            >
              <div className="container mx-auto max-w-2xl">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t('nav.search')}
                    className="w-full bg-secondary/50 border border-border rounded-none px-4 py-3 font-body text-sm tracking-wide focus:outline-none focus:border-gold"
                    autoFocus
                  />
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[55] bg-foreground"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-[60] w-80 max-w-[85vw] bg-background shadow-luxury"
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <img src={arecimaLogo} alt="Arecima" className="h-10 w-auto object-contain" width={200} height={100} />
                <button onClick={() => setIsMenuOpen(false)} className="p-2 text-foreground">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <nav className="flex flex-col p-6 gap-5">
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="font-display text-xl text-foreground hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/favorites"
                  onClick={() => setIsMenuOpen(false)}
                  className="font-display text-xl text-foreground hover:text-gold transition-colors flex items-center gap-3"
                >
                  <Heart className="h-5 w-5" />
                  {t('aria.myFavorites')}
                  {favCount > 0 && (
                    <span className="font-body text-[10px] bg-gold rounded-full px-1.5 py-0.5 min-w-[18px] text-center" style={{ color: 'hsl(200, 25%, 14%)' }}>
                      {favCount}
                    </span>
                  )}
                </Link>
              </nav>
              <div className="px-6 pt-4 border-t border-border">
                <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">
                  {t('general.language')}
                </p>
                <div className="flex flex-col gap-2">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code); setIsMenuOpen(false); }}
                      className={`flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                        language === lang.code
                          ? 'bg-champagne text-foreground'
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                      }`}
                    >
                      <img src={flagImages[lang.code]} alt={lang.label} className="w-6 h-4 object-cover rounded-[2px]" width={24} height={16} />
                      <span className="font-body text-sm">{lang.label}</span>
                      {language === lang.code && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="hsl(174, 42%, 42%)" strokeWidth="2" className="ml-auto">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
