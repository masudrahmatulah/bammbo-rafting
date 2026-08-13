import { redirect } from "next/navigation";
import { requireMitraPenginapan } from "@/app/lib/guards";
import { MitraService } from "@/app/server/services/MitraService";
import { MitraProdukService } from "@/app/server/services/MitraProdukService";
import { KamarMitraForm } from "./KamarMitraForm";
import { toggleOwnKamarAction } from "./actions";

export default async function MitraKamarPage() {
  const session = await requireMitraPenginapan();
  const mitra = await MitraService.getOwnMitraPenginapan((session.user as { id: string }).id);
  if (!mitra) redirect("/mitra");
  if (mitra.statusVerifikasi !== "AKTIF") redirect("/mitra");

  const kamar = await MitraProdukService.listOwnKamar(mitra.id);

  return (
    <div className="mx-auto max-w-3xl py-12">
      <h1 className="text-2xl font-semibold">Kamar Saya</h1>

      <div className="mt-6 rounded-lg border p-4">
        <KamarMitraForm />
      </div>

      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2">Nama Kamar</th>
            <th>Harga/Malam</th>
            <th>Kapasitas</th>
            <th>Unit</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {kamar.map((k) => (
            <tr key={k.id} className="border-b">
              <td className="py-2">{k.namaKamar}</td>
              <td>{Number(k.hargaPerMalam).toLocaleString("id-ID")}</td>
              <td>{k.kapasitasKamar}</td>
              <td>{k.jumlahUnit}</td>
              <td>{k.aktif ? "Aktif" : "Nonaktif"}</td>
              <td>
                <form action={toggleOwnKamarAction}>
                  <input type="hidden" name="kamarId" value={k.id} />
                  <input type="hidden" name="aktif" value={String(k.aktif)} />
                  <button type="submit" className="text-xs text-emerald-700 underline">
                    {k.aktif ? "Nonaktifkan" : "Aktifkan"}
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
