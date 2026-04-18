import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LoginForm } from "./login-form";

const ERROR_COPY: Record<string, string> = {
  not_authorized: "This email isn't on the admin allowlist.",
  no_user: "Sign-in failed — no user was created.",
  missing_code: "Sign-in link was invalid or expired. Request a new one.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const errorMsg = error ? ERROR_COPY[error] ?? decodeURIComponent(error) : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand)] text-white font-serif text-xl">
            서
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">Seoul Crafted</div>
            <div className="text-xs text-muted-foreground">Admin console</div>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sign in</CardTitle>
            <CardDescription>
              We&apos;ll email you a one-time sign-in link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMsg ? (
              <div className="mb-4 rounded-md border border-[var(--brand)] bg-[var(--brand-soft)] px-3 py-2 text-sm text-[var(--brand)]">
                {errorMsg}
              </div>
            ) : null}
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
