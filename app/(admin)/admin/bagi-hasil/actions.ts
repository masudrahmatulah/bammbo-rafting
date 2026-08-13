"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/app/lib/guards";
import { BagiHasilService } from "@/app/server/services/BagiHasilService";

export async function markCairAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id"));

  try {
    await BagiHasilService.markCair(id);
  } catch {
    // status entri berubah sebelum aksi ini diproses — abaikan, UI refresh menampilkan status terkini
  }

  revalidatePath("/admin/bagi-hasil");
}
