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

  const firePageViewIfReady = (path: string) => {
    if (path === lastPathRef.current) return;
    trackPageView();
    lastPathRef.current = path;
  };

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;

    let cancelled = false;
    const path = location.pathname + location.search;

    bootstrapFacebookPixel().then(ok => {
      if (cancelled || !ok) return;
      readyRef.current = true;
      firePageViewIfReady(path);
    });

    return () => { cancelled = true; };
  }, [location.pathname, location.search]);
};
