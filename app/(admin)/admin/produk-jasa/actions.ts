"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/app/lib/guards";
import { ProdukService } from "@/app/server/services/ProdukService";

export type ProdukJasaFormState = { error?: string };

export async function createProdukJasaAction(
  _prevState: ProdukJasaFormState,
  formData: FormData
): Promise<ProdukJasaFormState> {
  await requireAdmin();

  try {
    await ProdukService.createProdukJasa({
      mitraJasaId: String(formData.get("mitraJasaId")),
      nama: String(formData.get("nama")),
      jenis: formData.get("jenis") as "rafting" | "river_tubing",
      hargaPerOrang: Number(formData.get("hargaPerOrang")),
      kapasitasPerHari: Number(formData.get("kapasitasPerHari")),
    });
  } catch {
    return { error: "Data tidak valid" };
  }

  revalidatePath("/admin/produk-jasa");
  revalidatePath("/katalog");
  return {};
}
