"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/app/lib/guards";
import { ProdukService } from "@/app/server/services/ProdukService";

export type KamarFormState = { error?: string };

export async function createKamarAction(
  _prevState: KamarFormState,
  formData: FormData
): Promise<KamarFormState> {
  await requireAdmin();

  try {
    await ProdukService.createKamarPenginapan({
      mitraPenginapanId: String(formData.get("mitraPenginapanId")),
      namaKamar: String(formData.get("namaKamar")),
      hargaPerMalam: Number(formData.get("hargaPerMalam")),
      kapasitasKamar: Number(formData.get("kapasitasKamar")),
      jumlahUnit: Number(formData.get("jumlahUnit")),
    });
  } catch {
    return { error: "Data tidak valid" };
  }

  revalidatePath("/admin/kamar");
  revalidatePath("/katalog");
  return {};
}
