import { prisma } from "@/app/lib/prisma";
import type { ProdukJasaInput, KamarPenginapanInput } from "@/app/server/validators/produk";

export const ProdukRepository = {
  listMitraJasa() {
    return prisma.mitraJasa.findMany({ where: { statusVerifikasi: "AKTIF" }, orderBy: { namaUsaha: "asc" } });
  },
  listMitraPenginapan() {
    return prisma.mitraPenginapan.findMany({ where: { statusVerifikasi: "AKTIF" }, orderBy: { namaUsaha: "asc" } });
  },
  listProdukJasa() {
    return prisma.produkJasa.findMany({ include: { mitraJasa: true }, orderBy: { nama: "asc" } });
  },
  createProdukJasa(data: ProdukJasaInput) {
    return prisma.produkJasa.create({ data });
  },
  listKamarPenginapan() {
    return prisma.kamarPenginapan.findMany({ include: { mitraPenginapan: true }, orderBy: { namaKamar: "asc" } });
  },
  createKamarPenginapan(data: KamarPenginapanInput) {
    return prisma.kamarPenginapan.create({ data });
  },

  listProdukJasaByMitra(mitraJasaId: string) {
    return prisma.produkJasa.findMany({ where: { mitraJasaId }, orderBy: { nama: "asc" } });
  },
  listKamarByMitra(mitraPenginapanId: string) {
    return prisma.kamarPenginapan.findMany({ where: { mitraPenginapanId }, orderBy: { namaKamar: "asc" } });
  },

  async getProdukJasaOwner(id: string) {
    const produk = await prisma.produkJasa.findUnique({ where: { id }, select: { mitraJasaId: true } });
    return produk?.mitraJasaId;
  },
  async getKamarOwner(id: string) {
    const kamar = await prisma.kamarPenginapan.findUnique({ where: { id }, select: { mitraPenginapanId: true } });
    return kamar?.mitraPenginapanId;
  },

  updateProdukJasa(id: string, data: { hargaPerOrang?: number; kapasitasPerHari?: number; aktif?: boolean }) {
    return prisma.produkJasa.update({ where: { id }, data });
  },
  updateKamar(id: string, data: { hargaPerMalam?: number; kapasitasKamar?: number; jumlahUnit?: number; aktif?: boolean }) {
    return prisma.kamarPenginapan.update({ where: { id }, data });
  },
};
