"use client";

import { useActionState, useState } from "react";
import { createCuratedBooking, type BookingFormState } from "../_actions/booking";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/ui-strings";

export function CheckoutForm({
  routeSlug,
  pricePerPerson,
  defaultEmail,
  lang,
}: {
  routeSlug: string;
  pricePerPerson: number; // cents
  defaultEmail?: string;
  lang: Lang;
}) {
  const [state, formAction, pending] = useActionState<BookingFormState, FormData>(
    createCuratedBooking,
    {},
  );
  const [people, setPeople] = useState(1);

  const total = pricePerPerson * people;
  const fmt = (c: number) =>
    `$${(c / 100).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="route" value={routeSlug} />

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-xs font-medium">
          {t(lang, "field_email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          defaultValue={defaultEmail}
          placeholder="you@example.com"
          className="w-full rounded-xl border bg-card px-3 py-2.5 text-sm"
          style={{ borderColor: "var(--border)" }}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="name" className="text-xs font-medium">
          {t(lang, "field_name_optional")}
        </label>
        <input
          id="name"
          name="name"
          className="w-full rounded-xl border bg-card px-3 py-2.5 text-sm"
          style={{ borderColor: "var(--border)" }}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="date" className="text-xs font-medium">
          {t(lang, "field_date")}
        </label>
        <input
          id="date"
          name="date"
          type="date"
          className="w-full rounded-xl border bg-card px-3 py-2.5 text-sm"
          style={{ borderColor: "var(--border)" }}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium">{t(lang, "field_people")}</label>
        <div
          className="flex items-center justify-between rounded-xl border bg-card px-3 py-2.5"
          style={{ borderColor: "var(--border)" }}
        >
          <button
            type="button"
            onClick={() => setPeople((p) => Math.max(1, p - 1))}
            className="flex size-8 items-center justify-center rounded-full border text-lg"
            style={{ borderColor: "var(--border)" }}
          >
            −
          </button>
          <span className="font-display text-xl">{people}</span>
          <button
            type="button"
            onClick={() => setPeople((p) => Math.min(6, p + 1))}
            className="flex size-8 items-center justify-center rounded-full border text-lg"
            style={{ borderColor: "var(--border)" }}
          >
            +
          </button>
        </div>
        <input type="hidden" name="people" value={people} />
      </div>

      <div
        className="rounded-2xl border bg-card p-4 text-sm"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex justify-between">
          <span style={{ color: "var(--ink-subtle)" }}>
            {t(lang, "checkout_tour_line")} {people}
          </span>
          <span>{fmt(total)}</span>
        </div>
        <div className="mt-1 flex justify-between text-xs">
          <span style={{ color: "var(--ink-subtle)" }}>
            {t(lang, "checkout_fee")}
          </span>
          <span style={{ color: "var(--ink-subtle)" }}>$0</span>
        </div>
        <div
          className="mt-3 flex justify-between border-t pt-3 font-semibold"
          style={{ borderColor: "var(--border)" }}
        >
          <span>{t(lang, "checkout_total")}</span>
          <span>{fmt(total)}</span>
        </div>
        <p
          className="mt-3 text-[11px]"
          style={{ color: "var(--ink-subtle)" }}
        >
          {t(lang, "checkout_note")}
        </p>
      </div>

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
        {pending
          ? t(lang, "checkout_reserving")
          : `${t(lang, "checkout_reserve")} — ${fmt(total)}`}
      </button>
    </form>
  );
}
