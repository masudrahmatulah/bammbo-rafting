import { notFound } from "next/navigation";
import { CatalogService } from "@/app/server/services/CatalogService";
import { CheckoutForm } from "@/app/(public)/checkout/CheckoutForm";

function formatRupiah(n: { toString(): string }) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
    Number(n.toString())
  );
}

export default async function KamarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const kamar = await CatalogService.getPenginapan(id);
  if (!kamar || !kamar.aktif) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="flex h-56 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 text-7xl shadow-sm sm:h-72">
            🏡
          </div>
          <h1 className="mt-6 text-3xl font-bold text-slate-900">{kamar.namaKamar}</h1>
          <p className="mt-2 text-slate-500">{kamar.mitraPenginapan.namaUsaha}</p>

          <div className="mt-6 flex flex-wrap gap-4">
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs text-slate-400">Harga</p>
              <p className="font-semibold text-slate-900">{formatRupiah(kamar.hargaPerMalam)} / malam</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs text-slate-400">Kapasitas</p>
              <p className="font-semibold text-slate-900">{kamar.kapasitasKamar} orang/kamar</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs text-slate-400">Unit tersedia</p>
              <p className="font-semibold text-slate-900">{kamar.jumlahUnit} unit</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <p className="text-sm font-semibold text-slate-900">Pesan sekarang</p>
            <CheckoutForm type="kamar" id={kamar.id} isKamar={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
