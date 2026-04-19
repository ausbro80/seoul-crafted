import { PageShell } from "@/components/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { StringRow } from "./string-row";

export const dynamic = "force-dynamic";

type StringsRow = {
  key: string;
  en: string | null;
  zh: string | null;
  ja: string | null;
  vi: string | null;
};

export default async function ContentPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("i18n_strings")
    .select("key, en, zh, ja, vi")
    .order("key", { ascending: true })
    .returns<StringsRow[]>();

  const list = rows ?? [];

  return (
    <PageShell
      title="Content & i18n"
      description="Translation workspace for team copy. The app UI currently reads from code defaults — DB overrides wire in when you want the loop closed."
    >
      <Card>
        <CardContent className="space-y-2 p-4">
          <div className="mb-3">
            <h2 className="text-sm font-semibold">Add new string</h2>
            <p className="text-xs text-muted-foreground">
              Key should be a short snake_case id — e.g. <code>home_cta</code>.
            </p>
          </div>
          <StringRow isNew />
        </CardContent>
      </Card>

      {list.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No strings yet. Add one above.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {list.map((r) => (
            <StringRow key={r.key} row={r} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
