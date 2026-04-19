"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";

export async function savePushSubscription(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = formData.get("role") === "admin" ? "admin" : "customer";
  const endpoint = String(formData.get("endpoint") ?? "");
  const p256dh = String(formData.get("p256dh") ?? "");
  const auth = String(formData.get("auth") ?? "");
  const userAgent = String(formData.get("user_agent") ?? "").slice(0, 256) || null;

  if (!email || !endpoint || !p256dh || !auth) return { ok: false };

  const admin = await createAdminClient();
  await admin
    .from("push_subscriptions")
    .upsert(
      {
        subscriber_email: email,
        role,
        endpoint,
        p256dh,
        auth,
        user_agent: userAgent,
      },
      { onConflict: "subscriber_email,endpoint" },
    );
  revalidatePath("/me");
  revalidatePath("/admin");
  return { ok: true };
}

export async function removePushSubscription(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const endpoint = String(formData.get("endpoint") ?? "");
  if (!email || !endpoint) return;

  const admin = await createAdminClient();
  await admin
    .from("push_subscriptions")
    .delete()
    .eq("subscriber_email", email)
    .eq("endpoint", endpoint);
  revalidatePath("/me");
  revalidatePath("/admin");
}
