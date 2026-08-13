import { requireAdmin } from "@/app/lib/guards";
import { MitraService } from "@/app/server/services/MitraService";
import { VerifikasiButtons } from "./VerifikasiButtons";

export default async function AdminMitraPage() {
  await requireAdmin();
  const { jasa, penginapan } = await MitraService.listPending();

  return (
    <div className="mx-auto max-w-4xl py-12">
      <h1 className="text-2xl font-semibold">Verifikasi Mitra</h1>

      <section className="mt-8">
        <h2 className="text-lg font-medium">Mitra Jasa (Pending)</h2>
        <table className="mt-3 w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Usaha</th>
              <th>Penanggung Jawab</th>
              <th>Email</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {jasa.map((m) => (
              <tr key={m.id} className="border-b">
                <td className="py-2">{m.namaUsaha}</td>
                <td>{m.user.name}</td>
                <td>{m.user.email}</td>
                <td>
                  <VerifikasiButtons jenis="jasa" mitraId={m.id} />
                </td>
              </tr>
            ))}
            {jasa.length === 0 && (
              <tr>
                <td colSpan={4} className="py-4 text-neutral-500">
                  Tidak ada pengajuan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-medium">Mitra Penginapan (Pending)</h2>
        <table className="mt-3 w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Usaha</th>
              <th>Penanggung Jawab</th>
              <th>Email</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {penginapan.map((m) => (
              <tr key={m.id} className="border-b">
                <td className="py-2">{m.namaUsaha}</td>
                <td>{m.user.name}</td>
                <td>{m.user.email}</td>
                <td>
                  <VerifikasiButtons jenis="penginapan" mitraId={m.id} />
                </td>
              </tr>
            ))}
            {penginapan.length === 0 && (
              <tr>
                <td colSpan={4} className="py-4 text-neutral-500">
                  Tidak ada pengajuan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
