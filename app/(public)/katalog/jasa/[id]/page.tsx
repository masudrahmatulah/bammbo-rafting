import { notFound } from "next/navigation";
import { CatalogService } from "@/app/server/services/CatalogService";
import { CheckoutForm } from "@/app/(public)/checkout/CheckoutForm";

function formatRupiah(n: { toString(): string }) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
    Number(n.toString())
  );
}

export default async function ProdukJasaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const produk = await CatalogService.getJasa(id);
  if (!produk || !produk.aktif) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="flex h-56 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 text-7xl shadow-sm sm:h-72">
            {produk.jenis === "rafting" ? "🚣" : "🛞"}
          </div>
          <span className="mt-6 inline-block text-xs font-semibold uppercase tracking-wide text-teal-600">
            {produk.jenis === "rafting" ? "Rafting" : "River Tubing"}
          </span>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">{produk.nama}</h1>
          <p className="mt-2 text-slate-500">Diselenggarakan oleh {produk.mitraJasa.namaUsaha}</p>

          <div className="mt-6 flex flex-wrap gap-4">
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs text-slate-400">Harga</p>
              <p className="font-semibold text-slate-900">{formatRupiah(produk.hargaPerOrang)} / orang</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs text-slate-400">Kapasitas</p>
              <p className="font-semibold text-slate-900">{produk.kapasitasPerHari} orang/hari</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <p className="text-sm font-semibold text-slate-900">Pesan sekarang</p>
            <CheckoutForm type="jasa" id={produk.id} isKamar={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
