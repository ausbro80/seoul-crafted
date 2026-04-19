import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDuration, formatPrice } from "@/lib/format";
import { getLang, pickI18n } from "@/lib/i18n";
import { t } from "@/lib/ui-strings";

export const dynamic = "force-dynamic";

type RouteCard = {
  id: string;
  slug: string;
  tier: string;
  category: string | null;
  price_cents: number;
  duration_min: number;
  hero_image_url: string | null;
  theme_color: string | null;
  badge: string | null;
  routes_i18n: { lang: string; title: string | null; subtitle: string | null }[] | null;
};

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string }>;
}) {
  const { tier = "all" } = await searchParams;
  const lang = await getLang();
  const supabase = await createClient();

  const chips: { value: string; label: string }[] = [
    { value: "all", label: t(lang, "filter_all") },
    { value: "curated", label: t(lang, "filter_curated") },
    { value: "guided_custom", label: t(lang, "filter_guided") },
    { value: "route_only", label: t(lang, "filter_route_only") },
  ];

  let query = supabase
    .from("routes")
    .select(
      "id, slug, tier, category, price_cents, duration_min, hero_image_url, theme_color, badge, routes_i18n(lang, title, subtitle)",
    )
    .eq("published", true)
    .order("updated_at", { ascending: false });

  if (tier !== "all" && ["curated", "guided_custom", "route_only"].includes(tier)) {
    query = query.eq("tier", tier);
  }

  const { data: routes } = await query.returns<RouteCard[]>();
  const list = routes ?? [];

  return (
    <>
      <header className="flex items-center gap-3 px-5 pt-5">
        <Link
          href="/"
          className="flex size-9 items-center justify-center rounded-full border"
          style={{ borderColor: "var(--border)" }}
          aria-label={t(lang, "back")}
        >
          <ChevronLeft className="size-4" />
        </Link>
        <h1 className="font-display text-2xl">{t(lang, "browse_title")}</h1>
      </header>

      <div className="overflow-x-auto px-5 pt-4">
        <div className="flex gap-2">
          {chips.map((c) => {
            const active = tier === c.value;
            return (
              <Link
                key={c.value}
                href={c.value === "all" ? "/browse" : `/browse?tier=${c.value}`}
                className="whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium"
                style={{
                  borderColor: active ? "var(--brand)" : "var(--border)",
                  backgroundColor: active ? "var(--brand)" : "transparent",
                  color: active ? "#fff" : "var(--ink-subtle)",
                }}
              >
                {c.label}
              </Link>
            );
          })}
        </div>
      </div>

      <section className="px-5 py-5">
        {list.length === 0 ? (
          <div
            className="rounded-2xl border border-dashed px-4 py-16 text-center text-sm"
            style={{
              borderColor: "var(--border)",
              color: "var(--ink-subtle)",
            }}
          >
            {t(lang, "browse_empty")}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {list.map((r) => {
              const tr = pickI18n(r.routes_i18n, lang);
              return (
                <Link
                  key={r.id}
                  href={`/routes/${r.slug}`}
                  className="flex gap-3 overflow-hidden rounded-2xl border bg-card p-3"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div
                    className="size-24 flex-shrink-0 rounded-xl"
                    style={{
                      backgroundColor: r.theme_color ?? "var(--muted)",
                      backgroundImage: r.hero_image_url
                        ? `url(${r.hero_image_url})`
                        : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="font-display text-base leading-tight">
                        {tr?.title ?? r.slug}
                      </div>
                      {tr?.subtitle ? (
                        <div
                          className="mt-0.5 line-clamp-1 text-xs"
                          style={{ color: "var(--ink-subtle)" }}
                        >
                          {tr.subtitle}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span style={{ color: "var(--ink-subtle)" }}>
                        {formatDuration(r.duration_min)}
                      </span>
                      <span className="font-semibold">
                        {formatPrice(r.price_cents)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
