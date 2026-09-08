# iGood Apple Store Kebumen - Priority Care Member Card System

Sistem Manajemen & Monitoring Kartu Member Digital resmi untuk **iGood Apple Store & Service Kebumen**.

## Fitur Aplikasi:
1. **Verifikasi Keaslian Member**: Validasi langsung dengan ID Kartu Identitas (No. KTP) atau ID Member.
2. **Kartu Digital 3D Interaktif**: Tampilan depan dan belakang kartu dengan animasi putar 3D, chip platinum, barcode, QR-Code verifikasi resmi, dan nomor serial unik.
3. **Sinkronisasi Cloud Database**: Penyimpanan data member terintegrasi secara real-time dan aman.
4. **Monitoring & Statistik**: Metrik total member aktif, total klaim diskon servis mesin, dan riwayat klaim garansi.
5. **Pendaftaran & Tanda Tangan Digital**: Formulir aktivasi member baru dilengkapi tanda tangan layar sentuh (*touch signature*).
6. **Syarat & Ketentuan (S&K) Ringkas**: Ringkasan hak dan keuntungan member (diskon servis mesin 5%-15% termasuk kerusakan pemakai/user error, komisi referral tunai Rp 25.000, serta bebas biaya jasa diagnosa/iCloud).

---

## Panduan Deploy ke Vercel

### Metode 1: Lewat Dashboard Vercel (Paling Mudah)
1. Buka [https://vercel.com](https://vercel.com) dan login ke akun Anda.
2. Klik tombol **"Add New..."** lalu pilih **"Project"**.
3. Jika menggunakan GitHub:
   - Push folder proyek ini ke repository GitHub Anda.
   - Pilih repository tersebut di Vercel, lalu klik **"Deploy"**.
4. Jika deploy folder langsung tanpa Git:
   - Anda bisa menggunakan Vercel CLI (Metode 2 di bawah) atau Drag & Drop file ZIP ke dashboard Vercel.

### Metode 2: Menggunakan Vercel CLI (Lewat Terminal / CMD)
1. Buka terminal (Command Prompt atau PowerShell) di folder proyek ini (`d:\REZA\igood-membership-card`).
2. Jalankan perintah:
   ```bash
   npx vercel
   ```
3. Ikuti petunjuk interaktif di layar:
   - `Set up and deploy?` Ketik **Y**
   - `Which scope?` Pilih akun Vercel Anda
   - `Link to existing project?` Ketik **N**
   - `What's your project's name?` Ketik `igood-membership-card` (atau tekan Enter)
   - `In which directory is your code located?` Tekan Enter (`./`)
4. Untuk deploy ke mode produksi (*production*):
   ```bash
   npx vercel --prod
   ```
5. Website Anda langsung aktif dengan domain gratis seperti `https://igood-membership-card.vercel.app`!

---

## Struktur File Proyek:
- `index.html`: Halaman utama aplikasi (versi modern terbaru dengan 4 pilar fitur).
- `igood-membership-redesign.html`: Salinan master aplikasi web.
- `IGOOD LOGO.png` & `igood-logo.png`: Aset logo resmi toko.
- `vercel.json`: Konfigurasi routing, clean URLs, dan optimasi keamanan Vercel.
- `package.json`: Metadata paket proyek.
- `.gitignore`: Filter file yang tidak perlu diunggah.
