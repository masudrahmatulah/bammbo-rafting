import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="border-b">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <Link href="/" className="font-semibold text-emerald-700">
              Bammbo Rafting
            </Link>
            <div className="flex gap-4 text-sm">
              <Link href="/katalog">Katalog</Link>
              <Link href="/riwayat">Riwayat</Link>
              <Link href="/daftar-mitra">Jadi Mitra</Link>
              <Link href="/masuk">Masuk</Link>
              <Link href="/daftar">Daftar</Link>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
