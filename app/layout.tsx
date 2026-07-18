import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { getLocale } from "@/lib/i18n/server";
import "./globals.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "对味（Duìwèi AI）",
    template: "%s | 对味（Duìwèi AI）",
  },
  description:
    "对味（Duìwèi AI）帮助团队在发布前检查内容是否符合品牌标准，并生成可追溯的品牌 QA 报告。",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "对味（Duìwèi AI）",
    description:
      "发布前检查每条内容是否符合品牌标准，减少来回改稿和表达偏差。",
    siteName: "对味（Duìwèi AI）",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "对味（Duìwèi AI）",
    description:
      "发布前检查每条内容是否符合品牌标准，获得证据、结论和改写建议。",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale === "zh" ? "zh-CN" : "en"}>
      <body>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
