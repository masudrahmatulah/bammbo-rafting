import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { MitraService } from "@/app/server/services/MitraService";
import { BagiHasilService } from "@/app/server/services/BagiHasilService";
import { PageHeader, Card, Table, Thead, Th, Tr, Td, EmptyRow, Badge } from "@/app/components/ui";

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

const STATUS_TONE: Record<string, "amber" | "teal" | "slate" | "red"> = {
  PENDING: "slate",
  SIAP_CAIR: "amber",
  CAIR: "teal",
  VOID: "red",
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
    <div className="mx-auto max-w-3xl px-4 py-12">
      <PageHeader title="Pendapatan Saya" subtitle="Riwayat porsi bagi hasil dari setiap booking." />

      <Card className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total Sudah Dicairkan</p>
        <p className="mt-1 text-3xl font-bold text-teal-700">{formatRupiah(totalCair)}</p>
      </Card>

      <Table>
        <Thead>
          <Th>Booking</Th>
          <Th>Produk</Th>
          <Th>Porsi Saya</Th>
          <Th>Status</Th>
        </Thead>
        <tbody>
          {entries.map((e) => (
            <Tr key={e.id}>
              <Td className="font-mono text-xs text-slate-500">{e.bookingItem.booking.kodeBooking}</Td>
              <Td>
                {"produkJasa" in e.bookingItem
                  ? (e.bookingItem as { produkJasa?: { nama: string } }).produkJasa?.nama
                  : (e.bookingItem as { kamarPenginapan?: { namaKamar: string } }).kamarPenginapan?.namaKamar}
              </Td>
              <Td className="font-medium text-slate-900">{formatRupiah(e.porsiMitra)}</Td>
              <Td>
                <Badge tone={STATUS_TONE[e.status] ?? "slate"}>{STATUS_LABEL[e.status] ?? e.status}</Badge>
              </Td>
            </Tr>
          ))}
          {entries.length === 0 && <EmptyRow colSpan={4}>Belum ada pendapatan.</EmptyRow>}
        </tbody>
      </Table>
    </div>
  );
}
