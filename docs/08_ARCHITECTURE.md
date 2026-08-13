# 08 — Architecture

Pemilik pola arsitektur. Stack & versi detail: `docs/09_STACK.md`.

## Pola
Monolit modular berlapis dalam satu aplikasi Next.js:
```
Route Handler / Server Action (tipis)
        v
Service layer (app/server/services) — logika bisnis
        v
Repository/Prisma Client (app/server/repositories) — akses data
        v
PostgreSQL
```
Controller/Route Handler hanya: validasi input (Zod) → panggil Service → format response. Logika bisnis (mis. hitung bagi hasil, cek ketersediaan) hidup di Service, bukan di route.

## Tanggung Jawab Lapisan
- **Route Handler/Server Action**: autentikasi sesi, validasi input, orkestrasi panggilan Service, tidak ada query DB langsung.
- **Service**: aturan bisnis (ketersediaan, perhitungan bagi hasil, transisi status booking), transaksi DB multi-tabel.
- **Repository**: query Prisma per entitas, tidak ada logika bisnis.

## Integrasi Eksternal
- **Midtrans** — payment gateway, dipanggil dari Service `PembayaranService`; webhook masuk lewat Route Handler khusus (`/api/webhooks/midtrans`), verifikasi signature sebelum diteruskan ke Service.
- **Object storage S3-compatible** — upload foto produk/penginapan, diakses dari Service `MediaService`.
- **Resend** — kirim email transaksional (konfirmasi booking, reminder H-1, notifikasi mitra).

## Keputusan Arsitektural Kunci
- **Monolit, bukan microservices** — skala tim kecil, kompleksitas domain masih rendah; memisahkan layanan sekarang menambah overhead operasional tanpa manfaat jelas.
- **Server Actions untuk mutasi, Route Handler untuk webhook & API publik** — Server Actions cukup untuk form booking/panel mitra; webhook Midtrans wajib Route Handler karena dipanggil dari luar Next.js.
- **Perhitungan bagi hasil dilakukan sinkron saat webhook CONFIRMED diterima** — bukan job terjadwal terpisah, agar ledger `bagi_hasil` selalu konsisten dengan status booking tanpa lag.
