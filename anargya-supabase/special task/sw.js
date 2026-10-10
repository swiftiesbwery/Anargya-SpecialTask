const CACHE = 'anargya-v2';

// Daftar sesuai struktur dari README-mu. Kalau ada file yang tidak ada, dilewati saja.
const PRECACHE = [
  './',
  './index.html',
  './about.html',
  './achievements.html',
  './academy.html',
  './news.html',
  './contact.html',
  './shop.html',
  './checkout.html',
  './admin.html',
  './offline.html',
  './manifest.json',
  './style.css',
  './pages.css',
  './loader.css',
  './logo.css',
  './news.css',
  './footer-wordmark.css',
  './loader.js',
  './script.js',
  './store.js',
  './shop.js',
  './checkout.js',
  './admin.js',
  './supabase-config.js',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) =>
      // Satu per satu, supaya satu file yang hilang tidak menggagalkan seluruh install
      Promise.allSettled(
        PRECACHE.map((url) =>
          cache.add(url).catch((err) => console.warn('SW: gagal cache', url, err))
        )
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;

  // Hanya GET dan satu origin. Supabase, CDN, dan Google Fonts dilewati.
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;

  // Halaman: network-first, fallback cache, lalu offline.html
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() =>
          caches.match(req).then((r) => r || caches.match('./offline.html'))
        )
    );
    return;
  }

  // Aset lain: cache-first, simpan otomatis yang belum ada
  e.respondWith(
    caches.match(req).then(
      (cached) =>
        cached ||
        fetch(req).then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
    )
  );
});