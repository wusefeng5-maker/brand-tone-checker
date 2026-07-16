import Link from "next/link";

const adminLinks = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/ai-logs", label: "AI Logs" },
];

type AdminPageProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function AdminPage({ title, description, children }: AdminPageProps) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-orange-600">Admin</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal text-zinc-950">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
            {description}
          </p>
        </div>
        <nav className="flex flex-wrap gap-2">
          {adminLinks.map((link) => (
            <Link
              className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-950"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-8">{children}</div>
    </section>
  );
}

export function AdminStatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm shadow-zinc-200/70">
      <p className="text-sm font-semibold text-zinc-500">{label}</p>
      <p className="mt-4 text-4xl font-semibold tracking-normal text-zinc-950">
        {value.toLocaleString()}
      </p>
    </div>
  );
}
