# 21 — Security Rules

Pemilik keamanan. Defensif & wajib.

## Auth & Otorisasi
Auth via NextAuth.js (session-based). Peran & matriks akses: rujuk `docs/05_USER_ROLE.md`. Otorisasi ditegakkan di dua lapis: middleware (route-level) + pengecekan ulang di Service layer (defense in depth) — jangan andalkan middleware saja.

## Validasi Input
Semua input dari Route Handler/Server Action divalidasi dengan skema Zod sebelum diteruskan ke Service. Tolak request dengan payload tak sesuai skema di batas terluar.

## Penyimpanan Rahasia
Semua kredensial (Midtrans, database, NextAuth secret, S3, Resend) hanya di `.env`, tidak pernah di-commit ke git. Daftar nama variabel: `docs/10_DEV_ENV.md`.

## Data Sensitif & Enkripsi/Hashing
- `password_hash` — di-hash dengan bcrypt/argon2, tidak pernah disimpan plaintext.
- `no_rekening` mitra — dienkripsi at-rest (kolom terenkripsi atau app-level encryption).
- `no_ktp_nib` mitra — akses dibatasi hanya untuk admin (lihat matriks di `docs/05_USER_ROLE.md`).
- Tidak menyimpan detail kartu pembayaran wisatawan di server sendiri — seluruh proses kartu di sisi Midtrans (PCI scope tidak masuk sistem ini).

## Rate Limit/Abuse
Rate limit diterapkan di endpoint publik rawan abuse: registrasi, login, checkout. Batas & mekanisme detail (mis. sliding window) ditentukan saat implementasi, minimal mencegah brute-force login dan spam checkout.

## Webhook Midtrans
Wajib verifikasi signature (`signature_key`) sebelum memproses payload webhook — payload tanpa signature valid ditolak (`401`) dan dicatat sebagai `warn`.

## Kepatuhan
`[TERBUKA]` — tidak ada kepatuhan/regulasi khusus di luar praktik keamanan umum untuk v1.
