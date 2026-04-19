import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Gaegu, Noto_Serif_KR } from "next/font/google";
import "./globals.css";

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
  title: {
    default: "Seoul Crafted",
    template: "%s · Seoul Crafted",
  },
  description: "Curated Seoul tours, booked in minutes.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Seoul Crafted",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#C44536",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
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
      <body className="min-h-full">{children}</body>
    </html>
  );
}
