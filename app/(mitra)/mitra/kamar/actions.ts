"use server";

import { revalidatePath } from "next/cache";
import { requireMitraPenginapan } from "@/app/lib/guards";
import { MitraService } from "@/app/server/services/MitraService";
import { MitraProdukService } from "@/app/server/services/MitraProdukService";
import { kamarPenginapanSchema } from "@/app/server/validators/produk";

export type KamarFormState = { error?: string };

export async function createOwnKamarAction(
  _prevState: KamarFormState,
  formData: FormData
): Promise<KamarFormState> {
  const session = await requireMitraPenginapan();
  const mitra = await MitraService.getOwnMitraPenginapan((session.user as { id: string }).id);
  if (!mitra || mitra.statusVerifikasi !== "AKTIF") return { error: "Akun belum diverifikasi" };

  const parsed = kamarPenginapanSchema.safeParse({
    mitraPenginapanId: mitra.id,
    namaKamar: formData.get("namaKamar"),
    hargaPerMalam: formData.get("hargaPerMalam"),
    kapasitasKamar: formData.get("kapasitasKamar"),
    jumlahUnit: formData.get("jumlahUnit"),
  });
  if (!parsed.success) return { error: "Data tidak valid" };

  await MitraProdukService.createKamar(mitra.id, {
    namaKamar: parsed.data.namaKamar,
    hargaPerMalam: parsed.data.hargaPerMalam,
    kapasitasKamar: parsed.data.kapasitasKamar,
    jumlahUnit: parsed.data.jumlahUnit,
  });

  revalidatePath("/mitra/kamar");
  revalidatePath("/katalog");
  return {};
}

export async function toggleOwnKamarAction(formData: FormData): Promise<void> {
  const session = await requireMitraPenginapan();
  const mitra = await MitraService.getOwnMitraPenginapan((session.user as { id: string }).id);
  if (!mitra) return;

  const kamarId = String(formData.get("kamarId"));
  const aktif = formData.get("aktif") === "true";
  await MitraProdukService.updateKamar(mitra.id, kamarId, { aktif: !aktif });

  revalidatePath("/mitra/kamar");
  revalidatePath("/katalog");
}
