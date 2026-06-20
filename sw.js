// Service Worker for 每日说 PWA
const CACHE = 'meirishuo-v2';
const PRECACHE = [
  '.',
  'app.html',
  'manifest.json',
  'topics.js',
  'arguments.js',
  'words.js',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

// Install: precache core files
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return Promise.allSettled(
        PRECACHE.map(function(url) {
          return fetch(url, { cache: 'no-cache' }).then(function(res) {
            if (res.ok) cache.put(url, res.clone());
          }).catch(function() {
            // Silently skip failed precache items (offline install)
          });
        })
      );
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches, take control
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
          .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// Fetch: stale-while-revalidate for app shell, network-first for everything else
self.addEventListener('fetch', function(e) {
  var url = new URL(e.request.url);

  // Skip non-GET requests
  if (e.request.method !== 'GET') return;

  // For same-origin requests: stale-while-revalidate
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.open(CACHE).then(function(cache) {
        return cache.match(e.request).then(function(cached) {
          var fetchPromise = fetch(e.request).then(function(res) {
            if (res.ok) cache.put(e.request, res.clone());
            return res;
          }).catch(function() {
            return cached;
          });
          return cached || fetchPromise;
        });
      })
    );
    return;
  }

  // External requests: network-first with short timeout, fallback to cache
  // (handles API calls from callLLM — SW won't cache these, just pass through)
  e.respondWith(
    fetch(e.request).catch(function() {
      return caches.match(e.request);
    })
  );
});
