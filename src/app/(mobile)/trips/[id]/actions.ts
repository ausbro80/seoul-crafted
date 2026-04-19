"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import { getTravelerEmail } from "../../_actions/booking";

export async function cancelBooking(bookingId: string, _formData: FormData) {
  const email = await getTravelerEmail();
  if (!email) return;

  const admin = await createAdminClient();
  // Ownership check: only cancel if the booking belongs to this cookie email,
  // and only if it's still pending or confirmed.
  const { error } = await admin
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId)
    .eq("customer_email", email)
    .in("status", ["pending", "confirmed"]);

  if (error) throw new Error(error.message);

  revalidatePath("/trips");
  revalidatePath(`/trips/${bookingId}`);
  revalidatePath("/admin/bookings");
  revalidatePath("/admin");

  redirect("/trips");
}
