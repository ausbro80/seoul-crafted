"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RouteFormState } from "./actions";

type LangFields = {
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
};

export type RouteFormDefaults = {
  slug?: string;
  tier?: string;
  category?: string | null;
  price_usd?: number;
  duration_min?: number;
  hero_image_url?: string | null;
  theme_color?: string | null;
  badge?: string | null;
  tags?: string[];
  published?: boolean;
  i18n?: {
    en?: LangFields;
    zh?: LangFields;
    ja?: LangFields;
    vi?: LangFields;
  };
};

const TIERS = [
  { value: "curated", label: "Curated (3h pre-designed)" },
  { value: "guided_custom", label: "Guided custom (5h)" },
  { value: "route_only", label: "Route only (itinerary delivery)" },
];

const CATEGORIES = [
  "culture",
  "food",
  "nature",
  "shopping",
  "nightlife",
  "family",
  "photo",
  "craft",
];

const LANGS: { code: "en" | "zh" | "ja" | "vi"; label: string }[] = [
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
  { code: "ja", label: "日本語" },
  { code: "vi", label: "Tiếng Việt" },
];

function LanguageFields({
  lang,
  defaults,
}: {
  lang: "en" | "zh" | "ja" | "vi";
  defaults?: LangFields;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`title_${lang}`}>Title</Label>
        <Input
          id={`title_${lang}`}
          name={`title_${lang}`}
          defaultValue={defaults?.title ?? ""}
          placeholder={
            lang === "en"
              ? "Bukchon hanok morning"
              : lang === "zh"
                ? "北村韩屋之晨"
                : lang === "ja"
                  ? "北村韓屋の朝"
                  : "Buổi sáng ở Bukchon"
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`subtitle_${lang}`}>Subtitle</Label>
        <Input
          id={`subtitle_${lang}`}
          name={`subtitle_${lang}`}
          defaultValue={defaults?.subtitle ?? ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`description_${lang}`}>Description</Label>
        <textarea
          id={`description_${lang}`}
          name={`description_${lang}`}
          rows={5}
          defaultValue={defaults?.description ?? ""}
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>
    </div>
  );
}

export function RouteForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (
    prev: RouteFormState | undefined,
    formData: FormData,
  ) => Promise<RouteFormState>;
  defaults?: RouteFormDefaults;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Translations</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="en" className="w-full">
              <TabsList className="mb-4 grid w-full grid-cols-4">
                {LANGS.map((l) => (
                  <TabsTrigger key={l.code} value={l.code}>
                    {l.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {LANGS.map((l) => (
                <TabsContent key={l.code} value={l.code} className="mt-0">
                  <LanguageFields lang={l.code} defaults={defaults?.i18n?.[l.code]} />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                defaultValue={defaults?.slug ?? ""}
                placeholder="bukchon-morning"
              />
              <p className="text-xs text-muted-foreground">
                Leave blank to auto-generate from English title.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tier">Tier</Label>
              <Select name="tier" defaultValue={defaults?.tier ?? "curated"}>
                <SelectTrigger id="tier">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIERS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" defaultValue={defaults?.category ?? ""}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price_usd">Price (USD)</Label>
              <Input
                id="price_usd"
                name="price_usd"
                type="number"
                step="1"
                min="0"
                defaultValue={defaults?.price_usd ?? 42}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration_min">Duration (min)</Label>
              <Input
                id="duration_min"
                name="duration_min"
                type="number"
                step="15"
                min="30"
                defaultValue={defaults?.duration_min ?? 180}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="hero_image_url">Hero image URL</Label>
              <Input
                id="hero_image_url"
                name="hero_image_url"
                type="url"
                defaultValue={defaults?.hero_image_url ?? ""}
                placeholder="https://… (or pick from Media library)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="theme_color">Theme color</Label>
              <Input
                id="theme_color"
                name="theme_color"
                defaultValue={defaults?.theme_color ?? ""}
                placeholder="#C44536"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="badge">Badge</Label>
              <Input
                id="badge"
                name="badge"
                defaultValue={defaults?.badge ?? ""}
                placeholder="Bestseller"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                name="tags"
                defaultValue={(defaults?.tags ?? []).join(", ")}
                placeholder="morning, walking, hanok"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <aside className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Publish</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center justify-between rounded-md border p-3">
              <div>
                <div className="text-sm font-medium">Published</div>
                <div className="text-xs text-muted-foreground">
                  Visible in the mobile app
                </div>
              </div>
              <input
                type="checkbox"
                name="published"
                defaultChecked={defaults?.published}
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

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base">Coming next</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            <ul className="list-inside list-disc space-y-1">
              <li>Itinerary stops (reorderable)</li>
              <li>Media library picker for hero image</li>
              <li>Live mobile preview card</li>
            </ul>
          </CardContent>
        </Card>
      </aside>
    </form>
  );
}
