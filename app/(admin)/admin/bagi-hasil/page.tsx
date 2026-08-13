import { requireAdmin } from "@/app/lib/guards";
import { BagiHasilService } from "@/app/server/services/BagiHasilService";
import { markCairAction } from "./actions";
import { PageHeader, Table, Thead, Th, Tr, Td, EmptyRow, btnPrimary } from "@/app/components/ui";

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
    <div className="mx-auto max-w-5xl px-4 py-12">
      <PageHeader title="Kelola Pencairan Bagi Hasil" subtitle="Cairkan porsi pendapatan mitra yang sudah siap." />

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Siap Dicairkan</h2>
        <Table>
          <Thead>
            <Th>Booking</Th>
            <Th>Mitra / Produk</Th>
            <Th>Porsi Mitra</Th>
            <Th>Porsi Platform</Th>
            <Th>Aksi</Th>
          </Thead>
          <tbody>
            {siapCair.map((bh) => (
              <Tr key={bh.id}>
                <Td className="font-mono text-xs text-slate-500">{bh.bookingItem.booking.kodeBooking}</Td>
                <Td>{namaMitra(bh.bookingItem)}</Td>
                <Td className="font-medium text-slate-900">{formatRupiah(bh.porsiMitra)}</Td>
                <Td>{formatRupiah(bh.porsiPlatform)}</Td>
                <Td>
                  <form action={markCairAction}>
                    <input type="hidden" name="id" value={bh.id} />
                    <button type="submit" className={`${btnPrimary} !py-1.5`}>
                      Tandai Cair
                    </button>
                  </form>
                </Td>
              </Tr>
            ))}
            {siapCair.length === 0 && <EmptyRow colSpan={5}>Tidak ada entri siap cair.</EmptyRow>}
          </tbody>
        </Table>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Menunggu Tanggal Trip/Menginap</h2>
        <Table>
          <Thead>
            <Th>Booking</Th>
            <Th>Mitra / Produk</Th>
            <Th>Porsi Mitra</Th>
            <Th>Tanggal Selesai</Th>
          </Thead>
          <tbody>
            {pending.map((bh) => (
              <Tr key={bh.id}>
                <Td className="font-mono text-xs text-slate-500">{bh.bookingItem.booking.kodeBooking}</Td>
                <Td>{namaMitra(bh.bookingItem)}</Td>
                <Td>{formatRupiah(bh.porsiMitra)}</Td>
                <Td>{bh.bookingItem.booking.tanggalSelesai.toLocaleDateString("id-ID")}</Td>
              </Tr>
            ))}
            {pending.length === 0 && <EmptyRow colSpan={4}>Tidak ada entri pending.</EmptyRow>}
          </tbody>
        </Table>
      </section>
    </div>
  );
}
