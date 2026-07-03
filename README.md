# Website SMAN 16 MOJANG

Website resmi sekolah dengan sistem PPDB online, dibangun dengan **Next.js 14 (App Router) + React + Tailwind CSS + Firebase** (Authentication, Firestore, Storage).

> Catatan jujur di awal: proyek ini adalah **kode lengkap dan siap jalan** setelah kamu melakukan konfigurasi di bawah. Kode ini ditulis manual tanpa sempat dijalankan `npm install` / `npm run dev` di sisi saya (lingkungan kerja saya tidak punya akses internet), jadi setelah instalasi ada kemungkinan kecil perlu perbaikan kecil (typo import, dsb). Ikuti langkah "Menjalankan Pertama Kali" di bawah, dan kalau ada error saat `npm run dev`, tempel pesan errornya ke saya untuk saya perbaiki.

---

## 1. Yang Perlu Kamu Siapkan

1. **Node.js** versi 18 ke atas — [nodejs.org](https://nodejs.org)
2. **Akun Firebase** (gratis) — [console.firebase.google.com](https://console.firebase.google.com)
3. **Logo sekolah** dalam format PNG (belum ada di project ini karena belum diupload — lihat `public/BACA-INI-logo.txt`)

---

## 2. Setup Firebase (wajib, ±10 menit)

1. Buka [Firebase Console](https://console.firebase.google.com) → **Add Project** → beri nama bebas (mis. `sman16-mojang`).
2. Di dalam project, klik ikon **Web (`</>`)** untuk mendaftarkan aplikasi web → salin objek `firebaseConfig` yang muncul.
3. Aktifkan layanan berikut dari menu sebelah kiri:
   - **Authentication** → tab *Sign-in method* → aktifkan **Email/Password**.
   - **Authentication** → tab *Users* → **Add user** → buat akun admin (email + password bebas, ini yang dipakai untuk login dashboard).
   - **Firestore Database** → **Create database** → mode **production**.
   - **Storage** → **Get started** → mode **production**.
4. Publish rules keamanan:
   - Buka tab **Rules** di Firestore, ganti `ADMIN_EMAIL_DISINI` pada file `firestore.rules` (di project ini) dengan email admin yang kamu buat di langkah 3, lalu salin isi file itu ke sana dan **Publish**.
   - Lakukan hal sama untuk `storage.rules` → **Rules** di Storage.

---

## 3. Konfigurasi Project

```bash
cd sman16mojang
npm install
cp .env.local.example .env.local
```

Buka `.env.local`, isi dengan `firebaseConfig` dari langkah 2:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_ADMIN_EMAIL=email-admin-yang-kamu-buat@contoh.com
```

`NEXT_PUBLIC_ADMIN_EMAIL` **harus sama persis** dengan email admin yang kamu buat di Firebase Authentication, dan juga harus sama dengan yang kamu isi di `firestore.rules` / `storage.rules`.

---

## 4. Menjalankan Pertama Kali

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

- Halaman publik langsung bisa dipakai (Beranda, Informasi, Ekstrakurikuler, OSIS, PPDB).
- Login admin: buka `/login/admin`, masuk pakai email + password admin yang dibuat di Firebase.
- Setelah login admin, isi data awal lewat dashboard: Informasi, Ekstrakurikuler, OSIS, Galeri, Pengaturan — supaya halaman publik tidak kosong. (Halaman Ekstrakurikuler & OSIS sudah punya data contoh sementara / *fallback* selama koleksi Firestore masih kosong, supaya tampilan tetap enak dilihat.)

---

## 5. Menambahkan Logo Asli

Taruh file logo dengan nama **`logo.png`** di folder `public/`. Website akan otomatis memakainya di semua tempat (Navbar, Footer, Beranda, Panel Admin). Selama file itu belum ada, muncul logo sementara berbentuk monogram kubus — bukan bug, itu memang fallback yang sengaja dibuat.

---

## 6. Deploy ke Produksi (opsional, disarankan: Vercel)

1. Push project ini ke GitHub.
2. Buka [vercel.com](https://vercel.com) → **New Project** → import repo tadi.
3. Saat konfigurasi, tambahkan semua **Environment Variables** yang sama persis dengan isi `.env.local` kamu.
4. Deploy. Setelah selesai, tambahkan domain Vercel kamu (mis. `sman16mojang.vercel.app`) ke **Authentication → Settings → Authorized domains** di Firebase Console.

---

## 7. Struktur Data Firestore (otomatis terbentuk saat dipakai)

| Koleksi | Isi |
|---|---|
| `pendaftar` | Data pendaftar PPDB (biodata, berkas, status, hasil tes minat) — ID dokumen = nomor pendaftaran |
| `email_index` | Pemetaan email → nomor pendaftaran, dipakai untuk login peserta lewat email secara aman |
| `informasi` | Pengumuman, jadwal MPLS, kalender akademik, prestasi, berita (dibedakan lewat field `kategori`) |
| `ekstrakurikuler` | Daftar ekstrakurikuler |
| `osis_pengurus` | Struktur pengurus OSIS |
| `osis_program` | Program kerja / event OSIS |
| `osis_galeri` | Foto galeri OSIS & sekolah |
| `pengaturan/umum` | Sambutan kepala sekolah, visi misi, kontak, dll |

---

## 8. Login Peserta — Cara Kerjanya

Karena alur pendaftaran di brief tidak menyertakan pembuatan password, login peserta memakai **Nomor Pendaftaran atau Email + NISN** sebagai dua faktor verifikasi (bukan Firebase Auth). Ini cukup untuk cek status, tapi kalau nanti kamu ingin keamanan setingkat akun sungguhan (reset password, dsb), pertimbangkan menambahkan Firebase Auth (mis. OTP email) — beri tahu saya kalau kamu mau saya bantu tambahkan.

Login **admin** memakai Firebase Authentication (email + password) sungguhan.

---

## 9. Fitur yang Sudah Tersedia

Beranda · Sambutan Kepsek · Visi Misi · Statistik · Berita · Informasi (5 kategori) · Ekstrakurikuler · OSIS (struktur, program, galeri) · PPDB 3 langkah (biodata + upload berkas, tes minat, nomor pendaftaran + QR Code) · Login peserta & admin · Dashboard admin real-time · Tabel pendaftar (cari, filter status, pagination, export PDF/Excel, ubah status, hapus) · CRUD Informasi/Ekskul/OSIS/Galeri · Pengaturan website · Dark mode · Animasi (Framer Motion) · Toast notification · Skeleton loading · Validasi form · SEO metadata dasar.

## 10. Yang Belum / Bisa Dikembangkan Lagi

- Cetak bukti pendaftaran saat ini memakai `window.print()` (cetak halaman browser). Kalau kamu mau PDF bukti pendaftaran yang lebih rapi & bisa diunduh langsung, saya bisa buatkan generator PDF khusus.
- Scan QR Code (verifikasi tatap muka) belum diimplementasi — saat ini QR hanya menyimpan nomor pendaftaran.
- Belum ada notifikasi email/WhatsApp otomatis saat status pendaftaran berubah.

Kalau kamu mau saya lanjutkan salah satu di atas, atau ada error saat menjalankan project, tinggal bilang saja.
