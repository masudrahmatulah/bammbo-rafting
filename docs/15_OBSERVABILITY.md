# 15 — Observability

Pemilik logging/metrik.

## Apa yang Dilog & Format
- Log terstruktur JSON: `timestamp`, `level`, `event`, `request_id`, `user_id` (bila ada), `message`, `meta`.
- Event wajib dilog: pembuatan booking, webhook Midtrans masuk (payload + hasil verifikasi signature), perubahan status booking, perhitungan & pencairan bagi hasil, approve/reject mitra.

## Level Log
- `error` — kegagalan yang butuh perhatian (webhook signature invalid, integrasi eksternal gagal, exception tak tertangani).
- `warn` — kondisi tak normal tapi tertangani (checkout gagal karena slot penuh, pembayaran expired).
- `info` — event bisnis normal (booking dibuat, status berubah, mitra di-approve).

## Metrik/Monitoring
`[TERBUKA]` — belum ditentukan alat monitoring (mis. Sentry/Vercel Analytics) untuk v1; ditunda pasca-MVP. Untuk MVP, log terstruktur ke stdout (ditangkap platform hosting) sudah cukup untuk debugging awal.
