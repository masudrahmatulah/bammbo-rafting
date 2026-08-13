import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/app/lib/prisma", () => ({
  prisma: {
    $transaction: (fn: (tx: unknown) => unknown) => fn({}),
  },
}));

vi.mock("@/app/server/repositories/BookingRepository", () => ({
  BookingRepository: {
    getProdukJasa: vi.fn(),
    getKamarPenginapan: vi.fn(),
    sumJasaTerpakai: vi.fn(),
    sumKamarTerpakai: vi.fn(),
    countBookingsToday: vi.fn(),
    createBookingWithItems: vi.fn(),
  },
}));

vi.mock("@/app/server/services/BagiHasilService", () => ({
  BagiHasilService: { voidForBooking: vi.fn() },
}));

const { BookingRepository } = await import("@/app/server/repositories/BookingRepository");
const { BookingService, AvailabilityError, ProductNotFoundError } = await import("./BookingService");

const produkId = "11111111-1111-1111-1111-111111111111";

describe("BookingService.createBooking — cegah double-booking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("menolak booking saat kapasitas produk jasa sudah penuh", async () => {
    (BookingRepository.getProdukJasa as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: produkId,
      nama: "Rafting Bambu",
      hargaPerOrang: 100000,
      kapasitasPerHari: 5,
      aktif: true,
    });
    (BookingRepository.sumJasaTerpakai as ReturnType<typeof vi.fn>).mockResolvedValue(5);

    await expect(
      BookingService.createBooking("user-1", {
        tanggalMulai: new Date("2026-09-01"),
        tanggalSelesai: new Date("2026-09-01"),
        items: [{ type: "jasa", id: produkId, jumlah: 1 }],
      })
    ).rejects.toBeInstanceOf(AvailabilityError);
  });

  it("mengizinkan booking saat slot tersedia (kapasitas belum penuh)", async () => {
    (BookingRepository.getProdukJasa as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: produkId,
      nama: "Rafting Bambu",
      hargaPerOrang: 100000,
      kapasitasPerHari: 5,
      aktif: true,
    });
    (BookingRepository.sumJasaTerpakai as ReturnType<typeof vi.fn>).mockResolvedValue(2);
    (BookingRepository.countBookingsToday as ReturnType<typeof vi.fn>).mockResolvedValue(0);
    (BookingRepository.createBookingWithItems as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "booking-1",
      kodeBooking: "BR-20260901-0001",
      status: "PENDING",
      totalHarga: 200000,
    });

    const booking = await BookingService.createBooking("user-1", {
      tanggalMulai: new Date("2026-09-01"),
      tanggalSelesai: new Date("2026-09-01"),
      items: [{ type: "jasa", id: produkId, jumlah: 2 }],
    });

    expect(booking.kodeBooking).toBe("BR-20260901-0001");
  });

  it("menolak jika produk tidak ditemukan / nonaktif", async () => {
    (BookingRepository.getProdukJasa as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    await expect(
      BookingService.createBooking("user-1", {
        tanggalMulai: new Date("2026-09-01"),
        tanggalSelesai: new Date("2026-09-01"),
        items: [{ type: "jasa", id: produkId, jumlah: 1 }],
      })
    ).rejects.toBeInstanceOf(ProductNotFoundError);
  });
});
