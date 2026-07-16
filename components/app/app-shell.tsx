import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/marketing/logo";

export function AppShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-[#f6f7fb]">
      <header className="border-b border-zinc-200 bg-white/85 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link aria-label="返回官网" href="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              className="rounded-full px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
              href="/dashboard"
            >
              Dashboard
            </Link>
            <Link
              className="rounded-full px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
              href="/profiles"
            >
              Profiles
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </nav>
      </header>
      {children}
    </main>
  );
}
