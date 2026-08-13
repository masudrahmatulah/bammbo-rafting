import { requireAdmin } from "@/app/lib/guards";
import { MitraService } from "@/app/server/services/MitraService";
import { VerifikasiButtons } from "./VerifikasiButtons";
import { PageHeader, Table, Thead, Th, Tr, Td, EmptyRow } from "@/app/components/ui";

export default async function AdminMitraPage() {
  await requireAdmin();
  const { jasa, penginapan } = await MitraService.listPending();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <PageHeader title="Verifikasi Mitra" subtitle="Tinjau dan setujui/tolak pendaftaran mitra baru." />

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Mitra Jasa — Pending</h2>
        <Table>
          <Thead>
            <Th>Usaha</Th>
            <Th>Penanggung Jawab</Th>
            <Th>Email</Th>
            <Th>Aksi</Th>
          </Thead>
          <tbody>
            {jasa.map((m) => (
              <Tr key={m.id}>
                <Td className="font-medium text-slate-900">{m.namaUsaha}</Td>
                <Td>{m.user.name}</Td>
                <Td>{m.user.email}</Td>
                <Td>
                  <VerifikasiButtons jenis="jasa" mitraId={m.id} />
                </Td>
              </Tr>
            ))}
            {jasa.length === 0 && <EmptyRow colSpan={4}>Tidak ada pengajuan.</EmptyRow>}
          </tbody>
        </Table>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Mitra Penginapan — Pending</h2>
        <Table>
          <Thead>
            <Th>Usaha</Th>
            <Th>Penanggung Jawab</Th>
            <Th>Email</Th>
            <Th>Aksi</Th>
          </Thead>
          <tbody>
            {penginapan.map((m) => (
              <Tr key={m.id}>
                <Td className="font-medium text-slate-900">{m.namaUsaha}</Td>
                <Td>{m.user.name}</Td>
                <Td>{m.user.email}</Td>
                <Td>
                  <VerifikasiButtons jenis="penginapan" mitraId={m.id} />
                </Td>
              </Tr>
            ))}
            {penginapan.length === 0 && <EmptyRow colSpan={4}>Tidak ada pengajuan.</EmptyRow>}
          </tbody>
        </Table>
      </section>
    </div>
  );
}
