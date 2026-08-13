import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { BookingService } from "@/app/server/services/BookingService";

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

export default async function RiwayatPage() {
  const session = await auth();
  if (!session?.user) redirect("/masuk");

  const bookings = await BookingService.listByUser((session.user as { id: string }).id);

  return (
    <div className="mx-auto max-w-3xl py-12">
      <h1 className="text-2xl font-semibold">Riwayat Booking</h1>
      <div className="mt-6 space-y-4">
        {bookings.map((b) => (
          <div key={b.id} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm">{b.kodeBooking}</span>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium">
                {STATUS_LABEL[b.status] ?? b.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-neutral-600">
              {b.tanggalMulai.toLocaleDateString("id-ID")} &ndash; {b.tanggalSelesai.toLocaleDateString("id-ID")}
            </p>
            <p className="mt-1 font-semibold">{formatRupiah(b.totalHarga)}</p>
          </div>
        ))}
        {bookings.length === 0 && <p className="text-neutral-500">Belum ada booking.</p>}
      </div>
    </div>
  );
}
