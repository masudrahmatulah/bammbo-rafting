"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { BookingService, AvailabilityError, ProductNotFoundError } from "@/app/server/services/BookingService";
import { PembayaranService } from "@/app/server/services/PembayaranService";

export type CheckoutFormState = { error?: string };

export async function checkoutAction(
  _prevState: CheckoutFormState,
  formData: FormData
): Promise<CheckoutFormState> {
  const session = await auth();
  if (!session?.user) {
    redirect("/masuk");
  }

  const type = formData.get("type") as "jasa" | "kamar";
  const id = String(formData.get("id"));
  const jumlah = Number(formData.get("jumlah"));
  const tanggalMulai = String(formData.get("tanggalMulai"));
  const tanggalSelesai = String(formData.get("tanggalSelesai") || tanggalMulai);

  let booking;
  try {
    booking = await BookingService.createBooking((session!.user as { id: string }).id, {
      tanggalMulai: new Date(tanggalMulai),
      tanggalSelesai: new Date(tanggalSelesai),
      items: [{ type, id, jumlah }],
    });
  } catch (err) {
    if (err instanceof AvailabilityError || err instanceof ProductNotFoundError) {
      return { error: err.message };
    }
    return { error: "Gagal membuat booking, coba lagi" };
  }

  let snap;
  try {
    snap = await PembayaranService.initiatePayment(
      booking.id,
      session!.user!.name ?? "Wisatawan",
      session!.user!.email ?? ""
    );
  } catch {
    return { error: "Gagal menghubungi payment gateway. Booking Anda tersimpan sebagai PENDING." };
  }

  redirect(snap.redirect_url);
}
