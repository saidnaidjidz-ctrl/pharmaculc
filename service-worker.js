/* ==================== SERVICE WORKER - OFFLINE SUPPORT ==================== */

const CACHE_VERSION = 'pharmacalc-v1';
const CACHE_URLS = [
  '/',
  '/index.html',
  '/styles/styles.css',
  '/js/storage.js',
  '/js/calculator.js',
  '/js/ui-utils.js',
  '/js/pdf-export.js',
  '/js/page1.js',
  '/js/page2.js',
  '/js/page3.js',
  '/js/page4.js',
  '/js/app.js',
  '/manifest.json'
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

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }

      return fetch(event.request).then(response => {
        // Don't cache non-successful response
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // Clone the response for caching
        const responseClone = response.clone();
        caches.open(CACHE_VERSION).then(cache => {
          cache.put(event.request, responseClone);
        });

        return response;
      }).catch(err => {
        console.warn('[Service Worker] Fetch error:', err);
        // Serve cached version if available
        return caches.match('/index.html');
      });
    })
  );
});

// Handle background sync
self.addEventListener('sync', event => {
  if (event.tag === 'sync-grades') {
    event.waitUntil(
      // Sync logic here if needed
      Promise.resolve()
    );
  }
});

console.log('[Service Worker] Initialized - App is ready to work offline!');
