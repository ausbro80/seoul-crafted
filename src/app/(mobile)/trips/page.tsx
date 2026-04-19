import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";
import { getTravelerEmail } from "../_actions/booking";

export const dynamic = "force-dynamic";

type TripRow = {
  id: string;
  booking_date: string | null;
  people: number;
  status: string;
  price_cents: number;
  note: string | null;
  created_at: string;
  routes: {
    slug: string;
    hero_image_url: string | null;
    theme_color: string | null;
    routes_i18n: { lang: string; title: string | null }[] | null;
  } | null;
};

const STATUS_STYLE: Record<string, { bg: string; fg: string; label: string }> = {
  pending: { bg: "#F5E9CF", fg: "#9A7418", label: "Pending" },
  confirmed: { bg: "#DCEBE5", fg: "#2F855A", label: "Confirmed" },
  completed: { bg: "#F3ECE1", fg: "#6B5F4E", label: "Completed" },
  cancelled: { bg: "#F4DDD7", fg: "#C44536", label: "Cancelled" },
};

export default async function TripsPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const { new: isNew } = await searchParams;
  const email = await getTravelerEmail();

  const supabase = await createClient();
  let trips: TripRow[] = [];
  if (email) {
    const { data } = await supabase
      .from("bookings")
      .select(
        "id, booking_date, people, status, price_cents, note, created_at, routes(slug, hero_image_url, theme_color, routes_i18n(lang, title))",
      )
      .eq("customer_email", email)
      .order("created_at", { ascending: false })
      .returns<TripRow[]>();
    trips = data ?? [];
  }

  const upcoming = trips.filter(
    (t) => t.status === "pending" || t.status === "confirmed",
  );
  const past = trips.filter(
    (t) => t.status === "completed" || t.status === "cancelled",
  );

  return (
    <>
      <header className="px-5 pt-5">
        <h1 className="font-display text-3xl">My trips</h1>
        {email ? (
          <p
            className="mt-1 text-xs"
            style={{ color: "var(--ink-subtle)" }}
          >
            {email}
          </p>
        ) : null}
      </header>

      {isNew ? (
        <section className="px-5 pt-4">
          <div
            className="rounded-2xl p-3 text-sm"
            style={{
              backgroundColor: "var(--jade-soft)",
              color: "var(--jade)",
            }}
          >
            Reserved ✓ — our team will confirm by email.
          </div>
        </section>
      ) : null}

      {!email || trips.length === 0 ? (
        <section className="px-5 pt-6">
          <div
            className="rounded-2xl border border-dashed px-4 py-16 text-center text-sm"
            style={{
              borderColor: "var(--border)",
              color: "var(--ink-subtle)",
            }}
          >
            No trips yet.{" "}
            <Link
              href="/browse"
              className="font-medium"
              style={{ color: "var(--brand)" }}
            >
              Browse routes
            </Link>
            .
          </div>
        </section>
      ) : (
        <>
          {upcoming.length > 0 ? (
            <TripsSection title="Upcoming" trips={upcoming} />
          ) : null}
          {past.length > 0 ? (
            <TripsSection title="Past" trips={past} />
          ) : null}
        </>
      )}
    </>
  );
}

function TripsSection({ title, trips }: { title: string; trips: TripRow[] }) {
  return (
    <section className="px-5 pt-6">
      <h2
        className="mb-3 text-[11px] uppercase tracking-[0.18em]"
        style={{ color: "var(--ink-subtle)" }}
      >
        {title}
      </h2>
      <div className="flex flex-col gap-3">
        {trips.map((t) => {
          const en = t.routes?.routes_i18n?.find((x) => x.lang === "en");
          const label = en?.title ?? t.routes?.slug ?? "Custom tour";
          const stl = STATUS_STYLE[t.status];
          return (
            <div
              key={t.id}
              className="flex gap-3 overflow-hidden rounded-2xl border bg-card p-3"
              style={{ borderColor: "var(--border)" }}
            >
              <div
                className="size-20 flex-shrink-0 rounded-xl"
                style={{
                  backgroundColor: t.routes?.theme_color ?? "var(--muted)",
                  backgroundImage: t.routes?.hero_image_url
                    ? `url(${t.routes.hero_image_url})`
                    : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="font-display text-base leading-tight">
                    {label}
                  </div>
                  <div
                    className="mt-0.5 text-xs"
                    style={{ color: "var(--ink-subtle)" }}
                  >
                    {t.booking_date ?? "Date TBD"} · {t.people}{" "}
                    {t.people === 1 ? "person" : "people"}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em]"
                    style={{ backgroundColor: stl.bg, color: stl.fg }}
                  >
                    {stl.label}
                  </span>
                  <span className="text-xs font-semibold">
                    {formatPrice(t.price_cents)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
