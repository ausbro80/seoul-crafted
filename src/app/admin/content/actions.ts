"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function upsertString(_prev: unknown, formData: FormData) {
  const key = String(formData.get("key") ?? "").trim();
  if (!key) return { error: "Key is required." };
  const en = String(formData.get("en") ?? "").trim() || null;
  const zh = String(formData.get("zh") ?? "").trim() || null;
  const ja = String(formData.get("ja") ?? "").trim() || null;
  const vi = String(formData.get("vi") ?? "").trim() || null;

  const supabase = await createClient();
  const { error } = await supabase
    .from("i18n_strings")
    .upsert({ key, en, zh, ja, vi }, { onConflict: "key" });
  if (error) return { error: error.message };

  revalidatePath("/admin/content");
  return { ok: true };
}

export async function deleteString(key: string, _formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("i18n_strings").delete().eq("key", key);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/content");
}
