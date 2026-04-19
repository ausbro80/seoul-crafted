"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { upsertString, deleteString } from "./actions";

type Row = {
  key: string;
  en: string | null;
  zh: string | null;
  ja: string | null;
  vi: string | null;
};

export function StringRow({ row, isNew = false }: { row?: Row; isNew?: boolean }) {
  const [state, formAction, pending] = useActionState<
    { error?: string; ok?: boolean } | null,
    FormData
  >(upsertString, null);
  const [open, setOpen] = useState(isNew);

  const k = row?.key ?? "";

  return (
    <div
      className="rounded-lg border bg-card"
      style={{ borderColor: "var(--border)" }}
    >
      {!isNew ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-2.5 text-left"
        >
          <div className="truncate">
            <span className="font-mono text-xs">{k}</span>
            <span
              className="ml-3 truncate text-xs"
              style={{ color: "var(--ink-subtle)" }}
            >
              {row?.en ?? "—"}
            </span>
          </div>
          <span className="text-xs">{open ? "▴" : "▾"}</span>
        </button>
      ) : null}
      {open || isNew ? (
        <form
          action={formAction}
          className="space-y-2 border-t p-3"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
            <div className="space-y-1 sm:col-span-1">
              <label className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Key
              </label>
              <Input
                name="key"
                defaultValue={k}
                readOnly={!isNew}
                placeholder="e.g. home_hero_1"
                className="font-mono text-xs"
              />
            </div>
            {(["en", "zh", "ja", "vi"] as const).map((lang) => (
              <div key={lang} className="space-y-1">
                <label className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {lang.toUpperCase()}
                </label>
                <Input
                  name={lang}
                  defaultValue={row?.[lang] ?? ""}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs">
              {state?.error ? (
                <span className="text-[var(--brand)]">{state.error}</span>
              ) : state?.ok ? (
                <span className="text-[var(--success)]">Saved.</span>
              ) : null}
            </div>
            <div className="flex gap-2">
              {!isNew && k ? (
                <form action={deleteString.bind(null, k)}>
                  <Button
                    type="submit"
                    size="sm"
                    variant="ghost"
                    className="text-[var(--brand)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand)]"
                  >
                    Delete
                  </Button>
                </form>
              ) : null}
              <Button type="submit" size="sm" disabled={pending}>
                {pending ? "Saving…" : isNew ? "Add string" : "Save"}
              </Button>
            </div>
          </div>
        </form>
      ) : null}
    </div>
  );
}
