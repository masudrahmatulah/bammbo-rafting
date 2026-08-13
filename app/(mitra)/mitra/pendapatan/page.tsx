import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { MitraService } from "@/app/server/services/MitraService";
import { BagiHasilService } from "@/app/server/services/BagiHasilService";

function formatRupiah(n: { toString(): string }) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
    Number(n.toString())
  );
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Menunggu Trip/Menginap",
  SIAP_CAIR: "Siap Dicairkan",
  CAIR: "Sudah Dicairkan",
  VOID: "Dibatalkan",
};

export default async function MitraPendapatanPage() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!session?.user || !userId) redirect("/masuk");
  if (role !== "mitra_jasa" && role !== "mitra_penginapan") redirect("/masuk");

  const isJasa = role === "mitra_jasa";
  const mitra = isJasa ? await MitraService.getOwnMitraJasa(userId) : await MitraService.getOwnMitraPenginapan(userId);
  if (!mitra) redirect("/mitra");

  const entries = isJasa
    ? await BagiHasilService.listOwnByMitraJasa(mitra.id)
    : await BagiHasilService.listOwnByMitraPenginapan(mitra.id);

  const totalCair = entries.filter((e) => e.status === "CAIR").reduce((sum, e) => sum + Number(e.porsiMitra), 0);

  return (
    <div className="mx-auto max-w-3xl py-12">
      <h1 className="text-2xl font-semibold">Pendapatan Saya</h1>
      <p className="mt-1 text-neutral-600">Total sudah dicairkan: {formatRupiah(totalCair)}</p>

      <table className="mt-6 w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2">Booking</th>
            <th>Produk</th>
            <th>Porsi Saya</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.id} className="border-b">
              <td className="py-2 font-mono text-xs">{e.bookingItem.booking.kodeBooking}</td>
              <td>
                {"produkJasa" in e.bookingItem
                  ? (e.bookingItem as { produkJasa?: { nama: string } }).produkJasa?.nama
                  : (e.bookingItem as { kamarPenginapan?: { namaKamar: string } }).kamarPenginapan?.namaKamar}
              </td>
              <td>{formatRupiah(e.porsiMitra)}</td>
              <td>{STATUS_LABEL[e.status] ?? e.status}</td>
            </tr>
          ))}
          {entries.length === 0 && (
            <tr>
              <td colSpan={4} className="py-4 text-neutral-500">
                Belum ada pendapatan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
