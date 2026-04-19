import { MobileTabBar } from "@/components/mobile-tab-bar";
import { getLang } from "@/lib/i18n";
import { t } from "@/lib/ui-strings";

export default async function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = await getLang();
  const labels = {
    home: t(lang, "nav_home"),
    trips: t(lang, "nav_trips"),
    chat: t(lang, "nav_chat"),
    me: t(lang, "nav_me"),
  };

  return (
    <div className="theme-candy min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-md flex-col">
        <main className="flex-1">{children}</main>
        <MobileTabBar labels={labels} />
      </div>
    </div>
  );
}
