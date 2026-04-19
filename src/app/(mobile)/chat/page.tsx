import { getLang } from "@/lib/i18n";
import { t } from "@/lib/ui-strings";

export const dynamic = "force-dynamic";

export default async function ChatPage() {
  const lang = await getLang();
  return (
    <>
      <header className="px-5 pt-5">
        <h1 className="font-display text-3xl">{t(lang, "chat_title")}</h1>
      </header>
      <section className="px-5 pt-6">
        <div
          className="rounded-2xl border border-dashed px-4 py-16 text-center text-sm"
          style={{
            borderColor: "var(--border)",
            color: "var(--ink-subtle)",
          }}
        >
          {t(lang, "chat_empty")}
        </div>
      </section>
    </>
  );
}
