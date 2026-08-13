import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { encryptSensitive } from "../app/lib/crypto";

const prisma = new PrismaClient();

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

  console.log({ admin: admin.email, mitraJasa: mitraJasa.namaUsaha, mitraPenginapan: mitraPenginapan.namaUsaha });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
