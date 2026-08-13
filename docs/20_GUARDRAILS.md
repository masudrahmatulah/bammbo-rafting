# 20 — Guardrails

Pemilik larangan operasional untuk agen. Aturan keamanan detail: `docs/21_SECURITY_RULES.md`.

## Daftar "JANGAN" Keras
- **JANGAN** hard-code rahasia (API key Midtrans, `DATABASE_URL`, `NEXTAUTH_SECRET`) di kode — hanya di `.env`.
- **JANGAN** menonaktifkan validasi input atau pengecekan otorisasi untuk "mempercepat" development.
- **JANGAN** menambah dependency baru tanpa alasan jelas dan tercatat.
- **JANGAN** mengubah persentase bagi hasil mitra yang sudah berjalan tanpa konfirmasi eksplisit pengguna (operasi irreversibel — lihat `docs/22_CHANGE_POLICY.md`).
- **JANGAN** memproses webhook Midtrans tanpa verifikasi signature terlebih dahulu.
- **JANGAN** melakukan hard-delete pada data `bookings`, `pembayaran`, atau `bagi_hasil` — ini data audit finansial.
