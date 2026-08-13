"use client";

import { useActionState } from "react";
import { createOwnProdukJasaAction, type ProdukFormState } from "./actions";
import { inputClass, btnPrimary } from "@/app/components/ui";

const initialState: ProdukFormState = {};

export function ProdukJasaMitraForm() {
  const [state, formAction, pending] = useActionState(createOwnProdukJasaAction, initialState);

  return (
    <form action={formAction} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <select name="jenis" required className={inputClass}>
        <option value="rafting">Rafting</option>
        <option value="river_tubing">River Tubing</option>
      </select>
      <input name="nama" placeholder="Nama produk" required className={inputClass} />
      <input name="hargaPerOrang" type="number" min="1" placeholder="Harga per orang" required className={inputClass} />
      <input name="kapasitasPerHari" type="number" min="1" placeholder="Kapasitas per hari" required className={inputClass} />
      <button type="submit" disabled={pending} className={btnPrimary}>
        {pending ? "Menyimpan..." : "Tambah Produk"}
      </button>
      {state.error && <p className="col-span-full text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
