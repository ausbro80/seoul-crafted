import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { AddAdminForm } from "./add-admin-form";
import { removeAdmin } from "./actions";

export const dynamic = "force-dynamic";

type AdminRow = {
  email: string;
  name: string | null;
  created_at: string;
};

export default async function TeamPage() {
  const supabase = await createClient();
  const [{ data: admins }, userRes] = await Promise.all([
    supabase
      .from("admins")
      .select("email, name, created_at")
      .order("created_at", { ascending: true })
      .returns<AdminRow[]>(),
    supabase.auth.getUser(),
  ]);

  const currentEmail = userRes.data.user?.email ?? null;
  const list = admins ?? [];

  return (
    <PageShell
      title="Team"
      description="Ops team allowlist. Anyone here can sign in via magic link."
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invite admin</CardTitle>
        </CardHeader>
        <CardContent>
          <AddAdminForm />
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base">
            Admins ({list.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {list.length === 0 ? (
            <div className="px-6 pb-6 text-sm text-muted-foreground">
              No admins yet.
            </div>
          ) : (
            <div className="divide-y">
              {list.map((a) => {
                const self = a.email === currentEmail;
                return (
                  <div
                    key={a.email}
                    className="flex items-center justify-between px-6 py-3 text-sm"
                  >
                    <div>
                      <div className="font-medium">
                        {a.name ?? a.email}
                        {self ? (
                          <span
                            className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
                          >
                            you
                          </span>
                        ) : null}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {a.email}
                        {" · "}
                        added {new Date(a.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    {!self ? (
                      <form action={removeAdmin.bind(null, a.email)}>
                        <Button
                          type="submit"
                          size="sm"
                          variant="ghost"
                          className="text-[var(--brand)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand)]"
                        >
                          Remove
                        </Button>
                      </form>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
}
