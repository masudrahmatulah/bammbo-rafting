"use server";

import { MitraService, DuplicateEmailError } from "@/app/server/services/MitraService";
import { registrasiMitraSchema } from "@/app/server/validators/mitra";

export type RegistrasiMitraFormState = { error?: string; success?: boolean };

export async function registrasiMitraAction(
  _prevState: RegistrasiMitraFormState,
  formData: FormData
): Promise<RegistrasiMitraFormState> {
  const parsed = registrasiMitraSchema.safeParse({
    jenis: formData.get("jenis"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    password: formData.get("password"),
    namaUsaha: formData.get("namaUsaha"),
    noKtpNib: formData.get("noKtpNib"),
    noRekening: formData.get("noRekening"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  try {
    await MitraService.register(parsed.data);
    return { success: true };
  } catch (err) {
    if (err instanceof DuplicateEmailError) return { error: err.message };
    return { error: "Terjadi kesalahan, coba lagi" };
  }
}
