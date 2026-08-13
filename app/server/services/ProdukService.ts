import { ProdukRepository } from "@/app/server/repositories/ProdukRepository";
import { produkJasaSchema, kamarPenginapanSchema, type ProdukJasaInput, type KamarPenginapanInput } from "@/app/server/validators/produk";

export const ProdukService = {
  listMitraJasa: ProdukRepository.listMitraJasa,
  listMitraPenginapan: ProdukRepository.listMitraPenginapan,
  listProdukJasa: ProdukRepository.listProdukJasa,
  listKamarPenginapan: ProdukRepository.listKamarPenginapan,

  createProdukJasa(input: ProdukJasaInput) {
    const data = produkJasaSchema.parse(input);
    return ProdukRepository.createProdukJasa(data);
  },
  createKamarPenginapan(input: KamarPenginapanInput) {
    const data = kamarPenginapanSchema.parse(input);
    return ProdukRepository.createKamarPenginapan(data);
  },
};
