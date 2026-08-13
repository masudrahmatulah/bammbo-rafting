"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction, type RegisterFormState } from "./actions";

const initialState: RegisterFormState = {};

export default function DaftarPage() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  if (state.success) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-2xl font-semibold">Pendaftaran berhasil</h1>
        <p className="mt-2 text-neutral-600">
          Silakan <Link href="/masuk" className="text-emerald-700 underline">masuk</Link> dengan akun Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md py-16">
      <h1 className="text-2xl font-semibold">Daftar Akun</h1>
      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Nama</label>
          <input id="name" name="name" required className="mt-1 w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input id="email" name="email" type="email" required className="mt-1 w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium">No. HP (opsional)</label>
          <input id="phone" name="phone" className="mt-1 w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">Kata Sandi</label>
          <input id="password" name="password" type="password" required minLength={8} className="mt-1 w-full rounded border px-3 py-2" />
        </div>
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded bg-emerald-700 py-2 text-white disabled:opacity-50"
        >
          {pending ? "Memproses..." : "Daftar"}
        </button>
      </form>
      <p className="mt-4 text-sm text-neutral-600">
        Sudah punya akun? <Link href="/masuk" className="text-emerald-700 underline">Masuk</Link>
      </p>
    </div>
  );
}
