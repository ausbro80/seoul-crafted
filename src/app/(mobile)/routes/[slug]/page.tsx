import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Clock, MapPin, Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDuration, formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

type RouteDetail = {
  id: string;
  slug: string;
  tier: string;
  category: string | null;
  price_cents: number;
  duration_min: number;
  hero_image_url: string | null;
  theme_color: string | null;
  badge: string | null;
  tags: string[] | null;
  routes_i18n: {
    lang: string;
    title: string | null;
    subtitle: string | null;
    description: string | null;
  }[] | null;
  route_stops: {
    position: number;
    time_label: string | null;
    title: string;
    duration_min: number | null;
    note: string | null;
  }[] | null;
};

export default async function RouteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: route } = await supabase
    .from("routes")
    .select(
      "id, slug, tier, category, price_cents, duration_min, hero_image_url, theme_color, badge, tags, routes_i18n(lang, title, subtitle, description), route_stops(position, time_label, title, duration_min, note)",
    )
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle<RouteDetail>();

  if (!route) notFound();

  const en = route.routes_i18n?.find((t) => t.lang === "en");
  const stops = (route.route_stops ?? []).slice().sort((a, b) => a.position - b.position);

  return (
    <>
      {/* Hero */}
      <div className="relative">
        <div
          className="aspect-[4/3] w-full"
          style={{
            backgroundColor: route.theme_color ?? "var(--brand)",
            backgroundImage: route.hero_image_url
              ? `url(${route.hero_image_url})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-x-0 top-0 flex justify-between p-4">
          <Link
            href="/browse"
            className="flex size-9 items-center justify-center rounded-full bg-white/90 backdrop-blur"
          >
            <ChevronLeft className="size-4" />
          </Link>
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-full bg-white/90 backdrop-blur"
          >
            <Heart className="size-4" />
          </button>
        </div>
        {route.badge ? (
          <div
            className="absolute bottom-4 left-4 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white"
            style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
          >
            {route.badge}
          </div>
        ) : null}
      </div>

      {/* Title block */}
      <section className="space-y-1 px-5 pt-5">
        <h1 className="font-display text-2xl leading-tight">
          {en?.title ?? route.slug}
        </h1>
        {en?.subtitle ? (
          <p style={{ color: "var(--ink-subtle)" }} className="text-sm">
            {en.subtitle}
          </p>
        ) : null}
        <div
          className="flex items-center gap-3 pt-2 text-xs"
          style={{ color: "var(--ink-subtle)" }}
        >
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" />
            {formatDuration(route.duration_min)}
          </span>
          {route.category ? (
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" />
              {route.category}
            </span>
          ) : null}
        </div>
      </section>

      {/* Tabs (simple — Overview / Itinerary / Reviews.
          For now show Overview + Itinerary stacked; Reviews deferred.) */}
      {en?.description ? (
        <section className="px-5 pt-5">
          <h2 className="mb-2 font-display text-lg">Overview</h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {en.description}
          </p>
        </section>
      ) : null}

      {stops.length > 0 ? (
        <section className="px-5 pt-6">
          <h2 className="mb-3 font-display text-lg">Itinerary</h2>
          <ol className="space-y-3">
            {stops.map((s) => (
              <li key={s.position} className="flex gap-3">
                <div
                  className="flex size-8 flex-shrink-0 items-center justify-center rounded-full border text-xs font-semibold"
                  style={{ borderColor: "var(--border)" }}
                >
                  {s.position}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{s.title}</div>
                    {s.time_label ? (
                      <span
                        className="text-xs"
                        style={{ color: "var(--ink-subtle)" }}
                      >
                        {s.time_label}
                      </span>
                    ) : null}
                  </div>
                  {s.note ? (
                    <div
                      className="mt-1 text-xs"
                      style={{ color: "var(--ink-subtle)" }}
                    >
                      {s.note}
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {route.tags && route.tags.length > 0 ? (
        <section className="px-5 pt-6">
          <div className="flex flex-wrap gap-2">
            {route.tags.map((t) => (
              <span
                key={t}
                className="rounded-full px-2.5 py-1 text-[11px]"
                style={{
                  backgroundColor: "var(--muted)",
                  color: "var(--ink-subtle)",
                }}
              >
                #{t}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {/* Sticky bottom CTA */}
      <div className="pb-24" />
      <div
        className="fixed inset-x-0 bottom-0 z-20"
        style={{ pointerEvents: "none" }}
      >
        <div
          className="mx-auto max-w-md px-5 pb-5"
          style={{ pointerEvents: "auto" }}
        >
          <div
            className="flex items-center justify-between rounded-2xl border p-3 shadow-lg"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="pl-2">
              <div className="text-[11px]" style={{ color: "var(--ink-subtle)" }}>
                From
              </div>
              <div className="font-display text-xl leading-none">
                {formatPrice(route.price_cents)}
              </div>
            </div>
            <Link
              href={`/checkout?route=${route.slug}`}
              className="rounded-xl px-5 py-3 text-sm font-semibold text-white"
              style={{ backgroundColor: "var(--brand)" }}
            >
              Book now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
