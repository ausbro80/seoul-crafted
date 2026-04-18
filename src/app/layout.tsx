import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Gaegu, Noto_Serif_KR } from "next/font/google";
import "./globals.css";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AdminHeader } from "@/components/admin-header";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const gaegu = Gaegu({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "700"],
  display: "swap",
});

const notoSerifKR = Noto_Serif_KR({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Seoul Crafted · Admin",
  description: "Ops console for Seoul Crafted — routes, guides, bookings, messages.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${gaegu.variable} ${notoSerifKR.variable} h-full`}
    >
      <body className="min-h-full">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <AdminHeader />
            <main className="flex-1 p-6 lg:p-8">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
