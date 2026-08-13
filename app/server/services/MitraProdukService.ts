import { ProdukRepository } from "@/app/server/repositories/ProdukRepository";

export class ForbiddenError extends Error {
  constructor() {
    super("Anda tidak berhak mengubah produk ini");
  }
}

export const MitraProdukService = {
  listOwnJasa(mitraJasaId: string) {
    return ProdukRepository.listProdukJasaByMitra(mitraJasaId);
  },
  listOwnKamar(mitraPenginapanId: string) {
    return ProdukRepository.listKamarByMitra(mitraPenginapanId);
  },

  createJasa(mitraJasaId: string, data: { nama: string; jenis: "rafting" | "river_tubing"; hargaPerOrang: number; kapasitasPerHari: number }) {
    return ProdukRepository.createProdukJasa({ mitraJasaId, ...data });
  },
  createKamar(mitraPenginapanId: string, data: { namaKamar: string; hargaPerMalam: number; kapasitasKamar: number; jumlahUnit: number }) {
    return ProdukRepository.createKamarPenginapan({ mitraPenginapanId, ...data });
  },

  async updateJasa(mitraJasaId: string, produkId: string, data: { hargaPerOrang?: number; kapasitasPerHari?: number; aktif?: boolean }) {
    const owner = await ProdukRepository.getProdukJasaOwner(produkId);
    if (owner !== mitraJasaId) throw new ForbiddenError();
    return ProdukRepository.updateProdukJasa(produkId, data);
  },
  async updateKamar(mitraPenginapanId: string, kamarId: string, data: { hargaPerMalam?: number; kapasitasKamar?: number; jumlahUnit?: number; aktif?: boolean }) {
    const owner = await ProdukRepository.getKamarOwner(kamarId);
    if (owner !== mitraPenginapanId) throw new ForbiddenError();
    return ProdukRepository.updateKamar(kamarId, data);
  },
};
