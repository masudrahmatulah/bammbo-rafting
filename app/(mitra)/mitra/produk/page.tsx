import { redirect } from "next/navigation";
import { requireMitraJasa } from "@/app/lib/guards";
import { MitraService } from "@/app/server/services/MitraService";
import { MitraProdukService } from "@/app/server/services/MitraProdukService";
import { ProdukJasaMitraForm } from "./ProdukJasaMitraForm";
import { toggleOwnProdukJasaAction } from "./actions";
import { PageHeader, Card, Table, Thead, Th, Tr, Td, EmptyRow, Badge, btnGhost } from "@/app/components/ui";

export default async function MitraProdukPage() {
  const session = await requireMitraJasa();
  const mitra = await MitraService.getOwnMitraJasa((session.user as { id: string }).id);
  if (!mitra) redirect("/mitra");
  if (mitra.statusVerifikasi !== "AKTIF") redirect("/mitra");

  const produk = await MitraProdukService.listOwnJasa(mitra.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <PageHeader title="Produk Jasa Saya" subtitle="Kelola produk rafting/tubing milik usaha Anda." />

      <Card className="mb-8">
        <ProdukJasaMitraForm />
      </Card>

      <Table>
        <Thead>
          <Th>Nama</Th>
          <Th>Jenis</Th>
          <Th>Harga</Th>
          <Th>Kapasitas</Th>
          <Th>Status</Th>
          <Th>Aksi</Th>
        </Thead>
        <tbody>
          {produk.map((p) => (
            <Tr key={p.id}>
              <Td className="font-medium text-slate-900">{p.nama}</Td>
              <Td>{p.jenis === "rafting" ? "Rafting" : "River Tubing"}</Td>
              <Td>{Number(p.hargaPerOrang).toLocaleString("id-ID")}</Td>
              <Td>{p.kapasitasPerHari}</Td>
              <Td>
                <Badge tone={p.aktif ? "teal" : "slate"}>{p.aktif ? "Aktif" : "Nonaktif"}</Badge>
              </Td>
              <Td>
                <form action={toggleOwnProdukJasaAction}>
                  <input type="hidden" name="produkId" value={p.id} />
                  <input type="hidden" name="aktif" value={String(p.aktif)} />
                  <button type="submit" className={btnGhost}>
                    {p.aktif ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                </form>
              </Td>
            </Tr>
          ))}
          {produk.length === 0 && <EmptyRow colSpan={6}>Belum ada produk.</EmptyRow>}
        </tbody>
      </Table>
    </div>
  );
}
