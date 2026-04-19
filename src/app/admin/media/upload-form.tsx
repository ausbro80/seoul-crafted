"use client";

import { useActionState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { uploadMedia } from "./actions";

export function UploadForm() {
  const [state, formAction, pending] = useActionState(uploadMedia, undefined);
  const ref = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={ref}
      action={async (fd) => {
        await formAction(fd);
        ref.current?.reset();
      }}
      className="flex flex-wrap items-center gap-3"
    >
      <input
        id="files"
        name="files"
        type="file"
        multiple
        accept="image/*"
        className="flex-1 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-foreground file:px-3 file:py-1.5 file:text-background hover:file:opacity-90"
      />
      <Button type="submit" disabled={pending}>
        {pending ? "Uploading…" : "Upload"}
      </Button>
      {state?.error ? (
        <p className="w-full text-sm text-[var(--brand)]">{state.error}</p>
      ) : null}
      {state?.ok ? (
        <p className="w-full text-sm text-[var(--success)]">
          Uploaded {state.uploaded} file{state.uploaded === 1 ? "" : "s"}.
        </p>
      ) : null}
    </form>
  );
}
