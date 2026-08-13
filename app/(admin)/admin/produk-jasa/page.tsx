import { requireAdmin } from "@/app/lib/guards";
import { ProdukService } from "@/app/server/services/ProdukService";
import { ProdukJasaForm } from "./ProdukJasaForm";

export default async function AdminProdukJasaPage() {
  await requireAdmin();
  const [produk, mitraOptions] = await Promise.all([
    ProdukService.listProdukJasa(),
    ProdukService.listMitraJasa(),
  ]);

  return (
    <div className="mx-auto max-w-4xl py-12">
      <h1 className="text-2xl font-semibold">Kelola Produk Jasa</h1>

      <div className="mt-6 rounded-lg border p-4">
        <ProdukJasaForm mitraOptions={mitraOptions.map((m) => ({ id: m.id, namaUsaha: m.namaUsaha }))} />
      </div>

      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2">Nama</th>
            <th>Jenis</th>
            <th>Mitra</th>
            <th>Harga</th>
            <th>Kapasitas</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {produk.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="py-2">{p.nama}</td>
              <td>{p.jenis}</td>
              <td>{p.mitraJasa.namaUsaha}</td>
              <td>{Number(p.hargaPerOrang).toLocaleString("id-ID")}</td>
              <td>{p.kapasitasPerHari}</td>
              <td>{p.aktif ? "Aktif" : "Nonaktif"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
