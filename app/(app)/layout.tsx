import { auth } from "@clerk/nextjs/server";
import { AppShell } from "@/components/app/app-shell";

export default async function ProtectedAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await auth.protect();

  return <AppShell>{children}</AppShell>;
}
