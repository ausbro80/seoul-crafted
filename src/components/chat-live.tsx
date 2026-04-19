"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Opts = {
  topics: string[];          // e.g. ["convo:abc", "convo:def"] or ["admin:inbox"]
  notifyTitle: string;       // shown in the browser Notification + tab flash
  notifyBodyFor?: (payload: unknown) => string | null;
  playSound?: boolean;       // default true
};

const SOUND_URL =
  "data:audio/wav;base64,UklGRqgCAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YYQCAAAAAP///78DAgA+/T/+LgT6/xL8ewT8AQz69AJDAin9VP3yAiv+qfzcAaH/hPwOAnH+bwBNAOT/vvxMAED++wMq/wEBpwJN/zcCdgBU/ZABDwHM/ewB/v94ALsA5f3/Akr9f/83BAEBhf/d/GX8qAIJ/0IAZwCj/2MA3gG//ur9+wA9A2b+FgEyAMcAMwGN/twC7P5i/+MBff7J/4EAIQFn/hQA9QBN/0wEB/5S/TwBvwFo/+sA+f/A/6b+iv4Y/vYAFP8zAjMAR/+RAHD9xwK4/en/MwCo/3MB0gCL/8H/+P74/vn+8gHAAIr+3wHC/sYBHwGw/+IAdQCJ/9YAIwHa/03/ff7f/vP9wv5d/pj++QLP/uj+OQGM/zYCFQAg/zsBsQDS/5T/XgF1ALb/y//i/u7/UQDK/yH+2f+l/xT/4QDA/6f/GgCR/44AawAFAOr+Ff9PANL/WADR/53/bQDh/xoAJwDs/wEAQAAIALX/EAD//wgAiACsANH/AAD+/w0A+v8AABYA3v/6/+D/7f8aADAAMwAoADsAIAAqACoAHQAmAAoAFAAZACAAHgAZABAADAAHAAkAEQANABEADgAOABEABwAJAA8ABQAHAAUACQAEAAMABAAGAAYABgAHAAcABgAFAAMAAwACAAAA//8AAP3//f///wAAAAD//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

export function ChatLive({
  topics,
  notifyTitle,
  notifyBodyFor,
  playSound = true,
}: Opts) {
  const router = useRouter();
  const lastRef = useRef<number>(0);

  useEffect(() => {
    if (topics.length === 0) return;
    const sb = createClient();
    const channels = topics.map((topic) =>
      sb
        .channel(topic)
        .on("broadcast", { event: "message" }, (msg) => {
          // Rate-limit refresh to once per 500ms in case of bursts.
          const now = Date.now();
          if (now - lastRef.current < 400) return;
          lastRef.current = now;

          router.refresh();

          const body = notifyBodyFor?.(msg.payload) ?? null;
          const isHidden =
            typeof document !== "undefined" && document.visibilityState === "hidden";

          if (playSound && typeof Audio !== "undefined") {
            try {
              const a = new Audio(SOUND_URL);
              a.volume = 0.4;
              void a.play().catch(() => {});
            } catch {
              /* noop */
            }
          }

          if (
            isHidden &&
            typeof window !== "undefined" &&
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            try {
              new Notification(notifyTitle, {
                body: body ?? "You have a new message",
                icon: "/icon.png",
                badge: "/icon.png",
                tag: topic,
              });
            } catch {
              /* noop */
            }
          }

          // Title flash while tab is hidden
          if (isHidden && typeof document !== "undefined") {
            const original = document.title;
            document.title = `• ${original}`;
            const onVis = () => {
              if (document.visibilityState === "visible") {
                document.title = original;
                document.removeEventListener("visibilitychange", onVis);
              }
            };
            document.addEventListener("visibilitychange", onVis);
          }
        })
        .subscribe(),
    );

    return () => {
      channels.forEach((ch) => {
        sb.removeChannel(ch);
      });
    };
  }, [topics.join("|"), router, notifyTitle, notifyBodyFor, playSound]);

  return null;
}

export function EnableNotificationsButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window === "undefined" || !("Notification" in window)) return;
        if (Notification.permission === "default") {
          void Notification.requestPermission();
        } else if (Notification.permission === "denied") {
          alert(
            "Notifications are blocked in your browser settings. Enable them there to receive alerts.",
          );
        }
      }}
      className="text-xs underline"
      style={{ color: "var(--ink-subtle)" }}
    >
      {label}
    </button>
  );
}
