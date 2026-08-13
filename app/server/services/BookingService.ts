import { prisma } from "@/app/lib/prisma";
import { BookingRepository } from "@/app/server/repositories/BookingRepository";
import { BagiHasilService } from "@/app/server/services/BagiHasilService";
import { checkoutSchema, type CheckoutInput } from "@/app/server/validators/booking";
import { logger } from "@/app/lib/logger";
import type { Prisma } from "@prisma/client";

export class AvailabilityError extends Error {}
export class ProductNotFoundError extends Error {}
export class InvalidCancellationError extends Error {}

function toDateOnly(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function nightsBetween(mulai: Date, selesai: Date) {
  const ms = selesai.getTime() - mulai.getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

async function generateKodeBooking(tx: Prisma.TransactionClient) {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const prefix = `BR-${yyyy}${mm}${dd}`;
  const count = await BookingRepository.countBookingsToday(tx, prefix);
  return `${prefix}-${String(count + 1).padStart(4, "0")}`;
}

export const BookingService = {
  async createBooking(userId: string, input: CheckoutInput) {
    const data = checkoutSchema.parse(input);
    const tanggalMulai = toDateOnly(data.tanggalMulai);
    const tanggalSelesai = toDateOnly(data.tanggalSelesai);

    return prisma.$transaction(async (tx) => {
      const itemsToCreate: { produkJasaId?: string; kamarPenginapanId?: string; jumlah: number; subtotal: number }[] = [];
      let totalHarga = 0;

      for (const item of data.items) {
        if (item.type === "jasa") {
          const produk = await BookingRepository.getProdukJasa(tx, item.id);
          if (!produk || !produk.aktif) throw new ProductNotFoundError("Produk jasa tidak ditemukan");

          const terpakai = await BookingRepository.sumJasaTerpakai(tx, item.id, tanggalMulai);
          if (terpakai + item.jumlah > produk.kapasitasPerHari) {
            logger.warn("checkout_gagal_kapasitas_penuh", { produkJasaId: item.id, tanggal: tanggalMulai.toISOString() });
            throw new AvailabilityError(`Kapasitas "${produk.nama}" pada tanggal tersebut tidak cukup`);
          }

          const subtotal = Number(produk.hargaPerOrang) * item.jumlah;
          itemsToCreate.push({ produkJasaId: item.id, jumlah: item.jumlah, subtotal });
          totalHarga += subtotal;
        } else {
          const kamar = await BookingRepository.getKamarPenginapan(tx, item.id);
          if (!kamar || !kamar.aktif) throw new ProductNotFoundError("Kamar tidak ditemukan");

          const terpakai = await BookingRepository.sumKamarTerpakai(tx, item.id, tanggalMulai, tanggalSelesai);
          if (terpakai + item.jumlah > kamar.jumlahUnit) {
            logger.warn("checkout_gagal_kamar_penuh", { kamarPenginapanId: item.id, tanggalMulai: tanggalMulai.toISOString() });
            throw new AvailabilityError(`Kamar "${kamar.namaKamar}" pada tanggal tersebut tidak cukup`);
          }

          const malam = nightsBetween(tanggalMulai, tanggalSelesai);
          const subtotal = Number(kamar.hargaPerMalam) * item.jumlah * malam;
          itemsToCreate.push({ kamarPenginapanId: item.id, jumlah: item.jumlah, subtotal });
          totalHarga += subtotal;
        }
      }

      const kodeBooking = await generateKodeBooking(tx);

      const booking = await BookingRepository.createBookingWithItems(tx, {
        userId,
        kodeBooking,
        tanggalMulai,
        tanggalSelesai,
        totalHarga,
        items: itemsToCreate,
      });

      logger.info("booking_dibuat", { bookingId: booking.id, kodeBooking, userId, totalHarga });
      return booking;
    });
  },

  listByUser(userId: string) {
    return BookingRepository.listByUser(userId);
  },

  findByKodeBooking(kodeBooking: string) {
    return BookingRepository.findByKodeBooking(kodeBooking);
  },

  listForAdmin() {
    return BookingRepository.listAllForAdmin();
  },

  async cancelBooking(bookingId: string) {
    const booking = await prisma.booking.findUniqueOrThrow({ where: { id: bookingId } });
    if (booking.status !== "PENDING" && booking.status !== "CONFIRMED") {
      throw new InvalidCancellationError("Booking ini tidak bisa dibatalkan");
    }

    await BookingRepository.updateBookingStatus(bookingId, "CANCELLED");
    await BagiHasilService.voidForBooking(bookingId);
    logger.info("booking_dibatalkan", { bookingId });
  },
};
