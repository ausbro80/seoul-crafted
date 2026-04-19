import webpush from "web-push";
import { createAdminClient } from "@/lib/supabase/server";

let configured = false;
function ensureConfigured() {
  if (configured) return;
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  const contact = process.env.VAPID_CONTACT || "mailto:noreply@example.com";
  if (!pub || !priv) return;
  webpush.setVapidDetails(contact, pub, priv);
  configured = true;
}

export type PushPayload = {
  title: string;
  body?: string;
  url?: string;
  tag?: string;
};

/**
 * Best-effort push to every subscription for the given email. Cleans up
 * subscriptions that come back as Gone (410). Never throws — push is a
 * nice-to-have on top of the in-app Realtime path.
 */
export async function sendPushToEmail(
  email: string,
  payload: PushPayload,
): Promise<void> {
  ensureConfigured();
  if (!configured) return;

  const supabase = await createAdminClient();
  const { data: subs } = await supabase
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth")
    .eq("subscriber_email", email);

  if (!subs || subs.length === 0) return;

  const json = JSON.stringify(payload);
  await Promise.all(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: s.endpoint,
            keys: { p256dh: s.p256dh, auth: s.auth },
          },
          json,
          { TTL: 60 * 60 * 24 },
        );
      } catch (err: unknown) {
        const statusCode =
          err && typeof err === "object" && "statusCode" in err
            ? (err as { statusCode?: number }).statusCode
            : undefined;
        if (statusCode === 404 || statusCode === 410) {
          await supabase.from("push_subscriptions").delete().eq("id", s.id);
        }
      }
    }),
  );
}

/**
 * Push every admin on the allowlist. Used for customer-originated messages.
 */
export async function sendPushToAdmins(payload: PushPayload): Promise<void> {
  ensureConfigured();
  if (!configured) return;

  const supabase = await createAdminClient();
  const { data: admins } = await supabase.from("admins").select("email");
  if (!admins || admins.length === 0) return;

  await Promise.all(
    admins.map((a) =>
      a.email ? sendPushToEmail(a.email, payload) : Promise.resolve(),
    ),
  );
}
