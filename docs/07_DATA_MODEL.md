# 07 — Data Model

Sumber kebenaran skema. Dokumen lain merujuk (`lihat docs/07_DATA_MODEL.md`), tidak menyalin.

## Tabel: users
| Kolom | Tipe | Constraint | Catatan |
|---|---|---|---|
| id | uuid | PK, default gen_random_uuid() | |
| name | varchar(120) | NOT NULL | |
| email | varchar(180) | UNIQUE, NOT NULL | PII |
| phone | varchar(20) | NULL | PII |
| password_hash | varchar(255) | NOT NULL | bcrypt/argon2, lihat docs/21 |
| role | enum('wisatawan','mitra_jasa','mitra_penginapan','admin') | NOT NULL, default 'wisatawan' | peran: docs/05 |
| created_at | timestamptz | NOT NULL, default now() | |
| updated_at | timestamptz | NOT NULL | |

## Tabel: mitra_jasa
| Kolom | Tipe | Constraint | Catatan |
|---|---|---|---|
| id | uuid | PK | |
| user_id | uuid | FK -> users.id, UNIQUE, NOT NULL | |
| nama_usaha | varchar(150) | NOT NULL | |
| no_ktp_nib | varchar(30) | NOT NULL | PII, akses admin-only |
| no_rekening | varchar(50) | NOT NULL | dienkripsi at-rest, lihat docs/21 |
| persentase_bagi_hasil | numeric(5,2) | NOT NULL, default 85.00 | porsi mitra (%); default sama semua mitra v1 |
| status_verifikasi | enum('PENDING','AKTIF','REJECTED') | NOT NULL, default 'PENDING' | |
| created_at | timestamptz | NOT NULL, default now() | |

## Tabel: mitra_penginapan
| Kolom | Tipe | Constraint | Catatan |
|---|---|---|---|
| id | uuid | PK | |
| user_id | uuid | FK -> users.id, UNIQUE, NOT NULL | |
| nama_usaha | varchar(150) | NOT NULL | |
| no_ktp_nib | varchar(30) | NOT NULL | PII, akses admin-only |
| no_rekening | varchar(50) | NOT NULL | dienkripsi at-rest |
| persentase_bagi_hasil | numeric(5,2) | NOT NULL, default 85.00 | porsi mitra (%) |
| status_verifikasi | enum('PENDING','AKTIF','REJECTED') | NOT NULL, default 'PENDING' | |
| created_at | timestamptz | NOT NULL, default now() | |

## Tabel: produk_jasa
| Kolom | Tipe | Constraint | Catatan |
|---|---|---|---|
| id | uuid | PK | |
| mitra_jasa_id | uuid | FK -> mitra_jasa.id, NOT NULL | |
| nama | varchar(150) | NOT NULL | mis. "Rafting Bambu 2 Jam" |
| jenis | enum('rafting','river_tubing') | NOT NULL | |
| harga_per_orang | numeric(12,2) | NOT NULL, CHECK > 0 | |
| kapasitas_per_hari | int | NOT NULL, CHECK > 0 | |
| aktif | boolean | NOT NULL, default true | |

## Tabel: kamar_penginapan
| Kolom | Tipe | Constraint | Catatan |
|---|---|---|---|
| id | uuid | PK | |
| mitra_penginapan_id | uuid | FK -> mitra_penginapan.id, NOT NULL | |
| nama_kamar | varchar(150) | NOT NULL | |
| harga_per_malam | numeric(12,2) | NOT NULL, CHECK > 0 | |
| kapasitas_kamar | int | NOT NULL, CHECK > 0 | jumlah orang per kamar |
| jumlah_unit | int | NOT NULL, default 1, CHECK > 0 | untuk cek ketersediaan |
| aktif | boolean | NOT NULL, default true | |

## Tabel: bookings
| Kolom | Tipe | Constraint | Catatan |
|---|---|---|---|
| id | uuid | PK | |
| user_id | uuid | FK -> users.id, NOT NULL | wisatawan pemesan |
| kode_booking | varchar(20) | UNIQUE, NOT NULL | mis. "BR-20260812-0001" |
| tanggal_mulai | date | NOT NULL | |
| tanggal_selesai | date | NOT NULL | sama dengan tanggal_mulai untuk jasa harian |
| status | enum('PENDING','CONFIRMED','EXPIRED','CANCELLED') | NOT NULL, default 'PENDING' | |
| total_harga | numeric(12,2) | NOT NULL | |
| created_at | timestamptz | NOT NULL, default now() | |

## Tabel: booking_items
| Kolom | Tipe | Constraint | Catatan |
|---|---|---|---|
| id | uuid | PK | |
| booking_id | uuid | FK -> bookings.id, NOT NULL | |
| produk_jasa_id | uuid | FK -> produk_jasa.id, NULL | terisi jika item jasa |
| kamar_penginapan_id | uuid | FK -> kamar_penginapan.id, NULL | terisi jika item kamar |
| jumlah | int | NOT NULL, CHECK > 0 | jumlah orang (jasa) / kamar (penginapan) |
| subtotal | numeric(12,2) | NOT NULL | |
| CHECK | — | (produk_jasa_id IS NOT NULL) <> (kamar_penginapan_id IS NOT NULL) | tepat satu jenis item — enforce di DB & Service layer |

## Tabel: pembayaran
| Kolom | Tipe | Constraint | Catatan |
|---|---|---|---|
| id | uuid | PK | |
| booking_id | uuid | FK -> bookings.id, UNIQUE, NOT NULL | |
| midtrans_order_id | varchar(60) | UNIQUE, NOT NULL | |
| metode | varchar(30) | NULL | diisi dari respons Midtrans |
| status | enum('PENDING','PAID','FAILED','EXPIRED') | NOT NULL, default 'PENDING' | |
| jumlah | numeric(12,2) | NOT NULL | |
| paid_at | timestamptz | NULL | |

## Tabel: bagi_hasil
| Kolom | Tipe | Constraint | Catatan |
|---|---|---|---|
| id | uuid | PK | |
| booking_item_id | uuid | FK -> booking_items.id, UNIQUE, NOT NULL | |
| porsi_platform | numeric(12,2) | NOT NULL | dihitung dari subtotal x (100 - persentase_bagi_hasil mitra) |
| porsi_mitra | numeric(12,2) | NOT NULL | dihitung dari subtotal x persentase_bagi_hasil mitra |
| status | enum('PENDING','SIAP_CAIR','CAIR','VOID') | NOT NULL, default 'PENDING' | |
| dicairkan_at | timestamptz | NULL | |

## Tabel: ulasan (pasca-MVP, skema disiapkan)
| Kolom | Tipe | Constraint | Catatan |
|---|---|---|---|
| id | uuid | PK | |
| booking_item_id | uuid | FK -> booking_items.id, UNIQUE, NOT NULL | |
| rating | smallint | NOT NULL, CHECK 1-5 | |
| komentar | text | NULL | |
| created_at | timestamptz | NOT NULL, default now() | |

## Indeks Penting
- `bookings(user_id)`, `bookings(status)` — query riwayat & monitor admin.
- `booking_items(produk_jasa_id, booking_id)` dan `booking_items(kamar_penginapan_id, booking_id)` — cek ketersediaan cepat.
- `bagi_hasil(status)` — query antrean pencairan admin.
- Constraint unik komposit disarankan pada level Service untuk mencegah double-booking slot yang sama pada tanggal yang sama (dicek dalam transaksi DB, bukan hanya di aplikasi).

## Catatan Data Sensitif
`no_ktp_nib` dan `no_rekening` adalah PII/data finansial — aturan enkripsi & akses: lihat `docs/21_SECURITY_RULES.md`. Tidak ada hard-delete pada `bookings`, `pembayaran`, `bagi_hasil` (audit trail transaksi keuangan).
