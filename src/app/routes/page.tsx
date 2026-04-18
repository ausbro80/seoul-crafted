import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/page-shell";
import { EmptyPhaseB } from "@/components/empty-phase-b";

export default function RoutesPage() {
  return (
    <PageShell
      title="Routes"
      description="Curated, guided custom, and route-only tours."
      actions={<Button disabled>New route</Button>}
    >
      <EmptyPhaseB
        title="Route editor — coming in Phase B"
        whatsNext={[
          "Grid of route cards with hero image, title, price, status toggle",
          "Editor: Overview / Translations (EN·ZH·JA·VI) / Itinerary tabs",
          "Right rail: published toggle, theme color, live mobile preview",
          "Supabase table: routes (id, slug, tier, price_usd, duration_min, published, created_at) + routes_i18n + route_stops",
        ]}
      />
    </PageShell>
  );
}
