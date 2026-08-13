# 12 — Project Structure

Pemilik struktur folder & penamaan.

## Pohon Folder (tingkat penting)
```
app/
  (public)/                # halaman katalog, detail produk, checkout — wisatawan
  (mitra)/                 # panel mitra — kelola produk, ketersediaan, pendapatan
  (admin)/                 # panel admin — verifikasi mitra, monitor, bagi hasil
  api/webhooks/midtrans/   # webhook handler pembayaran
  server/
    services/               # logika bisnis (BookingService, BagiHasilService, dst.)
    repositories/           # akses data via Prisma per entitas
    validators/             # skema Zod per fitur
prisma/
  schema.prisma             # sumber skema — sinkron dengan docs/07_DATA_MODEL.md
  migrations/
docs/                        # 28 dokumen blueprint (paket ini)
scripts/                     # validate.sh, token_ledger.py (VCBD)
```

## Konvensi Penamaan
- Model Prisma: PascalCase (`BookingItem`), kolom DB: snake_case (`booking_id`) — Prisma `@map` untuk konversi.
- Service: `NamaEntitasService.ts` (mis. `BagiHasilService.ts`).
- Route folder: kebab-case; Server Action: verb-first (`createBooking`, `approveMitra`).

## Lokasi Jenis Kode
- Logika bisnis (perhitungan bagi hasil, validasi ketersediaan) → **Service**, bukan di Route Handler/Server Action.
- Query database → **Repository**, tidak langsung di Service (Service memanggil Repository).
- Validasi input → **Zod schema** di `server/validators/`, dipanggil di awal Route Handler/Server Action.
