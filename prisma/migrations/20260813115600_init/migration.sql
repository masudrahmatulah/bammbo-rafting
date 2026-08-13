-- CreateEnum
CREATE TYPE "Role" AS ENUM ('wisatawan', 'mitra_jasa', 'mitra_penginapan', 'admin');

-- CreateEnum
CREATE TYPE "StatusVerifikasi" AS ENUM ('PENDING', 'AKTIF', 'REJECTED');

-- CreateEnum
CREATE TYPE "JenisProdukJasa" AS ENUM ('rafting', 'river_tubing');

-- CreateEnum
CREATE TYPE "StatusBooking" AS ENUM ('PENDING', 'CONFIRMED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "StatusPembayaran" AS ENUM ('PENDING', 'PAID', 'FAILED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "StatusBagiHasil" AS ENUM ('PENDING', 'SIAP_CAIR', 'CAIR', 'VOID');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(180) NOT NULL,
    "phone" VARCHAR(20),
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'wisatawan',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mitra_jasa" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "nama_usaha" VARCHAR(150) NOT NULL,
    "no_ktp_nib" VARCHAR(30) NOT NULL,
    "no_rekening" VARCHAR(50) NOT NULL,
    "persentase_bagi_hasil" DECIMAL(5,2) NOT NULL DEFAULT 85.00,
    "status_verifikasi" "StatusVerifikasi" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mitra_jasa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mitra_penginapan" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "nama_usaha" VARCHAR(150) NOT NULL,
    "no_ktp_nib" VARCHAR(30) NOT NULL,
    "no_rekening" VARCHAR(50) NOT NULL,
    "persentase_bagi_hasil" DECIMAL(5,2) NOT NULL DEFAULT 85.00,
    "status_verifikasi" "StatusVerifikasi" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mitra_penginapan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produk_jasa" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "mitra_jasa_id" UUID NOT NULL,
    "nama" VARCHAR(150) NOT NULL,
    "jenis" "JenisProdukJasa" NOT NULL,
    "harga_per_orang" DECIMAL(12,2) NOT NULL,
    "kapasitas_per_hari" INTEGER NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "produk_jasa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kamar_penginapan" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "mitra_penginapan_id" UUID NOT NULL,
    "nama_kamar" VARCHAR(150) NOT NULL,
    "harga_per_malam" DECIMAL(12,2) NOT NULL,
    "kapasitas_kamar" INTEGER NOT NULL,
    "jumlah_unit" INTEGER NOT NULL DEFAULT 1,
    "aktif" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "kamar_penginapan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "kode_booking" VARCHAR(20) NOT NULL,
    "tanggal_mulai" DATE NOT NULL,
    "tanggal_selesai" DATE NOT NULL,
    "status" "StatusBooking" NOT NULL DEFAULT 'PENDING',
    "total_harga" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "booking_id" UUID NOT NULL,
    "produk_jasa_id" UUID,
    "kamar_penginapan_id" UUID,
    "jumlah" INTEGER NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "booking_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pembayaran" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "booking_id" UUID NOT NULL,
    "midtrans_order_id" VARCHAR(60) NOT NULL,
    "metode" VARCHAR(30),
    "status" "StatusPembayaran" NOT NULL DEFAULT 'PENDING',
    "jumlah" DECIMAL(12,2) NOT NULL,
    "paid_at" TIMESTAMPTZ,

    CONSTRAINT "pembayaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bagi_hasil" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "booking_item_id" UUID NOT NULL,
    "porsi_platform" DECIMAL(12,2) NOT NULL,
    "porsi_mitra" DECIMAL(12,2) NOT NULL,
    "status" "StatusBagiHasil" NOT NULL DEFAULT 'PENDING',
    "dicairkan_at" TIMESTAMPTZ,

    CONSTRAINT "bagi_hasil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ulasan" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "booking_item_id" UUID NOT NULL,
    "rating" SMALLINT NOT NULL,
    "komentar" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ulasan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "mitra_jasa_user_id_key" ON "mitra_jasa"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "mitra_penginapan_user_id_key" ON "mitra_penginapan"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_kode_booking_key" ON "bookings"("kode_booking");

-- CreateIndex
CREATE INDEX "bookings_user_id_idx" ON "bookings"("user_id");

-- CreateIndex
CREATE INDEX "bookings_status_idx" ON "bookings"("status");

-- CreateIndex
CREATE INDEX "booking_items_produk_jasa_id_booking_id_idx" ON "booking_items"("produk_jasa_id", "booking_id");

-- CreateIndex
CREATE INDEX "booking_items_kamar_penginapan_id_booking_id_idx" ON "booking_items"("kamar_penginapan_id", "booking_id");

-- CreateIndex
CREATE UNIQUE INDEX "pembayaran_booking_id_key" ON "pembayaran"("booking_id");

-- CreateIndex
CREATE UNIQUE INDEX "pembayaran_midtrans_order_id_key" ON "pembayaran"("midtrans_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "bagi_hasil_booking_item_id_key" ON "bagi_hasil"("booking_item_id");

-- CreateIndex
CREATE INDEX "bagi_hasil_status_idx" ON "bagi_hasil"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ulasan_booking_item_id_key" ON "ulasan"("booking_item_id");

-- AddForeignKey
ALTER TABLE "mitra_jasa" ADD CONSTRAINT "mitra_jasa_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mitra_penginapan" ADD CONSTRAINT "mitra_penginapan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produk_jasa" ADD CONSTRAINT "produk_jasa_mitra_jasa_id_fkey" FOREIGN KEY ("mitra_jasa_id") REFERENCES "mitra_jasa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kamar_penginapan" ADD CONSTRAINT "kamar_penginapan_mitra_penginapan_id_fkey" FOREIGN KEY ("mitra_penginapan_id") REFERENCES "mitra_penginapan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_items" ADD CONSTRAINT "booking_items_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_items" ADD CONSTRAINT "booking_items_produk_jasa_id_fkey" FOREIGN KEY ("produk_jasa_id") REFERENCES "produk_jasa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_items" ADD CONSTRAINT "booking_items_kamar_penginapan_id_fkey" FOREIGN KEY ("kamar_penginapan_id") REFERENCES "kamar_penginapan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pembayaran" ADD CONSTRAINT "pembayaran_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bagi_hasil" ADD CONSTRAINT "bagi_hasil_booking_item_id_fkey" FOREIGN KEY ("booking_item_id") REFERENCES "booking_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
