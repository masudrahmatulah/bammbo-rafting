"use server";

import { revalidatePath } from "next/cache";
import { requireMitraJasa } from "@/app/lib/guards";
import { MitraService } from "@/app/server/services/MitraService";
import { MitraProdukService } from "@/app/server/services/MitraProdukService";
import { produkJasaSchema } from "@/app/server/validators/produk";

export type ProdukFormState = { error?: string };

export async function createOwnProdukJasaAction(
  _prevState: ProdukFormState,
  formData: FormData
): Promise<ProdukFormState> {
  const session = await requireMitraJasa();
  const mitra = await MitraService.getOwnMitraJasa((session.user as { id: string }).id);
  if (!mitra || mitra.statusVerifikasi !== "AKTIF") return { error: "Akun belum diverifikasi" };

  const parsed = produkJasaSchema.safeParse({
    mitraJasaId: mitra.id,
    nama: formData.get("nama"),
    jenis: formData.get("jenis"),
    hargaPerOrang: formData.get("hargaPerOrang"),
    kapasitasPerHari: formData.get("kapasitasPerHari"),
  });
  if (!parsed.success) return { error: "Data tidak valid" };

  await MitraProdukService.createJasa(mitra.id, {
    nama: parsed.data.nama,
    jenis: parsed.data.jenis,
    hargaPerOrang: parsed.data.hargaPerOrang,
    kapasitasPerHari: parsed.data.kapasitasPerHari,
  });

  revalidatePath("/mitra/produk");
  revalidatePath("/katalog");
  return {};
}

export async function toggleOwnProdukJasaAction(formData: FormData): Promise<void> {
  const session = await requireMitraJasa();
  const mitra = await MitraService.getOwnMitraJasa((session.user as { id: string }).id);
  if (!mitra) return;

  const produkId = String(formData.get("produkId"));
  const aktif = formData.get("aktif") === "true";
  await MitraProdukService.updateJasa(mitra.id, produkId, { aktif: !aktif });

  revalidatePath("/mitra/produk");
  revalidatePath("/katalog");
}
