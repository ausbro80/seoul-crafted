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

// ========== Route stops (itinerary) ==========

export async function addStop(routeId: string, formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;
  const time_label = String(formData.get("time_label") ?? "").trim() || null;
  const durStr = String(formData.get("duration_min") ?? "").trim();
  const duration_min = durStr ? Number(durStr) : null;
  const note = String(formData.get("note") ?? "").trim() || null;

  const supabase = await createClient();
  const { data: last } = await supabase
    .from("route_stops")
    .select("position")
    .eq("route_id", routeId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const position = (last?.position ?? 0) + 1;

  const { error } = await supabase.from("route_stops").insert({
    route_id: routeId,
    position,
    time_label,
    title,
    duration_min,
    note,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/routes/${routeId}`);
}

export async function deleteStop(
  routeId: string,
  stopId: string,
  _formData: FormData,
) {
  const supabase = await createClient();
  const { error } = await supabase.from("route_stops").delete().eq("id", stopId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/routes/${routeId}`);
}

export async function moveStop(
  routeId: string,
  stopId: string,
  direction: "up" | "down",
  _formData: FormData,
) {
  const supabase = await createClient();
  const { data: stops } = await supabase
    .from("route_stops")
    .select("id, position")
    .eq("route_id", routeId)
    .order("position", { ascending: true });

  if (!stops) return;
  const idx = stops.findIndex((s) => s.id === stopId);
  if (idx === -1) return;
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= stops.length) return;

  const a = stops[idx];
  const b = stops[swapIdx];

  // Two-step swap via a sentinel position to avoid unique-constraint collisions.
  const sentinel = -1 - Math.floor(Math.random() * 1000);
  await supabase.from("route_stops").update({ position: sentinel }).eq("id", a.id);
  await supabase.from("route_stops").update({ position: a.position }).eq("id", b.id);
  await supabase.from("route_stops").update({ position: b.position }).eq("id", a.id);

  revalidatePath(`/admin/routes/${routeId}`);
}
