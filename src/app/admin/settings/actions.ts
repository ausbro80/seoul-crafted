"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type SettingsFormState = {
  ok?: boolean;
  error?: string;
};

export async function updateSettings(
  _prev: SettingsFormState | undefined,
  formData: FormData,
): Promise<SettingsFormState> {
  const brand_name = String(formData.get("brand_name") ?? "").trim() || null;
  const tagline = String(formData.get("tagline") ?? "").trim() || null;
  const contact_email = String(formData.get("contact_email") ?? "").trim() || null;
  const support_hours = String(formData.get("support_hours") ?? "").trim() || null;
  const max_party_size = Number(formData.get("max_party_size") ?? 6);
  const curated_cap_min = Number(formData.get("curated_cap_min") ?? 180);
  const guided_cap_min = Number(formData.get("guided_cap_min") ?? 300);

  const promoRaw = String(formData.get("promo_codes") ?? "").trim();
  let promo_codes: unknown = [];
  if (promoRaw) {
    try {
      promo_codes = JSON.parse(promoRaw);
      if (!Array.isArray(promo_codes)) {
        return { ok: false, error: "Promo codes must be a JSON array." };
      }
    } catch {
      return { ok: false, error: "Promo codes must be valid JSON." };
    }
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("settings")
    .update({
      brand_name,
      tagline,
      contact_email,
      support_hours,
      max_party_size,
      curated_cap_min,
      guided_cap_min,
      promo_codes,
    })
    .eq("id", 1);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/settings");
  return { ok: true };
}
