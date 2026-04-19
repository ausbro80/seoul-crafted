import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Clock, MessageCircle, LifeBuoy } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDuration, formatPrice } from "@/lib/format";
import { getTravelerEmail } from "../../_actions/booking";
import { getLang, pickI18n } from "@/lib/i18n";
import { t, type StringKey } from "@/lib/ui-strings";
import { cancelBooking } from "./actions";

export const dynamic = "force-dynamic";

type TripDetail = {
  id: string;
  customer_email: string;
  customer_name: string | null;
  booking_date: string | null;
  people: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  price_cents: number;
  note: string | null;
  created_at: string;
  routes: {
    id: string;
    slug: string;
    hero_image_url: string | null;
    theme_color: string | null;
    duration_min: number;
    routes_i18n:
      | { lang: string; title: string | null; subtitle: string | null }[]
      | null;
    route_stops:
      | {
          position: number;
          time_label: string | null;
          title: string;
          duration_min: number | null;
          note: string | null;
        }[]
      | null;
  } | null;
  guides: {
    id: string;
    name: string;
    photo_url: string | null;
    bio: string | null;
    languages: string[] | null;
  } | null;
};

const STATUS_STYLE: Record<string, { bg: string; fg: string; labelKey: StringKey }> = {
  pending: { bg: "#F5E9CF", fg: "#9A7418", labelKey: "status_pending" },
  confirmed: { bg: "#DCEBE5", fg: "#2F855A", labelKey: "status_confirmed" },
  completed: { bg: "#F3ECE1", fg: "#6B5F4E", labelKey: "status_completed" },
  cancelled: { bg: "#F4DDD7", fg: "#C44536", labelKey: "status_cancelled" },
};

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lang = await getLang();
  const email = await getTravelerEmail();

  if (!email) notFound();

  const supabase = await createClient();
  const { data: booking } = await supabase
    .from("bookings")
    .select(
      "id, customer_email, customer_name, booking_date, people, status, price_cents, note, created_at, routes(id, slug, hero_image_url, theme_color, duration_min, routes_i18n(lang, title, subtitle), route_stops(position, time_label, title, duration_min, note)), guides(id, name, photo_url, bio, languages)",
    )
    .eq("id", id)
    .maybeSingle<TripDetail>();

  if (!booking || booking.customer_email !== email) notFound();

  const tr = pickI18n(booking.routes?.routes_i18n, lang);
  const stops = (booking.routes?.route_stops ?? [])
    .slice()
    .sort((a, b) => a.position - b.position);
  const statusStyle = STATUS_STYLE[booking.status];
  const canCancel = booking.status === "pending" || booking.status === "confirmed";

  return (
    <div className="pb-10">
      {/* Hero + back */}
      <div className="relative">
        <div
          className="aspect-[16/10] w-full"
          style={{
            backgroundColor: booking.routes?.theme_color ?? "var(--brand)",
            backgroundImage: booking.routes?.hero_image_url
              ? `url(${booking.routes.hero_image_url})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Link
          href="/trips"
          className="absolute left-4 top-4 flex size-9 items-center justify-center rounded-full bg-white/90 backdrop-blur"
          aria-label={t(lang, "back")}
        >
          <ChevronLeft className="size-4" />
        </Link>
        {statusStyle ? (
          <div
            className="absolute bottom-4 left-4 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em]"
            style={{ backgroundColor: statusStyle.bg, color: statusStyle.fg }}
          >
            {t(lang, statusStyle.labelKey)}
          </div>
        ) : null}
      </div>

      {/* Title + meta */}
      <section className="px-5 pt-5">
        <h1 className="font-display text-2xl leading-tight">
          {tr?.title ?? booking.routes?.slug ?? "Trip"}
        </h1>
        {tr?.subtitle ? (
          <p className="mt-1 text-sm" style={{ color: "var(--ink-subtle)" }}>
            {tr.subtitle}
          </p>
        ) : null}

        <div
          className="mt-4 grid grid-cols-3 gap-3 rounded-2xl border bg-card p-4 text-center text-xs"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <div style={{ color: "var(--ink-subtle)" }}>
              {t(lang, "trip_meta_date")}
            </div>
            <div className="mt-0.5 font-medium">
              {booking.booking_date ?? t(lang, "trip_date_tbd")}
            </div>
          </div>
          <div>
            <div style={{ color: "var(--ink-subtle)" }}>
              {t(lang, "trip_meta_group")}
            </div>
            <div className="mt-0.5 font-medium">
              {booking.people}{" "}
              {booking.people === 1 ? t(lang, "trip_person") : t(lang, "trip_people")}
            </div>
          </div>
          <div>
            <div style={{ color: "var(--ink-subtle)" }}>
              {t(lang, "trip_meta_total")}
            </div>
            <div className="mt-0.5 font-medium">
              {formatPrice(booking.price_cents)}
            </div>
          </div>
        </div>
      </section>

      {/* Guide */}
      <section className="px-5 pt-6">
        <h2
          className="mb-3 text-[11px] uppercase tracking-[0.18em]"
          style={{ color: "var(--ink-subtle)" }}
        >
          {t(lang, "trip_section_guide")}
        </h2>
        {booking.guides ? (
          <div
            className="flex items-center gap-3 rounded-2xl border bg-card p-3"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className="size-14 flex-shrink-0 rounded-full bg-muted"
              style={{
                backgroundImage: booking.guides.photo_url
                  ? `url(${booking.guides.photo_url})`
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="truncate font-medium">{booking.guides.name}</div>
              {booking.guides.languages && booking.guides.languages.length > 0 ? (
                <div
                  className="truncate text-xs"
                  style={{ color: "var(--ink-subtle)" }}
                >
                  {booking.guides.languages.join(" · ")}
                </div>
              ) : null}
              {booking.guides.bio ? (
                <div
                  className="mt-1 line-clamp-2 text-xs"
                  style={{ color: "var(--ink-subtle)" }}
                >
                  {booking.guides.bio}
                </div>
              ) : null}
            </div>
            <Link
              href="/chat?tab=guide"
              className="flex-shrink-0 rounded-xl px-3 py-2 text-xs font-semibold text-white"
              style={{ backgroundColor: "var(--brand)" }}
            >
              <MessageCircle className="inline size-3.5" />
            </Link>
          </div>
        ) : (
          <div
            className="rounded-2xl border border-dashed p-4 text-sm"
            style={{
              borderColor: "var(--border)",
              color: "var(--ink-subtle)",
            }}
          >
            {t(lang, "trip_guide_unassigned")}
          </div>
        )}
      </section>

      {/* Itinerary */}
      {stops.length > 0 ? (
        <section className="px-5 pt-6">
          <h2
            className="mb-3 text-[11px] uppercase tracking-[0.18em]"
            style={{ color: "var(--ink-subtle)" }}
          >
            {t(lang, "trip_section_itinerary")}
          </h2>
          <ol className="space-y-3">
            {stops.map((s) => (
              <li
                key={s.position}
                className="flex gap-3 rounded-2xl border bg-card p-3"
                style={{ borderColor: "var(--border)" }}
              >
                <div
                  className="flex size-8 flex-shrink-0 items-center justify-center rounded-full border text-xs font-semibold"
                  style={{ borderColor: "var(--border)" }}
                >
                  {s.position}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate font-medium">{s.title}</div>
                    {s.time_label ? (
                      <span
                        className="whitespace-nowrap text-xs"
                        style={{ color: "var(--ink-subtle)" }}
                      >
                        {s.time_label}
                      </span>
                    ) : null}
                  </div>
                  {s.duration_min ? (
                    <div
                      className="text-[11px]"
                      style={{ color: "var(--ink-subtle)" }}
                    >
                      <Clock className="mr-1 inline size-3" />
                      {s.duration_min} min
                    </div>
                  ) : null}
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

      {/* Customer-added note */}
      {booking.note ? (
        <section className="px-5 pt-6">
          <h2
            className="mb-3 text-[11px] uppercase tracking-[0.18em]"
            style={{ color: "var(--ink-subtle)" }}
          >
            {t(lang, "trip_notes")}
          </h2>
          <div
            className="whitespace-pre-wrap rounded-2xl border bg-card p-3 text-sm"
            style={{ borderColor: "var(--border)" }}
          >
            {booking.note}
          </div>
        </section>
      ) : null}

      {/* Actions */}
      <section className="px-5 pt-6">
        <h2
          className="mb-3 text-[11px] uppercase tracking-[0.18em]"
          style={{ color: "var(--ink-subtle)" }}
        >
          {t(lang, "trip_section_actions")}
        </h2>
        <div className="flex flex-col gap-2">
          <Link
            href="/chat?tab=guide"
            className="flex items-center justify-between rounded-xl border bg-card px-4 py-3 text-sm"
            style={{ borderColor: "var(--border)" }}
          >
            <span className="flex items-center gap-2">
              <MessageCircle className="size-4" />
              {t(lang, "trip_msg_guide")}
            </span>
            <span style={{ color: "var(--ink-subtle)" }}>→</span>
          </Link>
          <Link
            href="/chat?tab=support"
            className="flex items-center justify-between rounded-xl border bg-card px-4 py-3 text-sm"
            style={{ borderColor: "var(--border)" }}
          >
            <span className="flex items-center gap-2">
              <LifeBuoy className="size-4" />
              {t(lang, "trip_msg_support")}
            </span>
            <span style={{ color: "var(--ink-subtle)" }}>→</span>
          </Link>

          {canCancel ? (
            <details
              className="rounded-xl border bg-card"
              style={{ borderColor: "var(--border)" }}
            >
              <summary
                className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm"
                style={{ color: "var(--brand)" }}
              >
                <span>{t(lang, "trip_cancel")}</span>
                <span>▾</span>
              </summary>
              <div
                className="border-t p-4"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="text-sm font-medium">
                  {t(lang, "trip_cancel_confirm_title")}
                </div>
                <div
                  className="mt-1 text-xs"
                  style={{ color: "var(--ink-subtle)" }}
                >
                  {t(lang, "trip_cancel_confirm_body")}
                </div>
                <form action={cancelBooking.bind(null, booking.id)} className="mt-3">
                  <button
                    type="submit"
                    className="w-full rounded-xl py-2.5 text-sm font-semibold text-white"
                    style={{ backgroundColor: "var(--brand)" }}
                  >
                    {t(lang, "trip_cancel_confirm_yes")}
                  </button>
                </form>
              </div>
            </details>
          ) : null}
        </div>
      </section>
    </div>
  );
}
