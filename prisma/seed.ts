import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { encryptSensitive } from "../app/lib/crypto";

const prisma = new PrismaClient();

async function upsertProdukJasa(
  mitraJasaId: string,
  data: { nama: string; jenis: "rafting" | "river_tubing"; hargaPerOrang: number; kapasitasPerHari: number }
) {
  const existing = await prisma.produkJasa.findFirst({ where: { mitraJasaId, nama: data.nama } });
  if (existing) return existing;
  return prisma.produkJasa.create({ data: { mitraJasaId, ...data } });
}

async function upsertKamar(
  mitraPenginapanId: string,
  data: { namaKamar: string; hargaPerMalam: number; kapasitasKamar: number; jumlahUnit: number }
) {
  const existing = await prisma.kamarPenginapan.findFirst({ where: { mitraPenginapanId, namaKamar: data.namaKamar } });
  if (existing) return existing;
  return prisma.kamarPenginapan.create({ data: { mitraPenginapanId, ...data } });
}

async function main() {
  const adminEmail = "admin@bammborafting.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "GantiSegera123!";

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Admin Bammbo",
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 12),
      role: "admin",
    },
  });

  // --- Mitra jasa 1: Loksado Bamboo Rafting ---
  const mitraJasaUser = await prisma.user.upsert({
    where: { email: "mitra.jasa@bammborafting.com" },
    update: {},
    create: {
      name: "Pengelola Rafting Loksado",
      email: "mitra.jasa@bammborafting.com",
      passwordHash: await bcrypt.hash("GantiSegera123!", 12),
      role: "mitra_jasa",
    },
  });

  const mitraJasa = await prisma.mitraJasa.upsert({
    where: { userId: mitraJasaUser.id },
    update: {},
    create: {
      userId: mitraJasaUser.id,
      namaUsaha: "Loksado Bamboo Rafting",
      noKtpNib: "0000000000000000",
      noRekening: encryptSensitive("0000000000"),
      statusVerifikasi: "AKTIF",
    },
  });

  // --- Mitra jasa 2: Haruyan River Adventure ---
  const mitraJasaUser2 = await prisma.user.upsert({
    where: { email: "mitra.jasa2@bammborafting.com" },
    update: {},
    create: {
      name: "Pengelola Haruyan Adventure",
      email: "mitra.jasa2@bammborafting.com",
      passwordHash: await bcrypt.hash("GantiSegera123!", 12),
      role: "mitra_jasa",
    },
  });

  const mitraJasa2 = await prisma.mitraJasa.upsert({
    where: { userId: mitraJasaUser2.id },
    update: {},
    create: {
      userId: mitraJasaUser2.id,
      namaUsaha: "Haruyan River Adventure",
      noKtpNib: "0000000000000001",
      noRekening: encryptSensitive("0000000001"),
      statusVerifikasi: "AKTIF",
    },
  });

  // --- Mitra penginapan 1: Homestay Loksado Asri ---
  const mitraPenginapanUser = await prisma.user.upsert({
    where: { email: "mitra.penginapan@bammborafting.com" },
    update: {},
    create: {
      name: "Pengelola Homestay Loksado",
      email: "mitra.penginapan@bammborafting.com",
      passwordHash: await bcrypt.hash("GantiSegera123!", 12),
      role: "mitra_penginapan",
    },
  });

  const mitraPenginapan = await prisma.mitraPenginapan.upsert({
    where: { userId: mitraPenginapanUser.id },
    update: {},
    create: {
      userId: mitraPenginapanUser.id,
      namaUsaha: "Homestay Loksado Asri",
      noKtpNib: "0000000000000000",
      noRekening: encryptSensitive("0000000000"),
      statusVerifikasi: "AKTIF",
    },
  });

  // --- Mitra penginapan 2: Malaris Riverside Cottage ---
  const mitraPenginapanUser2 = await prisma.user.upsert({
    where: { email: "mitra.penginapan2@bammborafting.com" },
    update: {},
    create: {
      name: "Pengelola Malaris Cottage",
      email: "mitra.penginapan2@bammborafting.com",
      passwordHash: await bcrypt.hash("GantiSegera123!", 12),
      role: "mitra_penginapan",
    },
  });

  const mitraPenginapan2 = await prisma.mitraPenginapan.upsert({
    where: { userId: mitraPenginapanUser2.id },
    update: {},
    create: {
      userId: mitraPenginapanUser2.id,
      namaUsaha: "Malaris Riverside Cottage",
      noKtpNib: "0000000000000001",
      noRekening: encryptSensitive("0000000001"),
      statusVerifikasi: "AKTIF",
    },
  });

  // --- Produk jasa dummy ---
  const produkJasa = await Promise.all([
    upsertProdukJasa(mitraJasa.id, { nama: "Rafting Bambu Klasik 2 Jam", jenis: "rafting", hargaPerOrang: 150000, kapasitasPerHari: 40 }),
    upsertProdukJasa(mitraJasa.id, { nama: "Rafting Bambu Panjang 4 Jam", jenis: "rafting", hargaPerOrang: 275000, kapasitasPerHari: 24 }),
    upsertProdukJasa(mitraJasa.id, { nama: "River Tubing Seru", jenis: "river_tubing", hargaPerOrang: 100000, kapasitasPerHari: 30 }),
    upsertProdukJasa(mitraJasa2.id, { nama: "Rafting Sunrise Haruyan", jenis: "rafting", hargaPerOrang: 180000, kapasitasPerHari: 20 }),
    upsertProdukJasa(mitraJasa2.id, { nama: "River Tubing Keluarga", jenis: "river_tubing", hargaPerOrang: 90000, kapasitasPerHari: 25 }),
  ]);

  // --- Kamar dummy ---
  const kamar = await Promise.all([
    upsertKamar(mitraPenginapan.id, { namaKamar: "Kamar Standar Pemandangan Sungai", hargaPerMalam: 250000, kapasitasKamar: 2, jumlahUnit: 4 }),
    upsertKamar(mitraPenginapan.id, { namaKamar: "Kamar Keluarga Deluxe", hargaPerMalam: 450000, kapasitasKamar: 4, jumlahUnit: 2 }),
    upsertKamar(mitraPenginapan2.id, { namaKamar: "Cottage Tepi Sungai", hargaPerMalam: 350000, kapasitasKamar: 3, jumlahUnit: 3 }),
    upsertKamar(mitraPenginapan2.id, { namaKamar: "Cottage Panorama Bukit", hargaPerMalam: 500000, kapasitasKamar: 4, jumlahUnit: 2 }),
  ]);

  console.log({
    admin: admin.email,
    mitraJasa: [mitraJasa.namaUsaha, mitraJasa2.namaUsaha],
    mitraPenginapan: [mitraPenginapan.namaUsaha, mitraPenginapan2.namaUsaha],
    produkJasa: produkJasa.length,
    kamar: kamar.length,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
