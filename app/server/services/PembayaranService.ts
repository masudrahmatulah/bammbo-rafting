import { prisma } from "@/app/lib/prisma";
import { BookingRepository } from "@/app/server/repositories/BookingRepository";
import { MidtransService } from "@/app/server/services/MidtransService";
import { BagiHasilService } from "@/app/server/services/BagiHasilService";
import { EmailService } from "@/app/server/services/EmailService";
import { logger } from "@/app/lib/logger";

export const PembayaranService = {
  async initiatePayment(bookingId: string, customerName: string, customerEmail: string) {
    const booking = await prisma.booking.findUniqueOrThrow({ where: { id: bookingId } });

    const snap = await MidtransService.createSnapTransaction({
      orderId: booking.kodeBooking,
      grossAmount: Number(booking.totalHarga),
      customerName,
      customerEmail,
    });

    await prisma.pembayaran.create({
      data: {
        bookingId: booking.id,
        midtransOrderId: booking.kodeBooking,
        jumlah: booking.totalHarga,
        status: "PENDING",
      },
    });

    logger.info("pembayaran_diinisiasi", { bookingId: booking.id, orderId: booking.kodeBooking });
    return snap;
  },

  async handleWebhookNotification(payload: {
    order_id: string;
    status_code: string;
    gross_amount: string;
    signature_key: string;
    transaction_status: string;
    fraud_status?: string;
    payment_type?: string;
  }) {
    const validSignature = MidtransService.verifySignature({
      orderId: payload.order_id,
      statusCode: payload.status_code,
      grossAmount: payload.gross_amount,
      signatureKey: payload.signature_key,
    });

    logger.info("webhook_midtrans_diterima", {
      orderId: payload.order_id,
      transactionStatus: payload.transaction_status,
      signatureValid: validSignature,
    });

    if (!validSignature) {
      logger.error("webhook_midtrans_signature_invalid", { orderId: payload.order_id });
      return { ok: false as const, reason: "invalid_signature" as const };
    }

    const pembayaran = await BookingRepository.findPembayaranByOrderId(payload.order_id);
    if (!pembayaran) {
      logger.warn("webhook_midtrans_order_not_found", { orderId: payload.order_id });
      return { ok: false as const, reason: "order_not_found" as const };
    }

    const { transaction_status, fraud_status } = payload;

    if (transaction_status === "capture" || transaction_status === "settlement") {
      if (transaction_status === "capture" && fraud_status && fraud_status !== "accept") {
        logger.warn("webhook_midtrans_fraud_ditolak", { orderId: payload.order_id, fraudStatus: fraud_status });
        return { ok: true as const };
      }
      await BookingRepository.updatePembayaranStatus(pembayaran.id, {
        status: "PAID",
        metode: payload.payment_type ?? null,
        paidAt: new Date(),
      });
      await BookingRepository.updateBookingStatus(pembayaran.bookingId, "CONFIRMED");
      await BagiHasilService.createForBooking(pembayaran.bookingId);
      logger.info("booking_status_berubah", { bookingId: pembayaran.bookingId, status: "CONFIRMED" });

      try {
        await EmailService.sendBookingConfirmation(pembayaran.bookingId);
      } catch (err) {
        logger.error("email_konfirmasi_booking_gagal", {
          bookingId: pembayaran.bookingId,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    } else if (transaction_status === "pending") {
      await BookingRepository.updatePembayaranStatus(pembayaran.id, { status: "PENDING" });
    } else if (transaction_status === "expire") {
      await BookingRepository.updatePembayaranStatus(pembayaran.id, { status: "EXPIRED" });
      await BookingRepository.updateBookingStatus(pembayaran.bookingId, "EXPIRED");
      logger.warn("booking_status_berubah", { bookingId: pembayaran.bookingId, status: "EXPIRED" });
    } else if (transaction_status === "deny" || transaction_status === "cancel") {
      await BookingRepository.updatePembayaranStatus(pembayaran.id, { status: "FAILED" });
      await BookingRepository.updateBookingStatus(pembayaran.bookingId, "CANCELLED");
      logger.info("booking_status_berubah", { bookingId: pembayaran.bookingId, status: "CANCELLED" });
    }

    return { ok: true as const };
  },
};
