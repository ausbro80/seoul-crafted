"use client";

import { useActionState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addAdmin, type TeamFormState } from "./actions";

export function AddAdminForm() {
  const [state, formAction, pending] = useActionState<TeamFormState, FormData>(
    addAdmin,
    {},
  );
  const ref = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={ref}
      action={async (fd) => {
        await formAction(fd);
        ref.current?.reset();
      }}
      className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto]"
    >
      <div className="space-y-1">
        <Label htmlFor="email" className="text-xs">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="teammate@d2dk.com"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="name" className="text-xs">
          Name (optional)
        </Label>
        <Input id="name" name="name" placeholder="Jane" />
      </div>
      <div className="flex items-end">
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
          {pending ? "Adding…" : "Invite admin"}
        </Button>
      </div>
      {state?.error ? (
        <p className="text-sm text-[var(--brand)] sm:col-span-3">
          {state.error}
        </p>
      ) : null}
      {state?.ok ? (
        <p className="text-sm text-[var(--success)] sm:col-span-3">
          Added. They can sign in via magic link once they visit /login.
        </p>
      ) : null}
    </form>
  );
}
