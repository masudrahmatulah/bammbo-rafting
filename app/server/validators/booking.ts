import { z } from "zod";

export const checkoutItemSchema = z.object({
  type: z.enum(["jasa", "kamar"]),
  id: z.string().uuid(),
  jumlah: z.coerce.number().int().positive(),
});

export const checkoutSchema = z
  .object({
    tanggalMulai: z.coerce.date(),
    tanggalSelesai: z.coerce.date(),
    items: z.array(checkoutItemSchema).min(1),
  })
  .refine((v) => v.tanggalSelesai >= v.tanggalMulai, {
    message: "Tanggal selesai harus setelah atau sama dengan tanggal mulai",
    path: ["tanggalSelesai"],
  });

export type CheckoutInput = z.infer<typeof checkoutSchema>;
