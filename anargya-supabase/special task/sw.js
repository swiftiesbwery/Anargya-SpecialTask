const VERSION = 'anargya-v7';
const CORE = [
  './', 'index.html', 'about.html', 'achievements.html', 'shop.html', 'checkout.html', 'admin.html', 'offline.html',
  'style.css', 'logo.css', 'pages.css', 'script.js', 'store.js', 'shop.js', 'checkout.js', 'admin.js',
  'manifest.webmanifest', 'assets/icons/icon-192.png', 'assets/icons/icon-512.png', 'assets/hero/hero-1.jpg', 'assets/hero/hero-2.jpg', 'assets/mark5.png', 'assets/mark6.png',
  'assets/shop/anargya-strap.jpg',
  'assets/shop/keychain-f1-chillguys.jpg',
  'assets/shop/jersey-gold-thunder.jpg',
  'assets/shop/workshirt-2025.jpg',
  'assets/shop/tee-mark4-black.jpg',
  'assets/shop/keychain-mark1-4.jpg',
  'assets/shop/tee-black.jpg',
  'assets/shop/tee-white.jpg',
  'assets/shop/tee-mark4.jpg',
  'assets/shop/lanyard.jpg',
  'assets/shop/keychain.jpg',
  'assets/shop/sticker-pack.jpg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION)
      .then(c => Promise.allSettled(CORE.map(u => c.add(new Request(u, { cache: 'reload' })))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
  if (req.destination === 'video' || /\.(mp4|webm)$/i.test(url.pathname) || req.headers.has('range')) return;

  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(res => {
          if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
          return res;
        })
        .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('offline.html')))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(cached => {
      const net = fetch(req).then(res => {
        if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => cached);
      return cached || net;
    })
  );
});