import { prisma } from "@/app/lib/prisma";
import { BagiHasilRepository } from "@/app/server/repositories/BagiHasilRepository";
import { logger } from "@/app/lib/logger";

export class InvalidTransitionError extends Error {}

export function hitungPorsi(subtotal: number, persentaseMitra: number) {
  const porsiMitra = Math.round(subtotal * (persentaseMitra / 100) * 100) / 100;
  const porsiPlatform = Math.round((subtotal - porsiMitra) * 100) / 100;
  return { porsiMitra, porsiPlatform };
}

export const BagiHasilService = {
  async createForBooking(bookingId: string) {
    return prisma.$transaction(async (tx) => {
      const items = await BagiHasilRepository.getBookingItemsForBooking(tx, bookingId);

      for (const item of items) {
        if (item.bagiHasil) continue;

        const persentaseMitra = item.produkJasa
          ? Number(item.produkJasa.mitraJasa.persentaseBagiHasil)
          : item.kamarPenginapan
            ? Number(item.kamarPenginapan.mitraPenginapan.persentaseBagiHasil)
            : null;

        if (persentaseMitra === null) continue;

        const subtotal = Number(item.subtotal);
        const { porsiMitra, porsiPlatform } = hitungPorsi(subtotal, persentaseMitra);

        await BagiHasilRepository.createEntry(tx, {
          bookingItemId: item.id,
          porsiPlatform,
          porsiMitra,
        });
        logger.info("bagi_hasil_dihitung", { bookingItemId: item.id, porsiMitra, porsiPlatform });
      }
    });
  },

  refreshSiapCair() {
    return BagiHasilRepository.setSiapCairForLapsedBookings();
  },

  voidForBooking(bookingId: string) {
    return prisma.$transaction((tx) => BagiHasilRepository.voidForBooking(tx, bookingId));
  },

  async markCair(id: string) {
    const entry = await BagiHasilRepository.getById(id);
    if (!entry || entry.status !== "SIAP_CAIR") {
      throw new InvalidTransitionError("Hanya entri berstatus SIAP_CAIR yang bisa dicairkan");
    }
    const updated = await BagiHasilRepository.markCair(id);
    logger.info("bagi_hasil_dicairkan", { bagiHasilId: id, porsiMitra: updated.porsiMitra.toString() });
    return updated;
  },

  listByStatus(status: "PENDING" | "SIAP_CAIR" | "CAIR" | "VOID") {
    return BagiHasilRepository.listByStatus(status);
  },

  listOwnByMitraJasa(mitraJasaId: string) {
    return BagiHasilRepository.listByMitraJasa(mitraJasaId);
  },
  listOwnByMitraPenginapan(mitraPenginapanId: string) {
    return BagiHasilRepository.listByMitraPenginapan(mitraPenginapanId);
  },
};
