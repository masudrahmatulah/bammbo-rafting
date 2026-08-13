"use client";

import { useActionState } from "react";
import { createKamarAction, type KamarFormState } from "./actions";
import { inputClass, btnPrimary } from "@/app/components/ui";

const initialState: KamarFormState = {};

export function KamarForm({ mitraOptions }: { mitraOptions: { id: string; namaUsaha: string }[] }) {
  const [state, formAction, pending] = useActionState(createKamarAction, initialState);

  return (
    <form action={formAction} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <select name="mitraPenginapanId" required className={inputClass}>
        <option value="">Pilih mitra penginapan</option>
        {mitraOptions.map((m) => (
          <option key={m.id} value={m.id}>
            {m.namaUsaha}
          </option>
        ))}
      </select>
      <input name="namaKamar" placeholder="Nama kamar" required className={inputClass} />
      <input name="hargaPerMalam" type="number" min="1" placeholder="Harga per malam" required className={inputClass} />
      <input name="kapasitasKamar" type="number" min="1" placeholder="Kapasitas kamar" required className={inputClass} />
      <input name="jumlahUnit" type="number" min="1" placeholder="Jumlah unit" required className={inputClass} />
      <button type="submit" disabled={pending} className={btnPrimary}>
        {pending ? "Menyimpan..." : "Tambah Kamar"}
      </button>
      {state.error && <p className="col-span-full text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
