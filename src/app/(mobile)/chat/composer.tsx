"use client";

import { useRef } from "react";
import { sendCustomerMessage } from "./actions";

export function Composer({
  channel,
  placeholder,
  sendLabel,
}: {
  channel: "guide" | "support";
  placeholder: string;
  sendLabel: string;
}) {
  const ref = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={ref}
      action={async (fd) => {
        await sendCustomerMessage(fd);
        ref.current?.reset();
      }}
      className="sticky bottom-0 flex gap-2 border-t bg-card p-3"
      style={{ borderColor: "var(--border)" }}
    >
      <input type="hidden" name="channel" value={channel} />
      <input
        name="body"
        placeholder={placeholder}
        className="flex-1 rounded-full border bg-background px-4 py-2 text-sm"
        style={{ borderColor: "var(--border)" }}
        autoComplete="off"
      />
      <button
        type="submit"
        className="rounded-full px-4 py-2 text-sm font-semibold text-white"
        style={{ backgroundColor: "var(--brand)" }}
      >
        {sendLabel}
      </button>
    </form>
  );
}
