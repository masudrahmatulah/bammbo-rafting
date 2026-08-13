import { redirect } from "next/navigation";
import { requireMitraPenginapan } from "@/app/lib/guards";
import { MitraService } from "@/app/server/services/MitraService";
import { MitraProdukService } from "@/app/server/services/MitraProdukService";
import { KamarMitraForm } from "./KamarMitraForm";
import { toggleOwnKamarAction } from "./actions";
import { PageHeader, Card, Table, Thead, Th, Tr, Td, EmptyRow, Badge, btnGhost } from "@/app/components/ui";

export default async function MitraKamarPage() {
  const session = await requireMitraPenginapan();
  const mitra = await MitraService.getOwnMitraPenginapan((session.user as { id: string }).id);
  if (!mitra) redirect("/mitra");
  if (mitra.statusVerifikasi !== "AKTIF") redirect("/mitra");

  const kamar = await MitraProdukService.listOwnKamar(mitra.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <PageHeader title="Kamar Saya" subtitle="Kelola kamar penginapan milik usaha Anda." />

      <Card className="mb-8">
        <KamarMitraForm />
      </Card>

      <Table>
        <Thead>
          <Th>Nama Kamar</Th>
          <Th>Harga/Malam</Th>
          <Th>Kapasitas</Th>
          <Th>Unit</Th>
          <Th>Status</Th>
          <Th>Aksi</Th>
        </Thead>
        <tbody>
          {kamar.map((k) => (
            <Tr key={k.id}>
              <Td className="font-medium text-slate-900">{k.namaKamar}</Td>
              <Td>{Number(k.hargaPerMalam).toLocaleString("id-ID")}</Td>
              <Td>{k.kapasitasKamar}</Td>
              <Td>{k.jumlahUnit}</Td>
              <Td>
                <Badge tone={k.aktif ? "teal" : "slate"}>{k.aktif ? "Aktif" : "Nonaktif"}</Badge>
              </Td>
              <Td>
                <form action={toggleOwnKamarAction}>
                  <input type="hidden" name="kamarId" value={k.id} />
                  <input type="hidden" name="aktif" value={String(k.aktif)} />
                  <button type="submit" className={btnGhost}>
                    {k.aktif ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                </form>
              </Td>
            </Tr>
          ))}
          {kamar.length === 0 && <EmptyRow colSpan={6}>Belum ada kamar.</EmptyRow>}
        </tbody>
      </Table>
    </div>
  );
}
