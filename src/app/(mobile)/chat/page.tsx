import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getTravelerEmail } from "../_actions/booking";
import { getLang } from "@/lib/i18n";
import { t } from "@/lib/ui-strings";
import { saveTravelerEmail } from "./actions";
import { Composer } from "./composer";
import { ChatLive, EnableNotificationsButton } from "@/components/chat-live";

export const dynamic = "force-dynamic";

type Message = {
  id: string;
  sender: "customer" | "guide" | "support";
  body: string;
  source_lang: string | null;
  translations: Record<string, string> | null;
  created_at: string;
};

type Convo = {
  id: string;
  channel: "guide" | "support";
  messages: Message[] | null;
};

export default async function ChatPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab: tabRaw } = await searchParams;
  const tab: "guide" | "support" = tabRaw === "guide" ? "guide" : "support";
  const lang = await getLang();
  const email = await getTravelerEmail();

  if (!email) {
    return (
      <>
        <header className="px-5 pt-5">
          <h1 className="font-display text-3xl">{t(lang, "chat_title")}</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--ink-subtle)" }}>
            {t(lang, "chat_need_email")}
          </p>
        </header>
        <section className="px-5 pt-6">
          <form action={saveTravelerEmail} className="flex gap-2">
            <input
              name="email"
              type="email"
              required
              placeholder={t(lang, "field_email")}
              className="flex-1 rounded-xl border bg-card px-3 py-2.5 text-sm"
              style={{ borderColor: "var(--border)" }}
            />
            <button
              type="submit"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-white"
              style={{ backgroundColor: "var(--brand)" }}
            >
              {t(lang, "chat_email_btn")}
            </button>
          </form>
        </section>
      </>
    );
  }

  const supabase = await createClient();
  const { data: convos } = await supabase
    .from("conversations")
    .select(
      "id, channel, messages(id, sender, body, source_lang, translations, created_at)",
    )
    .eq("customer_email", email)
    .returns<Convo[]>();

  const byChannel: Record<"guide" | "support", Convo | undefined> = {
    guide: convos?.find((c) => c.channel === "guide"),
    support: convos?.find((c) => c.channel === "support"),
  };

  const active = byChannel[tab];
  const messages = (active?.messages ?? [])
    .slice()
    .sort((a, b) => a.created_at.localeCompare(b.created_at));

  const topics = [byChannel.guide?.id, byChannel.support?.id]
    .filter((x): x is string => typeof x === "string")
    .map((id) => `convo:${id}`);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <ChatLive
        topics={topics}
        notifyTitle={t(lang, "chat_title")}
        viewerLang={lang}
      />

      <header className="flex items-start justify-between px-5 pt-5">
        <h1 className="font-display text-3xl">{t(lang, "chat_title")}</h1>
        <EnableNotificationsButton label="🔔" />
      </header>

      {/* Tab switcher */}
      <div className="mt-4 px-5">
        <div
          className="inline-flex rounded-full border p-0.5"
          style={{ borderColor: "var(--border)" }}
        >
          {(["support", "guide"] as const).map((ch) => {
            const active = tab === ch;
            return (
              <Link
                key={ch}
                href={ch === "support" ? "/chat" : "/chat?tab=guide"}
                className="rounded-full px-4 py-1.5 text-xs font-medium"
                style={{
                  backgroundColor: active ? "var(--brand)" : "transparent",
                  color: active ? "#fff" : "var(--ink-subtle)",
                }}
              >
                {t(lang, ch === "guide" ? "chat_tab_guide" : "chat_tab_support")}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Messages */}
      <section className="flex-1 overflow-y-auto px-5 pt-4 pb-4">
        {messages.length === 0 ? (
          <div
            className="rounded-2xl border border-dashed px-4 py-16 text-center text-sm"
            style={{
              borderColor: "var(--border)",
              color: "var(--ink-subtle)",
            }}
          >
            {t(lang, "chat_empty")}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {messages.map((m) => {
              const mine = m.sender === "customer";
              const translated = m.translations?.[lang] ?? m.body;
              const showOriginal =
                !mine && m.source_lang && m.source_lang !== lang && m.body !== translated;
              return (
                <div
                  key={m.id}
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${mine ? "self-end" : "self-start"}`}
                  style={{
                    backgroundColor: mine ? "var(--brand)" : "var(--muted)",
                    color: mine ? "#fff" : "inherit",
                  }}
                >
                  <div className="whitespace-pre-wrap">{translated}</div>
                  {showOriginal ? (
                    <details className="mt-1 text-[10px] opacity-70">
                      <summary className="cursor-pointer">
                        {m.source_lang?.toUpperCase()} · original
                      </summary>
                      <div className="mt-1 whitespace-pre-wrap">{m.body}</div>
                    </details>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Composer
        channel={tab}
        placeholder={t(lang, "chat_compose_placeholder")}
        sendLabel={t(lang, "chat_send")}
      />
    </div>
  );
}
