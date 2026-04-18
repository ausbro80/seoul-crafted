"use client";

import { useActionState } from "react";
import { sendMagicLink } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(sendMagicLink, undefined);

  if (state?.ok) {
    return (
      <div className="space-y-2 text-sm">
        <p className="font-medium">Check your inbox.</p>
        <p className="text-muted-foreground">
          A sign-in link was sent to{" "}
          <span className="font-medium text-foreground">{state.email}</span>.
          Click it to finish signing in. The link expires in 60 minutes.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@seoulcrafted.com"
          autoComplete="email"
          required
          defaultValue={state?.email}
        />
      </div>
      {state?.error ? (
        <p className="text-sm text-[var(--brand)]">{state.error}</p>
      ) : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Sending…" : "Send magic link"}
      </Button>
      <p className="text-xs text-muted-foreground">
        Admin-only. Your email must be on the allowlist.
      </p>
    </form>
  );
}
