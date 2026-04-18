"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/format";

export type RouteFormState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

function parsePayload(formData: FormData) {
  const slug =
    String(formData.get("slug") ?? "").trim() ||
    slugify(String(formData.get("title_en") ?? ""));
  const tier = String(formData.get("tier") ?? "curated");
  const categoryRaw = String(formData.get("category") ?? "");
  const category = categoryRaw === "" ? null : categoryRaw;
  const priceDollars = Number(formData.get("price_usd") ?? 0);
  const price_cents = Math.round(priceDollars * 100);
  const duration_min = Number(formData.get("duration_min") ?? 180);
  const hero_image_url = String(formData.get("hero_image_url") ?? "").trim() || null;
  const theme_color = String(formData.get("theme_color") ?? "").trim() || null;
  const badge = String(formData.get("badge") ?? "").trim() || null;
  const tagsRaw = String(formData.get("tags") ?? "");
  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const published = formData.get("published") === "on";

  const title_en = String(formData.get("title_en") ?? "").trim() || null;
  const subtitle_en = String(formData.get("subtitle_en") ?? "").trim() || null;
  const description_en =
    String(formData.get("description_en") ?? "").trim() || null;

  return {
    route: {
      slug,
      tier,
      category,
      price_cents,
      duration_min,
      hero_image_url,
      theme_color,
      badge,
      tags,
      published,
    },
    i18n_en: { title: title_en, subtitle: subtitle_en, description: description_en },
  };
}

export async function createRoute(
  _prev: RouteFormState | undefined,
  formData: FormData,
): Promise<RouteFormState> {
  const { route, i18n_en } = parsePayload(formData);
  if (!route.slug) return { ok: false, error: "Slug or English title is required." };

  const supabase = await createClient();
  const { data: inserted, error } = await supabase
    .from("routes")
    .insert(route)
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };

  if (i18n_en.title || i18n_en.subtitle || i18n_en.description) {
    const { error: i18nError } = await supabase
      .from("routes_i18n")
      .insert({ route_id: inserted.id, lang: "en", ...i18n_en });
    if (i18nError) return { ok: false, error: i18nError.message };
  }

  revalidatePath("/routes");
  redirect(`/routes/${inserted.id}`);
}

export async function updateRoute(
  id: string,
  _prev: RouteFormState | undefined,
  formData: FormData,
): Promise<RouteFormState> {
  const { route, i18n_en } = parsePayload(formData);
  if (!route.slug) return { ok: false, error: "Slug or English title is required." };

  const supabase = await createClient();
  const { error } = await supabase.from("routes").update(route).eq("id", id);
  if (error) return { ok: false, error: error.message };

  const { error: i18nError } = await supabase
    .from("routes_i18n")
    .upsert({ route_id: id, lang: "en", ...i18n_en }, { onConflict: "route_id,lang" });
  if (i18nError) return { ok: false, error: i18nError.message };

  revalidatePath("/routes");
  revalidatePath(`/routes/${id}`);
  return { ok: true };
}

export async function deleteRoute(id: string, _formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("routes").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/routes");
  redirect("/routes");
}
