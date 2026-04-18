import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageShell } from "@/components/page-shell";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

type RecentBooking = {
  id: string;
  customer_email: string;
  booking_date: string | null;
  status: string;
  price_cents: number;
  created_at: string;
  routes: { slug: string; routes_i18n: { lang: string; title: string | null }[] | null } | null;
};

type UnreadMessage = {
  id: string;
  body: string;
  sender: string;
  created_at: string;
  conversations: { customer_email: string; channel: string } | null;
};

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-[var(--warn-soft)] text-[var(--warn)]",
  confirmed: "bg-[var(--success-soft)] text-[var(--success)]",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-[var(--brand-soft)] text-[var(--brand)]",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [
    bookingsCount,
    revenueRows,
    routesPublished,
    unreadCount,
    recentBookings,
    unreadMessages,
  ] = await Promise.all([
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .gte("created_at", thirtyDaysAgo),
    supabase
      .from("bookings")
      .select("price_cents, status, created_at")
      .gte("created_at", thirtyDaysAgo)
      .in("status", ["confirmed", "completed"]),
    supabase
      .from("routes")
      .select("id", { count: "exact", head: true })
      .eq("published", true),
    supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .is("read_at", null)
      .eq("sender", "customer"),
    supabase
      .from("bookings")
      .select(
        "id, customer_email, booking_date, status, price_cents, created_at, routes(slug, routes_i18n(lang, title))",
      )
      .order("created_at", { ascending: false })
      .limit(10)
      .returns<RecentBooking[]>(),
    supabase
      .from("messages")
      .select(
        "id, body, sender, created_at, conversations(customer_email, channel)",
      )
      .is("read_at", null)
      .eq("sender", "customer")
      .order("created_at", { ascending: false })
      .limit(6)
      .returns<UnreadMessage[]>(),
  ]);

  const revenueCents = (revenueRows.data ?? []).reduce(
    (sum, r) => sum + (r.price_cents ?? 0),
    0,
  );

  const stats = [
    {
      label: "Bookings (30d)",
      value: (bookingsCount.count ?? 0).toLocaleString(),
      hint: "all statuses",
      href: "/bookings",
    },
    {
      label: "Revenue (30d)",
      value: formatPrice(revenueCents),
      hint: "confirmed + completed",
      href: "/bookings",
    },
    {
      label: "Active routes",
      value: (routesPublished.count ?? 0).toLocaleString(),
      hint: "published",
      href: "/routes",
    },
    {
      label: "Unread messages",
      value: (unreadCount.count ?? 0).toLocaleString(),
      hint: "from customers",
      href: "/messages",
    },
  ];

  return (
    <PageShell
      title="Dashboard"
      description="Operational overview across routes, bookings, and inbox."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="h-full transition hover:border-foreground/20 hover:shadow-sm">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs uppercase tracking-wide">
                  {s.label}
                </CardDescription>
                <CardTitle className="text-3xl font-semibold">{s.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{s.hint}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent bookings</CardTitle>
            <CardDescription>Last 10 across all routes</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {!recentBookings.data || recentBookings.data.length === 0 ? (
              <div className="px-6 pb-6 text-sm text-muted-foreground">
                No bookings yet.
              </div>
            ) : (
              <div className="divide-y">
                {recentBookings.data.map((b) => {
                  const routeTitle =
                    b.routes?.routes_i18n?.find((t) => t.lang === "en")?.title ??
                    b.routes?.slug ??
                    "—";
                  return (
                    <Link
                      key={b.id}
                      href="/bookings"
                      className="flex items-center gap-3 px-6 py-3 text-sm hover:bg-muted/40"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium">{routeTitle}</div>
                        <div className="truncate text-xs text-muted-foreground">
                          {b.customer_email}
                          {b.booking_date ? ` · ${b.booking_date}` : ""}
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`${STATUS_STYLE[b.status] ?? ""} hover:opacity-100`}
                      >
                        {b.status}
                      </Badge>
                      <div className="w-20 text-right tabular-nums">
                        {formatPrice(b.price_cents)}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Unread messages</CardTitle>
            <CardDescription>Customer-side threads</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {!unreadMessages.data || unreadMessages.data.length === 0 ? (
              <div className="px-6 pb-6 text-sm text-muted-foreground">
                Inbox zero.
              </div>
            ) : (
              <div className="divide-y">
                {unreadMessages.data.map((m) => (
                  <Link
                    key={m.id}
                    href="/messages"
                    className="block px-6 py-3 text-sm hover:bg-muted/40"
                  >
                    <div className="truncate font-medium">
                      {m.conversations?.customer_email ?? "—"}
                    </div>
                    <div className="mt-0.5 truncate text-xs text-muted-foreground">
                      {m.conversations?.channel === "guide" ? "guide" : "support"}
                      {" · "}
                      {m.body}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
