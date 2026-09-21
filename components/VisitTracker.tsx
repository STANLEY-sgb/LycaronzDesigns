"use client";

import { useEffect } from 'react';

export default function VisitTracker() {
  useEffect(() => {
    const payload = { path: window.location.pathname, referrer: document.referrer || null };
    // try sendBeacon for reliability, fallback to fetch
    try {
      const data = JSON.stringify(payload);
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/visits', data);
      } else {
        void fetch('/api/visits', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: data });
      }
    } catch {
      // ignore errors
    }
  }, []);

  return null;
}
