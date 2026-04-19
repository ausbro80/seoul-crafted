import Link from "next/link";
import { getLang, LANG_LABELS, type Lang } from "@/lib/i18n";
import { setLang } from "../_actions/lang";

export const dynamic = "force-dynamic";

export default async function MePage() {
  const current = await getLang();

  return (
    <>
      <header className="px-5 pt-5">
        <h1 className="font-display text-3xl">Me</h1>
      </header>

      <section className="px-5 pt-5">
        <div
          className="rounded-2xl border bg-card p-4"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="text-sm font-medium">Traveler</div>
          <div
            className="mt-0.5 text-xs"
            style={{ color: "var(--ink-subtle)" }}
          >
            Anonymous booking for now — trips are linked to your email.
          </div>
        </div>
      </section>

      <section className="px-5 pt-6">
        <h2
          className="mb-3 text-[11px] uppercase tracking-[0.18em]"
          style={{ color: "var(--ink-subtle)" }}
        >
          Language
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(LANG_LABELS) as Lang[]).map((code) => {
            const l = LANG_LABELS[code];
            const active = current === code;
            return (
              <form key={code} action={setLang}>
                <input type="hidden" name="lang" value={code} />
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 rounded-2xl border px-3 py-3 text-left"
                  style={{
                    borderColor: active ? "var(--brand)" : "var(--border)",
                    backgroundColor: active ? "var(--brand-soft)" : "transparent",
                  }}
                >
                  <span className="text-lg">{l.flag}</span>
                  <span className="flex-1">
                    <span
                      className="block text-sm font-medium"
                      style={{ color: active ? "var(--brand)" : "inherit" }}
                    >
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
      </section>

      <section className="px-5 pt-6">
        <h2
          className="mb-3 text-[11px] uppercase tracking-[0.18em]"
          style={{ color: "var(--ink-subtle)" }}
        >
          About
        </h2>
        <div
          className="divide-y rounded-2xl border bg-card"
          style={{ borderColor: "var(--border)" }}
        >
          <Link href="/browse" className="block px-4 py-3 text-sm">
            Browse all routes →
          </Link>
          <Link href="/trips" className="block px-4 py-3 text-sm">
            My trips →
          </Link>
          <a
            href="/admin"
            className="block px-4 py-3 text-xs"
            style={{ color: "var(--ink-subtle)" }}
          >
            Admin console (ops team) →
          </a>
        </div>
      </section>
    </>
  );
}
