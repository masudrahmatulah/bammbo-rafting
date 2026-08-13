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
    <div className="mx-auto max-w-3xl py-12">
      <p className="text-xs uppercase text-emerald-700">{produk.jenis === "rafting" ? "Rafting" : "River Tubing"}</p>
      <h1 className="mt-1 text-3xl font-semibold">{produk.nama}</h1>
      <p className="text-neutral-600">Diselenggarakan oleh {produk.mitraJasa.namaUsaha}</p>
      <p className="mt-4 text-2xl font-semibold">{formatRupiah(produk.hargaPerOrang)} / orang</p>
      <p className="mt-1 text-sm text-neutral-500">Kapasitas {produk.kapasitasPerHari} orang/hari</p>
      <div className="mt-8 max-w-sm rounded-lg border p-4">
        <CheckoutForm type="jasa" id={produk.id} isKamar={false} />
      </div>
    </div>
  );
}
