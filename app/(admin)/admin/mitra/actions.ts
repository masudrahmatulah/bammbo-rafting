"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/app/lib/guards";
import { MitraService } from "@/app/server/services/MitraService";
import { verifikasiMitraSchema } from "@/app/server/validators/mitra";

export type VerifikasiFormState = { error?: string };

export async function verifikasiMitraAction(
  _prevState: VerifikasiFormState,
  formData: FormData
): Promise<VerifikasiFormState> {
  await requireAdmin();

  const parsed = verifikasiMitraSchema.safeParse({
    jenis: formData.get("jenis"),
    mitraId: formData.get("mitraId"),
    keputusan: formData.get("keputusan"),
  });

  if (!parsed.success) return { error: "Data tidak valid" };

  await MitraService.verifikasi(parsed.data.jenis, parsed.data.mitraId, parsed.data.keputusan);
  revalidatePath("/admin/mitra");
  return {};
}
