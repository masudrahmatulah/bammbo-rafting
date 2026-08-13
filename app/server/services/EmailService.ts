import { sendEmail } from "@/app/lib/email";
import { BookingRepository } from "@/app/server/repositories/BookingRepository";
import { logger } from "@/app/lib/logger";

function formatRupiah(n: { toString(): string }) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
    Number(n.toString())
  );
}

function formatTanggal(d: Date) {
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export const EmailService = {
  async sendBookingConfirmation(bookingId: string) {
    const booking = await BookingRepository.getBookingDetailForEmail(bookingId);
    if (!booking) {
      logger.warn("email_konfirmasi_booking_tidak_ditemukan", { bookingId });
      return;
    }

    const itemsHtml = booking.items
      .map((item) => {
        const nama = item.produkJasa?.nama ?? item.kamarPenginapan?.namaKamar ?? "Item";
        return `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;">${nama}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;text-align:center;">${item.jumlah}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;text-align:right;">${formatRupiah(item.subtotal)}</td>
        </tr>`;
      })
      .join("");

    const html = `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#0f172a;">
        <h2 style="color:#0f766e;">Booking Terkonfirmasi 🎉</h2>
        <p>Halo ${booking.user.name},</p>
        <p>Pembayaran Anda telah kami terima. Berikut detail booking Anda:</p>
        <p style="margin:16px 0;">
          <strong>Kode Booking:</strong> ${booking.kodeBooking}<br/>
          <strong>Tanggal:</strong> ${formatTanggal(booking.tanggalMulai)} &mdash; ${formatTanggal(booking.tanggalSelesai)}
        </p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <thead>
            <tr style="text-align:left;color:#64748b;font-size:12px;text-transform:uppercase;">
              <th style="padding-bottom:8px;">Item</th>
              <th style="padding-bottom:8px;text-align:center;">Jumlah</th>
              <th style="padding-bottom:8px;text-align:right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <p style="margin-top:16px;font-size:16px;">
          <strong>Total: ${formatRupiah(booking.totalHarga)}</strong>
        </p>
        <p style="margin-top:24px;color:#64748b;font-size:13px;">
          Terima kasih telah memesan lewat Bammbo Rafting. Sampai jumpa di Loksado!
        </p>
      </div>
    `;

    await sendEmail({
      to: booking.user.email,
      subject: `Booking ${booking.kodeBooking} Terkonfirmasi - Bammbo Rafting`,
      html,
    });
  },
};
