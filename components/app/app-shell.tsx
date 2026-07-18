import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { Logo } from "@/components/marketing/logo";
import { getDictionary } from "@/lib/i18n/server";

export async function AppShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale, t } = await getDictionary();

  return (
    <main className="min-h-screen bg-[#f6f7fb]">
      <header className="border-b border-zinc-200 bg-white/85 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link aria-label={t.nav.home} href="/">
            <Logo />
          </Link>
          <div className="flex min-w-0 items-center gap-1 overflow-x-auto pl-4 sm:gap-4">
            <Link
              className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
              href="/dashboard"
            >
              {t.nav.dashboard}
            </Link>
            <Link
              className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
              href="/profiles"
            >
              {t.nav.profiles}
            </Link>
            <Link
              className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
              href="/check"
            >
              {t.nav.check}
            </Link>
            <Link
              className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
              href="/checks"
            >
              {t.nav.history}
            </Link>
            <LanguageSwitcher labels={t.common} locale={locale} />
            <UserButton />
          </div>
        </nav>
      </header>
      {children}
    </main>
  );
}
