# 18 — Repair Rules

Pemilik aturan perbaikan bug.

## Alur Perbaikan
1. Reproduksi bug (skenario jelas, data yang memicu).
2. Cari akar masalah — rujuk `docs/07_DATA_MODEL.md` untuk skema dan `docs/06_BUSINESS_PROCESS.md` untuk alur yang seharusnya.
3. Perbaikan minimal — hanya ubah kode yang menyebabkan bug.
4. Tambah/perbarui test regresi yang menangkap bug ini (lihat `docs/13_TESTING.md`).

## Larangan
- Perbaikan **tidak boleh melebihi scope bug** — jangan sekalian refactor bagian lain.
- **Tidak boleh** refactor luas tanpa izin eksplisit dari pengguna/pemilik proyek.
- Perbaikan yang menyentuh logika bagi hasil atau status pembayaran **wajib** disertai test regresi (area berdampak finansial langsung ke mitra).
