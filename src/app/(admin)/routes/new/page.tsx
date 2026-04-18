import { PageShell } from "@/components/page-shell";
import { RouteForm } from "../route-form";
import { createRoute } from "../actions";

export default function NewRoutePage() {
  return (
    <PageShell title="New route" description="Add a tour. You can fill in translations and stops after saving.">
      <RouteForm action={createRoute} submitLabel="Create route" />
    </PageShell>
  );
}
