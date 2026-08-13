# 14 — Error Handling

Pemilik pola penanganan error.

## Klasifikasi Error
- **Validasi input** (400) — pesan spesifik field ke pengguna (dari Zod).
- **Otorisasi** (401/403) — pesan generik "Anda tidak punya akses", detail dicatat ke log.
- **Konflik bisnis** (409) — mis. slot sudah penuh saat checkout: pesan jelas ke pengguna, minta pilih ulang.
- **Kegagalan integrasi eksternal** (502/503) — Midtrans/Resend/S3 down: pesan ramah ("coba lagi sebentar lagi"), detail teknis hanya di log.
- **Error tak terduga** (500) — pesan generik ke pengguna, stack trace lengkap hanya di log server.

## Tampil ke Pengguna vs Hanya Dicatat
- **Tampil**: pesan validasi field, status konflik bisnis (slot penuh, mitra belum aktif), status pembayaran gagal.
- **Hanya dicatat (log)**: stack trace, payload webhook mentah, detail error database/Prisma, exception dari SDK Midtrans/S3/Resend.

## Larangan
- **Dilarang** menampilkan stack trace atau pesan error database mentah ke pengguna.
- **Dilarang** mengirim detail internal (nama tabel, nama variabel server) dalam response API publik.
