const CACHE = 'fortean-v2';
const ASSETS = ['./', 'index.html', 'styles.css', 'fonts.css', 'app.js', 'data.js', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png',
  'fonts/CormorantGaramond-500.woff2', 'fonts/CormorantGaramond-500i.woff2', 'fonts/CormorantGaramond-600.woff2',
  'fonts/JosefinSans-400.woff2', 'fonts/JosefinSans-600.woff2', 'fonts/Limelight-400.woff2', 'fonts/PoiretOne-400.woff2'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request).then(r => {
    const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r;
  }).catch(() => caches.match('index.html'))));
});
