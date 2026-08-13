import { requireAdmin } from "@/app/lib/guards";
import { ProdukService } from "@/app/server/services/ProdukService";
import { ProdukJasaForm } from "./ProdukJasaForm";
import { PageHeader, Card, Table, Thead, Th, Tr, Td, EmptyRow, Badge } from "@/app/components/ui";

export default async function AdminProdukJasaPage() {
  await requireAdmin();
  const [produk, mitraOptions] = await Promise.all([
    ProdukService.listProdukJasa(),
    ProdukService.listMitraJasa(),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <PageHeader title="Kelola Produk Jasa" subtitle="Tambahkan atau pantau produk rafting & tubing mitra." />

      <Card className="mb-8">
        <ProdukJasaForm mitraOptions={mitraOptions.map((m) => ({ id: m.id, namaUsaha: m.namaUsaha }))} />
      </Card>

      <Table>
        <Thead>
          <Th>Nama</Th>
          <Th>Jenis</Th>
          <Th>Mitra</Th>
          <Th>Harga</Th>
          <Th>Kapasitas</Th>
          <Th>Status</Th>
        </Thead>
        <tbody>
          {produk.map((p) => (
            <Tr key={p.id}>
              <Td className="font-medium text-slate-900">{p.nama}</Td>
              <Td>{p.jenis === "rafting" ? "Rafting" : "River Tubing"}</Td>
              <Td>{p.mitraJasa.namaUsaha}</Td>
              <Td>{Number(p.hargaPerOrang).toLocaleString("id-ID")}</Td>
              <Td>{p.kapasitasPerHari}</Td>
              <Td>
                <Badge tone={p.aktif ? "teal" : "slate"}>{p.aktif ? "Aktif" : "Nonaktif"}</Badge>
              </Td>
            </Tr>
          ))}
          {produk.length === 0 && <EmptyRow colSpan={6}>Belum ada produk.</EmptyRow>}
        </tbody>
      </Table>
    </div>
  );
}
