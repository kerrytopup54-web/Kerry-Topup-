// Kerry Topup Official — Service Worker minimal (obligatwa pou enstalasyon PWA)
self.addEventListener('install', (event) => {
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  self.clients.claim();
});
self.addEventListener('fetch', (event) => {
  // Passthrough — pa gen cache espesyal, jis satisfè kritè "installability" Chrome
  event.respondWith(fetch(event.request).catch(() => new Response('', { status: 503 })));
});
