import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { MitraService } from "@/app/server/services/MitraService";
import { BookingService } from "@/app/server/services/BookingService";
import { PageHeader, Table, Thead, Th, Tr, Td, EmptyRow, Badge } from "@/app/components/ui";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Menunggu Pembayaran",
  CONFIRMED: "Terkonfirmasi",
  EXPIRED: "Kedaluwarsa",
  CANCELLED: "Dibatalkan",
};

const STATUS_TONE: Record<string, "amber" | "teal" | "slate" | "red"> = {
  PENDING: "amber",
  CONFIRMED: "teal",
  EXPIRED: "slate",
  CANCELLED: "red",
};

export default async function MitraKlienPage() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!session?.user || !userId) redirect("/masuk");
  if (role !== "mitra_jasa" && role !== "mitra_penginapan") redirect("/masuk");

  const isJasa = role === "mitra_jasa";
  const mitra = isJasa ? await MitraService.getOwnMitraJasa(userId) : await MitraService.getOwnMitraPenginapan(userId);
  if (!mitra) redirect("/mitra");

  const items = isJasa
    ? await BookingService.listClientsForMitraJasa(mitra.id)
    : await BookingService.listClientsForMitraPenginapan(mitra.id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <PageHeader title="Klien Booking" subtitle="Daftar wisatawan yang memesan produk/kamar Anda." />
      <Table>
        <Thead>
          <Th>Kode Booking</Th>
          <Th>Klien</Th>
          <Th>Kontak</Th>
          <Th>{isJasa ? "Produk" : "Kamar"}</Th>
          <Th>Tanggal</Th>
          <Th>Jumlah</Th>
          <Th>Status</Th>
        </Thead>
        <tbody>
          {items.map((item) => {
            const namaItem = isJasa
              ? (item as { produkJasa?: { nama: string } }).produkJasa?.nama
              : (item as { kamarPenginapan?: { namaKamar: string } }).kamarPenginapan?.namaKamar;
            return (
              <Tr key={item.id}>
                <Td className="font-mono text-xs text-slate-500">{item.booking.kodeBooking}</Td>
                <Td className="font-medium text-slate-900">{item.booking.user.name}</Td>
                <Td className="text-slate-600">
                  <div>{item.booking.user.email}</div>
                  {item.booking.user.phone && <div className="text-xs text-slate-400">{item.booking.user.phone}</div>}
                </Td>
                <Td>{namaItem ?? "-"}</Td>
                <Td>{item.booking.tanggalMulai.toLocaleDateString("id-ID")}</Td>
                <Td>{item.jumlah}</Td>
                <Td>
                  <Badge tone={STATUS_TONE[item.booking.status] ?? "slate"}>
                    {STATUS_LABEL[item.booking.status] ?? item.booking.status}
                  </Badge>
                </Td>
              </Tr>
            );
          })}
          {items.length === 0 && <EmptyRow colSpan={7}>Belum ada klien yang booking.</EmptyRow>}
        </tbody>
      </Table>
    </div>
  );
}
