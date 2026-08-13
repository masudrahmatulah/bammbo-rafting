import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { auth } from "@/auth";
import { SignOutButton } from "@/app/components/SignOutButton";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bammbo Rafting",
  description: "Booking online bamboo rafting, river tubing & penginapan di Loksado",
};

const ROLE_LABEL: Record<string, string> = {
  admin: "Panel Admin",
  mitra_jasa: "Panel Mitra",
  mitra_penginapan: "Panel Mitra",
};

const ROLE_HREF: Record<string, string> = {
  admin: "/admin",
  mitra_jasa: "/mitra",
  mitra_penginapan: "/mitra",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const name = session?.user?.name;

  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-slate-50 text-slate-900 antialiased`}>
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-teal-700">
              <span className="text-xl">🎋</span>
              <span>Bammbo Rafting</span>
            </Link>
            <div className="flex items-center gap-1 text-sm sm:gap-2">
              <Link href="/katalog" className="rounded-lg px-3 py-2 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
                Katalog
              </Link>
              {role === "wisatawan" && (
                <Link href="/riwayat" className="rounded-lg px-3 py-2 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
                  Riwayat
                </Link>
              )}
              {!role && (
                <Link href="/daftar-mitra" className="hidden rounded-lg px-3 py-2 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:inline-block">
                  Jadi Mitra
                </Link>
              )}

              {role ? (
                <>
                  <Link
                    href={ROLE_HREF[role] ?? "/"}
                    className="rounded-lg px-3 py-2 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    {ROLE_LABEL[role] ?? "Akun"}
                  </Link>
                  <span className="hidden pl-2 text-sm text-slate-400 md:inline">{name}</span>
                  <SignOutButton />
                </>
              ) : (
                <>
                  <Link href="/masuk" className="rounded-lg px-3 py-2 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
                    Masuk
                  </Link>
                  <Link href="/daftar" className="rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-teal-700">
                    Daftar
                  </Link>
                </>
              )}
            </div>
          </nav>
        </header>
        {children}
        <footer className="mt-24 border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-500 sm:px-6">
            <p>© {new Date().getFullYear()} Bammbo Rafting — Loksado, Hulu Sungai Selatan.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
