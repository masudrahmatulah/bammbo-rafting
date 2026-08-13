"use client";

import { useActionState } from "react";
import { checkoutAction, type CheckoutFormState } from "./actions";

const initialState: CheckoutFormState = {};

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
    <form action={formAction} className="mt-6 space-y-4">
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="id" value={id} />

      <div>
        <label htmlFor="tanggalMulai" className="block text-sm font-medium">{isKamar ? "Tanggal Check-in" : "Tanggal"}</label>
        <input id="tanggalMulai" name="tanggalMulai" type="date" required className="mt-1 w-full rounded border px-3 py-2" />
      </div>

      {isKamar && (
        <div>
          <label htmlFor="tanggalSelesai" className="block text-sm font-medium">Tanggal Check-out</label>
          <input id="tanggalSelesai" name="tanggalSelesai" type="date" required className="mt-1 w-full rounded border px-3 py-2" />
        </div>
      )}

      <div>
        <label htmlFor="jumlah" className="block text-sm font-medium">{isKamar ? "Jumlah Kamar" : "Jumlah Orang"}</label>
        <input id="jumlah" name="jumlah" type="number" min="1" defaultValue="1" required className="mt-1 w-full rounded border px-3 py-2" />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded bg-emerald-700 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Memproses..." : "Pesan & Bayar"}
      </button>
    </form>
  );
}
