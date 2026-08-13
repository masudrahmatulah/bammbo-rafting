import { prisma } from "@/app/lib/prisma";

export const MitraRepository = {
  createMitraJasaUser(data: {
    name: string;
    email: string;
    phone?: string;
    passwordHash: string;
    namaUsaha: string;
    noKtpNib: string;
    noRekeningEnc: string;
  }) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        passwordHash: data.passwordHash,
        role: "mitra_jasa",
        mitraJasa: {
          create: {
            namaUsaha: data.namaUsaha,
            noKtpNib: data.noKtpNib,
            noRekening: data.noRekeningEnc,
          },
        },
      },
      include: { mitraJasa: true },
    });
  },

  createMitraPenginapanUser(data: {
    name: string;
    email: string;
    phone?: string;
    passwordHash: string;
    namaUsaha: string;
    noKtpNib: string;
    noRekeningEnc: string;
  }) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        passwordHash: data.passwordHash,
        role: "mitra_penginapan",
        mitraPenginapan: {
          create: {
            namaUsaha: data.namaUsaha,
            noKtpNib: data.noKtpNib,
            noRekening: data.noRekeningEnc,
          },
        },
      },
      include: { mitraPenginapan: true },
    });
  },

  listPendingJasa() {
    return prisma.mitraJasa.findMany({
      where: { statusVerifikasi: "PENDING" },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "asc" },
    });
  },
  listPendingPenginapan() {
    return prisma.mitraPenginapan.findMany({
      where: { statusVerifikasi: "PENDING" },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "asc" },
    });
  },

  setStatusJasa(id: string, status: "AKTIF" | "REJECTED") {
    return prisma.mitraJasa.update({ where: { id }, data: { statusVerifikasi: status } });
  },
  setStatusPenginapan(id: string, status: "AKTIF" | "REJECTED") {
    return prisma.mitraPenginapan.update({ where: { id }, data: { statusVerifikasi: status } });
  },

  getMitraJasaByUserId(userId: string) {
    return prisma.mitraJasa.findUnique({ where: { userId } });
  },
  getMitraPenginapanByUserId(userId: string) {
    return prisma.mitraPenginapan.findUnique({ where: { userId } });
  },
};
