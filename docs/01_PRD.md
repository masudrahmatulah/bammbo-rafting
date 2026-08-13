# 01 — PRD (Product Requirements)

Pemilik fitur & user story. `docs/23_ACCEPTANCE_CRITERIA.md` merujuk ke sini.

## Daftar Fitur

| Fitur | Deskripsi | Prioritas |
|---|---|---|
| Registrasi & login wisatawan | Daftar akun via email/password (NextAuth) | MVP |
| Katalog jasa & penginapan | Browse & filter produk jasa (rafting/tubing) dan kamar penginapan by tanggal & jumlah orang | MVP |
| Booking mandiri | Checkout self-service, konfirmasi instan setelah pembayaran sukses | MVP |
| Pembayaran online | Integrasi Midtrans (VA/QRIS/e-wallet), webhook konfirmasi status | MVP |
| Paket gabungan | Bundel rafting/tubing + penginapan dengan harga bundel | MVP |
| Panel mitra | Mitra jasa & mitra penginapan kelola ketersediaan, harga, lihat pendapatan | MVP |
| Panel admin | Approve pendaftaran mitra, kelola master data, monitor booking & pembayaran | MVP |
| Mesin bagi hasil otomatis | Hitung & catat porsi platform vs mitra tiap transaksi CONFIRMED | MVP |
| Riwayat booking & pendapatan | Wisatawan lihat riwayat booking; mitra lihat riwayat pendapatan & status pencairan | MVP |
| Ulasan & rating | Wisatawan beri rating pasca-trip/menginap | Nanti |
| Payout otomatis | Pencairan bagi hasil otomatis via API ke rekening mitra | Nanti |
| Notifikasi WhatsApp | Konfirmasi & reminder via WhatsApp API | Nanti |

## User Story (fitur MVP)

- Sebagai **wisatawan**, saya ingin mencari jasa rafting/tubing & penginapan berdasarkan tanggal, agar saya tahu ketersediaan sebelum memesan.
- Sebagai **wisatawan**, saya ingin membayar langsung online setelah checkout, agar booking saya langsung terkonfirmasi tanpa menunggu konfirmasi manual.
- Sebagai **wisatawan**, saya ingin memesan paket gabungan rafting + penginapan, agar mendapat harga lebih hemat dalam satu transaksi.
- Sebagai **mitra jasa/penginapan**, saya ingin mengatur ketersediaan & harga produk saya sendiri, agar stok tidak overbooking.
- Sebagai **mitra jasa/penginapan**, saya ingin melihat pendapatan & status bagi hasil saya, agar saya tahu berapa yang akan saya terima dan kapan.
- Sebagai **admin**, saya ingin memverifikasi pendaftaran mitra baru sebelum tampil ke publik, agar kualitas & legalitas mitra terjaga.
- Sebagai **admin**, saya ingin memonitor seluruh booking dan mencairkan bagi hasil ke mitra, agar operasional bagi hasil berjalan tertib.

## Kebutuhan Non-Fungsional
- Waktu muat halaman katalog < 3 detik pada koneksi 4G rata-rata.
- Checkout dan konfirmasi pembayaran real-time (via webhook Midtrans, bukan polling manual).
- Sistem harus mencegah race condition double-booking pada slot/kamar yang sama (lihat `docs/07_DATA_MODEL.md` untuk constraint).
