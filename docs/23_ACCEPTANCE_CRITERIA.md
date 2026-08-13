# 23 — Acceptance Criteria

Per fitur MVP (diturunkan dari `docs/01_PRD.md` + `docs/07_DATA_MODEL.md`). DoD universal: `docs/24_DEFINITION_OF_DONE.md`.

> **Arsip-saat-diterima**: begitu sebuah fitur diterima (kriteria terpenuhi, tes hijau), pindahkan bloknya ke `docs/_archive/23-{fitur}.md`. Dokumen ini hanya memuat fitur aktif.

## Booking Mandiri & Pembayaran
- **Given** wisatawan login dan produk tersedia pada tanggal pilihan, **When** wisatawan checkout dan bayar sukses via Midtrans, **Then** status booking menjadi `CONFIRMED` dan entri `bagi_hasil` tercipta dengan porsi sesuai `persentase_bagi_hasil` mitra.
- **Given** slot/kamar penuh, **When** wisatawan mencoba checkout, **Then** sistem menolak sebelum redirect ke Midtrans dengan pesan slot penuh.
- **Given** pembayaran timeout/gagal, **When** webhook Midtrans melapor status gagal, **Then** booking menjadi `EXPIRED` dan slot dilepas kembali.

**Blok verifikasi:** `npm run test -- booking.spec.ts` dan `npm run test:e2e -- booking-flow.spec.ts` → semua lulus (exit 0), tanpa test yang di-skip.

## Pendaftaran & Verifikasi Mitra
- **Given** calon mitra mengisi form pendaftaran lengkap, **When** disubmit, **Then** status `PENDING` dan tidak tampil di katalog publik.
- **Given** admin approve mitra `PENDING`, **When** disetujui, **Then** status `AKTIF` dan produknya tampil di katalog.
- **Given** admin reject, **When** ditolak, **Then** status `REJECTED` dan mitra melihat catatan alasan.

**Blok verifikasi:** `npm run test -- mitra-onboarding.spec.ts` → lulus.

## Mesin Bagi Hasil
- **Given** booking `CONFIRMED`, **When** dihitung, **Then** `porsi_platform + porsi_mitra = subtotal` per booking item, sesuai `persentase_bagi_hasil` mitra terkait.
- **Given** booking dibatalkan sebelum tanggal trip, **When** dibatalkan, **Then** entri `bagi_hasil` terkait berstatus `VOID`.

**Blok verifikasi:** `npm run test -- bagi-hasil.spec.ts` → lulus, termasuk kasus pembulatan nominal.

## Panel Mitra (Ketersediaan, Harga, Pendapatan)
- **Given** mitra login, **When** mengubah harga/ketersediaan produknya, **Then** perubahan tersimpan dan hanya berlaku untuk produk miliknya (tidak bisa mengubah milik mitra lain).
- **Given** mitra melihat halaman pendapatan, **When** dimuat, **Then** menampilkan hanya entri `bagi_hasil` miliknya dengan status terkini.

**Blok verifikasi:** `npm run test -- panel-mitra.spec.ts` → lulus, termasuk test otorisasi lintas-mitra (harus gagal 403).

## Panel Admin (Monitor & Pencairan)
- **Given** admin login, **When** membuka daftar bagi hasil `SIAP_CAIR`, **Then** admin bisa menandai `CAIR` dan `dicairkan_at` terisi.

**Blok verifikasi:** `npm run test -- panel-admin.spec.ts` → lulus.
