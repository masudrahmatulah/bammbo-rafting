import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { MitraService } from "@/app/server/services/MitraService";
import { Card, Badge } from "@/app/components/ui";

export default async function MitraDashboardPage() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!session?.user || !userId) redirect("/masuk");

  const isJasa = role === "mitra_jasa";
  const mitra = isJasa ? await MitraService.getOwnMitraJasa(userId) : await MitraService.getOwnMitraPenginapan(userId);

  if (!mitra) redirect("/masuk");

  const statusTone = mitra.statusVerifikasi === "AKTIF" ? "teal" : mitra.statusVerifikasi === "PENDING" ? "amber" : "red";
  const statusText =
    mitra.statusVerifikasi === "AKTIF" ? "Aktif" : mitra.statusVerifikasi === "PENDING" ? "Menunggu verifikasi admin" : "Ditolak";

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Card>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{mitra.namaUsaha}</h1>
            <p className="mt-1 text-sm text-slate-500">{isJasa ? "Mitra Jasa Rafting/Tubing" : "Mitra Penginapan"}</p>
          </div>
          <Badge tone={statusTone}>{statusText}</Badge>
        </div>

        {mitra.statusVerifikasi !== "AKTIF" && (
          <p className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            Anda dapat mengelola produk setelah akun disetujui oleh admin.
          </p>
        )}

        {mitra.statusVerifikasi === "AKTIF" && (
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={isJasa ? "/mitra/produk" : "/mitra/kamar"}
              className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
            >
              Kelola {isJasa ? "Produk Jasa" : "Kamar"}
            </Link>
            <Link
              href="/mitra/pendapatan"
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Lihat Pendapatan
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
