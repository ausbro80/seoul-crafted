"use client";

import { assignGuide } from "./actions";

export function GuideSelect({
  bookingId,
  currentGuideId,
  guides,
}: {
  bookingId: string;
  currentGuideId: string | null;
  guides: { id: string; name: string; active: boolean }[];
}) {
  return (
    <form action={assignGuide.bind(null, bookingId)}>
      <select
        name="guide_id"
        defaultValue={currentGuideId ?? ""}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="max-w-[140px] rounded-md border bg-background px-2 py-1 text-xs"
      >
        <option value="">— Assign —</option>
        {guides
          .filter((g) => g.active)
          .map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
      </select>
    </form>
  );
}
