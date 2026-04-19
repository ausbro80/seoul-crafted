import { PageShell } from "@/components/page-shell";
import { GuideForm } from "../guide-form";
import { createGuide } from "../actions";

export default function NewGuidePage() {
  return (
    <PageShell title="New guide" description="Add a local guide to the roster.">
      <GuideForm action={createGuide} submitLabel="Create guide" />
    </PageShell>
  );
}
