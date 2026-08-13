# 02 — Scope

Pemilik batas cakupan. Gerbang anti scope-creep — rujuk fitur di `docs/01_PRD.md`.

## In-Scope (v1 / MVP)
- Booking online untuk 3 kategori produk: jasa rafting/tubing, kamar penginapan, dan paket gabungan keduanya.
- Pembayaran online via Midtrans dengan konfirmasi otomatis (webhook).
- Panel mitra (jasa & penginapan) untuk kelola ketersediaan, harga, dan lihat pendapatan.
- Panel admin untuk verifikasi mitra, kelola master data, monitor transaksi, dan kelola pencairan bagi hasil (manual).
- Mesin bagi hasil otomatis (perhitungan & pencatatan ledger), pencairan dana tetap manual oleh admin.

## Out-of-Scope (v1)
- **Aplikasi mobile native (Android/iOS)** — v1 hanya web responsif.
- **Multi-bahasa** — hanya Bahasa Indonesia; internasionalisasi ditunda.
- **Integrasi OTA pihak ketiga** (Traveloka, Tiket.com, Booking.com, dll.) — tidak ada sinkronisasi inventaris ke platform luar.
- **Refund/pembatalan otomatis** — pembatalan & pengembalian dana diproses manual oleh admin di v1.
- **Payout otomatis ke rekening mitra via API** — pencairan bagi hasil dilakukan manual (transfer bank) oleh admin di v1.

## Asumsi & Batasan
- Bahasa aplikasi: Indonesia saja.
- Persentase bagi hasil 15% platform / 85% mitra berlaku sama untuk semua mitra di v1 (lihat `docs/07_DATA_MODEL.md` untuk struktur data yang sudah mendukung persentase per-mitra pasca-MVP).
- Notifikasi transaksional lewat email di v1; WhatsApp API menyusul pasca-MVP.
- Legal entity resmi untuk kontrak bagi hasil dengan mitra: **[TERBUKA]** — ditentukan saat implementasi/legal review, tidak memengaruhi desain teknis v1.
