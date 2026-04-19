import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { getLang, LANG_LABELS, type Lang } from "@/lib/i18n";
import { t } from "@/lib/ui-strings";
import { setLang } from "../_actions/lang";

export const dynamic = "force-dynamic";

export default async function MePage() {
  const current = await getLang();
  const others = (Object.keys(LANG_LABELS) as Lang[]).filter((c) => c !== current);

  return (
    <>
      <header className="px-5 pt-5">
        <h1 className="font-display text-3xl">{t(current, "me_title")}</h1>
      </header>

      <section className="px-5 pt-5">
        <div
          className="rounded-2xl border bg-card p-4"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="text-sm font-medium">{t(current, "me_traveler")}</div>
          <div
            className="mt-0.5 text-xs"
            style={{ color: "var(--ink-subtle)" }}
          >
            {t(current, "me_traveler_sub")}
          </div>
        </div>
      </section>

      <section className="px-5 pt-6">
        <h2
          className="mb-3 text-[11px] uppercase tracking-[0.18em]"
          style={{ color: "var(--ink-subtle)" }}
        >
          {t(current, "me_language")}
        </h2>
        <details
          className="group rounded-2xl border bg-card overflow-hidden"
          style={{ borderColor: "var(--border)" }}
        >
          <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3">
            <span className="text-lg">{LANG_LABELS[current].flag}</span>
            <span className="flex-1">
              <span className="block text-sm font-medium">
                {LANG_LABELS[current].native}
              </span>
              <span
                className="block text-[11px]"
                style={{ color: "var(--ink-subtle)" }}
              >
                {t(current, "me_change_language")}
              </span>
            </span>
            <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
          </summary>
          <div
            className="border-t"
            style={{ borderColor: "var(--border)" }}
          >
            {others.map((code) => {
              const l = LANG_LABELS[code];
              return (
                <form key={code} action={setLang}>
                  <input type="hidden" name="lang" value={code} />
                  <button
                    type="submit"
                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[var(--muted)]"
                  >
                    <span className="text-lg">{l.flag}</span>
                    <span className="flex-1">
                      <span className="block text-sm font-medium">
                        {l.native}
                      </span>
                      <span
                        className="block text-[11px]"
                        style={{ color: "var(--ink-subtle)" }}
                      >
                        {l.english}
                      </span>
                    </span>
                  </button>
                </form>
              );
            })}
          </div>
        </details>
      </section>

      <section className="px-5 pt-6 pb-4">
        <h2
          className="mb-3 text-[11px] uppercase tracking-[0.18em]"
          style={{ color: "var(--ink-subtle)" }}
        >
          {t(current, "me_about")}
        </h2>
        <div
          className="divide-y rounded-2xl border bg-card"
          style={{ borderColor: "var(--border)" }}
        >
          <Link href="/browse" className="block px-4 py-3 text-sm">
            {t(current, "trips_browse")} →
          </Link>
          <Link href="/trips" className="block px-4 py-3 text-sm">
            {t(current, "trips_title")} →
          </Link>
          <a
            href="/admin"
            className="block px-4 py-3 text-xs"
            style={{ color: "var(--ink-subtle)" }}
          >
            {t(current, "me_admin_link")}
          </a>
        </div>
      </section>
    </>
  );
}
