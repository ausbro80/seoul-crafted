export default function MobileLoading() {
  return (
    <div className="animate-pulse">
      {/* Top bar skeleton */}
      <div className="flex items-center justify-between px-5 pt-5">
        <div className="flex items-center gap-2">
          <div
            className="size-9 rounded-xl"
            style={{ backgroundColor: "var(--muted)" }}
          />
          <div className="space-y-1.5">
            <div
              className="h-3 w-28 rounded"
              style={{ backgroundColor: "var(--muted)" }}
            />
            <div
              className="h-2 w-20 rounded"
              style={{ backgroundColor: "var(--muted)" }}
            />
          </div>
        </div>
        <div
          className="h-6 w-12 rounded-full"
          style={{ backgroundColor: "var(--muted)" }}
        />
      </div>

      {/* Hero skeleton */}
      <div className="space-y-2 px-5 pt-6">
        <div
          className="h-9 w-3/4 rounded"
          style={{ backgroundColor: "var(--muted)" }}
        />
        <div
          className="h-9 w-1/2 rounded"
          style={{ backgroundColor: "var(--muted)" }}
        />
      </div>

      {/* Card skeletons */}
      <div className="space-y-3 px-5 pt-6">
        <div
          className="aspect-[4/3] w-full rounded-3xl"
          style={{ backgroundColor: "var(--muted)" }}
        />
        <div className="grid grid-cols-2 gap-3">
          <div
            className="aspect-square rounded-3xl"
            style={{ backgroundColor: "var(--muted)" }}
          />
          <div
            className="aspect-square rounded-3xl"
            style={{ backgroundColor: "var(--muted)" }}
          />
        </div>
      </div>
    </div>
  );
}
