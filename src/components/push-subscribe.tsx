"use client";

import { useEffect, useState } from "react";
import {
  savePushSubscription,
  removePushSubscription,
} from "@/app/_actions/push";

type Status = "unsupported" | "idle" | "subscribed" | "pending";

function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const buf = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) buf[i] = raw.charCodeAt(i);
  return buf;
}

async function getRegistration() {
  if (!("serviceWorker" in navigator)) return null;
  const existing = await navigator.serviceWorker.getRegistration("/");
  if (existing) return existing;
  return navigator.serviceWorker.register("/sw.js", { scope: "/" });
}

export function PushSubscribe({
  email,
  role,
}: {
  email: string;
  role: "customer" | "admin";
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [endpoint, setEndpoint] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (
        typeof window === "undefined" ||
        !("Notification" in window) ||
        !("serviceWorker" in navigator) ||
        !("PushManager" in window)
      ) {
        if (!ignore) setStatus("unsupported");
        return;
      }
      const reg = await getRegistration();
      if (!reg) {
        if (!ignore) setStatus("unsupported");
        return;
      }
      const sub = await reg.pushManager.getSubscription();
      if (!ignore) {
        if (sub) {
          setEndpoint(sub.endpoint);
          setStatus("subscribed");
        } else {
          setStatus("idle");
        }
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  async function subscribe() {
    setStatus("pending");
    try {
      const perm =
        Notification.permission === "default"
          ? await Notification.requestPermission()
          : Notification.permission;
      if (perm !== "granted") {
        setStatus("idle");
        return;
      }
      const reg = await getRegistration();
      if (!reg) {
        setStatus("unsupported");
        return;
      }
      const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!key) {
        setStatus("unsupported");
        return;
      }
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(key),
      });

      const json = sub.toJSON();
      const fd = new FormData();
      fd.set("email", email);
      fd.set("role", role);
      fd.set("endpoint", sub.endpoint);
      fd.set("p256dh", json.keys?.p256dh ?? "");
      fd.set("auth", json.keys?.auth ?? "");
      fd.set("user_agent", navigator.userAgent);
      await savePushSubscription(fd);
      setEndpoint(sub.endpoint);
      setStatus("subscribed");
    } catch {
      setStatus("idle");
    }
  }

  async function unsubscribe() {
    setStatus("pending");
    try {
      const reg = await getRegistration();
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        const ep = sub.endpoint;
        await sub.unsubscribe();
        const fd = new FormData();
        fd.set("email", email);
        fd.set("endpoint", ep);
        await removePushSubscription(fd);
      }
      setEndpoint(null);
      setStatus("idle");
    } catch {
      setStatus("idle");
    }
  }

  if (status === "unsupported") {
    return (
      <div
        className="rounded-xl border bg-card p-3 text-xs"
        style={{ borderColor: "var(--border)", color: "var(--ink-subtle)" }}
      >
        Push notifications not supported on this browser.
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-between rounded-xl border bg-card p-3"
      style={{ borderColor: "var(--border)" }}
    >
      <div>
        <div className="text-sm font-medium">Push notifications</div>
        <div
          className="text-[11px]"
          style={{ color: "var(--ink-subtle)" }}
        >
          {status === "subscribed"
            ? "On — you'll get alerts even when this tab is closed."
            : "Off. Enable to get alerts even when the app is closed."}
        </div>
      </div>
      {status === "subscribed" ? (
        <button
          type="button"
          onClick={unsubscribe}
          disabled={status !== "subscribed"}
          className="rounded-full border px-3 py-1.5 text-xs font-medium"
          style={{ borderColor: "var(--border)" }}
        >
          Disable
        </button>
      ) : (
        <button
          type="button"
          onClick={subscribe}
          disabled={(status as Status) === "pending"}
          className="rounded-full px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
          style={{ backgroundColor: "var(--brand)" }}
        >
          {(status as Status) === "pending" ? "…" : "Enable"}
        </button>
      )}
    </div>
  );
}
