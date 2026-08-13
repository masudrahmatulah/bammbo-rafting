import Link from "next/link";
import { CatalogService } from "@/app/server/services/CatalogService";

function formatRupiah(n: { toString(): string }) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
    Number(n.toString())
  );
}

export default async function KatalogPage() {
  const [jasa, kamar] = await Promise.all([CatalogService.listJasa(), CatalogService.listPenginapan()]);

  return (
    <div className="mx-auto max-w-5xl py-12">
      <h1 className="text-3xl font-semibold">Katalog Bammbo Rafting</h1>
      <p className="mt-2 text-neutral-600">Rafting bambu, river tubing, dan penginapan di Loksado.</p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Jasa Rafting & Tubing</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {jasa.map((p) => (
            <Link
              key={p.id}
              href={`/katalog/jasa/${p.id}`}
              className="rounded-lg border p-4 hover:shadow-md transition"
            >
              <p className="text-xs uppercase text-emerald-700">{p.jenis === "rafting" ? "Rafting" : "River Tubing"}</p>
              <h3 className="mt-1 font-medium">{p.nama}</h3>
              <p className="text-sm text-neutral-500">{p.mitraJasa.namaUsaha}</p>
              <p className="mt-2 font-semibold">{formatRupiah(p.hargaPerOrang)} / orang</p>
            </Link>
          ))}
          {jasa.length === 0 && <p className="text-neutral-500">Belum ada produk jasa.</p>}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Penginapan</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {kamar.map((k) => (
            <Link
              key={k.id}
              href={`/katalog/penginapan/${k.id}`}
              className="rounded-lg border p-4 hover:shadow-md transition"
            >
              <h3 className="font-medium">{k.namaKamar}</h3>
              <p className="text-sm text-neutral-500">{k.mitraPenginapan.namaUsaha}</p>
              <p className="mt-2 font-semibold">{formatRupiah(k.hargaPerMalam)} / malam</p>
            </Link>
          ))}
          {kamar.length === 0 && <p className="text-neutral-500">Belum ada kamar penginapan.</p>}
        </div>
      </section>
    </div>
  );
}
