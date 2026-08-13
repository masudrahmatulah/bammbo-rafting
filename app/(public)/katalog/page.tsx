import Link from "next/link";
import { CatalogService } from "@/app/server/services/CatalogService";

function formatRupiah(n: { toString(): string }) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
    Number(n.toString())
  );
}

const JENIS_LABEL: Record<string, string> = {
  rafting: "Rafting",
  river_tubing: "River Tubing",
};

export default async function KatalogPage() {
  const [jasa, kamar] = await Promise.all([CatalogService.listJasa(), CatalogService.listPenginapan()]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Katalog Bammbo Rafting</h1>
        <p className="mt-3 text-slate-500">
          Pilih pengalaman rafting bambu, river tubing, dan penginapan terbaik di Loksado.
        </p>
      </div>

      <section className="mt-12">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-900">Jasa Rafting & Tubing</h2>
          <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700">{jasa.length}</span>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {jasa.map((p) => (
            <Link
              key={p.id}
              href={`/katalog/jasa/${p.id}`}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex h-32 items-center justify-center bg-gradient-to-br from-teal-500 to-emerald-500 text-5xl">
                {p.jenis === "rafting" ? "🚣" : "🛞"}
              </div>
              <div className="p-5">
                <span className="text-xs font-semibold uppercase tracking-wide text-teal-600">
                  {JENIS_LABEL[p.jenis] ?? p.jenis}
                </span>
                <h3 className="mt-1 font-semibold text-slate-900 group-hover:text-teal-700">{p.nama}</h3>
                <p className="mt-1 text-sm text-slate-500">{p.mitraJasa.namaUsaha}</p>
                <p className="mt-3 text-lg font-bold text-slate-900">
                  {formatRupiah(p.hargaPerOrang)} <span className="text-sm font-normal text-slate-400">/ orang</span>
                </p>
              </div>
            </Link>
          ))}
          {jasa.length === 0 && (
            <p className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center text-slate-400">
              Belum ada produk jasa.
            </p>
          )}
        </div>
      </section>

      <section className="mt-14">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-900">Penginapan</h2>
          <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700">{kamar.length}</span>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {kamar.map((k) => (
            <Link
              key={k.id}
              href={`/katalog/penginapan/${k.id}`}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex h-32 items-center justify-center bg-gradient-to-br from-amber-400 to-orange-400 text-5xl">
                🏡
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-slate-900 group-hover:text-teal-700">{k.namaKamar}</h3>
                <p className="mt-1 text-sm text-slate-500">{k.mitraPenginapan.namaUsaha}</p>
                <p className="mt-3 text-lg font-bold text-slate-900">
                  {formatRupiah(k.hargaPerMalam)} <span className="text-sm font-normal text-slate-400">/ malam</span>
                </p>
              </div>
            </Link>
          ))}
          {kamar.length === 0 && (
            <p className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center text-slate-400">
              Belum ada kamar penginapan.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
