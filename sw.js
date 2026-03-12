const CACHE_NAME = 'rg-repairs-pwa-v1';
const ASSETS = ['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).catch(()=>{}));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null)))
  );
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request).then(networkRes => {
      return caches.open(CACHE_NAME).then(cache => {
        cache.put(event.request, networkRes.clone());
        return networkRes;
      });
    }).catch(() => caches.match('./index.html')))
  );
});
