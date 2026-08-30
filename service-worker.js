/* ==================== SERVICE WORKER - OFFLINE SUPPORT ==================== */

const CACHE_VERSION = 'pharmacalc-v2.3';
const CACHE_URLS = [
  './',
  './index.html',
  './styles/styles.css',
  './js/years-config.js',
  './js/storage.js',
  './js/i18n.js',
  './js/calculator.js',
  './js/ui-utils.js',
  './js/pdf-export.js',
  './js/year-calculator.js',
  './js/page3.js',
  './js/page4.js',
  './js/fixes.js',
  './js/app.js',
  './manifest.json'
];

// Install event - cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      console.log('[Service Worker] Caching files...');
      return cache.addAll(CACHE_URLS).catch(err => {
        console.warn('[Service Worker] Cache error:', err);
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_VERSION) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Network-First, fallback to cache
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  // Skip non-http/https requests (e.g. chrome-extension://)
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        const responseClone = response.clone();
        caches.open(CACHE_VERSION).then(cache => {
          cache.put(event.request, responseClone);
        });

        return response;
      })
      .catch(err => {
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html')) {
            return caches.match('./index.html');
          }
        });
      })
  );
});
