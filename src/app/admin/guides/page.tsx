import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageShell } from "@/components/page-shell";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type GuideRow = {
  id: string;
  name: string;
  photo_url: string | null;
  languages: string[] | null;
  active: boolean;
  rating: number | null;
};

export default async function GuidesPage() {
  const supabase = await createClient();
  const { data: guides, error } = await supabase
    .from("guides")
    .select("id, name, photo_url, languages, active, rating")
    .order("name", { ascending: true })
    .returns<GuideRow[]>();

  return (
    <PageShell
      title="Guides"
      description="Photo, bio, languages, and active status."
      actions={<Button render={<Link href="/admin/guides/new">Add guide</Link>} />}
    >
      {error ? (
        <Card className="border-[var(--brand)] bg-[var(--brand-soft)]">
          <CardContent className="py-4 text-sm text-[var(--brand)]">
            Failed to load guides: {error.message}
          </CardContent>
        </Card>
      ) : !guides || guides.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No guides yet.{" "}
            <Link
              href="/admin/guides/new"
              className="font-medium text-foreground underline"
            >
              Add the first one
            </Link>
            .
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => (
            <Link key={g.id} href={`/admin/guides/${g.id}`}>
              <Card className="h-full transition hover:border-foreground/20 hover:shadow-sm">
                <CardContent className="flex items-start gap-3 p-4">
                  <Avatar className="h-12 w-12">
                    {g.photo_url ? <AvatarImage src={g.photo_url} alt={g.name} /> : null}
                    <AvatarFallback>
                      {g.name.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="truncate text-sm font-semibold">{g.name}</div>
                      <Badge
                        variant="secondary"
                        className={
                          g.active
                            ? "bg-[var(--success-soft)] text-[var(--success)] hover:bg-[var(--success-soft)]"
                            : "bg-muted text-muted-foreground hover:bg-muted"
                        }
                      >
                        {g.active ? "Active" : "Off"}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {(g.languages ?? []).join(" · ") || "No languages set"}
                    </div>
                    {g.rating != null ? (
                      <div className="text-xs text-muted-foreground">
                        ★ {g.rating.toFixed(1)}
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  );
}
