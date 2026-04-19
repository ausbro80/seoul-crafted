"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { translateForAllLanguages } from "@/lib/translate";
import { broadcast } from "@/lib/broadcast";
import { sendPushToEmail } from "@/lib/push";

export async function sendAdminReply(
  conversationId: string,
  formData: FormData,
) {
  const body = String(formData.get("body") ?? "").trim();
  const senderRole =
    formData.get("sender_role") === "guide" ? "guide" : "support";
  if (!body) return;

  // Ops team writes in Korean by default; translations land in every
  // supported chat language for the customer.
  const sourceLang = "ko";
  const translations = await translateForAllLanguages(body, sourceLang);

  const supabase = await createClient();
  const { data: msg, error: insErr } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender: senderRole,
      body,
      source_lang: sourceLang,
      translations,
    })
    .select("id, conversation_id, sender, body, source_lang, translations, created_at")
    .single();
  if (insErr) throw new Error(insErr.message);

  const { data: convo } = await supabase
    .from("conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", conversationId)
    .select("customer_email")
    .single();

  const customerEmail = convo?.customer_email;

  await Promise.all([
    broadcast(`convo:${conversationId}`, "message", msg),
    broadcast("admin:inbox", "message", {
      conversation_id: conversationId,
      from_admin: true,
      preview: body,
      source_lang: sourceLang,
    }),
    customerEmail
      ? sendPushToEmail(customerEmail, {
          title: `Message from ${senderRole}`,
          body,
          url: `/chat?tab=${senderRole}`,
          tag: `convo:${conversationId}`,
        })
      : Promise.resolve(),
  ]);

  revalidatePath("/admin/messages");
  revalidatePath("/chat");
}

export async function markConversationRead(
  conversationId: string,
  _formData: FormData,
) {
  const supabase = await createClient();
  await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("conversation_id", conversationId)
    .eq("sender", "customer")
    .is("read_at", null);
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}
