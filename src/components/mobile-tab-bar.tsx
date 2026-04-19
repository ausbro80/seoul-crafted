"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, MessageCircle, User } from "lucide-react";

const TABS = [
  { href: "/", label: "Home", icon: Home, match: (p: string) => p === "/" || p === "/browse" || p.startsWith("/routes/") },
  { href: "/trips", label: "Trips", icon: Compass, match: (p: string) => p.startsWith("/trips") },
  { href: "/chat", label: "Chat", icon: MessageCircle, match: (p: string) => p.startsWith("/chat") },
  { href: "/me", label: "Me", icon: User, match: (p: string) => p.startsWith("/me") },
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="sticky bottom-0 z-10 border-t backdrop-blur-xl"
      style={{ backgroundColor: "rgba(255,255,255,0.85)" }}
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {TABS.map((t) => {
          const active = t.match(pathname);
          const Icon = t.icon;
          return (
            <Link
              key={t.href}
              href={t.href}
              className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px]"
              style={{
                color: active ? "var(--brand)" : "var(--ink-subtle)",
              }}
            >
              <Icon className="size-5" strokeWidth={active ? 2.2 : 1.8} />
              <span className="font-display">{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
