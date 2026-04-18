import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageShell } from "@/components/page-shell";
import { EmptyPhaseB } from "@/components/empty-phase-b";

const STATS = [
  { label: "Bookings (30d)", value: "—", hint: "confirmed + pending" },
  { label: "Revenue (30d)", value: "—", hint: "USD, after refunds" },
  { label: "Active routes", value: "—", hint: "published" },
  { label: "Unread messages", value: "—", hint: "guide + support" },
];

export default function DashboardPage() {
  return (
    <PageShell
      title="Dashboard"
      description="Operational overview across routes, bookings, and inbox."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <Card key={s.label}>
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
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent bookings</CardTitle>
            <CardDescription>Last 10 across all routes</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Connect Supabase (Phase B) to list confirmed + pending bookings with
            customer, route, date, status.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Unread messages</CardTitle>
            <CardDescription>Guide + support inbox</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Realtime inbox lands with Supabase Realtime in Phase B.
          </CardContent>
        </Card>
      </div>

      <EmptyPhaseB
        title="Live data coming next"
        whatsNext={[
          "Supabase schema: routes, guides, bookings, messages, i18n_strings, media",
          "Admin auth (invite-only, Supabase Auth email+magic link)",
          "Row-level security policies for admin role",
          "Realtime subscriptions for messages + booking status",
        ]}
      />
    </PageShell>
  );
}
