import { prisma } from "@/app/lib/prisma";

export const CatalogRepository = {
  listProdukJasa() {
    return prisma.produkJasa.findMany({
      where: { aktif: true },
      include: { mitraJasa: { select: { namaUsaha: true } } },
      orderBy: { nama: "asc" },
    });
  },
  getProdukJasaById(id: string) {
    return prisma.produkJasa.findUnique({
      where: { id },
      include: { mitraJasa: { select: { namaUsaha: true } } },
    });
  },
  listKamarPenginapan() {
    return prisma.kamarPenginapan.findMany({
      where: { aktif: true },
      include: { mitraPenginapan: { select: { namaUsaha: true } } },
      orderBy: { namaKamar: "asc" },
    });
  },
  getKamarPenginapanById(id: string) {
    return prisma.kamarPenginapan.findUnique({
      where: { id },
      include: { mitraPenginapan: { select: { namaUsaha: true } } },
    });
  },
};
