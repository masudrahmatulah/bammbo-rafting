import { describe, it, expect } from "vitest";
import { hitungPorsi } from "./BagiHasilService";

describe("hitungPorsi", () => {
  it("membagi 85/15 sesuai default persentase mitra", () => {
    const { porsiMitra, porsiPlatform } = hitungPorsi(400000, 85);
    expect(porsiMitra).toBe(340000);
    expect(porsiPlatform).toBe(60000);
  });

  it("total porsi selalu sama dengan subtotal", () => {
    const subtotal = 123456.78;
    const { porsiMitra, porsiPlatform } = hitungPorsi(subtotal, 72.5);
    expect(Math.round((porsiMitra + porsiPlatform) * 100) / 100).toBe(subtotal);
  });

  it("menangani persentase 100% (semua ke mitra)", () => {
    const { porsiMitra, porsiPlatform } = hitungPorsi(100000, 100);
    expect(porsiMitra).toBe(100000);
    expect(porsiPlatform).toBe(0);
  });

  it("menangani persentase 0% (semua ke platform)", () => {
    const { porsiMitra, porsiPlatform } = hitungPorsi(100000, 0);
    expect(porsiMitra).toBe(0);
    expect(porsiPlatform).toBe(100000);
  });

  it("membulatkan ke 2 desimal untuk nilai pecahan rupiah", () => {
    const { porsiMitra } = hitungPorsi(99999, 85);
    expect(porsiMitra).toBeCloseTo(84999.15, 2);
  });
});
