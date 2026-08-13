import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { BookingService } from "@/app/server/services/BookingService";

function formatRupiah(n: { toString(): string }) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
    Number(n.toString())
  );
}

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-teal-50 text-teal-700",
  EXPIRED: "bg-slate-100 text-slate-500",
  CANCELLED: "bg-red-50 text-red-700",
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Menunggu Pembayaran",
  CONFIRMED: "Terkonfirmasi",
  EXPIRED: "Kedaluwarsa",
  CANCELLED: "Dibatalkan",
};

export default async function RiwayatPage() {
  const session = await auth();
  if (!session?.user) redirect("/masuk");

  const bookings = await BookingService.listByUser((session.user as { id: string }).id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Riwayat Booking</h1>
      <div className="mt-6 space-y-4">
        {bookings.map((b) => (
          <div key={b.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-slate-500">{b.kodeBooking}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[b.status] ?? "bg-slate-100 text-slate-600"}`}>
                {STATUS_LABEL[b.status] ?? b.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              {b.tanggalMulai.toLocaleDateString("id-ID")} &ndash; {b.tanggalSelesai.toLocaleDateString("id-ID")}
            </p>
            <p className="mt-1 text-lg font-bold text-slate-900">{formatRupiah(b.totalHarga)}</p>
          </div>
        ))}
        {bookings.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center text-slate-400">
            Belum ada booking.
          </p>
        )}
      </div>
    </div>
  );
}
