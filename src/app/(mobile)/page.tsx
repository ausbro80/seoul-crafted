import Link from "next/link";
import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDuration, formatPrice } from "@/lib/format";
import { getLang, LANG_LABELS, pickI18n } from "@/lib/i18n";

export const dynamic = "force-dynamic";

type RouteCard = {
  id: string;
  slug: string;
  tier: string;
  price_cents: number;
  duration_min: number;
  hero_image_url: string | null;
  theme_color: string | null;
  badge: string | null;
  routes_i18n: { lang: string; title: string | null; subtitle: string | null }[] | null;
};

export default async function HomePage() {
  const lang = await getLang();
  const supabase = await createClient();
  const { data: routes } = await supabase
    .from("routes")
    .select(
      "id, slug, tier, price_cents, duration_min, hero_image_url, theme_color, badge, routes_i18n(lang, title, subtitle)",
    )
    .eq("published", true)
    .order("updated_at", { ascending: false })
    .limit(12)
    .returns<RouteCard[]>();

  const list = routes ?? [];

  return (
    <>
      {/* Top bar */}
      <header className="flex items-center justify-between px-5 pt-5">
        <div className="flex items-center gap-2">
          <div
            className="flex size-9 items-center justify-center rounded-xl font-serif text-lg text-white"
            style={{ backgroundColor: "var(--brand)" }}
          >
            서
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">Seoul Crafted</div>
            <div
              className="text-[11px]"
              style={{ color: "var(--ink-subtle)" }}
            >
              Tours, crafted for you
            </div>
          </div>
        </div>
        <Link
          href="/me"
          className="flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium"
          style={{ borderColor: "var(--border)" }}
        >
          <span>{LANG_LABELS[lang].flag}</span>
          <span>{lang.toUpperCase()}</span>
        </Link>
      </header>

      {/* Hero greeting */}
      <section className="px-5 pt-6">
        <h1 className="font-display text-4xl leading-tight tracking-tight">
          Hi, traveler.
          <br />
          <span style={{ color: "var(--ink-subtle)" }}>
            Where shall we wander today?
          </span>
        </h1>
      </section>

      {/* Search */}
      <section className="px-5 pt-5">
        <Link
          href="/browse"
          className="flex items-center gap-2 rounded-2xl border bg-card px-4 py-3 text-sm"
          style={{ borderColor: "var(--border)", color: "var(--ink-subtle)" }}
        >
          <Search className="size-4" />
          <span>Search routes, neighborhoods, food…</span>
        </Link>
      </section>

      {/* Category cards */}
      <section className="px-5 pt-6">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="font-display text-xl">Start here</h2>
          <span
            className="text-[11px]"
            style={{ color: "var(--ink-subtle)" }}
          >
            3 ways to go
          </span>
        </div>
        <Link
          href="/browse?tier=curated"
          className="relative block overflow-hidden rounded-3xl"
          style={{ backgroundColor: "var(--brand)" }}
        >
          <div className="relative z-10 p-5 text-white">
            <div className="text-[11px] uppercase tracking-[0.18em] opacity-80">
              Curated
            </div>
            <div className="mt-1 font-display text-2xl leading-tight">
              Pre-designed
              <br />3-hour tours
            </div>
            <div className="mt-2 text-xs opacity-80">From $42 · Book and go</div>
          </div>
          <LatticePattern />
        </Link>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Link
            href="/customize?mode=guided"
            className="block rounded-3xl p-4"
            style={{ backgroundColor: "var(--jade-soft)" }}
          >
            <div
              className="text-[11px] uppercase tracking-[0.18em]"
              style={{ color: "var(--jade)" }}
            >
              Guided
            </div>
            <div className="mt-1 font-display text-lg leading-tight">
              Plan with
              <br />a guide
            </div>
            <div
              className="mt-2 text-[11px]"
              style={{ color: "var(--ink-subtle)" }}
            >
              ~$120 · 5h max
            </div>
          </Link>
          <Link
            href="/customize?mode=route-only"
            className="block rounded-3xl p-4"
            style={{ backgroundColor: "var(--gold-soft)" }}
          >
            <div
              className="text-[11px] uppercase tracking-[0.18em]"
              style={{ color: "var(--gold)" }}
            >
              Route only
            </div>
            <div className="mt-1 font-display text-lg leading-tight">
              We make
              <br />the map
            </div>
            <div
              className="mt-2 text-[11px]"
              style={{ color: "var(--ink-subtle)" }}
            >
              $18 · No time limit
            </div>
          </Link>
        </div>
      </section>

      {/* Popular routes */}
      <section className="px-5 py-6">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="font-display text-xl">Popular now</h2>
          <Link
            href="/browse"
            className="text-xs font-medium"
            style={{ color: "var(--brand)" }}
          >
            See all →
          </Link>
        </div>
        {list.length === 0 ? (
          <div
            className="rounded-2xl border border-dashed px-4 py-10 text-center text-sm"
            style={{
              borderColor: "var(--border)",
              color: "var(--ink-subtle)",
            }}
          >
            No routes published yet. Admin will add some soon.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {list.map((r) => {
              const tr = pickI18n(r.routes_i18n, lang);
              return (
                <Link
                  key={r.id}
                  href={`/routes/${r.slug}`}
                  className="overflow-hidden rounded-3xl border bg-card"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div
                    className="aspect-[4/3] w-full"
                    style={{
                      backgroundColor: r.theme_color ?? "var(--muted)",
                      backgroundImage: r.hero_image_url
                        ? `url(${r.hero_image_url})`
                        : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="p-4">
                    {r.badge ? (
                      <div
                        className="mb-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em]"
                        style={{
                          backgroundColor: "var(--gold-soft)",
                          color: "var(--gold)",
                        }}
                      >
                        {r.badge}
                      </div>
                    ) : null}
                    <div className="font-display text-lg leading-tight">
                      {tr?.title ?? r.slug}
                    </div>
                    {tr?.subtitle ? (
                      <div
                        className="mt-0.5 text-xs"
                        style={{ color: "var(--ink-subtle)" }}
                      >
                        {tr.subtitle}
                      </div>
                    ) : null}
                    <div className="mt-3 flex items-center justify-between text-xs">
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

function LatticePattern() {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full opacity-20"
    >
      <defs>
        <pattern id="lattice" width="14" height="14" patternUnits="userSpaceOnUse">
          <path d="M0 7 L14 7 M7 0 L7 14" stroke="white" strokeWidth="1" />
          <path d="M0 0 L14 14 M14 0 L0 14" stroke="white" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#lattice)" />
    </svg>
  );
}
