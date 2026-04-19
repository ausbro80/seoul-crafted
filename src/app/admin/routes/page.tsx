import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageShell } from "@/components/page-shell";
import { createClient } from "@/lib/supabase/server";
import { formatDuration, formatPrice } from "@/lib/format";

const TIER_LABEL: Record<string, string> = {
  curated: "Curated",
  guided_custom: "Guided custom",
  route_only: "Route only",
};

type RouteRow = {
  id: string;
  slug: string;
  tier: string;
  price_cents: number;
  duration_min: number;
  published: boolean;
  hero_image_url: string | null;
  routes_i18n: { lang: string; title: string | null }[] | null;
};

export default async function RoutesPage() {
  const supabase = await createClient();
  const { data: routes, error } = await supabase
    .from("routes")
    .select(
      "id, slug, tier, price_cents, duration_min, published, hero_image_url, routes_i18n(lang, title)",
    )
    .order("updated_at", { ascending: false })
    .returns<RouteRow[]>();

  return (
    <PageShell
      title="Routes"
      description="Curated, guided custom, and route-only tours."
      actions={
        <Button render={<Link href="/admin/routes/new">New route</Link>} />
      }
    >
      {error ? (
        <Card className="border-[var(--brand)] bg-[var(--brand-soft)]">
          <CardContent className="py-4 text-sm text-[var(--brand)]">
            Failed to load routes: {error.message}
          </CardContent>
        </Card>
      ) : !routes || routes.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No routes yet.{" "}
            <Link href="/admin/routes/new" className="font-medium text-foreground underline">
              Create the first one
            </Link>
            .
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {routes.map((r) => {
            const enTitle =
              r.routes_i18n?.find((t) => t.lang === "en")?.title ?? r.slug;
            return (
              <Link key={r.id} href={`/admin/routes/${r.id}`}>
                <Card className="h-full overflow-hidden transition hover:border-foreground/20 hover:shadow-sm">
                  <div
                    className="aspect-video w-full bg-muted"
                    style={{
                      backgroundImage: r.hero_image_url
                        ? `url(${r.hero_image_url})`
                        : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <CardContent className="space-y-2 p-4">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={
                          r.published
                            ? "bg-[var(--success-soft)] text-[var(--success)] hover:bg-[var(--success-soft)]"
                            : "bg-muted text-muted-foreground hover:bg-muted"
                        }
                      >
                        {r.published ? "Published" : "Draft"}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {TIER_LABEL[r.tier] ?? r.tier}
                      </Badge>
                    </div>
                    <div className="text-base font-semibold tracking-tight">
                      {enTitle}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatDuration(r.duration_min)}</span>
                      <span>{formatPrice(r.price_cents)}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
