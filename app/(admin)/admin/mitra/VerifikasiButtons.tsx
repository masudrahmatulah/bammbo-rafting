"use client";

import { useActionState } from "react";
import { verifikasiMitraAction, type VerifikasiFormState } from "./actions";

const initialState: VerifikasiFormState = {};

export function VerifikasiButtons({ jenis, mitraId }: { jenis: "jasa" | "penginapan"; mitraId: string }) {
  const [state, formAction, pending] = useActionState(verifikasiMitraAction, initialState);

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="jenis" value={jenis} />
      <input type="hidden" name="mitraId" value={mitraId} />
      <button
        type="submit"
        name="keputusan"
        value="AKTIF"
        disabled={pending}
        className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:opacity-50"
      >
        Setujui
      </button>
      <button
        type="submit"
        name="keputusan"
        value="REJECTED"
        disabled={pending}
        className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
      >
        Tolak
      </button>
      {state.error && <span className="text-xs text-red-600">{state.error}</span>}
    </form>
  );
}
