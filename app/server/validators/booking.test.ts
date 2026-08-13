import { describe, it, expect } from "vitest";
import { checkoutSchema } from "./booking";

describe("checkoutSchema", () => {
  it("menerima checkout jasa yang valid", () => {
    const result = checkoutSchema.safeParse({
      tanggalMulai: "2026-09-01",
      tanggalSelesai: "2026-09-01",
      items: [{ type: "jasa", id: "11111111-1111-1111-1111-111111111111", jumlah: 2 }],
    });
    expect(result.success).toBe(true);
  });

  it("menolak jika tanggal selesai sebelum tanggal mulai", () => {
    const result = checkoutSchema.safeParse({
      tanggalMulai: "2026-09-05",
      tanggalSelesai: "2026-09-01",
      items: [{ type: "jasa", id: "11111111-1111-1111-1111-111111111111", jumlah: 2 }],
    });
    expect(result.success).toBe(false);
  });

  it("menolak jumlah nol atau negatif", () => {
    const result = checkoutSchema.safeParse({
      tanggalMulai: "2026-09-01",
      tanggalSelesai: "2026-09-01",
      items: [{ type: "jasa", id: "11111111-1111-1111-1111-111111111111", jumlah: 0 }],
    });
    expect(result.success).toBe(false);
  });

  it("menolak items kosong", () => {
    const result = checkoutSchema.safeParse({
      tanggalMulai: "2026-09-01",
      tanggalSelesai: "2026-09-01",
      items: [],
    });
    expect(result.success).toBe(false);
  });

  it("menolak id produk yang bukan uuid", () => {
    const result = checkoutSchema.safeParse({
      tanggalMulai: "2026-09-01",
      tanggalSelesai: "2026-09-01",
      items: [{ type: "jasa", id: "bukan-uuid", jumlah: 1 }],
    });
    expect(result.success).toBe(false);
  });
});
