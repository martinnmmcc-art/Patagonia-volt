// Patagonia Volt — Service Worker v5
//
// REGLA DE ORO: el service worker SOLO guarda archivos de la app (código, íconos,
// fuentes, librerías). NUNCA toca pedidos a la base de datos (Supabase) ni a ninguna
// otra API: esos siempre van directo a internet. (En la v4 la lectura de la base de
// datos quedaba guardada en caché y la app leía datos viejos -> se pisaban presupuestos.)
//
// - Código de la app (index.html, app.js, style.css): red primero; sin señal -> copia guardada.
// - Íconos, fuentes y librerías: caché primero (casi nunca cambian).
// - Cambiar CACHE_NAME borra todas las copias viejas al activarse.

const CACHE_NAME = 'patagonia-volt-v5';

const CORE_ASSETS = ['./', './index.html', './app.js', './style.css', './manifest.json'];
const STATIC_ASSETS = [
  './icon-192.png',
  './icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@400;500;600&display=swap'
];

// Únicos dominios externos que se pueden guardar en caché (recursos estáticos).
const CACHEABLE_HOSTS = ['cdnjs.cloudflare.com', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(CORE_ASSETS).then(() =>
        Promise.allSettled(STATIC_ASSETS.map(url => cache.add(url).catch(() => {})))
      )
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function isCoreRequest(request, url) {
  if (request.mode === 'navigate') return true;
  if (url.origin !== self.location.origin) return false;
  return /\/(index\.html|app\.js|style\.css)$/.test(url.pathname);
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;
  const cacheableExternal = CACHEABLE_HOSTS.includes(url.hostname);

  // Base de datos (Supabase) y cualquier otra API: NO se intercepta, va directo a internet.
  if (!sameOrigin && !cacheableExternal) return;

  if (isCoreRequest(request, url)) {
    // Red primero: con señal siempre trae la última versión; sin señal usa la copia guardada.
    event.respondWith(
      fetch(request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      }).catch(() =>
        caches.match(request).then(cached => cached || caches.match('./index.html'))
      )
    );
    return;
  }

  // Caché primero para íconos, fuentes y librerías.
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});
