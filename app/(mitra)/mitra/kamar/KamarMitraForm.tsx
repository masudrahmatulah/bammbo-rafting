"use client";

import { useActionState } from "react";
import { createOwnKamarAction, type KamarFormState } from "./actions";

const initialState: KamarFormState = {};

export function KamarMitraForm() {
  const [state, formAction, pending] = useActionState(createOwnKamarAction, initialState);

  return (
    <form action={formAction} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <input name="namaKamar" placeholder="Nama kamar" required className="rounded border px-3 py-2" />
      <input name="hargaPerMalam" type="number" min="1" placeholder="Harga per malam" required className="rounded border px-3 py-2" />
      <input name="kapasitasKamar" type="number" min="1" placeholder="Kapasitas kamar" required className="rounded border px-3 py-2" />
      <input name="jumlahUnit" type="number" min="1" placeholder="Jumlah unit" required className="rounded border px-3 py-2" />
      <button type="submit" disabled={pending} className="rounded bg-emerald-700 px-4 py-2 text-white disabled:opacity-50">
        {pending ? "Menyimpan..." : "Tambah Kamar"}
      </button>
      {state.error && <p className="col-span-full text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
