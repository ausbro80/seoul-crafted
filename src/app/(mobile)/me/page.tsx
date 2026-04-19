import Link from "next/link";

export const dynamic = "force-dynamic";

const LANGS = [
  { code: "en", label: "English", native: "English", flag: "🇺🇸" },
  { code: "zh", label: "Chinese", native: "中文", flag: "🇨🇳" },
  { code: "ja", label: "Japanese", native: "日本語", flag: "🇯🇵" },
  { code: "vi", label: "Vietnamese", native: "Tiếng Việt", flag: "🇻🇳" },
];

export default function MePage() {
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
            Sign-in coming soon. For now, just browse and book.
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
          {LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              className="flex items-center gap-2 rounded-2xl border px-3 py-3 text-left"
              style={{ borderColor: "var(--border)" }}
            >
              <span className="text-lg">{l.flag}</span>
              <span className="flex-1">
                <span className="block text-sm font-medium">{l.native}</span>
                <span
                  className="block text-[11px]"
                  style={{ color: "var(--ink-subtle)" }}
                >
                  {l.label}
                </span>
              </span>
            </button>
          ))}
        </div>
        <p
          className="mt-2 text-[11px]"
          style={{ color: "var(--ink-subtle)" }}
        >
          Language switcher wires up in a later pass.
        </p>
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
