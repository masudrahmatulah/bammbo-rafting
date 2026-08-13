# 03 — Roadmap

Pemilik urutan fase. Tiap fase = vertical slice yang bisa didemokan (bukan per-layer).

| Fase | Tujuan Demoable | Fitur Tercakup |
|---|---|---|
| Fase 1 — Fondasi & Katalog | Wisatawan bisa lihat katalog jasa & penginapan (data dummy/admin-input) | Auth wisatawan; CRUD produk jasa & kamar (via admin/mitra dasar); halaman katalog & detail produk |
| Fase 2 — Booking & Pembayaran | Wisatawan bisa booking end-to-end dan bayar, dapat konfirmasi instan | Checkout; integrasi Midtrans + webhook; status booking (PENDING/CONFIRMED/EXPIRED); paket gabungan |
| Fase 3 — Onboarding Mitra | Mitra bisa daftar, diverifikasi admin, dan kelola produk sendiri | Pendaftaran mitra; verifikasi admin; panel mitra (ketersediaan & harga) |
| Fase 4 — Bagi Hasil & Panel Admin | Bagi hasil terhitung otomatis dan admin bisa memonitor & mencairkan | Mesin bagi hasil (ledger); panel admin (monitor transaksi, kelola pencairan); riwayat pendapatan mitra |
| Fase 5 — Pengerasan & Rilis | Sistem siap produksi | Testing menyeluruh (13); observability dasar (15); guardrail keamanan (21); rilis (25) |

Fitur "nanti" (ulasan/rating, payout otomatis, notifikasi WhatsApp) masuk roadmap pasca-MVP, tidak dijadwalkan di fase di atas.
