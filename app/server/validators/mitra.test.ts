import { describe, it, expect } from "vitest";
import { registrasiMitraSchema } from "./mitra";

const validInput = {
  jenis: "jasa" as const,
  name: "Budi",
  email: "budi@example.com",
  password: "RahasiaBudi123!",
  namaUsaha: "Budi Rafting Adventure",
  noKtpNib: "1234567890123456",
  noRekening: "9988776655",
};

describe("registrasiMitraSchema", () => {
  it("menerima pendaftaran mitra yang valid", () => {
    expect(registrasiMitraSchema.safeParse(validInput).success).toBe(true);
  });

  it("menolak email tidak valid", () => {
    const result = registrasiMitraSchema.safeParse({ ...validInput, email: "bukan-email" });
    expect(result.success).toBe(false);
  });

  it("menolak password terlalu pendek", () => {
    const result = registrasiMitraSchema.safeParse({ ...validInput, password: "short" });
    expect(result.success).toBe(false);
  });

  it("menolak jenis mitra di luar enum", () => {
    const result = registrasiMitraSchema.safeParse({ ...validInput, jenis: "lainnya" });
    expect(result.success).toBe(false);
  });
});
