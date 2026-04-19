"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GuideFormState } from "./actions";

export type GuideFormDefaults = {
  name?: string;
  photo_url?: string | null;
  bio?: string | null;
  languages?: string[];
  active?: boolean;
  rating?: number | null;
};

export function GuideForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (
    prev: GuideFormState | undefined,
    formData: FormData,
  ) => Promise<GuideFormState>;
  defaults?: GuideFormDefaults;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={defaults?.name ?? ""}
                placeholder="Jiwoo Park"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="photo_url">Photo URL</Label>
              <Input
                id="photo_url"
                name="photo_url"
                type="url"
                defaultValue={defaults?.photo_url ?? ""}
                placeholder="https://…"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                name="bio"
                rows={5}
                defaultValue={defaults?.bio ?? ""}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="A sentence or two. Languages, favorite neighborhoods, style…"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="languages">Languages (comma-separated)</Label>
                <Input
                  id="languages"
                  name="languages"
                  defaultValue={(defaults?.languages ?? []).join(", ")}
                  placeholder="en, ko, ja"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">Rating (0–5)</Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  defaultValue={defaults?.rating ?? ""}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <aside className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center justify-between rounded-md border p-3">
              <div>
                <div className="text-sm font-medium">Active</div>
                <div className="text-xs text-muted-foreground">
                  Available for new bookings
                </div>
              </div>
              <input
                type="checkbox"
                name="active"
                defaultChecked={defaults?.active ?? true}
                className="h-4 w-4"
              />
            </label>
            {state?.error ? (
              <p className="text-sm text-[var(--brand)]">{state.error}</p>
            ) : null}
            {state?.ok ? (
              <p className="text-sm text-[var(--success)]">Saved.</p>
            ) : null}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Saving…" : submitLabel}
            </Button>
          </CardContent>
        </Card>
      </aside>
    </form>
  );
}
