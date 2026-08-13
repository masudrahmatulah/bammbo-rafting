# 06 — Business Process

Pemilik alur proses bisnis. Rujuk peran (`docs/05_USER_ROLE.md`) dan data (`docs/07_DATA_MODEL.md`), tidak didefinisikan ulang di sini.

## 1. Booking & Pembayaran Wisatawan

```
Wisatawan pilih produk (jasa/penginapan/paket gabungan)
  -> pilih tanggal & jumlah orang
  -> sistem cek ketersediaan (docs/07: constraint slot)
  -> checkout (buat Booking status PENDING)
  -> redirect ke Midtrans
  -> wisatawan bayar
  -> Midtrans kirim webhook -> verifikasi signature (docs/21)
  -> Booking status CONFIRMED, Pembayaran status PAID
  -> notifikasi email ke wisatawan & mitra terkait
  -> H-1 sebelum tanggal trip/menginap: email reminder
```
**Kondisi gagal:**
- Pembayaran gagal/timeout di Midtrans → Booking status `EXPIRED`, slot yang di-hold dilepas kembali.
- Slot/kamar penuh saat checkout → wisatawan diarahkan pilih tanggal lain sebelum lanjut ke pembayaran (dicegah sebelum redirect ke Midtrans).

## 2. Pendaftaran Mitra Baru

```
Calon mitra isi form pendaftaran (data usaha, jenis produk, dokumen KTP/NIB)
  -> status_verifikasi = PENDING
  -> admin tinjau data & dokumen
  -> admin APPROVE -> status AKTIF, produk mitra tampil di katalog publik
  -> ATAU admin REJECT -> status REJECTED + catatan alasan, mitra boleh ajukan ulang
```

## 3. Perhitungan & Pencairan Bagi Hasil

```
Booking status berubah menjadi CONFIRMED
  -> untuk tiap Booking Item, sistem hitung porsi_platform & porsi_mitra
     sesuai persentase berlaku (docs/07: kolom persentase)
  -> catat entri BagiHasil, status PENDING
  -> setelah tanggal trip/menginap terlampaui -> status SIAP_CAIR
  -> admin proses transfer manual ke rekening mitra
  -> admin tandai status CAIR (dicairkan_at diisi)
```
**Kondisi gagal:** Booking dibatalkan sebelum tanggal trip/menginap → entri BagiHasil terkait di-VOID, tidak masuk antrean pencairan.
