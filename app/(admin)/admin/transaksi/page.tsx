import { requireAdmin } from "@/app/lib/guards";
import { BookingService } from "@/app/server/services/BookingService";
import { cancelBookingAction } from "./actions";
import { PageHeader, Table, Thead, Th, Tr, Td, EmptyRow, Badge, btnDanger } from "@/app/components/ui";

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

const STATUS_TONE: Record<string, "amber" | "teal" | "slate" | "red"> = {
  PENDING: "amber",
  CONFIRMED: "teal",
  EXPIRED: "slate",
  CANCELLED: "red",
};

export default async function AdminTransaksiPage() {
  await requireAdmin();
  const bookings = await BookingService.listForAdmin();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <PageHeader title="Monitor Transaksi" subtitle="Pantau seluruh booking dan status pembayarannya." />
      <Table>
        <Thead>
          <Th>Kode</Th>
          <Th>Wisatawan</Th>
          <Th>Tanggal</Th>
          <Th>Total</Th>
          <Th>Status</Th>
          <Th>Pembayaran</Th>
          <Th>Aksi</Th>
        </Thead>
        <tbody>
          {bookings.map((b) => (
            <Tr key={b.id}>
              <Td className="font-mono text-xs text-slate-500">{b.kodeBooking}</Td>
              <Td>{b.user.name}</Td>
              <Td>{b.tanggalMulai.toLocaleDateString("id-ID")}</Td>
              <Td className="font-medium text-slate-900">{formatRupiah(b.totalHarga)}</Td>
              <Td>
                <Badge tone={STATUS_TONE[b.status] ?? "slate"}>{STATUS_LABEL[b.status] ?? b.status}</Badge>
              </Td>
              <Td>{b.pembayaran?.status ?? "-"}</Td>
              <Td>
                {(b.status === "PENDING" || b.status === "CONFIRMED") && (
                  <form action={cancelBookingAction}>
                    <input type="hidden" name="bookingId" value={b.id} />
                    <button type="submit" className={btnDanger}>
                      Batalkan
                    </button>
                  </form>
                )}
              </Td>
            </Tr>
          ))}
          {bookings.length === 0 && <EmptyRow colSpan={7}>Belum ada transaksi.</EmptyRow>}
        </tbody>
      </Table>
    </div>
  );
}
