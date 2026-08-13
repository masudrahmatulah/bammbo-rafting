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
    <div className="mx-auto max-w-3xl py-12">
      <h1 className="text-3xl font-semibold">{kamar.namaKamar}</h1>
      <p className="text-neutral-600">{kamar.mitraPenginapan.namaUsaha}</p>
      <p className="mt-4 text-2xl font-semibold">{formatRupiah(kamar.hargaPerMalam)} / malam</p>
      <p className="mt-1 text-sm text-neutral-500">
        Kapasitas {kamar.kapasitasKamar} orang/kamar &middot; {kamar.jumlahUnit} unit tersedia
      </p>
      <div className="mt-8 max-w-sm rounded-lg border p-4">
        <CheckoutForm type="kamar" id={kamar.id} isKamar={true} />
      </div>
    </div>
  );
}
