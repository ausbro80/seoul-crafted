"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateSettings, type SettingsFormState } from "./actions";

export type SettingsDefaults = {
  brand_name?: string | null;
  tagline?: string | null;
  contact_email?: string | null;
  support_hours?: string | null;
  max_party_size?: number;
  curated_cap_min?: number;
  guided_cap_min?: number;
  promo_codes?: unknown;
};

export function SettingsForm({ defaults }: { defaults: SettingsDefaults }) {
  const [state, formAction, pending] = useActionState<SettingsFormState, FormData>(
    updateSettings,
    {},
  );

  const promoJson = JSON.stringify(defaults.promo_codes ?? [], null, 2);

  return (
    <form action={formAction} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Brand</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="brand_name">Brand name</Label>
            <Input
              id="brand_name"
              name="brand_name"
              defaultValue={defaults.brand_name ?? ""}
              placeholder="Day to Day Korea"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              name="tagline"
              defaultValue={defaults.tagline ?? ""}
              placeholder="Live Seoul like a local."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_email">Contact email</Label>
            <Input
              id="contact_email"
              name="contact_email"
              type="email"
              defaultValue={defaults.contact_email ?? ""}
              placeholder="hello@d2dk.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="support_hours">Support hours</Label>
            <Input
              id="support_hours"
              name="support_hours"
              defaultValue={defaults.support_hours ?? ""}
              placeholder="Mon–Sat 9am–9pm KST"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tour rules</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="max_party_size">Max party size</Label>
            <Input
              id="max_party_size"
              name="max_party_size"
              type="number"
              min="1"
              max="12"
              defaultValue={defaults.max_party_size ?? 6}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="curated_cap_min">Curated cap (min)</Label>
            <Input
              id="curated_cap_min"
              name="curated_cap_min"
              type="number"
              step="15"
              min="30"
              defaultValue={defaults.curated_cap_min ?? 180}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guided_cap_min">Guided cap (min)</Label>
            <Input
              id="guided_cap_min"
              name="guided_cap_min"
              type="number"
              step="15"
              min="30"
              defaultValue={defaults.guided_cap_min ?? 300}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Promo codes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="promo_codes" className="text-xs text-muted-foreground">
            JSON array. Example: {`[{"code":"WELCOME","percent":10}]`}
          </Label>
          <textarea
            id="promo_codes"
            name="promo_codes"
            rows={6}
            defaultValue={promoJson}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 font-mono text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3">
        {state?.error ? (
          <p className="text-sm text-[var(--brand)]">{state.error}</p>
        ) : null}
        {state?.ok ? (
          <p className="text-sm text-[var(--success)]">Saved.</p>
        ) : null}
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save settings"}
        </Button>
      </div>
    </form>
  );
}
