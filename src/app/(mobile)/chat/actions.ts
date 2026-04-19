"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { getTravelerEmail } from "../_actions/booking";

const TRAVELER_COOKIE = "seoul_crafted_email";
const ONE_YEAR = 60 * 60 * 24 * 365;

export async function saveTravelerEmail(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email || !email.includes("@")) return;
  const jar = await cookies();
  jar.set(TRAVELER_COOKIE, email, {
    path: "/",
    maxAge: ONE_YEAR,
    sameSite: "lax",
  });
  revalidatePath("/chat");
}

export async function sendCustomerMessage(formData: FormData) {
  const email = await getTravelerEmail();
  if (!email) return;
  const channel = formData.get("channel") === "guide" ? "guide" : "support";
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return;

  const admin = await createAdminClient();

  // Upsert the (email, channel) conversation so it exists.
  const { data: convo, error: convoErr } = await admin
    .from("conversations")
    .upsert(
      {
        customer_email: email,
        channel,
        last_message_at: new Date().toISOString(),
      },
      { onConflict: "customer_email,channel" },
    )
    .select("id")
    .single();
  if (convoErr || !convo) throw new Error(convoErr?.message ?? "convo failed");

  const { error: msgErr } = await admin.from("messages").insert({
    conversation_id: convo.id,
    sender: "customer",
    body,
  });
  if (msgErr) throw new Error(msgErr.message);

  revalidatePath("/chat");
  revalidatePath("/admin/messages");
}
