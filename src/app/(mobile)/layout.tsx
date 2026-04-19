import { MobileTabBar } from "@/components/mobile-tab-bar";

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="theme-candy min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-md flex-col">
        <main className="flex-1">{children}</main>
        <MobileTabBar />
      </div>
    </div>
  );
}
