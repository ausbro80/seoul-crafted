import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { RouteForm } from "../route-form";
import { updateRoute, deleteRoute } from "../actions";
import { createClient } from "@/lib/supabase/server";

type RouteRow = {
  id: string;
  slug: string;
  tier: string;
  category: string | null;
  price_cents: number;
  duration_min: number;
  hero_image_url: string | null;
  theme_color: string | null;
  badge: string | null;
  tags: string[] | null;
  published: boolean;
  routes_i18n: {
    lang: string;
    title: string | null;
    subtitle: string | null;
    description: string | null;
  }[] | null;
};

export default async function EditRoutePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: route } = await supabase
    .from("routes")
    .select(
      "id, slug, tier, category, price_cents, duration_min, hero_image_url, theme_color, badge, tags, published, routes_i18n(lang, title, subtitle, description)",
    )
    .eq("id", id)
    .maybeSingle<RouteRow>();

  if (!route) notFound();

  const byLang = (lang: string) => route.routes_i18n?.find((t) => t.lang === lang);
  const en = byLang("en");
  const zh = byLang("zh");
  const ja = byLang("ja");
  const vi = byLang("vi");

  const bound = updateRoute.bind(null, route.id);

  return (
    <PageShell
      title={en?.title ?? route.slug}
      description={`Slug: ${route.slug}`}
      actions={
        <form action={deleteRoute.bind(null, route.id)}>
          <Button type="submit" variant="ghost" className="text-[var(--brand)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand)]">
            Delete
          </Button>
        </form>
      }
    >
      <RouteForm
        action={bound}
        submitLabel="Save changes"
        defaults={{
          slug: route.slug,
          tier: route.tier,
          category: route.category,
          price_usd: route.price_cents / 100,
          duration_min: route.duration_min,
          hero_image_url: route.hero_image_url,
          theme_color: route.theme_color,
          badge: route.badge,
          tags: route.tags ?? [],
          published: route.published,
          i18n: {
            en: { title: en?.title, subtitle: en?.subtitle, description: en?.description },
            zh: { title: zh?.title, subtitle: zh?.subtitle, description: zh?.description },
            ja: { title: ja?.title, subtitle: ja?.subtitle, description: ja?.description },
            vi: { title: vi?.title, subtitle: vi?.subtitle, description: vi?.description },
          },
        }}
      />
    </PageShell>
  );
}
