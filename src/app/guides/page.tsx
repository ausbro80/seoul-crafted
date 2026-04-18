import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/page-shell";
import { EmptyPhaseB } from "@/components/empty-phase-b";

export default function GuidesPage() {
  return (
    <PageShell
      title="Guides"
      description="Photo, bio, languages, and active status."
      actions={<Button disabled>Add guide</Button>}
    >
      <EmptyPhaseB
        title="Guide directory — coming in Phase B"
        whatsNext={[
          "List + side editor: photo upload, name, bio, languages, active toggle",
          "Supabase table: guides (id, name, photo_url, languages[], bio, active, rating)",
          "Guide auth role + payout setup (Stripe Connect later)",
        ]}
      />
    </PageShell>
  );
}
