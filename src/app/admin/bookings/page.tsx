import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";
import { updateBookingStatus } from "./actions";
import { GuideSelect } from "./guide-select";

export const dynamic = "force-dynamic";

type BookingRow = {
  id: string;
  customer_email: string;
  customer_name: string | null;
  booking_date: string | null;
  people: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  price_cents: number;
  guide_id: string | null;
  created_at: string;
  routes: {
    slug: string;
    routes_i18n: { lang: string; title: string | null }[] | null;
  } | null;
  guides: { id: string; name: string } | null;
};

const FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-[var(--warn-soft)] text-[var(--warn)]",
  confirmed: "bg-[var(--success-soft)] text-[var(--success)]",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-[var(--brand-soft)] text-[var(--brand)]",
};

const NEXT_STATUS: Record<BookingRow["status"], BookingRow["status"] | null> = {
  pending: "confirmed",
  confirmed: "completed",
  completed: null,
  cancelled: null,
};

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status = "all" } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("bookings")
    .select(
      "id, customer_email, customer_name, booking_date, people, status, price_cents, guide_id, created_at, routes(slug, routes_i18n(lang, title)), guides(id, name)",
    )
    .order("created_at", { ascending: false });

  if (status !== "all" && VALID_STATUSES.includes(status)) {
    query = query.eq("status", status);
  }

  const { data: bookings, error } = await query.returns<BookingRow[]>();

  const { data: guides } = await supabase
    .from("guides")
    .select("id, name, active")
    .order("name", { ascending: true });

  return (
    <PageShell
      title="Bookings"
      description="Confirm, complete, or cancel tours. Click a status pill to filter."
    >
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = status === f.value;
          return (
            <Link
              key={f.value}
              href={f.value === "all" ? "/bookings" : `/bookings?status=${f.value}`}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {error ? (
        <Card className="border-[var(--brand)] bg-[var(--brand-soft)]">
          <CardContent className="py-4 text-sm text-[var(--brand)]">
            Failed to load bookings: {error.message}
          </CardContent>
        </Card>
      ) : !bookings || bookings.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No bookings{status === "all" ? "" : ` with status "${status}"`} yet.
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Customer</th>
                  <th className="px-4 py-3 text-left font-medium">Route</th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Guide</th>
                  <th className="px-4 py-3 text-left font-medium">Ppl</th>
                  <th className="px-4 py-3 text-left font-medium">Price</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {bookings.map((b) => {
                  const routeTitle =
                    b.routes?.routes_i18n?.find((t) => t.lang === "en")?.title ??
                    b.routes?.slug ??
                    "—";
                  const next = NEXT_STATUS[b.status];
                  return (
                    <tr key={b.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="font-medium">
                          {b.customer_name ?? b.customer_email}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {b.customer_email}
                        </div>
                      </td>
                      <td className="px-4 py-3">{routeTitle}</td>
                      <td className="px-4 py-3 tabular-nums">
                        {b.booking_date ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <GuideSelect
                          bookingId={b.id}
                          currentGuideId={b.guide_id}
                          guides={guides ?? []}
                        />
                      </td>
                      <td className="px-4 py-3 tabular-nums">{b.people}</td>
                      <td className="px-4 py-3 tabular-nums">
                        {formatPrice(b.price_cents)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="secondary"
                          className={`${STATUS_STYLE[b.status] ?? ""} hover:opacity-100`}
                        >
                          {b.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          {next ? (
                            <form action={updateBookingStatus}>
                              <input type="hidden" name="id" value={b.id} />
                              <input type="hidden" name="status" value={next} />
                              <Button type="submit" size="sm" variant="outline">
                                {next === "confirmed"
                                  ? "Confirm"
                                  : next === "completed"
                                    ? "Mark complete"
                                    : next}
                              </Button>
                            </form>
                          ) : null}
                          {b.status !== "cancelled" && b.status !== "completed" ? (
                            <form action={updateBookingStatus}>
                              <input type="hidden" name="id" value={b.id} />
                              <input type="hidden" name="status" value="cancelled" />
                              <Button type="submit" size="sm" variant="ghost">
                                Cancel
                              </Button>
                            </form>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </PageShell>
  );
}

const VALID_STATUSES = ["pending", "confirmed", "completed", "cancelled"];
