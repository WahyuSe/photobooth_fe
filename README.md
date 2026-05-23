# 🎨 Next.js PhotoBooth Frontend App

Direktori ini berisi kode aplikasi frontend antarmuka pengguna (UI) untuk mesin Kiosk PhotoBooth. Frontend dibangun menggunakan Next.js 14 (App Router), TypeScript, dan react-konva untuk kanvas editor visual.

---

## 🛠️ Langkah Instalasi

1. **Masuk ke Direktori:**
   ```bash
   cd frontend
   ```

2. **Instal Dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variable:**
   Secara default, frontend Next.js akan membaca backend yang berjalan di `http://localhost:4000`. Jika Anda mengubah port backend, buat file `.env.local` di folder frontend:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

---

## 🚀 Perintah Menjalankan Aplikasi

- **Mode Pengembangan (Dev):**
  Menjalankan Next.js dalam server dev lokal dengan *fast-refresh*.
  ```bash
  npm run dev
  ```

- **Mode Produksi (Build & Start):**
  Lakukan build untuk mengoptimalkan performa halaman statis, lalu jalankan server produksinya.
  ```bash
  npm run build
  npm start
  ```
  *Aplikasi akan berjalan di:* `http://localhost:3000`

---

## 🗺️ Peta Halaman Aplikasi (Pages & Routes)

- **`/` (Home/Landing Page):** Halaman beranda utama Kiosk. Pengguna memindai kode sesi (session code) dari Admin untuk memulai sesi foto.
- **`/select-frame`:** Layar pemilihan template bingkai foto (frame) awal yang disediakan oleh Admin.
- **`/booth`:** Layar kamera utama. Mengambil foto secara otomatis atau manual menggunakan webcam, lengkap dengan countdown visual dan pratinjau strip foto.
- **`/editor`:** Layar kanvas editor visual utama. Pengguna dapat merender foto, memutar (*rotate*), memperbesar (*zoom*), menggeser posisi wajah agar pas di frame, menambahkan teks kustom dan tanggal. Serta memicu tombol **"Cetak & Selesai Sesi"** untuk auto-upload Google Drive dan auto-print fisik.
- **`/admin`:** Dashboard Admin terproteksi kata sandi. Tempat Admin untuk mengelola riwayat antrean sesi, merancang template frame baru secara visual menggunakan visual editor canvas, dan menyalakan/mematikan fitur integrasi sosial (seperti WhatsApp Share).
