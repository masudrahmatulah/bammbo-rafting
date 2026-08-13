"use client";

import { useActionState } from "react";
import { checkoutAction, type CheckoutFormState } from "./actions";

const initialState: CheckoutFormState = {};

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100";

export function CheckoutForm({
  type,
  id,
  isKamar,
}: {
  type: "jasa" | "kamar";
  id: string;
  isKamar: boolean;
}) {
  const [state, formAction, pending] = useActionState(checkoutAction, initialState);

  return (
    <form action={formAction} className="mt-4 space-y-4">
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="id" value={id} />

      <div>
        <label htmlFor="tanggalMulai" className="block text-sm font-medium text-slate-700">
          {isKamar ? "Tanggal Check-in" : "Tanggal"}
        </label>
        <input id="tanggalMulai" name="tanggalMulai" type="date" required className={inputClass} />
      </div>

      {isKamar && (
        <div>
          <label htmlFor="tanggalSelesai" className="block text-sm font-medium text-slate-700">Tanggal Check-out</label>
          <input id="tanggalSelesai" name="tanggalSelesai" type="date" required className={inputClass} />
        </div>
      )}

      <div>
        <label htmlFor="jumlah" className="block text-sm font-medium text-slate-700">
          {isKamar ? "Jumlah Kamar" : "Jumlah Orang"}
        </label>
        <input id="jumlah" name="jumlah" type="number" min="1" defaultValue="1" required className={inputClass} />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-teal-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:opacity-50"
      >
        {pending ? "Memproses..." : "Pesan & Bayar"}
      </button>
    </form>
  );
}
