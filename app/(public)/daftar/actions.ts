"use server";

import { AuthService, DuplicateEmailError } from "@/app/server/services/AuthService";
import { registerSchema } from "@/app/server/validators/auth";

export type RegisterFormState = { error?: string; success?: boolean };

export async function registerAction(
  _prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  try {
    await AuthService.register(parsed.data);
    return { success: true };
  } catch (err) {
    if (err instanceof DuplicateEmailError) return { error: err.message };
    return { error: "Terjadi kesalahan, coba lagi" };
  }
}
