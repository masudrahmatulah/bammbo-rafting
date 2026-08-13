import Link from "next/link";
import { requireAdmin } from "@/app/lib/guards";
import { PageHeader } from "@/app/components/ui";

const LINKS = [
  { href: "/admin/mitra", label: "Verifikasi Mitra", icon: "🤝", desc: "Tinjau & setujui pendaftaran mitra baru" },
  { href: "/admin/produk-jasa", label: "Kelola Produk Jasa", icon: "🚣", desc: "CRUD produk rafting & tubing" },
  { href: "/admin/kamar", label: "Kelola Kamar", icon: "🏡", desc: "CRUD kamar penginapan" },
  { href: "/admin/transaksi", label: "Monitor Transaksi", icon: "🧾", desc: "Pantau & batalkan booking" },
  { href: "/admin/bagi-hasil", label: "Kelola Bagi Hasil", icon: "💰", desc: "Cairkan pendapatan mitra" },
];

export default async function AdminHomePage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <PageHeader title="Panel Admin" subtitle="Kelola mitra, produk, transaksi, dan bagi hasil." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-xl">{l.icon}</div>
            <p className="mt-3 font-semibold text-slate-900 group-hover:text-teal-700">{l.label}</p>
            <p className="mt-1 text-sm text-slate-500">{l.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
