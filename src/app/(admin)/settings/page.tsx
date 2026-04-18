import { PageShell } from "@/components/page-shell";
import { EmptyPhaseB } from "@/components/empty-phase-b";

export default function SettingsPage() {
  return (
    <PageShell
      title="Settings"
      description="Brand info, tour rules, promo codes, data export."
    >
      <EmptyPhaseB
        title="Settings — coming in Phase B"
        whatsNext={[
          "Brand: name, tagline, contact email, support hours",
          "Tour rules: 3h curated cap, 5h guided custom cap, 6-person max party size",
          "Promo codes table",
          "JSON export of all content; danger-zone reset",
        ]}
      />
    </PageShell>
  );
}
