"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const VALID = new Set(["pending", "confirmed", "completed", "cancelled"]);

export async function updateBookingStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !VALID.has(status)) return;

  const supabase = await createClient();
  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/bookings");
  revalidatePath("/");
}
