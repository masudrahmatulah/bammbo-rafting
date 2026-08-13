import { z } from "zod";

export const produkJasaSchema = z.object({
  mitraJasaId: z.string().uuid(),
  nama: z.string().min(3).max(150),
  jenis: z.enum(["rafting", "river_tubing"]),
  hargaPerOrang: z.coerce.number().positive(),
  kapasitasPerHari: z.coerce.number().int().positive(),
});
export type ProdukJasaInput = z.infer<typeof produkJasaSchema>;

export const kamarPenginapanSchema = z.object({
  mitraPenginapanId: z.string().uuid(),
  namaKamar: z.string().min(3).max(150),
  hargaPerMalam: z.coerce.number().positive(),
  kapasitasKamar: z.coerce.number().int().positive(),
  jumlahUnit: z.coerce.number().int().positive(),
});
export type KamarPenginapanInput = z.infer<typeof kamarPenginapanSchema>;
