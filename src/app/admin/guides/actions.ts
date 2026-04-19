"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type GuideFormState = {
  ok?: boolean;
  error?: string;
};

function parsePayload(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const photo_url = String(formData.get("photo_url") ?? "").trim() || null;
  const bio = String(formData.get("bio") ?? "").trim() || null;
  const languagesRaw = String(formData.get("languages") ?? "");
  const languages = languagesRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const active = formData.get("active") === "on";
  const ratingStr = String(formData.get("rating") ?? "").trim();
  const rating = ratingStr ? Number(ratingStr) : null;
  return { name, photo_url, bio, languages, active, rating };
}

export async function createGuide(
  _prev: GuideFormState | undefined,
  formData: FormData,
): Promise<GuideFormState> {
  const payload = parsePayload(formData);
  if (!payload.name) return { ok: false, error: "Name is required." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("guides")
    .insert(payload)
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/guides");
  redirect(`/admin/guides/${data.id}`);
}

export async function updateGuide(
  id: string,
  _prev: GuideFormState | undefined,
  formData: FormData,
): Promise<GuideFormState> {
  const payload = parsePayload(formData);
  if (!payload.name) return { ok: false, error: "Name is required." };

  const supabase = await createClient();
  const { error } = await supabase.from("guides").update(payload).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/guides");
  revalidatePath(`/admin/guides/${id}`);
  return { ok: true };
}

export async function deleteGuide(id: string, _formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("guides").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/guides");
  redirect("/admin/guides");
}
