import { requireAdmin } from "@/app/lib/guards";
import { ProdukService } from "@/app/server/services/ProdukService";
import { KamarForm } from "./KamarForm";
import { PageHeader, Card, Table, Thead, Th, Tr, Td, EmptyRow, Badge } from "@/app/components/ui";

export default async function AdminKamarPage() {
  await requireAdmin();
  const [kamar, mitraOptions] = await Promise.all([
    ProdukService.listKamarPenginapan(),
    ProdukService.listMitraPenginapan(),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <PageHeader title="Kelola Kamar Penginapan" subtitle="Tambahkan atau pantau kamar penginapan mitra." />

      <Card className="mb-8">
        <KamarForm mitraOptions={mitraOptions.map((m) => ({ id: m.id, namaUsaha: m.namaUsaha }))} />
      </Card>

      <Table>
        <Thead>
          <Th>Nama Kamar</Th>
          <Th>Mitra</Th>
          <Th>Harga/Malam</Th>
          <Th>Kapasitas</Th>
          <Th>Unit</Th>
          <Th>Status</Th>
        </Thead>
        <tbody>
          {kamar.map((k) => (
            <Tr key={k.id}>
              <Td className="font-medium text-slate-900">{k.namaKamar}</Td>
              <Td>{k.mitraPenginapan.namaUsaha}</Td>
              <Td>{Number(k.hargaPerMalam).toLocaleString("id-ID")}</Td>
              <Td>{k.kapasitasKamar}</Td>
              <Td>{k.jumlahUnit}</Td>
              <Td>
                <Badge tone={k.aktif ? "teal" : "slate"}>{k.aktif ? "Aktif" : "Nonaktif"}</Badge>
              </Td>
            </Tr>
          ))}
          {kamar.length === 0 && <EmptyRow colSpan={6}>Belum ada kamar.</EmptyRow>}
        </tbody>
      </Table>
    </div>
  );
}
