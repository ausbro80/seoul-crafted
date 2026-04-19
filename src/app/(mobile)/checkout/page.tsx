import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getTravelerEmail } from "../_actions/booking";
import { CheckoutForm } from "./checkout-form";
import { getLang, pickI18n } from "@/lib/i18n";
import { t } from "@/lib/ui-strings";

export const dynamic = "force-dynamic";

type RouteBrief = {
  id: string;
  slug: string;
  price_cents: number;
  hero_image_url: string | null;
  theme_color: string | null;
  routes_i18n: { lang: string; title: string | null }[] | null;
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ route?: string }>;
}) {
  const { route: slug } = await searchParams;
  if (!slug) notFound();

  const supabase = await createClient();
  const { data: route } = await supabase
    .from("routes")
    .select(
      "id, slug, price_cents, hero_image_url, theme_color, routes_i18n(lang, title)",
    )
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle<RouteBrief>();

  if (!route) notFound();

  const lang = await getLang();
  const tr = pickI18n(route.routes_i18n, lang);
  const email = await getTravelerEmail();

  return (
    <>
      <header className="flex items-center gap-3 px-5 pt-5">
        <Link
          href={`/routes/${route.slug}`}
          className="flex size-9 items-center justify-center rounded-full border"
          style={{ borderColor: "var(--border)" }}
          aria-label={t(lang, "back")}
        >
          <ChevronLeft className="size-4" />
        </Link>
        <h1 className="font-display text-2xl">{t(lang, "checkout_title")}</h1>
      </header>

      <section className="px-5 pt-5">
        <div
          className="flex gap-3 rounded-2xl border bg-card p-3"
          style={{ borderColor: "var(--border)" }}
        >
          <div
            className="size-16 flex-shrink-0 rounded-xl"
            style={{
              backgroundColor: route.theme_color ?? "var(--muted)",
              backgroundImage: route.hero_image_url
                ? `url(${route.hero_image_url})`
                : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="flex flex-1 flex-col justify-center">
            <div
              className="text-[11px] uppercase tracking-[0.14em]"
              style={{ color: "var(--ink-subtle)" }}
            >
              {t(lang, "checkout_tour")}
            </div>
            <div className="font-display text-base leading-tight">
              {tr?.title ?? route.slug}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-5 pb-10">
        <CheckoutForm
          routeSlug={route.slug}
          pricePerPerson={route.price_cents}
          defaultEmail={email ?? undefined}
          lang={lang}
        />
      </section>
    </>
  );
}
