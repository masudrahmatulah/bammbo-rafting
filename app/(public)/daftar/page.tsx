"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction, type RegisterFormState } from "./actions";

const initialState: RegisterFormState = {};
const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100";

export default function DaftarPage() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  if (state.success) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 text-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-2xl">✓</div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Pendaftaran berhasil</h1>
          <p className="mt-2 text-slate-500">
            Silakan <Link href="/masuk" className="font-medium text-teal-700 hover:underline">masuk</Link> dengan akun Anda.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Daftar Akun</h1>
        <p className="mt-1 text-sm text-slate-500">Buat akun untuk mulai booking petualangan Anda.</p>
        <form action={formAction} className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Nama</label>
            <input id="name" name="name" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
            <input id="email" name="email" type="email" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700">No. HP (opsional)</label>
            <input id="phone" name="phone" className={inputClass} />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">Kata Sandi</label>
            <input id="password" name="password" type="password" required minLength={8} className={inputClass} />
          </div>
          {state.error && <p className="text-sm text-red-600">{state.error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-teal-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:opacity-50"
          >
            {pending ? "Memproses..." : "Daftar"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Sudah punya akun? <Link href="/masuk" className="font-medium text-teal-700 hover:underline">Masuk</Link>
        </p>
      </div>
    </div>
  );
}
