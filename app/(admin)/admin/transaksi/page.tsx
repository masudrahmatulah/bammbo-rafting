import { requireAdmin } from "@/app/lib/guards";
import { BookingService } from "@/app/server/services/BookingService";
import { cancelBookingAction } from "./actions";

function formatRupiah(n: { toString(): string }) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
    Number(n.toString())
  );
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Menunggu Pembayaran",
  CONFIRMED: "Terkonfirmasi",
  EXPIRED: "Kedaluwarsa",
  CANCELLED: "Dibatalkan",
};

export default async function AdminTransaksiPage() {
  await requireAdmin();
  const bookings = await BookingService.listForAdmin();

  return (
    <div className="mx-auto max-w-5xl py-12">
      <h1 className="text-2xl font-semibold">Monitor Transaksi</h1>
      <table className="mt-6 w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2">Kode</th>
            <th>Wisatawan</th>
            <th>Tanggal</th>
            <th>Total</th>
            <th>Status</th>
            <th>Pembayaran</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="border-b">
              <td className="py-2 font-mono text-xs">{b.kodeBooking}</td>
              <td>{b.user.name}</td>
              <td>{b.tanggalMulai.toLocaleDateString("id-ID")}</td>
              <td>{formatRupiah(b.totalHarga)}</td>
              <td>{STATUS_LABEL[b.status] ?? b.status}</td>
              <td>{b.pembayaran?.status ?? "-"}</td>
              <td>
                {(b.status === "PENDING" || b.status === "CONFIRMED") && (
                  <form action={cancelBookingAction}>
                    <input type="hidden" name="bookingId" value={b.id} />
                    <button type="submit" className="text-xs text-red-600 underline">
                      Batalkan
                    </button>
                  </form>
                )}
              </td>
            </tr>
          ))}
          {bookings.length === 0 && (
            <tr>
              <td colSpan={7} className="py-4 text-neutral-500">
                Belum ada transaksi.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
