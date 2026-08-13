# 05 — User & Role

Pemilik peran & matriks akses. `docs/06_BUSINESS_PROCESS.md` dan `docs/21_SECURITY_RULES.md` merujuk ke sini.

## Daftar Peran
- **wisatawan** — pengguna publik yang memesan jasa/penginapan.
- **mitra_jasa** — pemilik usaha rafting/tubing.
- **mitra_penginapan** — pemilik penginapan/homestay.
- **admin** — pengelola platform.

## Matriks Akses

| Kapabilitas | wisatawan | mitra_jasa | mitra_penginapan | admin |
|---|---|---|---|---|
| Browse katalog | ✓ | ✓ | ✓ | ✓ |
| Booking & bayar | ✓ | ✗ | ✗ | ✗ |
| Lihat riwayat booking sendiri | ✓ | — | — | — |
| Kelola produk jasa miliknya (harga/ketersediaan) | ✗ | ✓ | ✗ | ✓ (override) |
| Kelola kamar penginapan miliknya (harga/ketersediaan) | ✗ | ✗ | ✓ | ✓ (override) |
| Lihat booking masuk untuk produk/kamarnya | ✗ | ✓ (miliknya) | ✓ (miliknya) | ✓ (semua) |
| Lihat pendapatan & status bagi hasil sendiri | ✗ | ✓ (miliknya) | ✓ (miliknya) | ✓ (semua) |
| Approve/tolak pendaftaran mitra baru | ✗ | ✗ | ✗ | ✓ |
| Kelola master data (kategori, dsb.) | ✗ | ✗ | ✗ | ✓ |
| Ubah persentase bagi hasil | ✗ | ✗ | ✗ | ✓ |
| Cairkan bagi hasil (tandai CAIR) | ✗ | ✗ | ✗ | ✓ |
| Kelola pengaduan/pembatalan manual | ✗ | ✗ | ✗ | ✓ |

Aturan otorisasi teknis (middleware, defense-in-depth): lihat `docs/21_SECURITY_RULES.md`.
