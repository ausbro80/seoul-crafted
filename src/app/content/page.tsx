import { PageShell } from "@/components/page-shell";
import { EmptyPhaseB } from "@/components/empty-phase-b";

export default function ContentPage() {
  return (
    <PageShell
      title="Content & i18n"
      description="Every customer-facing string across EN · 中文 · 日本語 · Tiếng Việt."
    >
      <EmptyPhaseB
        title="String editor — coming in Phase B"
        whatsNext={[
          "Language picker: en / zh / ja / vi",
          "Key-value table of every app string with inline edit",
          "Supabase table: i18n_strings (key, en, zh, ja, vi, updated_at, updated_by)",
          "Fallback to EN on missing keys; export as JSON for the mobile bundle",
        ]}
      />
    </PageShell>
  );
}
