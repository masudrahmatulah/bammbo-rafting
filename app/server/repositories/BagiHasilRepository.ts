import { prisma } from "@/app/lib/prisma";
import type { Prisma, StatusBagiHasil } from "@prisma/client";

export const BagiHasilRepository = {
  async getBookingItemsForBooking(tx: Prisma.TransactionClient, bookingId: string) {
    return tx.bookingItem.findMany({
      where: { bookingId },
      include: {
        produkJasa: { include: { mitraJasa: true } },
        kamarPenginapan: { include: { mitraPenginapan: true } },
        bagiHasil: true,
      },
    });
  },

  createEntry(
    tx: Prisma.TransactionClient,
    data: { bookingItemId: string; porsiPlatform: number; porsiMitra: number }
  ) {
    return tx.bagiHasil.create({ data });
  },

  async setSiapCairForLapsedBookings() {
    const now = new Date();
    return prisma.bagiHasil.updateMany({
      where: {
        status: "PENDING",
        bookingItem: {
          booking: { status: "CONFIRMED", tanggalSelesai: { lt: now } },
        },
      },
      data: { status: "SIAP_CAIR" },
    });
  },

  voidForBooking(tx: Prisma.TransactionClient, bookingId: string) {
    return tx.bagiHasil.updateMany({
      where: {
        status: { in: ["PENDING", "SIAP_CAIR"] },
        bookingItem: { bookingId },
      },
      data: { status: "VOID" },
    });
  },

  markCair(id: string) {
    return prisma.bagiHasil.update({
      where: { id },
      data: { status: "CAIR", dicairkanAt: new Date() },
    });
  },

  getById(id: string) {
    return prisma.bagiHasil.findUnique({ where: { id } });
  },

  listByStatus(status: StatusBagiHasil) {
    return prisma.bagiHasil.findMany({
      where: { status },
      include: {
        bookingItem: {
          include: {
            booking: { select: { kodeBooking: true, tanggalMulai: true, tanggalSelesai: true } },
            produkJasa: { select: { nama: true, mitraJasaId: true, mitraJasa: { select: { namaUsaha: true } } } },
            kamarPenginapan: {
              select: { namaKamar: true, mitraPenginapanId: true, mitraPenginapan: { select: { namaUsaha: true } } },
            },
          },
        },
      },
      orderBy: { id: "asc" },
    });
  },

  listByMitraJasa(mitraJasaId: string) {
    return prisma.bagiHasil.findMany({
      where: { bookingItem: { produkJasa: { mitraJasaId } } },
      include: {
        bookingItem: {
          include: {
            booking: { select: { kodeBooking: true, tanggalMulai: true } },
            produkJasa: { select: { nama: true } },
          },
        },
      },
      orderBy: { id: "desc" },
    });
  },

  listByMitraPenginapan(mitraPenginapanId: string) {
    return prisma.bagiHasil.findMany({
      where: { bookingItem: { kamarPenginapan: { mitraPenginapanId } } },
      include: {
        bookingItem: {
          include: {
            booking: { select: { kodeBooking: true, tanggalMulai: true } },
            kamarPenginapan: { select: { namaKamar: true } },
          },
        },
      },
      orderBy: { id: "desc" },
    });
  },
};
