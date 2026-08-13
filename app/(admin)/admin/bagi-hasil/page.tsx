import { requireAdmin } from "@/app/lib/guards";
import { BagiHasilService } from "@/app/server/services/BagiHasilService";
import { markCairAction } from "./actions";

function formatRupiah(n: { toString(): string }) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
    Number(n.toString())
  );
}

function namaMitra(item: {
  produkJasa: { nama: string; mitraJasa: { namaUsaha: string } } | null;
  kamarPenginapan: { namaKamar: string; mitraPenginapan: { namaUsaha: string } } | null;
}) {
  if (item.produkJasa) return `${item.produkJasa.mitraJasa.namaUsaha} — ${item.produkJasa.nama}`;
  if (item.kamarPenginapan) return `${item.kamarPenginapan.mitraPenginapan.namaUsaha} — ${item.kamarPenginapan.namaKamar}`;
  return "-";
}

export default async function AdminBagiHasilPage() {
  await requireAdmin();
  await BagiHasilService.refreshSiapCair();
  const [siapCair, pending] = await Promise.all([
    BagiHasilService.listByStatus("SIAP_CAIR"),
    BagiHasilService.listByStatus("PENDING"),
  ]);

  return (
    <div className="mx-auto max-w-5xl py-12">
      <h1 className="text-2xl font-semibold">Kelola Pencairan Bagi Hasil</h1>

      <section className="mt-8">
        <h2 className="text-lg font-medium">Siap Dicairkan</h2>
        <table className="mt-3 w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Booking</th>
              <th>Mitra / Produk</th>
              <th>Porsi Mitra</th>
              <th>Porsi Platform</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {siapCair.map((bh) => (
              <tr key={bh.id} className="border-b">
                <td className="py-2 font-mono text-xs">{bh.bookingItem.booking.kodeBooking}</td>
                <td>{namaMitra(bh.bookingItem)}</td>
                <td>{formatRupiah(bh.porsiMitra)}</td>
                <td>{formatRupiah(bh.porsiPlatform)}</td>
                <td>
                  <form action={markCairAction}>
                    <input type="hidden" name="id" value={bh.id} />
                    <button type="submit" className="rounded bg-emerald-700 px-3 py-1 text-xs text-white">
                      Tandai Cair
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {siapCair.length === 0 && (
              <tr>
                <td colSpan={5} className="py-4 text-neutral-500">
                  Tidak ada entri siap cair.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-medium">Menunggu Tanggal Trip/Menginap</h2>
        <table className="mt-3 w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Booking</th>
              <th>Mitra / Produk</th>
              <th>Porsi Mitra</th>
              <th>Tanggal Selesai</th>
            </tr>
          </thead>
          <tbody>
            {pending.map((bh) => (
              <tr key={bh.id} className="border-b">
                <td className="py-2 font-mono text-xs">{bh.bookingItem.booking.kodeBooking}</td>
                <td>{namaMitra(bh.bookingItem)}</td>
                <td>{formatRupiah(bh.porsiMitra)}</td>
                <td>{bh.bookingItem.booking.tanggalSelesai.toLocaleDateString("id-ID")}</td>
              </tr>
            ))}
            {pending.length === 0 && (
              <tr>
                <td colSpan={4} className="py-4 text-neutral-500">
                  Tidak ada entri pending.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
