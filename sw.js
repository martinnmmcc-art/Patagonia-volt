// ── Patagonia Volt · Service Worker ──────────────────────
// Versión del caché — cambiá este número cada vez que
// actualices la app para que se descargue la versión nueva.
const CACHE_NAME = 'patagonia-volt-v1';

// Archivos a cachear para funcionar offline
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  // html2canvas desde CDN (se cachea en el primer uso)
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  // Fuentes de Google (se cachean en el primer uso)
  'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@400;500;600&display=swap'
];

// ── INSTALL: descarga y guarda todos los assets ───────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Agregamos los archivos locales con seguridad
      return cache.addAll(['/', '/index.html', '/manifest.json'])
        .then(() => {
          // CDN y fuentes: intentamos cachear, si falla no importa
          return Promise.allSettled(
            ASSETS.slice(3).map(url =>
              cache.add(url).catch(() => {})
            )
          );
        });
    }).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: borra cachés viejos ─────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: Cache First para assets, Network First para CDN ─
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Solo manejamos GET
  if (event.request.method !== 'GET') return;

  // Estrategia: Cache First (si está en caché lo usa, si no va a la red y lo guarda)
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request)
        .then(response => {
          // Solo cacheamos respuestas válidas
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Si no hay red y no está en caché, devolvemos index.html (para SPA)
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
    })
  );
});
