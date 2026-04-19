"use client";

import { useActionState, useState } from "react";
import { createCustomIntake, type BookingFormState } from "../_actions/booking";
import type { Lang } from "@/lib/i18n";
import { t, type StringKey } from "@/lib/ui-strings";

const INTERESTS: { id: string; labelKey: StringKey; emoji: string }[] = [
  { id: "culture", labelKey: "interest_culture", emoji: "🏯" },
  { id: "food", labelKey: "interest_food", emoji: "🍲" },
  { id: "nature", labelKey: "interest_nature", emoji: "🌿" },
  { id: "shopping", labelKey: "interest_shopping", emoji: "🛍️" },
  { id: "nightlife", labelKey: "interest_nightlife", emoji: "🌙" },
  { id: "family", labelKey: "interest_family", emoji: "👨‍👩‍👧" },
  { id: "photo", labelKey: "interest_photo", emoji: "📷" },
  { id: "craft", labelKey: "interest_craft", emoji: "🧵" },
];

const PACES: { value: string; labelKey: StringKey; subKey: StringKey }[] = [
  { value: "relaxed", labelKey: "pace_relaxed_label", subKey: "pace_relaxed_sub" },
  { value: "balanced", labelKey: "pace_balanced_label", subKey: "pace_balanced_sub" },
  { value: "packed", labelKey: "pace_packed_label", subKey: "pace_packed_sub" },
];

export function CustomizeForm({
  mode,
  defaultEmail,
  lang,
}: {
  mode: "guided" | "route-only";
  defaultEmail?: string;
  lang: Lang;
}) {
  const [state, formAction, pending] = useActionState<BookingFormState, FormData>(
    createCustomIntake,
    {},
  );
  const [people, setPeople] = useState(2);
  const [interests, setInterests] = useState<string[]>([]);
  const [pace, setPace] = useState("balanced");

  const toggleInterest = (id: string) =>
    setInterests((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : cur.length >= 4 ? cur : [...cur, id],
    );

  const cta =
    mode === "guided" ? t(lang, "cta_match_guide") : t(lang, "cta_see_route");

  return (
    <form action={formAction} className="space-y-7 pb-10">
      <input type="hidden" name="mode" value={mode} />
      {interests.map((i) => (
        <input key={i} type="hidden" name="interests" value={i} />
      ))}
      <input type="hidden" name="pace" value={pace} />
      <input type="hidden" name="people" value={people} />

      <section>
        <SectionLabel step={1} title={t(lang, "step_when")} stepWord={t(lang, "step")} />
        <input
          name="date"
          type="date"
          className="mt-2 w-full rounded-xl border bg-card px-3 py-2.5 text-sm"
          style={{ borderColor: "var(--border)" }}
        />
      </section>

      <section>
        <SectionLabel step={2} title={t(lang, "step_how_many")} stepWord={t(lang, "step")} />
        <div
          className="mt-2 flex items-center justify-between rounded-xl border bg-card px-3 py-3"
          style={{ borderColor: "var(--border)" }}
        >
          <button
            type="button"
            onClick={() => setPeople((p) => Math.max(1, p - 1))}
            className="flex size-9 items-center justify-center rounded-full border text-lg"
            style={{ borderColor: "var(--border)" }}
          >
            −
          </button>
          <div className="text-center">
            <div className="font-display text-2xl leading-none">{people}</div>
            <div
              className="text-[11px]"
              style={{ color: "var(--ink-subtle)" }}
            >
              {people === 1 ? t(lang, "traveler") : t(lang, "travelers")}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPeople((p) => Math.min(6, p + 1))}
            className="flex size-9 items-center justify-center rounded-full border text-lg"
            style={{ borderColor: "var(--border)" }}
          >
            +
          </button>
        </div>
      </section>

      <section>
        <SectionLabel
          step={3}
          title={t(lang, "step_interests")}
          sub={`${t(lang, "step_interests_sub")} (${interests.length}/4)`}
          stepWord={t(lang, "step")}
        />
        <div className="mt-2 grid grid-cols-2 gap-2">
          {INTERESTS.map((i) => {
            const active = interests.includes(i.id);
            return (
              <button
                key={i.id}
                type="button"
                onClick={() => toggleInterest(i.id)}
                className="flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm"
                style={{
                  borderColor: active ? "var(--brand)" : "var(--border)",
                  backgroundColor: active ? "var(--brand-soft)" : "transparent",
                  color: active ? "var(--brand)" : "inherit",
                }}
              >
                <span>{i.emoji}</span>
                <span className="font-medium">{t(lang, i.labelKey)}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <SectionLabel step={4} title={t(lang, "step_pace")} stepWord={t(lang, "step")} />
        <div className="mt-2 grid grid-cols-3 gap-2">
          {PACES.map((p) => {
            const active = pace === p.value;
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => setPace(p.value)}
                className="rounded-xl border p-3 text-center"
                style={{
                  borderColor: active ? "var(--brand)" : "var(--border)",
                  backgroundColor: active ? "var(--brand-soft)" : "transparent",
                }}
              >
                <div
                  className="text-sm font-medium"
                  style={{ color: active ? "var(--brand)" : "inherit" }}
                >
                  {t(lang, p.labelKey)}
                </div>
                <div
                  className="mt-0.5 text-[10px] leading-tight"
                  style={{ color: "var(--ink-subtle)" }}
                >
                  {t(lang, p.subKey)}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <SectionLabel step={5} title={t(lang, "step_contact")} stepWord={t(lang, "step")} />
        <div className="mt-2 space-y-2">
          <input
            name="email"
            type="email"
            required
            defaultValue={defaultEmail}
            placeholder={t(lang, "field_email")}
            className="w-full rounded-xl border bg-card px-3 py-2.5 text-sm"
            style={{ borderColor: "var(--border)" }}
          />
          <input
            name="name"
            placeholder={t(lang, "field_name_optional")}
            className="w-full rounded-xl border bg-card px-3 py-2.5 text-sm"
            style={{ borderColor: "var(--border)" }}
          />
        </div>
      </section>

      {state?.error ? (
        <p className="text-sm" style={{ color: "var(--brand)" }}>
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl py-3.5 text-sm font-semibold text-white disabled:opacity-60"
        style={{ backgroundColor: "var(--brand)" }}
      >
        {pending ? t(lang, "submitting") : cta}
      </button>
    </form>
  );
}

function SectionLabel({
  step,
  title,
  sub,
  stepWord,
}: {
  step: number;
  title: string;
  sub?: string;
  stepWord: string;
}) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <div
          className="text-[11px] uppercase tracking-[0.18em]"
          style={{ color: "var(--ink-subtle)" }}
        >
          {stepWord} {step}
        </div>
        <h3 className="font-display text-lg leading-tight">{title}</h3>
      </div>
      {sub ? (
        <span className="text-[11px]" style={{ color: "var(--ink-subtle)" }}>
          {sub}
        </span>
      ) : null}
    </div>
  );
}
