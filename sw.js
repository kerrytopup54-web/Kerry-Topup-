// Kerry Topup Official — Service Worker
// Kache kokiy app la (paj prensipal, polis, elatriye) pou chajman PI VIT
// menm sou koneksyon fèb, e pou l ka louvri OFFLINE apre premye vizit.
//
// ⚠️ IMPORTANT: Done finansye (wallet, pri, kòmand, chat) PA JANM kache —
// yo toujou soti dirèkteman nan Supabase/ntfy.sh lè entènèt disponib,
// pou evite montre kliyan enfòmasyon ki pa ajou.

const OFFLINE_URL = '/offline.html';
const CACHE_NAME = 'kerry-topup-shell-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(['/', OFFLINE_URL]).catch(() => {}))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // PA janm kache apèl Supabase (done finansye) oswa ntfy — toujou rezo, jamè cache
  if (url.hostname.includes('supabase.co') || url.hostname.includes('ntfy.sh')) {
    return;
  }

  // Sèlman jere GET — POST/PUT/DELETE pase dirèk san entèsepsyon
  if (event.request.method !== 'GET') return;

  // Navigasyon (louvri/rechaje paj la): rezo an premye pou toujou gen dènye vèsyon,
  // men si rezo a echwe (offline/fèb), sèvi ak kopi kache a pou chajman imedyat.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('/', copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match('/').then((cached) => cached || caches.match(OFFLINE_URL)))
    );
    return;
  }

  // Rès resous yo (polis, ikòn, elatriye): eseye kache dabò pou vitès,
  // rafrechi an background lè posib.
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
          return res;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});

// ===== Push Notifications =====
self.addEventListener('push', (event) => {
  let data = {};
  try{ data = event.data ? event.data.json() : {}; }catch(e){ data = { title: 'Kerry Topup', body: event.data ? event.data.text() : '' }; }
  const title = data.title || 'Kerry Topup Official';
  const options = {
    body: data.body || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: { url: data.url || '/' },
    vibrate: [100, 50, 100]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
