// Patagonia Volt — Service Worker
// v4: separa los archivos "core" (index.html, app.js, style.css) — que siempre se piden
// primero por red para traer la última versión — de los recursos estáticos (íconos, fuentes,
// librerías externas) que sí se sirven desde caché primero porque casi nunca cambian.
// Esto evita que el celular quede pegado a una versión vieja después de actualizar la app.

const CACHE_NAME = 'patagonia-volt-v4';

const CORE_ASSETS = ['./', './index.html', './app.js', './style.css', './manifest.json'];
const STATIC_ASSETS = [
  './icon-192.png',
  './icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@400;500;600&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CORE_ASSETS).then(() =>
        Promise.allSettled(STATIC_ASSETS.map(url => cache.add(url).catch(() => {})))
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

function isCoreRequest(request) {
  if (request.mode === 'navigate') return true;
  return request.url.endsWith('/index.html') || request.url.endsWith('/app.js') || request.url.endsWith('/style.css');
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  if (isCoreRequest(event.request)) {
    // Red primero: si hay conexión, siempre trae la versión más nueva del código de la app.
    // Si no hay conexión, usa la última copia guardada (así la app sigue abriendo offline).
    event.respondWith(
      fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() =>
        caches.match(event.request).then(cached => cached || caches.match('./index.html'))
      )
    );
    return;
  }

  // Caché primero para recursos estáticos (íconos, fuentes, librerías externas).
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'error') return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => {});
    })
  );
});
