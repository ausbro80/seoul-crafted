import { PageShell } from "@/components/page-shell";
import { EmptyPhaseB } from "@/components/empty-phase-b";

export default function MediaPage() {
  return (
    <PageShell
      title="Media library"
      description="Route hero images, guide photos, marketing assets."
    >
      <EmptyPhaseB
        title="Asset grid — coming in Phase B"
        whatsNext={[
          "Drag-drop upload (multiple files) to Supabase Storage bucket 'media'",
          "Grid with thumbnail + filename + dimensions + usage",
          "Copy-URL / replace / delete actions",
          "Image transformation via Supabase Storage renderer or next/image",
        ]}
      />
    </PageShell>
  );
}
