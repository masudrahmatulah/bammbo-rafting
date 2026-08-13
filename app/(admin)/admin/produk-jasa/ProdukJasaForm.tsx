"use client";

import { useActionState } from "react";
import { createProdukJasaAction, type ProdukJasaFormState } from "./actions";
import { inputClass, btnPrimary } from "@/app/components/ui";

const initialState: ProdukJasaFormState = {};

export function ProdukJasaForm({ mitraOptions }: { mitraOptions: { id: string; namaUsaha: string }[] }) {
  const [state, formAction, pending] = useActionState(createProdukJasaAction, initialState);

  return (
    <form action={formAction} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <select name="mitraJasaId" required className={inputClass}>
        <option value="">Pilih mitra jasa</option>
        {mitraOptions.map((m) => (
          <option key={m.id} value={m.id}>
            {m.namaUsaha}
          </option>
        ))}
      </select>
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
