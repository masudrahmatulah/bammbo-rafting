import { redirect } from "next/navigation";
import { requireMitraJasa } from "@/app/lib/guards";
import { MitraService } from "@/app/server/services/MitraService";
import { MitraProdukService } from "@/app/server/services/MitraProdukService";
import { ProdukJasaMitraForm } from "./ProdukJasaMitraForm";
import { toggleOwnProdukJasaAction } from "./actions";

export default async function MitraProdukPage() {
  const session = await requireMitraJasa();
  const mitra = await MitraService.getOwnMitraJasa((session.user as { id: string }).id);
  if (!mitra) redirect("/mitra");
  if (mitra.statusVerifikasi !== "AKTIF") redirect("/mitra");

  const produk = await MitraProdukService.listOwnJasa(mitra.id);

  return (
    <div className="mx-auto max-w-3xl py-12">
      <h1 className="text-2xl font-semibold">Produk Jasa Saya</h1>

      <div className="mt-6 rounded-lg border p-4">
        <ProdukJasaMitraForm />
      </div>

      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2">Nama</th>
            <th>Jenis</th>
            <th>Harga</th>
            <th>Kapasitas</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {produk.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="py-2">{p.nama}</td>
              <td>{p.jenis}</td>
              <td>{Number(p.hargaPerOrang).toLocaleString("id-ID")}</td>
              <td>{p.kapasitasPerHari}</td>
              <td>{p.aktif ? "Aktif" : "Nonaktif"}</td>
              <td>
                <form action={toggleOwnProdukJasaAction}>
                  <input type="hidden" name="produkId" value={p.id} />
                  <input type="hidden" name="aktif" value={String(p.aktif)} />
                  <button type="submit" className="text-xs text-emerald-700 underline">
                    {p.aktif ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
