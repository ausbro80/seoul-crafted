import { PageShell } from "@/components/page-shell";
import { EmptyPhaseB } from "@/components/empty-phase-b";

export default function BookingsPage() {
  return (
    <PageShell
      title="Bookings"
      description="Filter by status, run inline confirm / complete actions."
    >
      <EmptyPhaseB
        title="Bookings table — coming in Phase B"
        whatsNext={[
          "Filter pills: all / pending / confirmed / completed / cancelled",
          "Inline status transition buttons (Confirm → Complete)",
          "Supabase table: bookings (id, customer_email, route_id, guide_id, date, status, price_cents, stripe_payment_intent_id, created_at)",
          "Payment hook-up: Stripe (explicitly deferred per project plan)",
        ]}
      />
    </PageShell>
  );
}
