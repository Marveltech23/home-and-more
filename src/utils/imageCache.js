// Local browser persistent image cache helper (Service Worker + Cache Storage API)
const IMAGE_CACHE_NAME = 'hm-image-cache-v1';
const warmedUrls = new Set();

export function registerImageCacheWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .catch((err) => {
        console.warn('Image cache service worker registration skipped:', err);
      });
  });
}

/**
 * Quietly saves image URLs into the browser's persistent Cache Storage
 * during idle time so subsequent views load instantaneously with zero network wait.
 */
export function warmLocalImageCache(urls = []) {
  if (typeof window === 'undefined') return;

  const pending = Array.from(
    new Set(
      urls.filter(
        (u) =>
          typeof u === 'string' &&
          u.trim() &&
          !u.startsWith('data:') &&
          !warmedUrls.has(u)
      )
    )
  );

  if (pending.length === 0) return;
  pending.forEach((u) => warmedUrls.add(u));

  const run = async () => {
    // Prefer delegating to active Service Worker if ready
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'PRECACHE_IMAGES',
        urls: pending,
      });
      return;
    }

    // Fallback: write directly to Browser Cache Storage API on first visit
    if (!('caches' in window)) return;
    try {
      const cache = await window.caches.open(IMAGE_CACHE_NAME);
      const BATCH_SIZE = 4;
      for (let i = 0; i < pending.length; i += BATCH_SIZE) {
        const batch = pending.slice(i, i + BATCH_SIZE);
        await Promise.allSettled(
          batch.map(async (url) => {
            try {
              const req = new Request(url, {
                mode: url.startsWith('/') ? 'same-origin' : 'cors',
              });
              const hit = await cache.match(req);
              if (hit) return;
              const res = await fetch(req);
              if (res && (res.ok || res.type === 'opaque')) {
                await cache.put(req, res.clone());
              }
            } catch {
              // Ignore individual fetch failures on slow networks
            }
          })
        );
      }
    } catch {
      // Cache Storage unavailable (e.g. private browsing mode)
    }
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => run(), { timeout: 2500 });
  } else {
    setTimeout(run, 1200);
  }
}
