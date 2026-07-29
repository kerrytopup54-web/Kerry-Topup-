// Kerry Topup Official — Service Worker minimal (obligatwa pou enstalasyon PWA)
self.addEventListener('install', (event) => {
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  self.clients.claim();
});
self.addEventListener('fetch', (event) => {
  // Passthrough total — kite navigatè a jere demand yo natirèlman.
  // Nou pa kreye repons fo (tankou 503) lè yon demand echwe;
  // sa te lakòz sit la parèt "down" pou yon senp ti glitch rezo pasajè.
  event.respondWith(fetch(event.request));
});
