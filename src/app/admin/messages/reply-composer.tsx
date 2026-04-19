"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { sendAdminReply } from "./actions";

export function ReplyComposer({
  conversationId,
  channel,
  placeholder,
}: {
  conversationId: string;
  channel: "guide" | "support";
  placeholder: string;
}) {
  const [value, setValue] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = value.trim();
    if (pending || !trimmed) return;

    setValue("");

    const fd = new FormData();
    fd.set("sender_role", channel);
    fd.set("body", trimmed);

    startTransition(async () => {
      try {
        await sendAdminReply(conversationId, fd);
      } catch {
        setValue(trimmed);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 border-t p-3">
      <input
        name="body"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1 rounded-full border bg-background px-4 py-2 text-sm disabled:opacity-60"
        autoComplete="off"
        disabled={pending}
      />
      <Button type="submit" disabled={pending || value.trim().length === 0}>
        {pending ? "…" : "Send"}
      </Button>
    </form>
  );
}
