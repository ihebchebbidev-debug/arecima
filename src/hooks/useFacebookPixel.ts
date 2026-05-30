import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { bootstrapFacebookPixel, trackPageView } from '@/lib/facebookPixel';

/**
 * Bootstraps Facebook Pixel from API config and fires PageView on each
 * storefront route change (SPA-safe). Skips /admin/* routes.
 */
export const useFacebookPixel = () => {
  const location = useLocation();
  const readyRef = useRef(false);
  const lastPathRef = useRef('');

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;

    let cancelled = false;

    bootstrapFacebookPixel().then(ok => {
      if (cancelled || !ok) return;
      readyRef.current = true;
      const path = location.pathname + location.search;
      trackPageView();
      lastPathRef.current = path;
    });

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;

    const path = location.pathname + location.search;
    if (path === lastPathRef.current) return;

    if (!readyRef.current) {
      bootstrapFacebookPixel().then(ok => {
        if (!ok) return;
        readyRef.current = true;
        trackPageView();
        lastPathRef.current = path;
      });
      return;
    }

    lastPathRef.current = path;
    trackPageView();
  }, [location.pathname, location.search]);
};
