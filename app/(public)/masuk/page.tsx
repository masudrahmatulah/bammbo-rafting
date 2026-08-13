"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import Link from "next/link";

function redirectPathForRole(role: string | undefined) {
  if (role === "admin") return "/admin";
  if (role === "mitra_jasa" || role === "mitra_penginapan") return "/mitra";
  return "/";
}

export default function MasukPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (res?.error) {
      setPending(false);
      setError("Email atau kata sandi salah");
      return;
    }

    const session = await getSession();
    const role = (session?.user as { role?: string } | undefined)?.role;
    router.push(redirectPathForRole(role));
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Masuk</h1>
        <p className="mt-1 text-sm text-slate-500">Masuk ke akun Bammbo Rafting Anda.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">Kata Sandi</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-teal-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:opacity-50"
          >
            {pending ? "Memproses..." : "Masuk"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Belum punya akun? <Link href="/daftar" className="font-medium text-teal-700 hover:underline">Daftar</Link>
        </p>
        <p className="mt-1 text-center text-sm text-slate-500">
          Ingin jadi mitra? <Link href="/daftar-mitra" className="font-medium text-teal-700 hover:underline">Daftar mitra</Link>
        </p>
      </div>
    </div>
  );
}
