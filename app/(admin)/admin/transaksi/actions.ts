"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/app/lib/guards";
import { BookingService } from "@/app/server/services/BookingService";

export async function cancelBookingAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const bookingId = String(formData.get("bookingId"));

  try {
    await BookingService.cancelBooking(bookingId);
  } catch {
    // status booking sudah tidak valid untuk dibatalkan — abaikan, UI tetap refresh
  }

  revalidatePath("/admin/transaksi");
  revalidatePath("/admin/bagi-hasil");
}
