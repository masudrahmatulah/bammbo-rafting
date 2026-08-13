# 13 — Testing

Pemilik strategi tes. Perintah: `docs/11_COMMANDS.md`. Rujuk oleh `docs/23_ACCEPTANCE_CRITERIA.md` dan `docs/24_DEFINITION_OF_DONE.md`.

## Jenis Tes & Cakupan Target
- **Unit test (Vitest)** — logika domain murni: perhitungan bagi hasil (`BagiHasilService`), validasi ketersediaan slot/kamar, validasi Zod. Target: semua Service dengan aturan bisnis non-trivial.
- **Feature/E2E test (Playwright)** — alur kritikal end-to-end dengan Midtrans di-mock: booking → checkout → webhook simulasi → status CONFIRMED; pendaftaran mitra → approve admin → produk tampil di katalog.

## Wajib Dites (Alur Kritikal)
1. Booking sukses: slot tersedia → checkout → webhook PAID → status CONFIRMED → entri `bagi_hasil` tercipta dengan porsi benar.
2. Booking gagal bayar: webhook FAILED/timeout → status EXPIRED → slot dilepas.
3. Cegah double-booking: dua checkout bersamaan untuk slot/kamar terakhir → hanya satu yang berhasil.
4. Approve mitra: mitra PENDING → admin approve → produk mitra muncul di katalog publik; mitra REJECTED tidak muncul.
5. Otorisasi per peran: mitra tidak bisa akses data mitra lain; wisatawan tidak bisa akses panel admin/mitra.

## Perintah
Lihat `docs/11_COMMANDS.md` (`test`, `test:e2e`).
