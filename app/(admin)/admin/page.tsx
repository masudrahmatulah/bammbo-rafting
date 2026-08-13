import Link from "next/link";
import { requireAdmin } from "@/app/lib/guards";

const LINKS = [
  { href: "/admin/mitra", label: "Verifikasi Mitra" },
  { href: "/admin/produk-jasa", label: "Kelola Produk Jasa" },
  { href: "/admin/kamar", label: "Kelola Kamar" },
  { href: "/admin/transaksi", label: "Monitor Transaksi" },
  { href: "/admin/bagi-hasil", label: "Kelola Bagi Hasil" },
];

export default async function AdminHomePage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-2xl py-12">
      <h1 className="text-2xl font-semibold">Panel Admin</h1>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="rounded-lg border p-4 hover:bg-neutral-50">
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
