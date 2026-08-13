# 10 — Dev Environment

Pemilik setup lingkungan lokal. Perintah aktual: `docs/11_COMMANDS.md`.

## Prasyarat
- Node.js 20 LTS + npm
- PostgreSQL 16 (lokal via Docker, atau pakai instance dev Supabase/Neon)
- Akun sandbox Midtrans (untuk testing pembayaran)
- Akun Resend (untuk testing email, boleh pakai mode sandbox/log-only saat dev)

## Langkah Setup Lokal
1. Clone repo, `npm install`.
2. Salin `.env.example` ke `.env`, isi semua variabel (lihat daftar di bawah).
3. Jalankan migrasi: lihat `docs/11_COMMANDS.md` (`migrate_dev`).
4. (Opsional) Jalankan seed data contoh: lihat `docs/11_COMMANDS.md` (`seed`).
5. Jalankan server dev: lihat `docs/11_COMMANDS.md` (`dev`).

## Variabel `.env` yang Dibutuhkan (nama saja, bukan nilai)
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `MIDTRANS_SERVER_KEY`
- `MIDTRANS_CLIENT_KEY`
- `MIDTRANS_IS_PRODUCTION`
- `RESEND_API_KEY`
- `S3_ENDPOINT`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_BUCKET_NAME`
