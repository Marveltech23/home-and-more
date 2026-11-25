// Home & More Furniture — Local Browser Image Cache Service Worker
// Saves all site images persistently inside the user's browser Cache Storage
// so images load instantaneously even on slow or intermittent networks.

const IMAGE_CACHE_NAME = 'hm-image-cache-v1';

const IMAGE_EXTENSIONS = /\.(jpe?g|png|webp|gif|avif|svg)(\?.*)?$/i;

function isImageRequest(request, url) {
  if (request.method !== 'GET') return false;
  if (url.pathname.startsWith('/images/')) return true;
  if (request.destination === 'image') return true;
  if (IMAGE_EXTENSIONS.test(url.pathname)) return true;
  if (url.hostname === 'images.unsplash.com') return true;
  return false;
}

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(IMAGE_CACHE_NAME));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith('hm-image-cache-') && key !== IMAGE_CACHE_NAME)
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

// Listen for background precache requests from the storefront
self.addEventListener('message', (event) => {
  if (event.data?.type === 'PRECACHE_IMAGES' && Array.isArray(event.data.urls)) {
    event.waitUntil(precacheImageUrls(event.data.urls));
  }
});

async function precacheImageUrls(urls) {
  const cache = await caches.open(IMAGE_CACHE_NAME);
  const uniqueUrls = Array.from(
    new Set(urls.filter((u) => typeof u === 'string' && u.trim() && !u.startsWith('data:')))
  );

  // Batch in small groups so we never congest a slow user connection
  const BATCH_SIZE = 4;
  for (let i = 0; i < uniqueUrls.length; i += BATCH_SIZE) {
    const batch = uniqueUrls.slice(i, i + BATCH_SIZE);
    await Promise.allSettled(
      batch.map(async (rawUrl) => {
        try {
          const req = new Request(rawUrl, { mode: rawUrl.startsWith('/') ? 'same-origin' : 'cors' });
          const existing = await cache.match(req);
          if (existing) return;
          const res = await fetch(req);
          if (res && (res.ok || res.type === 'opaque')) {
            await cache.put(req, res.clone());
          }
        } catch {
          // Silently skip failed items on offline/poor connections
        }
      })
    );
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }

  // Never intercept Supabase API, Realtime, or non-GET calls
  if (url.hostname.includes('supabase.co')) return;
  if (!isImageRequest(request, url)) return;

  // Cache-First strategy: serve instantaneously from local browser storage
  event.respondWith(
    (async () => {
      const cache = await caches.open(IMAGE_CACHE_NAME);
      const cachedResponse = await cache.match(request, { ignoreVary: true });
      if (cachedResponse) {
        return cachedResponse;
      }

      try {
        const networkResponse = await fetch(request);
        if (networkResponse && (networkResponse.ok || networkResponse.type === 'opaque')) {
          cache.put(request, networkResponse.clone()).catch(() => {});
        }
        return networkResponse;
      } catch (err) {
        // Fallback if offline and image wasn't cached yet
        if (cachedResponse) return cachedResponse;
        throw err;
      }
    })()
  );
});
