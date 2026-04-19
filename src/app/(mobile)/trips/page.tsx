export const dynamic = "force-dynamic";

export default function TripsPage() {
  return (
    <>
      <header className="px-5 pt-5">
        <h1 className="font-display text-3xl">My trips</h1>
      </header>
      <section className="px-5 pt-6">
        <div
          className="rounded-2xl border border-dashed px-4 py-16 text-center text-sm"
          style={{
            borderColor: "var(--border)",
            color: "var(--ink-subtle)",
          }}
        >
          No trips yet. Book a route and it will show up here.
        </div>
      </section>
    </>
  );
}
