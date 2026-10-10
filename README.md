# Anargya ITS EV Team

Website Anargya ITS EV Team merupakan website profil tim yang dilengkapi katalog merchandise dan sistem pemesanan. Website ini dibuat menggunakan HTML, CSS, dan JavaScript, dengan Supabase sebagai layanan backend dan database.

Website dapat diakses melalui [https://its.id/m/anargyaura](https://its.id/m/anargyaura).

## 1. Project Overview

Project ini menggabungkan halaman informasi tim dengan fitur toko merchandise. Pengunjung dapat melihat informasi tim, pencapaian, program, berita, kontak, dan produk merchandise. Admin juga memiliki halaman tersendiri untuk mengelola produk dan memantau pesanan.

Fitur utama yang tersedia:

- Halaman Home, About, Achievements, Academy, News, dan Contact.
- Katalog merchandise yang mengambil data produk dari database.
- Keranjang belanja dengan penyimpanan lokal di browser.
- Checkout demo yang menyimpan pesanan ke database.
- Pembaruan stok setelah pesanan diproses.
- Panel admin dengan autentikasi Supabase.
- Loading screen saat halaman dibuka dan ketika berpindah halaman.
- Progressive Web App (PWA) dengan manifest, service worker, dan halaman offline.

## 2. Development Environment

Project ini dikembangkan sebagai website statis. Artinya, file HTML, CSS, dan JavaScript dikirim ke browser, kemudian JavaScript menjalankan interaksi dan menghubungkan website ke layanan Supabase.

Environment yang digunakan:

| Komponen | Keterangan |
|---|---|
| Code editor | Visual Studio Code |
| Bahasa frontend | HTML5, CSS3, JavaScript |
| JavaScript framework | Tidak menggunakan framework frontend |
| Runtime frontend | Browser |
| Local web server | VS Code Live Server atau Python HTTP Server |
| Backend service | Supabase |
| Database engine | PostgreSQL melalui Supabase |
| Authentication | Supabase Auth |
| Database client | `@supabase/supabase-js` v2 melalui CDN |
| Browser storage | `localStorage` dan `sessionStorage` |
| PWA | `manifest.json` dan `sw.js` |
| Deployment | Hosting statis dengan HTTPS |

Project ini tidak memerlukan Node.js, npm, atau proses build untuk menjalankan frontend versi yang menggunakan library melalui CDN. Karena itu, tidak diperlukan perintah `npm install` maupun `npm run dev`.

Versi browser dan Live Server tidak dikunci oleh project. Gunakan browser modern dan server lokal yang mendukung akses melalui HTTP.

## 3. Struktur Project

File website berada di dalam folder `anargya-supabase/special task/`.

```text
special task/
├── index.html
├── about.html
├── achievements.html
├── academy.html
├── news.html
├── contact.html
├── shop.html
├── checkout.html
├── admin.html
├── style.css
├── pages.css
├── loader.css
├── loader.js
├── script.js
├── store.js
├── shop.js
├── checkout.js
├── admin.js
├── supabase-config.js
├── supabase.sql
├── supabase-admin.sql
├── manifest.json
├── sw.js
├── offline.html
└── assets/
    ├── icons/
    └── ...
```

Fungsi file utama:

| File | Fungsi |
|---|---|
| `index.html` | Beranda website |
| `about.html` | Informasi tim |
| `achievements.html` | Daftar pencapaian tim |
| `academy.html` | Informasi program Academy |
| `news.html` | Berita dan informasi terbaru |
| `contact.html` | Informasi kontak |
| `shop.html` | Katalog merchandise |
| `checkout.html` | Keranjang dan proses checkout |
| `admin.html` | Login dan panel pengelolaan toko |
| `style.css`, `pages.css` | Styling halaman website |
| `loader.css`, `loader.js` | Tampilan dan logika loading screen |
| `script.js` | Interaksi umum dan registrasi service worker |
| `store.js` | Logika data produk, keranjang, checkout, dan komunikasi database |
| `shop.js` | Interaksi halaman Shop |
| `checkout.js` | Proses checkout dan konfirmasi pesanan |
| `admin.js` | Logika panel admin |
| `supabase-config.js` | Konfigurasi koneksi Supabase |
| `supabase.sql` | Skrip database dan data awal |
| `supabase-admin.sql` | Skrip tambahan terkait akses admin |
| `manifest.json` | Konfigurasi PWA |
| `sw.js` | Cache dan penanganan akses offline |
| `offline.html` | Halaman ketika akses offline diperlukan |

Nama file dan susunan di atas perlu disesuaikan jika struktur repository berubah. Pastikan referensi antarfile tetap benar.

## 4. Environment dan Dependency

### Frontend

Frontend dibuat menggunakan HTML, CSS, dan JavaScript vanilla. HTML mengatur struktur halaman, CSS menangani tampilan dan responsivitas, sedangkan JavaScript menangani interaksi pengguna dan komunikasi dengan Supabase.

Tidak ada framework seperti React, Vue, atau Angular yang diwajibkan oleh project ini.

### Supabase JavaScript Client

Website menggunakan library `@supabase/supabase-js` versi 2 yang dimuat melalui CDN. Library ini menyediakan fungsi untuk berkomunikasi dengan database Supabase melalui API, melakukan autentikasi, dan menjalankan pemanggilan fungsi database.

Karena library dimuat melalui CDN, koneksi internet diperlukan ketika browser perlu mengunduh library tersebut.

Project tidak menggunakan server Node.js khusus untuk menjalankan API sendiri. Browser berkomunikasi langsung dengan Supabase menggunakan client JavaScript.

### Environment variables

Pada implementasi ini, konfigurasi Supabase disimpan di file `supabase-config.js`, bukan otomatis dibaca dari file `.env`.

Hal ini sesuai dengan pola website statis yang menjalankan JavaScript langsung di browser. File `.env` yang biasa digunakan oleh backend atau build tool tidak otomatis tersedia di browser.

Perlu diingat bahwa nilai yang ditulis di file frontend dapat dilihat oleh pengunjung. Karena itu, file konfigurasi hanya boleh berisi informasi yang memang aman digunakan pada sisi client.

## 5. Supabase Connection Configuration

Bagian ini menjelaskan bagaimana website terhubung ke backend dan database.

### 5.1 Layanan yang digunakan

Supabase menyediakan beberapa layanan yang digunakan dalam project ini:

- **PostgreSQL:** menyimpan data produk dan pesanan.
- **Supabase Auth:** menangani autentikasi admin.
- **Data API:** menyediakan akses ke tabel database melalui client Supabase.
- **RPC:** memungkinkan frontend memanggil fungsi database, termasuk `place_order`.

### 5.2 Project URL dan API key

Koneksi dari browser menggunakan dua informasi utama:

1. **Project URL**, yaitu alamat API untuk project Supabase.
2. **Publishable key atau anon key**, yaitu key yang digunakan frontend untuk mengakses API sesuai hak akses yang ditentukan.

Format Project URL:

```text
https://<project-ref>.supabase.co
```

Nilai `<project-ref>` harus diganti dengan referensi project yang tersedia pada dashboard Supabase.

Kedua nilai tersebut dikonfigurasi pada `supabase-config.js`. Untuk menjalankan project dengan database sendiri, gunakan URL dan key dari project yang ingin dihubungkan.

### 5.3 Apakah project menggunakan PostgreSQL connection string?

Frontend project ini **tidak menggunakan PostgreSQL connection string secara langsung**.

PostgreSQL connection string biasanya memiliki format seperti:

```text
postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

String tersebut digunakan untuk koneksi langsung ke PostgreSQL melalui driver atau database client, misalnya `psql`. Di dalamnya dapat terdapat username dan password database.

Sementara itu, website Anargya menggunakan Project URL dan publishable/anon key melalui Supabase JavaScript Client. Komunikasi dilakukan melalui API Supabase, bukan dengan membuka koneksi PostgreSQL langsung dari browser.

Connection string database dapat ditemukan pada pengaturan koneksi database Supabase jika diperlukan untuk tool database tertentu. Namun, connection string beserta password database tidak boleh dimasukkan ke JavaScript frontend atau repository publik.

## 6. Supabase Client Initialization

Inisialisasi adalah proses membuat client agar file JavaScript website dapat mengakses layanan Supabase.

### 6.1 Konfigurasi client

File `supabase-config.js` bertanggung jawab menyediakan konfigurasi Supabase dan membuat client yang dapat digunakan file lain.

Secara konsep, inisialisasinya seperti berikut:

```javascript
window.SUPABASE_URL = 'https://PROJECT-REF.supabase.co';
window.SUPABASE_ANON_KEY = 'YOUR_PUBLISHABLE_OR_ANON_KEY';

window.supabaseClient = window.supabase.createClient(
  window.SUPABASE_URL,
  window.SUPABASE_ANON_KEY
);
```

Kode di atas merupakan ilustrasi pola inisialisasi. Pertahankan nama variabel dan struktur yang benar-benar digunakan oleh file project. Jangan mengganti isi konfigurasi asli tanpa memeriksa pemanggilan client di file lainnya.

### 6.2 Urutan pemuatan script

Agar inisialisasi berhasil, library Supabase harus dimuat sebelum `supabase-config.js`. File yang menggunakan client juga harus dijalankan setelah client tersedia.

Contoh urutan pemuatan:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="supabase-config.js"></script>
<script src="store.js"></script>
```

Urutan ini menunjukkan dependensi dasar. Sesuaikan lokasi dan atribut script dengan HTML yang digunakan pada setiap halaman.

Jika library belum dimuat ketika `supabase-config.js` dijalankan, `window.supabase` dapat bernilai `undefined`. Jika konfigurasi belum selesai ketika `store.js` berjalan, client database juga belum tersedia.

### 6.3 Alur koneksi

Secara umum, proses koneksi berjalan seperti berikut:

1. Browser membuka halaman website.
2. Browser memuat library Supabase dari CDN.
3. `supabase-config.js` membaca konfigurasi URL dan API key.
4. Client Supabase dibuat melalui `createClient()`.
5. File JavaScript halaman menggunakan client tersebut untuk mengambil atau mengirim data.
6. Supabase memproses permintaan sesuai autentikasi dan kebijakan akses database.
7. Hasilnya dikembalikan ke JavaScript untuk ditampilkan atau diproses lebih lanjut.

Dengan pola ini, frontend tidak perlu menjalankan server database sendiri di komputer pengunjung.

## 7. Database Schema dan Data Flow

Database PostgreSQL dikelola melalui Supabase. Skrip SQL pada project digunakan untuk menyiapkan struktur tabel dan data awal.

### 7.1 Tabel utama

| Tabel atau fungsi | Peran |
|---|---|
| `products` | Menyimpan data merchandise dan stok |
| `orders` | Menyimpan data pesanan |
| `place_order` | Memproses pemesanan melalui RPC |

Struktur kolom, tipe data, constraint, dan parameter fungsi mengikuti definisi yang ada di file SQL project. Periksa file tersebut sebelum membuat database baru agar struktur database sesuai dengan kode frontend.

### 7.2 Alur pengambilan produk

Ketika halaman Shop dibuka, JavaScript meminta data produk melalui Supabase. Data yang diterima kemudian digunakan untuk membentuk tampilan katalog.

Alurnya:

```text
shop.html
    ↓
shop.js / store.js
    ↓
Supabase JavaScript Client
    ↓
Supabase Data API
    ↓
PostgreSQL: products
    ↓
Data produk ditampilkan di Shop
```

### 7.3 Alur keranjang

Saat pengunjung memilih produk, keranjang dikelola oleh JavaScript dan disimpan di `localStorage`.

Dengan begitu, keranjang dapat tetap tersedia setelah halaman dimuat ulang pada browser yang sama. Namun, penyimpanan tersebut bersifat lokal dan tidak otomatis disinkronkan ke perangkat lain.

### 7.4 Alur checkout

Saat checkout diproses, frontend memanggil fungsi database `place_order` melalui RPC Supabase. Fungsi tersebut menangani penyimpanan pesanan dan pembaruan stok sesuai implementasi database.

```text
checkout.html
    ↓
checkout.js / store.js
    ↓
Supabase Client
    ↓
RPC: place_order
    ↓
Penyimpanan pesanan dan pembaruan stok
    ↓
Hasil proses dikembalikan ke frontend
```

Alur ini memungkinkan pesanan tercatat di database, bukan hanya disimpan di browser.

Checkout tetap berupa simulasi pemesanan karena belum menggunakan payment gateway untuk memproses pembayaran sungguhan.

## 8. Database Setup

Untuk menjalankan fitur database menggunakan project Supabase sendiri:

1. Buat project baru di [Supabase](https://supabase.com).
2. Buka bagian SQL Editor pada dashboard.
3. Periksa isi `supabase.sql`.
4. Jalankan skrip pada database yang sesuai.
5. Periksa `supabase-admin.sql` jika dibutuhkan oleh konfigurasi akses admin.
6. Buat akun admin melalui Authentication → Users.
7. Atur konfigurasi pada `supabase-config.js`.
8. Jalankan website melalui web server lokal.
9. Uji pengambilan data produk dan proses checkout.

**Penting:** periksa perintah `DROP TABLE` atau perintah penghapusan lain sebelum menjalankan skrip. Menjalankan ulang skrip yang menghapus tabel dapat menyebabkan kehilangan data.

## 9. Authentication dan Database Security

Panel admin menggunakan Supabase Auth untuk login. Setelah login, operasi database tetap harus mengikuti kebijakan akses yang diterapkan pada Supabase.

Row Level Security (RLS) digunakan untuk membatasi operasi pada tabel sesuai kebijakan yang telah dibuat.

Hal yang perlu diperhatikan:

- API key yang digunakan di frontend harus merupakan publishable key atau anon key, bukan secret key atau `service_role` key.
- RLS harus aktif dan kebijakannya harus sesuai dengan kebutuhan setiap tabel.
- Pengguna biasa tidak boleh mendapatkan akses admin hanya dengan mengetahui URL halaman admin.
- Pembuatan akun Supabase Auth tidak otomatis menjadikan akun tersebut admin.
- Kredensial login tidak boleh disimpan dalam README publik.
- Pengujian harus memastikan pengguna yang tidak berwenang tidak dapat mengubah produk atau membaca pesanan yang dilindungi.

Keamanan tidak hanya bergantung pada halaman login. Pembatasan akses juga harus diterapkan dan diuji di sisi database.

## 10. Browser Storage

Website menggunakan penyimpanan browser untuk beberapa kebutuhan.

| Teknologi | Penggunaan |
|---|---|
| `localStorage` | Menyimpan keranjang dan cache produk |
| `sessionStorage` | Menyimpan informasi sesi terkait konfirmasi pesanan |

Data yang tersimpan di browser tidak sama dengan data pada PostgreSQL. Menghapus data browser dapat menghilangkan keranjang atau informasi lokal, tetapi tidak otomatis menghapus pesanan yang telah tersimpan di database Supabase.

## 11. PWA Initialization

Project menggunakan `manifest.json`, `sw.js`, dan `offline.html` untuk mendukung Progressive Web App.

### Manifest

`manifest.json` berisi informasi aplikasi, misalnya nama, nama singkat, ikon, warna tema, mode tampilan, dan shortcut.

Setiap halaman yang menggunakan manifest perlu mengarah ke file yang benar:

```html
<link rel="manifest" href="manifest.json">
```

### Service worker

`sw.js` menangani cache resource yang telah ditentukan dalam kode. Service worker didaftarkan oleh JavaScript website dan membantu menyediakan akses terhadap resource yang sudah tersimpan.

### Offline page

`offline.html` menjadi halaman alternatif saat kondisi offline ditangani oleh konfigurasi service worker.

PWA tidak menjamin seluruh fitur website tersedia tanpa internet. Pengambilan data baru dari Supabase, login, dan pemrosesan checkout tetap membutuhkan koneksi.

## 12. Menjalankan Project Secara Lokal

### Menggunakan VS Code Live Server

1. Clone repository:

   ```bash
   git clone https://github.com/swiftiesbwery/Anargya-SpecialTask.git
   ```

2. Buka folder repository di VS Code.
3. Masuk ke folder `anargya-supabase/special task/`.
4. Pastikan `index.html` berada di folder yang dibuka.
5. Instal ekstensi Live Server jika belum tersedia.
6. Klik kanan `index.html` dan pilih **Open with Live Server**.
7. Buka alamat lokal yang ditampilkan browser.

### Menggunakan Python

Masuk ke folder yang berisi `index.html`, kemudian jalankan:

```bash
python -m http.server 5500
```

Di Windows, kamu juga bisa menggunakan:

```powershell
py -m http.server 5500
```

Buka `http://localhost:5500` pada browser.

Tidak perlu menjalankan `npm install` atau `npm run dev` untuk frontend statis ini.

## 13. Deployment

Website statis dapat dipublikasikan melalui hosting yang mendukung HTTPS.

Langkah umum:

1. Push file project ke repository GitHub.
2. Pilih hosting statis yang sesuai.
3. Atur direktori publik agar menunjuk ke folder yang berisi `index.html`.
4. Pastikan file JavaScript, CSS, dan aset dapat diakses.
5. Pastikan konfigurasi Supabase menunjuk ke project yang benar.
6. Jika memakai Supabase Auth, periksa Site URL dan Redirect URLs pada dashboard.
7. Uji halaman utama, Shop, checkout, dan panel admin setelah deployment.

Hosting statis hanya mengirimkan file frontend. Database tetap dikelola oleh Supabase.

## 14. Testing

Setelah website berjalan, lakukan pengujian berikut:

| Pengujian | Hal yang diperiksa |
|---|---|
| Navigasi halaman | Semua link menuju halaman yang benar |
| Katalog Shop | Data produk berhasil diambil |
| Keranjang | Produk dapat ditambahkan dan tetap tersimpan setelah reload |
| Checkout | Pesanan berhasil diproses melalui RPC |
| Stok | Stok berubah sesuai hasil pemesanan |
| Admin login | Akun yang benar dapat login |
| Hak akses admin | Operasi terlindungi dari pengguna tanpa izin |
| PWA | Manifest dan service worker dapat dimuat |
| Offline | Resource yang sudah dicache dapat diakses sesuai konfigurasi |

Jika fitur database gagal, periksa konfigurasi client, koneksi internet, struktur tabel, fungsi RPC, dan kebijakan RLS.

Jika perubahan frontend tidak muncul, lakukan hard refresh dengan `Ctrl + F5` dan periksa cache service worker melalui Developer Tools.

## 15. Batasan Project

- Checkout belum terhubung dengan payment gateway.
- Keranjang disimpan secara lokal di browser.
- Fitur yang mengambil data terbaru dari Supabase membutuhkan koneksi internet.
- Tidak semua resource tersedia saat offline.
- Konfigurasi database dan autentikasi harus diperiksa sebelum digunakan untuk data sensitif atau transaksi produksi.

## Penutup

Project Anargya ITS EV Team menggunakan frontend statis dengan HTML, CSS, dan JavaScript, sedangkan Supabase menyediakan database PostgreSQL, API data, autentikasi, dan fungsi database untuk proses pemesanan.

Pemisahan tersebut memungkinkan website dijalankan melalui web server statis tanpa backend Node.js khusus. Untuk menjalankan fitur secara lengkap menggunakan database sendiri, pengguna perlu menyiapkan project Supabase, menjalankan skrip SQL, mengatur koneksi client, dan memastikan kebijakan akses sudah sesuai.

**Website:** [https://its.id/m/anargyaura](https://its.id/m/anargyaura)

**Repository:** [https://github.com/swiftiesbwery/Anargya-SpecialTask](https://github.com/swiftiesbwery/Anargya-SpecialTask)
