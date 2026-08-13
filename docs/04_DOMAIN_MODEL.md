# 04 — Domain Model

Pemilik bahasa & entitas konseptual. Skema fisik → `docs/07_DATA_MODEL.md` (jangan salin di sini).

## Glosarium

| Istilah | Makna |
|---|---|
| Mitra Jasa | Pemilik usaha bamboo rafting/river tubing yang bergabung sebagai penyedia di platform |
| Mitra Penginapan | Pemilik homestay/penginapan di Loksado yang bergabung sebagai penyedia di platform |
| Produk Jasa | Satu jenis layanan yang dijual mitra jasa (mis. "Rafting Bambu 2 jam", "River Tubing Pemula") |
| Kamar Penginapan | Satu unit/tipe kamar yang dijual mitra penginapan |
| Paket Gabungan | Kombinasi Produk Jasa + Kamar Penginapan yang dijual sebagai satu booking dengan harga bundel |
| Booking | Satu transaksi pemesanan wisatawan, terdiri dari satu atau lebih item (jasa dan/atau kamar) |
| Bagi Hasil | Porsi pendapatan yang menjadi hak platform vs mitra dari satu item booking, dicatat sebagai ledger |
| Status Verifikasi Mitra | Status pendaftaran mitra: PENDING → AKTIF (approve) atau REJECTED (tolak) |

## Entitas Inti & Relasi Konseptual

- **User** — akun tunggal untuk semua peran (wisatawan, mitra jasa, mitra penginapan, admin); satu User bisa punya profil Mitra Jasa atau Mitra Penginapan.
- **Mitra Jasa** — memiliki banyak Produk Jasa.
- **Mitra Penginapan** — memiliki banyak Kamar Penginapan.
- **Booking** — dibuat oleh satu User (wisatawan), terdiri dari satu atau lebih Booking Item (jasa dan/atau kamar), punya satu Pembayaran.
- **Bagi Hasil** — dihitung per Booking Item setelah Booking berstatus CONFIRMED.
- **Ulasan** — opsional, terkait ke satu Booking Item pasca-trip (fitur pasca-MVP).

Rincian atribut, tipe kolom, constraint, dan relasi fisik: lihat `docs/07_DATA_MODEL.md`. Peran & matriks akses: lihat `docs/05_USER_ROLE.md`.
