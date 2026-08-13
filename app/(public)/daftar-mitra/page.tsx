"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registrasiMitraAction, type RegistrasiMitraFormState } from "./actions";

const initialState: RegistrasiMitraFormState = {};

export default function DaftarMitraPage() {
  const [state, formAction, pending] = useActionState(registrasiMitraAction, initialState);

  if (state.success) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-2xl font-semibold">Pendaftaran diterima</h1>
        <p className="mt-2 text-neutral-600">
          Data usaha Anda sedang ditinjau admin. Anda akan bisa masuk setelah status berubah menjadi AKTIF.
        </p>
        <Link href="/masuk" className="mt-4 inline-block text-emerald-700 underline">
          Ke halaman masuk
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg py-16">
      <h1 className="text-2xl font-semibold">Daftar Sebagai Mitra</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Untuk pengelola jasa rafting/tubing atau penginapan di Loksado.
      </p>
      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <label htmlFor="jenis" className="block text-sm font-medium">Jenis Mitra</label>
          <select id="jenis" name="jenis" required className="mt-1 w-full rounded border px-3 py-2">
            <option value="jasa">Jasa Rafting/Tubing</option>
            <option value="penginapan">Penginapan</option>
          </select>
        </div>
        <div>
          <label htmlFor="namaUsaha" className="block text-sm font-medium">Nama Usaha</label>
          <input id="namaUsaha" name="namaUsaha" required className="mt-1 w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Nama Penanggung Jawab</label>
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
          <label htmlFor="noKtpNib" className="block text-sm font-medium">No. KTP/NIB</label>
          <input id="noKtpNib" name="noKtpNib" required className="mt-1 w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label htmlFor="noRekening" className="block text-sm font-medium">No. Rekening</label>
          <input id="noRekening" name="noRekening" required className="mt-1 w-full rounded border px-3 py-2" />
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
          {pending ? "Memproses..." : "Daftar Mitra"}
        </button>
      </form>
    </div>
  );
}
