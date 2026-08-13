"use client";

import { useActionState } from "react";
import { createOwnProdukJasaAction, type ProdukFormState } from "./actions";

const initialState: ProdukFormState = {};

export function ProdukJasaMitraForm() {
  const [state, formAction, pending] = useActionState(createOwnProdukJasaAction, initialState);

  return (
    <form action={formAction} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <select name="jenis" required className="rounded border px-3 py-2">
        <option value="rafting">Rafting</option>
        <option value="river_tubing">River Tubing</option>
      </select>
      <input name="nama" placeholder="Nama produk" required className="rounded border px-3 py-2" />
      <input name="hargaPerOrang" type="number" min="1" placeholder="Harga per orang" required className="rounded border px-3 py-2" />
      <input name="kapasitasPerHari" type="number" min="1" placeholder="Kapasitas per hari" required className="rounded border px-3 py-2" />
      <button type="submit" disabled={pending} className="rounded bg-emerald-700 px-4 py-2 text-white disabled:opacity-50">
        {pending ? "Menyimpan..." : "Tambah Produk"}
      </button>
      {state.error && <p className="col-span-full text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
