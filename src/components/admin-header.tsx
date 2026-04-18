"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/routes": "Routes",
  "/guides": "Guides",
  "/bookings": "Bookings",
  "/messages": "Messages",
  "/content": "Content & i18n",
  "/media": "Media library",
  "/settings": "Settings",
};

export function AdminHeader() {
  const pathname = usePathname();
  const title =
    TITLES[pathname] ??
    TITLES[Object.keys(TITLES).find((k) => k !== "/" && pathname.startsWith(k)) ?? "/"] ??
    "Dashboard";

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-background/80 px-6 backdrop-blur-xl lg:px-8">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-5" />
      <h1 className="text-sm font-semibold tracking-tight">{title}</h1>
    </header>
  );
}
