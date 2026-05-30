import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { api, detectBrowser, detectDevice, detectOS, detectReferrerSource, getVisitorId } from '@/lib/api';

/**
 * Tracks a visitor session against /analytics.php.
 * - Fires once per page-route change (fire-and-forget; failures are silent).
 * - Records: device, browser, OS, referrer, landing page.
 * - Skips admin routes.
 */
export const useAnalyticsTracker = () => {
  const location = useLocation();
  const startRef = useRef<number>(Date.now());
  const pagesRef = useRef<number>(0);

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;
    pagesRef.current += 1;

    const duration = Math.round((Date.now() - startRef.current) / 1000);
    const payload = {
      visitor_id: getVisitorId(),
      device: detectDevice(),
      browser: detectBrowser(),
      os: detectOS(),
      referrer_source: detectReferrerSource(),
      landing_page: location.pathname,
      pages_viewed: pagesRef.current,
      duration_seconds: duration,
      is_bounce: pagesRef.current <= 1 ? 1 : 0,
    };

    // Fire and forget — never block the UI.
    api.trackSession(payload).catch(() => {});
  }, [location.pathname]);
};
