"use client";

import { useActionState, useState } from "react";
import { createCustomIntake, type BookingFormState } from "../_actions/booking";

const INTERESTS = [
  { id: "culture", label: "Culture", emoji: "🏯" },
  { id: "food", label: "Food", emoji: "🍲" },
  { id: "nature", label: "Nature", emoji: "🌿" },
  { id: "shopping", label: "Shopping", emoji: "🛍️" },
  { id: "nightlife", label: "Nightlife", emoji: "🌙" },
  { id: "family", label: "Family", emoji: "👨‍👩‍👧" },
  { id: "photo", label: "Photo", emoji: "📷" },
  { id: "craft", label: "Craft", emoji: "🧵" },
];

const PACES = [
  { value: "relaxed", label: "Relaxed", sub: "Few stops, long breaks" },
  { value: "balanced", label: "Balanced", sub: "Steady pace" },
  { value: "packed", label: "Packed", sub: "See as much as possible" },
];

export function CustomizeForm({
  mode,
  defaultEmail,
}: {
  mode: "guided" | "route-only";
  defaultEmail?: string;
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
    mode === "guided" ? "Match me with a guide →" : "See my route — $18";

  return (
    <form action={formAction} className="space-y-7 pb-10">
      <input type="hidden" name="mode" value={mode} />
      {interests.map((i) => (
        <input key={i} type="hidden" name="interests" value={i} />
      ))}
      <input type="hidden" name="pace" value={pace} />
      <input type="hidden" name="people" value={people} />

      {/* Step 1 — Date */}
      <section>
        <SectionLabel step={1} title="When?" />
        <input
          name="date"
          type="date"
          className="mt-2 w-full rounded-xl border bg-card px-3 py-2.5 text-sm"
          style={{ borderColor: "var(--border)" }}
        />
      </section>

      {/* Step 2 — People */}
      <section>
        <SectionLabel step={2} title="How many?" />
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
              {people === 1 ? "traveler" : "travelers"}
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

      {/* Step 3 — Interests */}
      <section>
        <SectionLabel
          step={3}
          title="What grabs you?"
          sub={`Pick 3–4 (${interests.length}/4)`}
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
                <span className="font-medium">{i.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Step 4 — Pace */}
      <section>
        <SectionLabel step={4} title="What pace?" />
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
                  {p.label}
                </div>
                <div
                  className="mt-0.5 text-[10px] leading-tight"
                  style={{ color: "var(--ink-subtle)" }}
                >
                  {p.sub}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Contact */}
      <section>
        <SectionLabel step={5} title="How do we reach you?" />
        <div className="mt-2 space-y-2">
          <input
            name="email"
            type="email"
            required
            defaultValue={defaultEmail}
            placeholder="Email"
            className="w-full rounded-xl border bg-card px-3 py-2.5 text-sm"
            style={{ borderColor: "var(--border)" }}
          />
          <input
            name="name"
            placeholder="Name (optional)"
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
        {pending ? "Submitting…" : cta}
      </button>
    </form>
  );
}

function SectionLabel({
  step,
  title,
  sub,
}: {
  step: number;
  title: string;
  sub?: string;
}) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <div
          className="text-[11px] uppercase tracking-[0.18em]"
          style={{ color: "var(--ink-subtle)" }}
        >
          Step {step}
        </div>
        <h3 className="font-display text-lg leading-tight">{title}</h3>
      </div>
      {sub ? (
        <span
          className="text-[11px]"
          style={{ color: "var(--ink-subtle)" }}
        >
          {sub}
        </span>
      ) : null}
    </div>
  );
}
