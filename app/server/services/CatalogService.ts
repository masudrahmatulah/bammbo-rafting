import { CatalogRepository } from "@/app/server/repositories/CatalogRepository";

export const CatalogService = {
  listJasa() {
    return CatalogRepository.listProdukJasa();
  },
  getJasa(id: string) {
    return CatalogRepository.getProdukJasaById(id);
  },
  listPenginapan() {
    return CatalogRepository.listKamarPenginapan();
  },
  getPenginapan(id: string) {
    return CatalogRepository.getKamarPenginapanById(id);
  },
};
