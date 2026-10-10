# Anargya ITS EV Team

Website profil **Anargya ITS EV Team** yang dibuat untuk menampilkan informasi tim, prestasi, program, berita, dan kontak. Website ini juga memiliki fitur shop untuk katalog merchandise, keranjang belanja, checkout, serta halaman admin untuk mengelola produk dan pesanan.

**Website:** [https://its.id/m/anargyaura](https://its.id/m/anargyaura)

## 1. Gambaran Website

Anargya ITS EV Team merupakan website yang menggabungkan informasi mengenai tim dengan fitur katalog merchandise. Pengunjung bisa mengenal tim melalui beberapa halaman yang tersedia, kemudian melihat produk dan mencoba proses pemesanan melalui halaman Shop.

Website ini dibuat menggunakan HTML, CSS, dan JavaScript tanpa framework frontend. Untuk menyimpan data produk dan pesanan, website terhubung dengan Supabase. Selain itu, website dilengkapi loading screen dan fitur Progressive Web App (PWA).

Fitur yang tersedia meliputi:

- Halaman profil tim dan informasi umum.
- Halaman pencapaian atau achievements.
- Halaman Academy, News, dan Contact.
- Katalog merchandise beserta informasi stok.
- Keranjang belanja dan halaman checkout.
- Panel admin untuk mengelola produk dan melihat pesanan.
- Loading screen saat membuka atau berpindah halaman.
- PWA dengan manifest, service worker, dan halaman offline.
- Tampilan responsif untuk desktop maupun perangkat mobile.

## 2. Teknologi yang Digunakan

Teknologi yang digunakan disesuaikan dengan kebutuhan website, mulai dari menampilkan informasi hingga mengelola data produk dan pesanan.

| Teknologi | Penggunaan |
|---|---|
| HTML5 | Membuat struktur setiap halaman website |
| CSS3 | Mengatur tampilan, layout, animasi, dan responsivitas |
| JavaScript | Menangani interaksi dan proses pada website |
| Supabase | Menyimpan data produk dan pesanan |
| PostgreSQL | Database yang digunakan melalui Supabase |
| Supabase Auth | Menangani login admin |
| localStorage | Menyimpan keranjang dan cache produk di browser |
| sessionStorage | Menyimpan informasi sesi untuk konfirmasi pesanan |
| Service Worker | Menangani cache dan dukungan akses offline |
| PWA Manifest | Mengatur informasi dan ikon aplikasi |

Website menggunakan Google Fonts, yaitu Inter dan Montserrat, untuk mendukung tampilan antarmuka.

## 3. Struktur Folder

Seluruh file website berada di folder `anargya-supabase/special task/`.

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
├── manifest.webmanifest
├── sw.js
├── offline.html
└── assets/
    ├── icons/
    └── ...
```

Berikut fungsi beberapa file utama:

- `index.html` menjadi halaman beranda website.
- `about.html` dan `achievements.html` menampilkan informasi tim dan pencapaiannya.
- `shop.html` menampilkan katalog merchandise.
- `checkout.html` menangani keranjang dan proses pemesanan.
- `admin.html` menyediakan halaman login dan pengelolaan toko.
- `store.js` mengatur proses pengambilan data, keranjang, checkout, dan komunikasi dengan Supabase.
- `shop.js`, `checkout.js`, dan `admin.js` menangani fungsi khusus pada masing-masing halaman.
- `loader.js` dan `loader.css` mengatur loading screen.
- `manifest.webmanifest` dan `sw.js` mendukung fitur PWA.
- `supabase-config.js` berisi konfigurasi koneksi ke Supabase.
- `supabase.sql` berisi skrip pembuatan tabel dan data awal.

## 4. Cara Menjalankan Website

### Menjalankan secara lokal

Website bisa dijalankan melalui VS Code menggunakan ekstensi Live Server.

1. Buka folder `anargya-supabase/special task/` di VS Code.
2. Pastikan file `index.html` berada di folder yang dibuka.
3. Klik kanan `index.html`.
4. Pilih **Open with Live Server**.
5. Website akan terbuka di browser melalui alamat lokal, biasanya `http://127.0.0.1:5500`.

Alternatifnya, jalankan perintah berikut melalui terminal yang sudah berada di folder website:

```bash
python -m http.server 5500
```

Kemudian buka `http://localhost:5500` di browser.

### Mengakses website yang sudah di-deploy

Website dapat diakses langsung melalui:

[https://its.id/m/anargyaura](https://its.id/m/anargyaura)

Dengan versi online ini, pengunjung tidak perlu mengunduh project atau menjalankan server lokal.

## 5. Integrasi Database Supabase

Supabase digunakan untuk menyimpan data yang perlu diakses oleh website, terutama data produk, stok, dan pesanan. Dengan begitu, data tersebut tidak hanya bergantung pada penyimpanan di browser.

Tabel `products` digunakan untuk menyimpan informasi merchandise, sedangkan tabel `orders` digunakan untuk menyimpan pesanan yang masuk.

Pada halaman Shop, data produk diambil dari Supabase dan ditampilkan sebagai katalog. Ketika pengunjung menambahkan produk ke keranjang, data keranjang disimpan di `localStorage`. Keranjang ini tetap tersedia ketika halaman dimuat ulang pada browser yang sama.

Saat checkout dilakukan, website memanggil fungsi database `place_order` untuk menyimpan pesanan sekaligus mengurangi stok produk. Proses ini menghubungkan aktivitas pengunjung di halaman Shop dengan data yang tersimpan di database.

Berikut pembagian penyimpanan yang digunakan:

| Data | Tempat penyimpanan |
|---|---|
| Informasi produk | Tabel `products` di Supabase |
| Stok produk | Tabel `products` di Supabase |
| Pesanan | Tabel `orders` melalui fungsi `place_order` |
| Keranjang belanja | `localStorage` pada browser |
| Cache produk | `localStorage` pada browser |
| Gambar dan ikon | Folder `assets/` |

### Konfigurasi Supabase

Koneksi ke database diatur melalui file `supabase-config.js`. File ini menggunakan Project URL dan publishable key atau anon key dari project Supabase yang digunakan.

Skrip SQL yang tersedia dapat digunakan untuk menyiapkan tabel dan data awal. Namun, skrip tersebut perlu diperiksa sebelum dijalankan pada database yang sudah digunakan karena beberapa perintah dapat menghapus tabel beserta datanya.

Publishable key digunakan untuk koneksi frontend, sedangkan secret key dan `service_role` key tidak boleh dimasukkan ke dalam kode frontend atau repository publik.

## 6. Fitur Website

### Halaman profil tim

Halaman utama menjadi titik awal untuk mengenal Anargya ITS EV Team. Navigasi website menghubungkan pengunjung ke halaman informasi lainnya, termasuk profil tim, pencapaian, Academy, News, dan Contact.

Halaman-halaman tersebut dipisahkan agar informasi lebih mudah ditemukan dan tidak menumpuk dalam satu halaman.

### Shop dan katalog merchandise

Halaman Shop menampilkan produk merchandise yang tersedia. Informasi produk diambil dari database Supabase, sehingga katalog dapat mengikuti data yang tersimpan di database.

Pengunjung bisa memilih produk dan menambahkannya ke keranjang sebelum melanjutkan ke halaman checkout.

### Keranjang dan checkout

Keranjang digunakan untuk menampung produk yang dipilih pengunjung. Setelah itu, pengunjung dapat melanjutkan ke halaman checkout untuk memasukkan pesanan.

Ketika pesanan berhasil diproses, data order disimpan di Supabase dan stok produk diperbarui. Dengan mekanisme ini, proses pemesanan tidak hanya ditampilkan di halaman website, tetapi juga tercatat di database.

**Catatan:** checkout saat ini masih berupa simulasi pemesanan. Website belum menggunakan payment gateway untuk memproses pembayaran secara nyata.

### Panel admin

Halaman admin digunakan untuk mengelola bagian toko. Admin dapat login menggunakan Supabase Auth, melihat pesanan yang masuk, dan mengelola produk sesuai hak aksesnya.

Pembatasan akses database juga menggunakan Row Level Security (RLS), sehingga operasi yang memerlukan hak admin tidak seharusnya dapat dilakukan oleh pengguna biasa.

Akun admin sebaiknya digunakan secara terpisah dari akun pengunjung dan tidak dicantumkan bersama password di README publik.

### Loading screen

Website memiliki loading screen dengan tema visual Anargya, menggunakan latar gelap, logo, teks berwarna hijau, progress bar, dan persentase pemuatan.

Loading screen muncul ketika halaman dibuka dan ketika pengunjung berpindah melalui tautan internal. Durasi minimum digunakan agar animasi tidak langsung menghilang ketika halaman selesai dimuat terlalu cepat.

Pengaturan animasi juga memperhatikan preferensi `prefers-reduced-motion` pada perangkat pengguna.

### Progressive Web App (PWA)

Website dilengkapi manifest dan service worker agar dapat mendukung fitur PWA. Manifest mengatur nama aplikasi, ikon, serta pengaturan tampilan ketika website dipasang pada perangkat.

Service worker menangani cache untuk mendukung pemuatan halaman tertentu ketika koneksi internet tidak tersedia. Website juga menyediakan `offline.html` sebagai halaman alternatif ketika akses offline diperlukan.

Fitur ini tetap memiliki batasan: tidak semua halaman, gambar, atau data dari Supabase otomatis tersedia secara offline.

## 7. Pengujian Website

Pengujian dilakukan pada fitur utama untuk memastikan alur penggunaan website berjalan sesuai fungsinya.

| Fitur yang diuji | Hasil |
|---|---|
| Membuka halaman utama dan navigasi | Berjalan |
| Menampilkan katalog produk | Berjalan |
| Menambahkan produk ke keranjang | Berjalan |
| Menyimpan keranjang di browser | Berjalan |
| Memproses checkout demo | Berjalan |
| Menyimpan pesanan ke Supabase | Berjalan |
| Memperbarui stok setelah checkout | Berjalan |
| Login ke panel admin | Berjalan |
| Mengelola produk dan melihat pesanan | Berjalan |
| Dukungan PWA dan halaman offline | Perlu diuji pada kondisi perangkat dan jaringan yang berbeda |

Hasil tersebut menggambarkan pengujian alur utama website. Pengujian ini belum berarti seluruh kemungkinan error, kondisi jaringan, atau celah keamanan sudah diperiksa.

## 8. Keamanan dan Batasan

Beberapa hal yang perlu diperhatikan dalam penggunaan website:

- Keranjang disimpan di browser, sehingga tidak otomatis tersinkronisasi antarperangkat.
- Checkout belum terhubung dengan payment gateway.
- Akses admin bergantung pada konfigurasi autentikasi dan kebijakan RLS di Supabase.
- Kebijakan database perlu diperiksa agar pengguna biasa tidak dapat mengubah data produk atau mengakses pesanan milik pihak lain tanpa izin.
- Service worker dapat menyimpan versi lama website. Jika perubahan belum terlihat, lakukan hard refresh menggunakan `Ctrl + F5` atau periksa cache melalui DevTools.
- Sebagian fitur membutuhkan internet karena website mengambil data dari Supabase dan memuat resource dari CDN.
- Pengujian keamanan yang lebih menyeluruh tetap diperlukan sebelum website digunakan untuk transaksi nyata.

## 9. Kendala dan Solusi

| Kendala | Solusi |
|---|---|
| Perubahan website tidak terlihat | Lakukan hard refresh atau periksa cache service worker |
| Produk tidak muncul | Periksa konfigurasi Supabase, data pada tabel `products`, dan kebijakan RLS |
| Login admin gagal setelah deploy | Periksa Site URL dan Redirect URLs pada pengaturan Supabase Auth |
| Website gagal dibuka setelah deploy | Pastikan folder publik hosting berisi `index.html` |
| PWA tidak dapat dipasang | Periksa HTTPS, manifest, ikon, dan service worker |
| Website tidak menampilkan data terbaru | Periksa koneksi database dan cache produk di browser |

## 10. Kesimpulan

Website Anargya ITS EV Team dibuat untuk menyediakan informasi tim sekaligus menghadirkan fitur toko merchandise dalam satu website. Selain halaman profil dan pencapaian, website memiliki katalog produk, keranjang, checkout demo, serta panel admin yang terhubung dengan Supabase.

Penggunaan HTML, CSS, dan JavaScript membuat frontend dapat dijalankan melalui web server statis, sedangkan Supabase menangani penyimpanan data produk dan pesanan. Website juga dilengkapi loading screen, tampilan responsif, serta dukungan PWA.

Berdasarkan pengujian alur utama, fitur Shop, keranjang, checkout, penyimpanan pesanan, dan panel admin telah berjalan. Pengembangan berikutnya dapat difokuskan pada integrasi pembayaran nyata, pengujian keamanan lebih lanjut, serta penyempurnaan akses offline agar website lebih siap digunakan di luar kebutuhan demonstrasi.
