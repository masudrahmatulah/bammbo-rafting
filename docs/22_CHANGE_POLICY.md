# 22 — Change Policy

Pemilik kebijakan perubahan. Friksi sebanding irreversibilitas. `docs/25_RELEASE_CHECKLIST.md` merujuk ke sini.

## Alur Git/Branch
Branch per fitur (format: `fitur/nama-singkat`). Dilarang commit langsung ke `main`. Merge ke `main` wajib lewat pull request dengan code review.

## Siapa Boleh Merge
Pemilik proyek/reviewer yang ditunjuk. Agen coding tidak merge sendiri ke `main` tanpa persetujuan eksplisit pengguna.

## Operasi Irreversibel + Gerbang Manusia
Operasi berikut **wajib** konfirmasi eksplisit dari pengguna sebelum dieksekusi:
- Migrasi destruktif (drop/alter kolom yang membawa data).
- Hapus data `bookings`, `pembayaran`, atau `bagi_hasil`.
- Perubahan persentase bagi hasil pada mitra yang sudah punya transaksi berjalan.
- Rilis ke production.

## Aturan Rollback
Setiap rilis harus punya rencana rollback (revert deploy + restore backup database bila migrasi bermasalah) sebelum dieksekusi — detail langkah: `docs/25_RELEASE_CHECKLIST.md`.
