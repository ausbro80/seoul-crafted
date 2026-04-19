import { PageShell } from "@/components/page-shell";
import { RouteForm, type MediaOption } from "../route-form";
import { createRoute } from "../actions";
import { createClient } from "@/lib/supabase/server";

export default async function NewRoutePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("media")
    .select("id, path, filename")
    .order("created_at", { ascending: false });

  const mediaOptions: MediaOption[] = (data ?? []).map((m) => ({
    id: m.id,
    filename: m.filename,
    url: supabase.storage.from("media").getPublicUrl(m.path).data.publicUrl,
  }));

  return (
    <PageShell
      title="New route"
      description="Add a tour. You can fill in translations and stops after saving."
    >
      <RouteForm
        action={createRoute}
        submitLabel="Create route"
        mediaOptions={mediaOptions}
      />
    </PageShell>
  );
}
