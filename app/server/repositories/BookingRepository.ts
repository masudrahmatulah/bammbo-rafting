import { prisma } from "@/app/lib/prisma";
import type { Prisma, StatusBooking, StatusPembayaran } from "@prisma/client";

const HELD_STATUSES: StatusBooking[] = ["PENDING", "CONFIRMED"];

export const BookingRepository = {
  getProdukJasa(tx: Prisma.TransactionClient, id: string) {
    return tx.produkJasa.findUnique({ where: { id } });
  },
  getKamarPenginapan(tx: Prisma.TransactionClient, id: string) {
    return tx.kamarPenginapan.findUnique({ where: { id } });
  },

  async sumJasaTerpakai(tx: Prisma.TransactionClient, produkJasaId: string, tanggal: Date) {
    const result = await tx.bookingItem.aggregate({
      _sum: { jumlah: true },
      where: {
        produkJasaId,
        booking: {
          status: { in: HELD_STATUSES },
          tanggalMulai: tanggal,
        },
      },
    });
    return result._sum.jumlah ?? 0;
  },

  async sumKamarTerpakai(tx: Prisma.TransactionClient, kamarPenginapanId: string, mulai: Date, selesai: Date) {
    const result = await tx.bookingItem.aggregate({
      _sum: { jumlah: true },
      where: {
        kamarPenginapanId,
        booking: {
          status: { in: HELD_STATUSES },
          tanggalMulai: { lt: selesai },
          tanggalSelesai: { gt: mulai },
        },
      },
    });
    return result._sum.jumlah ?? 0;
  },

  countBookingsToday(tx: Prisma.TransactionClient, prefix: string) {
    return tx.booking.count({ where: { kodeBooking: { startsWith: prefix } } });
  },

  createBookingWithItems(
    tx: Prisma.TransactionClient,
    data: {
      userId: string;
      kodeBooking: string;
      tanggalMulai: Date;
      tanggalSelesai: Date;
      totalHarga: number;
      items: { produkJasaId?: string; kamarPenginapanId?: string; jumlah: number; subtotal: number }[];
    }
  ) {
    return tx.booking.create({
      data: {
        userId: data.userId,
        kodeBooking: data.kodeBooking,
        tanggalMulai: data.tanggalMulai,
        tanggalSelesai: data.tanggalSelesai,
        totalHarga: data.totalHarga,
        items: { create: data.items },
      },
      include: { items: true },
    });
  },

  createPembayaran(
    tx: Prisma.TransactionClient,
    data: { bookingId: string; midtransOrderId: string; jumlah: number }
  ) {
    return tx.pembayaran.create({ data });
  },

  findByKodeBooking(kodeBooking: string) {
    return prisma.booking.findUnique({ where: { kodeBooking }, include: { items: true, pembayaran: true } });
  },

  findPembayaranByOrderId(midtransOrderId: string) {
    return prisma.pembayaran.findUnique({ where: { midtransOrderId }, include: { booking: true } });
  },

  async updatePembayaranStatus(
    id: string,
    data: { status: StatusPembayaran; metode?: string | null; paidAt?: Date | null }
  ) {
    return prisma.pembayaran.update({ where: { id }, data });
  },

  async updateBookingStatus(id: string, status: StatusBooking) {
    return prisma.booking.update({ where: { id }, data: { status } });
  },

  listByUser(userId: string) {
    return prisma.booking.findMany({
      where: { userId },
      include: { items: true, pembayaran: true },
      orderBy: { createdAt: "desc" },
    });
  },

  listAllForAdmin() {
    return prisma.booking.findMany({
      include: {
        user: { select: { name: true, email: true, phone: true } },
        items: {
          include: {
            produkJasa: { select: { nama: true } },
            kamarPenginapan: { select: { namaKamar: true } },
          },
        },
        pembayaran: true,
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  },

  listBookingItemsByMitraJasa(mitraJasaId: string) {
    return prisma.bookingItem.findMany({
      where: { produkJasa: { mitraJasaId } },
      include: {
        produkJasa: { select: { nama: true } },
        booking: { select: { kodeBooking: true, tanggalMulai: true, tanggalSelesai: true, status: true, user: { select: { name: true, email: true, phone: true } } } },
      },
      orderBy: { booking: { createdAt: "desc" } },
    });
  },

  listBookingItemsByMitraPenginapan(mitraPenginapanId: string) {
    return prisma.bookingItem.findMany({
      where: { kamarPenginapan: { mitraPenginapanId } },
      include: {
        kamarPenginapan: { select: { namaKamar: true } },
        booking: { select: { kodeBooking: true, tanggalMulai: true, tanggalSelesai: true, status: true, user: { select: { name: true, email: true, phone: true } } } },
      },
      orderBy: { booking: { createdAt: "desc" } },
    });
  },
};
