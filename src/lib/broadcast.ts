// Server-side Supabase Realtime broadcast.
// Uses the Realtime HTTP "broadcast" endpoint so we don't open a WebSocket
// from the server action.

export async function broadcast(
  topic: string,
  event: string,
  payload: unknown,
): Promise<void> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SECRET_KEY ??
    null;
  if (!base || !serviceKey) return;

  try {
    await fetch(`${base}/realtime/v1/api/broadcast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({
        messages: [{ topic, event, payload }],
      }),
      signal: AbortSignal.timeout(3000),
      cache: "no-store",
    });
  } catch {
    // Realtime is best-effort — if the broadcast fails, the receiver will
    // still see the message on their next page load.
  }
}
