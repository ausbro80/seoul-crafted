export const dynamic = "force-dynamic";

export default function ChatPage() {
  return (
    <>
      <header className="px-5 pt-5">
        <h1 className="font-display text-3xl">Chat</h1>
        <p
          className="mt-1 text-sm"
          style={{ color: "var(--ink-subtle)" }}
        >
          Guide and support threads will appear here once you have a booking.
        </p>
      </header>
      <section className="px-5 pt-6">
        <div
          className="rounded-2xl border border-dashed px-4 py-16 text-center text-sm"
          style={{
            borderColor: "var(--border)",
            color: "var(--ink-subtle)",
          }}
        >
          No messages yet.
        </div>
      </section>
    </>
  );
}
