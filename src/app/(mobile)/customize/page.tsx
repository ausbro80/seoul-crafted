import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getTravelerEmail } from "../_actions/booking";
import { CustomizeForm } from "./customize-form";
import { getLang } from "@/lib/i18n";
import { t } from "@/lib/ui-strings";

export const dynamic = "force-dynamic";

export default async function CustomizePage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode: raw } = await searchParams;
  const mode = raw === "route-only" ? "route-only" : "guided";
  const email = await getTravelerEmail();
  const lang = await getLang();

  const title =
    mode === "guided" ? t(lang, "customize_guided_title") : t(lang, "customize_route_title");
  const sub =
    mode === "guided" ? t(lang, "customize_guided_sub") : t(lang, "customize_route_sub");

  return (
    <>
      <header className="flex items-center gap-3 px-5 pt-5">
        <Link
          href="/"
          className="flex size-9 items-center justify-center rounded-full border"
          style={{ borderColor: "var(--border)" }}
          aria-label={t(lang, "back")}
        >
          <ChevronLeft className="size-4" />
        </Link>
        <div>
          <div
            className="text-[11px] uppercase tracking-[0.18em]"
            style={{ color: "var(--ink-subtle)" }}
          >
            {t(lang, "customize_label")}
          </div>
          <h1 className="font-display text-2xl leading-tight">{title}</h1>
          <p className="text-xs" style={{ color: "var(--ink-subtle)" }}>
            {sub}
          </p>
        </div>
      </header>

      <section className="px-5 pt-6">
        <CustomizeForm mode={mode} defaultEmail={email ?? undefined} lang={lang} />
      </section>
    </>
  );
}
