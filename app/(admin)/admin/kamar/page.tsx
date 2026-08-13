import { requireAdmin } from "@/app/lib/guards";
import { ProdukService } from "@/app/server/services/ProdukService";
import { KamarForm } from "./KamarForm";

export default async function AdminKamarPage() {
  await requireAdmin();
  const [kamar, mitraOptions] = await Promise.all([
    ProdukService.listKamarPenginapan(),
    ProdukService.listMitraPenginapan(),
  ]);

  return (
    <div className="mx-auto max-w-4xl py-12">
      <h1 className="text-2xl font-semibold">Kelola Kamar Penginapan</h1>

      <div className="mt-6 rounded-lg border p-4">
        <KamarForm mitraOptions={mitraOptions.map((m) => ({ id: m.id, namaUsaha: m.namaUsaha }))} />
      </div>

      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2">Nama Kamar</th>
            <th>Mitra</th>
            <th>Harga/Malam</th>
            <th>Kapasitas</th>
            <th>Unit</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {kamar.map((k) => (
            <tr key={k.id} className="border-b">
              <td className="py-2">{k.namaKamar}</td>
              <td>{k.mitraPenginapan.namaUsaha}</td>
              <td>{Number(k.hargaPerMalam).toLocaleString("id-ID")}</td>
              <td>{k.kapasitasKamar}</td>
              <td>{k.jumlahUnit}</td>
              <td>{k.aktif ? "Aktif" : "Nonaktif"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
