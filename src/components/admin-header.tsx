"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/routes": "Routes",
  "/admin/guides": "Guides",
  "/admin/bookings": "Bookings",
  "/admin/messages": "Messages",
  "/admin/content": "Content & i18n",
  "/admin/media": "Media library",
  "/admin/settings": "Settings",
};

export function AdminHeader({ userEmail }: { userEmail: string | null }) {
  const pathname = usePathname();
  const title =
    TITLES[pathname] ??
    TITLES[
      Object.keys(TITLES).find((k) => k !== "/admin" && pathname.startsWith(k)) ??
        "/admin"
    ] ??
    "Dashboard";

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-background/80 px-6 backdrop-blur-xl lg:px-8">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-5" />
      <h1 className="text-sm font-semibold tracking-tight">{title}</h1>
      <div className="ml-auto flex items-center gap-3">
        {userEmail ? (
          <span className="hidden text-xs text-muted-foreground sm:inline">
            {userEmail}
          </span>
        ) : null}
        <form action="/auth/logout" method="post">
          <Button variant="ghost" size="sm" type="submit">
            Sign out
          </Button>
        </form>
      </div>
    </header>
  );
}
