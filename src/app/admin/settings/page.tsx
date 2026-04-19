import { PageShell } from "@/components/page-shell";
import { createClient } from "@/lib/supabase/server";
import { SettingsForm, type SettingsDefaults } from "./settings-form";

export const dynamic = "force-dynamic";

type SettingsRow = {
  brand_name: string | null;
  tagline: string | null;
  contact_email: string | null;
  support_hours: string | null;
  max_party_size: number;
  curated_cap_min: number;
  guided_cap_min: number;
  promo_codes: unknown;
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("settings")
    .select(
      "brand_name, tagline, contact_email, support_hours, max_party_size, curated_cap_min, guided_cap_min, promo_codes",
    )
    .eq("id", 1)
    .maybeSingle<SettingsRow>();

  const defaults: SettingsDefaults = {
    brand_name: data?.brand_name ?? "Day to Day Korea",
    tagline: data?.tagline ?? null,
    contact_email: data?.contact_email ?? null,
    support_hours: data?.support_hours ?? null,
    max_party_size: data?.max_party_size ?? 6,
    curated_cap_min: data?.curated_cap_min ?? 180,
    guided_cap_min: data?.guided_cap_min ?? 300,
    promo_codes: data?.promo_codes ?? [],
  };

  return (
    <PageShell
      title="Settings"
      description="Brand, tour rules, promo codes. Applied to customer app."
    >
      <SettingsForm defaults={defaults} />
    </PageShell>
  );
}
