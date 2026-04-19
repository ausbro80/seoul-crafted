"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/format";

export type RouteFormState = {
  ok?: boolean;
  error?: string;
};

const LANGS = ["en", "zh", "ja", "vi"] as const;
type Lang = (typeof LANGS)[number];

function parsePayload(formData: FormData) {
  const i18n: Record<Lang, { title: string | null; subtitle: string | null; description: string | null }> =
    {
      en: { title: null, subtitle: null, description: null },
      zh: { title: null, subtitle: null, description: null },
      ja: { title: null, subtitle: null, description: null },
      vi: { title: null, subtitle: null, description: null },
    };
  for (const lang of LANGS) {
    i18n[lang] = {
      title: String(formData.get(`title_${lang}`) ?? "").trim() || null,
      subtitle: String(formData.get(`subtitle_${lang}`) ?? "").trim() || null,
      description: String(formData.get(`description_${lang}`) ?? "").trim() || null,
    };
  }

  const slug =
    String(formData.get("slug") ?? "").trim() ||
    slugify(i18n.en.title ?? "");
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
    i18n,
  };
}

function i18nRows(
  routeId: string,
  i18n: ReturnType<typeof parsePayload>["i18n"],
) {
  return LANGS.filter((lang) =>
    i18n[lang].title || i18n[lang].subtitle || i18n[lang].description,
  ).map((lang) => ({
    route_id: routeId,
    lang,
    ...i18n[lang],
  }));
}

export async function createRoute(
  _prev: RouteFormState | undefined,
  formData: FormData,
): Promise<RouteFormState> {
  const { route, i18n } = parsePayload(formData);
  if (!route.slug) return { ok: false, error: "Slug or English title is required." };

  const supabase = await createClient();
  const { data: inserted, error } = await supabase
    .from("routes")
    .insert(route)
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };

  const rows = i18nRows(inserted.id, i18n);
  if (rows.length > 0) {
    const { error: i18nError } = await supabase.from("routes_i18n").insert(rows);
    if (i18nError) return { ok: false, error: i18nError.message };
  }

  revalidatePath("/admin/routes");
  redirect(`/admin/routes/${inserted.id}`);
}

export async function updateRoute(
  id: string,
  _prev: RouteFormState | undefined,
  formData: FormData,
): Promise<RouteFormState> {
  const { route, i18n } = parsePayload(formData);
  if (!route.slug) return { ok: false, error: "Slug or English title is required." };

  const supabase = await createClient();
  const { error } = await supabase.from("routes").update(route).eq("id", id);
  if (error) return { ok: false, error: error.message };

  const rows = LANGS.map((lang) => ({
    route_id: id,
    lang,
    ...i18n[lang],
  }));
  const { error: i18nError } = await supabase
    .from("routes_i18n")
    .upsert(rows, { onConflict: "route_id,lang" });
  if (i18nError) return { ok: false, error: i18nError.message };

  revalidatePath("/admin/routes");
  revalidatePath(`/admin/routes/${id}`);
  return { ok: true };
}

export async function deleteRoute(id: string, _formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("routes").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/routes");
  redirect("/admin/routes");
}
