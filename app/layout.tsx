import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "对味（Duìwèi AI）",
    template: "%s | 对味（Duìwèi AI）",
  },
  description:
    "对味（Duìwèi AI）帮助团队在发布前检查文案是否符合品牌语调，并获得可执行的改写建议。",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "对味（Duìwèi AI）",
    description:
      "发布前检查每条文案是否符合你的品牌语调，减少来回改稿和表达偏差。",
    siteName: "对味（Duìwèi AI）",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "对味（Duìwèi AI）",
    description:
      "发布前检查每条文案是否符合你的品牌语调，获得评分、问题和改写建议。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
