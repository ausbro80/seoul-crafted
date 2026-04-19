import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getTravelerEmail } from "../_actions/booking";
import { CustomizeForm } from "./customize-form";

export const dynamic = "force-dynamic";

export default async function CustomizePage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode: raw } = await searchParams;
  const mode = raw === "route-only" ? "route-only" : "guided";
  const email = await getTravelerEmail();

  const meta =
    mode === "guided"
      ? {
          title: "Guided custom tour",
          sub: "~5 hours, matched with a local guide",
        }
      : {
          title: "Route only",
          sub: "A printable itinerary — no time limit, $18",
        };

  return (
    <>
      <header className="flex items-center gap-3 px-5 pt-5">
        <Link
          href="/"
          className="flex size-9 items-center justify-center rounded-full border"
          style={{ borderColor: "var(--border)" }}
        >
          <ChevronLeft className="size-4" />
        </Link>
        <div>
          <div
            className="text-[11px] uppercase tracking-[0.18em]"
            style={{ color: "var(--ink-subtle)" }}
          >
            Customize
          </div>
          <h1 className="font-display text-2xl leading-tight">{meta.title}</h1>
          <p
            className="text-xs"
            style={{ color: "var(--ink-subtle)" }}
          >
            {meta.sub}
          </p>
        </div>
      </header>

      <section className="px-5 pt-6">
        <CustomizeForm mode={mode} defaultEmail={email ?? undefined} />
      </section>
    </>
  );
}
