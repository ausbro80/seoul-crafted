export default function AdminLoading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 animate-pulse">
      {/* Title skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 rounded bg-muted" />
        <div className="h-4 w-80 rounded bg-muted" />
      </div>

      {/* Cards grid skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl border bg-card p-4">
            <div className="h-2 w-16 rounded bg-muted" />
            <div className="mt-2 h-8 w-20 rounded bg-muted" />
            <div className="mt-3 h-2 w-24 rounded bg-muted" />
          </div>
        ))}
      </div>

      {/* Table-ish skeleton */}
      <div className="rounded-xl border bg-card">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 border-b px-4 py-3 last:border-0"
          >
            <div className="h-3 flex-1 rounded bg-muted" />
            <div className="h-3 w-24 rounded bg-muted" />
            <div className="h-3 w-16 rounded bg-muted" />
            <div className="h-6 w-20 rounded-full bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
