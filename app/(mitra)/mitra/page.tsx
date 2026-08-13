import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { MitraService } from "@/app/server/services/MitraService";

export default async function MitraDashboardPage() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!session?.user || !userId) redirect("/masuk");

  const isJasa = role === "mitra_jasa";
  const mitra = isJasa ? await MitraService.getOwnMitraJasa(userId) : await MitraService.getOwnMitraPenginapan(userId);

  if (!mitra) redirect("/masuk");

  return (
    <div className="mx-auto max-w-2xl py-12">
      <h1 className="text-2xl font-semibold">{mitra.namaUsaha}</h1>
      <p className="mt-2 text-sm">
        Status verifikasi:{" "}
        <span className="font-medium">
          {mitra.statusVerifikasi === "AKTIF" ? "Aktif" : mitra.statusVerifikasi === "PENDING" ? "Menunggu verifikasi admin" : "Ditolak"}
        </span>
      </p>

      {mitra.statusVerifikasi !== "AKTIF" && (
        <p className="mt-4 text-neutral-600">
          Anda dapat mengelola produk setelah akun disetujui oleh admin.
        </p>
      )}

      {mitra.statusVerifikasi === "AKTIF" && (
        <div className="mt-6 flex gap-3">
          <Link
            href={isJasa ? "/mitra/produk" : "/mitra/kamar"}
            className="inline-block rounded bg-emerald-700 px-4 py-2 text-white"
          >
            Kelola {isJasa ? "Produk Jasa" : "Kamar"}
          </Link>
          <Link href="/mitra/pendapatan" className="inline-block rounded border px-4 py-2">
            Lihat Pendapatan
          </Link>
        </div>
      )}
    </div>
  );
}
