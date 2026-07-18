import { Logo } from "@/components/marketing/logo";

export function AuthPageShell({
  children,
  description,
  heroDescription,
  heroTitle,
  title,
}: Readonly<{
  children: React.ReactNode;
  description: string;
  heroDescription: string;
  heroTitle: string;
  title: string;
}>) {
  return (
    <main className="grid min-h-screen bg-[#f6f7fb] px-5 py-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
      <section className="hidden flex-col justify-between rounded-[2rem] bg-gradient-to-br from-[#e8443a] to-[#ff7a45] p-10 text-white lg:flex">
        <Logo />
        <div>
          <h1 className="max-w-xl text-5xl font-semibold leading-tight tracking-normal">
            {heroTitle}
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-white/85">
            {heroDescription}
          </p>
        </div>
        <p className="text-sm text-white/75">对味 Duìwèi AI</p>
      </section>

      <section className="flex items-center justify-center py-10 lg:py-0">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <div className="mb-8">
            <h2 className="text-3xl font-semibold tracking-normal text-zinc-950">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              {description}
            </p>
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}
