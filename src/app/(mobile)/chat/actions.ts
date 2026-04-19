"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { getTravelerEmail } from "../_actions/booking";
import { getLang } from "@/lib/i18n";
import { translateForAllLanguages } from "@/lib/translate";
import { broadcast } from "@/lib/broadcast";

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

  const sourceLang = await getLang(); // en | zh | ja | vi
  const translations = await translateForAllLanguages(body, sourceLang);

  const admin = await createAdminClient();

  // Upsert conversation first so the FK is satisfied.
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

  const { data: msg, error: msgErr } = await admin
    .from("messages")
    .insert({
      conversation_id: convo.id,
      sender: "customer",
      body,
      source_lang: sourceLang,
      translations,
    })
    .select("id, conversation_id, sender, body, source_lang, translations, created_at")
    .single();
  if (msgErr) throw new Error(msgErr.message);

  // Fire-and-forget realtime broadcasts.
  await Promise.all([
    broadcast(`convo:${convo.id}`, "message", msg),
    broadcast("admin:inbox", "message", {
      conversation_id: convo.id,
      customer_email: email,
      channel,
      preview: body,
      source_lang: sourceLang,
    }),
  ]);

  revalidatePath("/chat");
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}
