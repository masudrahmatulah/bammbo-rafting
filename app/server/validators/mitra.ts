import { z } from "zod";

export const registrasiMitraSchema = z.object({
  jenis: z.enum(["jasa", "penginapan"]),
  name: z.string().min(2).max(120),
  email: z.string().email().max(180),
  phone: z.string().max(20).optional(),
  password: z.string().min(8).max(100),
  namaUsaha: z.string().min(3).max(150),
  noKtpNib: z.string().min(5).max(30),
  noRekening: z.string().min(5).max(50),
});
export type RegistrasiMitraInput = z.infer<typeof registrasiMitraSchema>;

export const verifikasiMitraSchema = z.object({
  jenis: z.enum(["jasa", "penginapan"]),
  mitraId: z.string().uuid(),
  keputusan: z.enum(["AKTIF", "REJECTED"]),
});
export type VerifikasiMitraInput = z.infer<typeof verifikasiMitraSchema>;
