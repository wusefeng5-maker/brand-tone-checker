import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { isAdminEmailAllowed } from "@/lib/admin-rules";

export async function requireAdmin() {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? null;

  if (!isAdminEmailAllowed(email, process.env.ADMIN_EMAILS)) {
    notFound();
  }

  return {
    email,
  };
}
