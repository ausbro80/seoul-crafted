"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function sendAdminReply(
  conversationId: string,
  formData: FormData,
) {
  const body = String(formData.get("body") ?? "").trim();
  const senderRole =
    formData.get("sender_role") === "guide" ? "guide" : "support";
  if (!body) return;

  const supabase = await createClient();
  const { error: insErr } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender: senderRole,
    body,
  });
  if (insErr) throw new Error(insErr.message);

  await supabase
    .from("conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", conversationId);

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
