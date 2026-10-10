# Anargya ITS EV Team — Website, Shop & PWA

> 🌐 **Sudah ter-deploy dan bisa diakses di: [https://its.id/m/anargyaura](https://its.id/m/anargyaura)**

Website profil tim **Anargya ITS EV Team** yang dilengkapi halaman informasi, katalog merchandise, keranjang, checkout demo, halaman admin, loading screen, dan dukungan Progressive Web App (PWA).

> **Status:** Alur utama (katalog produk, keranjang, checkout, penyimpanan order ke Supabase, dan panel admin) sudah diuji dan berjalan. Ringkasan hasil pengujian ada di bagian [Status pengujian dan keamanan](#9-status-pengujian-dan-keamanan).

## Daftar isi

1. [Ringkasan](#1-ringkasan)
2. [Teknologi yang digunakan](#2-teknologi-yang-digunakan)
3. [Struktur folder](#3-struktur-folder)
4. [Persyaratan perangkat](#4-persyaratan-perangkat)
5. [Menjalankan secara lokal](#5-menjalankan-website-secara-lokal)
6. [Menjalankan dari device lain & deploy](#6-menjalankan-dari-device-lain-dan-deploy)
7. [Konfigurasi Supabase dan database](#7-konfigurasi-supabase-dan-database)
8. [Fitur dan cara mengetes](#8-fitur-dan-cara-mengetes)
9. [Status pengujian dan keamanan](#9-status-pengujian-dan-keamanan)
10. [Loading screen](#10-loading-screen)
11. [Troubleshooting](#11-troubleshooting)
12. [Batasan yang diketahui](#12-batasan-yang-diketahui)
13. [Checklist kelengkapan project](#13-checklist-kelengkapan-project)

## 1. Ringkasan

| Item | Keterangan |
|---|---|
| **Link live** | https://its.id/m/anargyaura |
| **Jenis project** | Website statis (HTML, CSS, JavaScript) + Supabase |
| **Halaman utama** | Beranda, About, Achievements, Academy, News, Contact, Shop, Checkout, Admin |
| **PWA** | Ya (manifest, service worker, halaman offline) |
| **Pembayaran** | Belum ada payment gateway (checkout bersifat demo) |
| **Folder website** | `anargya-supabase/special task/` |

### Fitur utama

- **Website profil tim** — beranda, about, achievements, academy, news, dan contact.
- **Katalog merchandise** — produk dan stok dibaca langsung dari database Supabase.
- **Keranjang dan checkout** — keranjang tersimpan di browser; order disimpan ke Supabase melalui fungsi database `place_order` dan mengurangi stok otomatis.
- **Panel admin** — login admin (Supabase Auth) untuk mengelola produk dan melihat order, dengan pembatasan akses melalui Row Level Security (RLS).
- **Progressive Web App (PWA)** — dapat di-install dan memiliki halaman offline.
- **Loading screen** — animasi pemuatan bertema Anargya saat halaman dibuka dan saat berpindah halaman.
- **Desain responsif** — tampilan menyesuaikan layar mobile, tablet, dan desktop.

## 2. Teknologi yang digunakan

- **Frontend:** HTML5, CSS3, dan JavaScript vanilla (tanpa framework frontend).
- **Font:** Google Fonts — Inter dan Montserrat.
- **Database/backend-as-a-service:** Supabase, yang menyediakan PostgreSQL dan Supabase Auth.
- **Client database:** `@supabase/supabase-js` v2 melalui CDN.
- **Penyimpanan browser:** `localStorage` untuk keranjang dan cache data produk lokal; `sessionStorage` untuk menampilkan konfirmasi order terakhir pada sesi browser.
- **PWA:** `manifest.webmanifest`, `sw.js` (service worker), halaman `offline.html`, serta ikon aplikasi di `assets/icons/`.
- **Hosting:** dapat dijalankan secara lokal dengan web server statis atau dipublikasikan ke hosting statis yang mendukung HTTPS. Versi live saat ini: https://its.id/m/anargyaura.

Project ini tidak memakai Node.js/npm sebagai keharusan untuk menjalankan frontend, dan tidak memiliki `package.json` pada versi yang disertakan.

## 3. Struktur folder

File website berada di:

```text
anargya-supabase/special task/
├── index.html                 # Halaman utama
├── about.html                 # Profil/tim
├── achievements.html          # Prestasi
├── academy.html               # Academy/program
├── news.html                  # Berita
├── contact.html               # Kontak
├── shop.html                  # Katalog merchandise
├── checkout.html              # Keranjang/checkout
├── admin.html                 # Login dan panel admin
├── style.css                  # Gaya halaman utama
├── pages.css                  # Gaya halaman lainnya
├── loader.css                 # Gaya loading screen
├── loader.js                  # Logika loading screen (HTML loader disisipkan otomatis)
├── script.js                  # Interaksi umum dan registrasi service worker
├── store.js                   # Logika produk, cart, checkout, dan Supabase
├── shop.js
├── checkout.js
├── admin.js
├── supabase-config.js         # URL project dan public key Supabase
├── supabase.sql               # Skema awal dan data produk
├── supabase-admin.sql         # Tambahan aturan admin (perlu ditinjau; lihat catatan)
├── manifest.webmanifest       # Metadata PWA
├── sw.js                      # Cache/offline behavior
├── offline.html
└── assets/                    # Foto, logo, ikon, dan gambar merchandise
```

## 4. Persyaratan perangkat

- Browser modern (Chrome, Edge, Firefox, atau Safari).
- Koneksi internet untuk memuat Google Fonts, CDN Supabase, serta mengakses database cloud.
- Python 3 **atau** ekstensi VS Code Live Server untuk menjalankan web server lokal.
- Akun Supabase untuk membuat/mengelola database jika belum memiliki project yang aktif.

Untuk akses dari device berbeda, setiap device cukup membuka alamat live (https://its.id/m/anargyaura) atau alamat IP komputer server yang dapat dijangkau di jaringan yang sama. Data di Supabase tersimpan di cloud dan dapat diakses lintas device; data `localStorage` tidak otomatis berpindah antar-browser/device.

## 5. Menjalankan website secara lokal

### Opsi A — VS Code Live Server

1. Ekstrak ZIP project.
2. Buka folder `anargya-supabase/special task/` di VS Code.
3. Pasang ekstensi **Live Server** jika belum tersedia.
4. Klik kanan `index.html` → **Open with Live Server**.
5. Browser akan membuka alamat lokal, biasanya seperti `http://127.0.0.1:5500`.

### Opsi B — Python

Pastikan terminal berada di folder `anargya-supabase/special task/`, lalu jalankan:

```bash
python -m http.server 5500
```

Jika perintah `python` tidak tersedia, coba `py -m http.server 5500` di Windows atau `python3 -m http.server 5500` di macOS/Linux. Buka `http://localhost:5500` di browser.

> Jangan hanya membuka file dengan double-click (`file://`). Jalankan melalui HTTP/HTTPS agar perilaku JavaScript dan service worker lebih konsisten.

## 6. Menjalankan dari device lain dan deploy

### a. Mengakses versi live

Cukup buka **https://its.id/m/anargyaura** dari browser device mana pun. Tidak perlu instalasi apa pun.

### b. Mencoba di jaringan Wi-Fi yang sama (versi lokal)

1. Jalankan server lokal seperti langkah sebelumnya.
2. Cari alamat IP lokal komputer yang menjalankan server:
   - Windows: `ipconfig`, lalu cari IPv4 Address pada adapter Wi-Fi.
   - macOS/Linux: `ifconfig` atau `ip addr`.
3. Dari device lain yang tersambung ke Wi-Fi yang sama, buka `http://IP-KOMPUTER:5500`.
4. Jika tidak bisa diakses, periksa firewall dan pastikan server mendengarkan pada interface jaringan, bukan hanya loopback. Jangan membuka port ini ke internet publik.

Contoh format alamat: `http://192.168.1.10:5500` — ganti IP contoh tersebut dengan IP komputer sendiri.

**Catatan PWA:** service worker dan fitur instalasi PWA umumnya memerlukan HTTPS, dengan pengecualian `localhost`. Akses melalui IP lokal dengan HTTP mungkin membuat PWA tidak bisa di-install atau service worker tidak berjalan. Untuk menguji PWA lintas device, gunakan versi live yang sudah HTTPS.

### c. Deploy ulang atau deploy ke hosting lain

1. Push project ke repository Git (pastikan tidak menyertakan secret).
2. Deploy ke static hosting seperti GitHub Pages, Netlify, atau Vercel.
3. **Arahkan folder publish ke folder yang berisi `index.html`**, yaitu:
   ```text
   anargya-supabase/special task
   ```
   Build command dikosongkan karena ini website statis.
4. Gunakan URL HTTPS hasil deployment di setiap device.
5. Pastikan konfigurasi Supabase di deployment mengarah ke project cloud yang benar.
6. Jika memakai login Supabase Auth, tambahkan URL deployment ke **Authentication → URL Configuration** (Site URL dan Redirect URLs) di dashboard Supabase.

Static hosting hanya meng-host file website. Database Supabase tetap berada di project Supabase dan tidak ikut tersimpan di folder website.

## 7. Konfigurasi Supabase dan database

### Di mana database disimpan?

Database yang dirancang project ini adalah **PostgreSQL pada Supabase cloud**, bukan database lokal di laptop dan bukan file database di folder project. File `supabase.sql` adalah skrip untuk membuat tabel dan memasukkan data awal; file itu bukan database aktif itu sendiri.

### Membuat/menghubungkan project Supabase

1. Buat atau buka project di dashboard Supabase.
2. Buka **SQL Editor**.
3. **Sebelum menjalankan SQL**, ketahui bahwa skrip utama (`supabase.sql`) berisi perintah `DROP TABLE ... CASCADE` untuk tabel `orders` dan `products`. Menjalankannya ulang pada database yang sudah berisi data akan menghapus data tersebut, jadi lakukan backup terlebih dahulu.
4. Jalankan skrip skema di SQL Editor pada project yang baru/kosong.
5. Buat user admin melalui **Authentication → Users**.
6. Ambil **Project URL** dan **Publishable key** (atau legacy `anon` key) dari pengaturan/API project Supabase.
7. Buka `supabase-config.js`, lalu isi dengan nilai project milikmu:

```js
window.SUPABASE_URL = 'https://PROJECT-REF.supabase.co';
window.SUPABASE_ANON_KEY = 'YOUR_PUBLISHABLE_OR_ANON_KEY';
window.supabaseClient = window.supabase.createClient(
  window.SUPABASE_URL,
  window.SUPABASE_ANON_KEY
);
```

Gunakan nilai asli dari dashboard Supabase, bukan teks contoh di atas. Setelah disimpan, deploy ulang file website.

### Connection string

Frontend saat ini **tidak memakai PostgreSQL connection string langsung**. Browser berkomunikasi dengan Supabase melalui **Project URL + publishable/anon key** dan library `supabase-js`. Connection string PostgreSQL (yang berisi host, database, user, dan password) hanya diperlukan untuk tool backend/database seperti `psql` atau database client. **Jangan** taruh connection string ber-password atau `service_role` key di JavaScript frontend maupun repository publik.

### Data yang tersimpan di mana?

| Data | Lokasi |
|---|---|
| Produk dan stok | Tabel `products` di Supabase, dibaca ke browser |
| Order/pesanan | Fungsi database `place_order` menyimpan pesanan dan mengurangi stok |
| Keranjang | `localStorage` browser (tidak sinkron antar-device) |
| Cache produk | `localStorage` browser, diperbarui saat data berhasil diambil dari Supabase |
| Order terakhir (halaman konfirmasi) | `localStorage` + ID sesi di `sessionStorage`; sumber order lintas-device seharusnya database |
| Gambar | Folder `assets/`; kolom gambar di database menyimpan path relatif |

## 8. Fitur dan cara mengetes

1. Buka `index.html` (atau https://its.id/m/anargyaura) untuk halaman profil.
2. Perhatikan **loading screen** yang tampil saat halaman dimuat.
3. Navigasikan ke halaman **Shop** untuk melihat katalog.
4. Tambahkan barang ke keranjang dan buka **Checkout**.
5. Checkout memanggil RPC `place_order` pada Supabase dan order tersimpan di database. Karena belum ada payment gateway, ini adalah alur **pemesanan demo**, bukan transaksi pembayaran sungguhan.
6. Buka `admin.html`, login dengan akun admin, lalu cek daftar order dan pengelolaan produk.
7. Untuk PWA, buka website melalui HTTPS, lalu cek menu install browser. Uji halaman offline setelah website pernah dibuka saat online.

Tidak ada integrasi payment gateway pada file yang diperiksa. Pilihan metode pembayaran di checkout hanya data pesanan/demo, bukan proses pembayaran otomatis.

## 9. Status pengujian dan keamanan

Berikut hasil pengujian alur utama berdasarkan pengujian langsung oleh pengembang pada versi yang ter-deploy:

| Area | Hasil |
|---|---|
| Katalog produk (Shop) | Berjalan, data produk dibaca dari Supabase |
| Keranjang | Berjalan, disimpan di `localStorage` |
| Checkout | Berjalan, order tersimpan ke Supabase melalui RPC `place_order` |
| Stok produk | Berkurang setelah checkout |
| Struktur data order | Sesuai dengan query pada JavaScript |
| Panel admin | Login berjalan; order dan produk dapat dikelola |
| Pembatasan akses admin (RLS) | Operasi admin dibatasi untuk admin yang sah |

### Catatan penting

- **Skrip `supabase.sql` bersifat destruktif.** Skrip ini berisi `DROP TABLE ... CASCADE` untuk `orders` dan `products`. Jangan dijalankan ulang pada database yang berisi data tanpa backup dan review.
- **Jangan menaruh `service_role` key atau password database di frontend atau repository.** Frontend hanya memakai Project URL dan publishable/anon key. Keamanan bergantung pada kebijakan Row Level Security (RLS) di database, bukan pada tampilan frontend.
- **Pembayaran belum nyata.** Metode pembayaran di checkout hanya data pesanan; belum ada payment gateway.
- **Pengujian lanjutan yang disarankan:** uji alur produk → cart → checkout → stok → daftar order di beberapa browser/device yang berbeda, serta uji beberapa checkout bersamaan untuk memastikan stok tidak negatif.

## 10. Loading screen

Website memiliki loading screen bertema Anargya (background gelap, logo, teks hijau, bar progress, dan persentase).

**Cara kerja**
- Muncul otomatis saat halaman pertama dimuat; progress naik pelan hingga 90%, lalu menjadi 100% saat halaman selesai dimuat dan loader memudar.
- Muncul lagi saat pengguna berpindah halaman lewat link internal.
- Ada durasi tampil minimum (`MIN_MS` di `loader.js`, default 900 ms) agar tidak berkedip pada koneksi cepat.
- Menghormati pengaturan `prefers-reduced-motion`.

**Cara memasang di halaman baru**

Di dalam `<head>`:

```html
<link rel="stylesheet" href="loader.css">
```

Sebelum `</body>`:

```html
<script src="loader.js"></script>
```

**Pemakaian manual** (misalnya untuk proses fetch/AJAX):

```js
PageLoader.show();
// ... proses yang butuh waktu
PageLoader.hide();
```

**Kustomisasi ukuran:** ubah `width`/`height` pada `.anl-content` dan `.anl-logo` di `loader.css`. Semua class dan ID loader memakai awalan `anl-` agar tidak bentrok dengan CSS website. Untuk mengganti logo, ubah elemen `<svg>` di `loader.js` dengan logo asli, misalnya `<img class="anl-logo" src="assets/logo.svg" alt="">`.

## 11. Troubleshooting

| Masalah | Solusi |
|---|---|
| **"Page not found" setelah deploy** | Publish directory belum menunjuk ke folder yang berisi `index.html`. Isi dengan `anargya-supabase/special task`, lalu deploy ulang. |
| **Perubahan tidak muncul** | Muat ulang paksa dengan **Ctrl + F5**. Service worker dapat menyimpan cache lama; hapus lewat DevTools → Application → Service Workers → Unregister bila perlu. |
| **Loader tampil tanpa background / tertimpa style lain** | Pastikan memakai `loader.css` dan `loader.js` versi terbaru (class berawalan `anl-`), lalu muat ulang dengan Ctrl + F5. |
| **Login admin gagal setelah deploy** | Tambahkan URL deployment ke Site URL dan Redirect URLs di Supabase (Authentication → URL Configuration). |
| **Produk/stok tidak muncul** | Periksa isi `supabase-config.js` dan pastikan data produk ada di tabel `products` dan kebijakan baca (RLS) mengizinkannya. |
| **PWA tidak bisa di-install** | Pastikan website dibuka lewat HTTPS dan `manifest.webmanifest` serta `sw.js` dapat diakses. |

## 12. Batasan yang diketahui

- `localStorage` dan `sessionStorage` berlaku per browser/per device; tidak sama dengan sinkronisasi database.
- Service worker memberi cache/offline fallback dasar, bukan jaminan seluruh halaman dan seluruh gambar tersedia offline.
- Website memuat Google Fonts dan Supabase JS dari CDN, sehingga beberapa bagian memerlukan koneksi internet.
- Project belum memproses pembayaran melalui payment gateway.
- Alur shop/admin sudah diuji. Karena belum ada pembayaran nyata, checkout bersifat demo dan belum dimaksudkan sebagai toko produksi penuh.