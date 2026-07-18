"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  localeCookieName,
  normalizeLocale,
} from "@/lib/i18n/config";

export async function setLocaleAction(formData: FormData): Promise<void> {
  const locale = normalizeLocale(formData.get("locale"));
  const path = formData.get("path");
  const cookieStore = await cookies();

  cookieStore.set(localeCookieName, locale, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  if (typeof path === "string" && path.startsWith("/")) {
    revalidatePath(path);
  }
}
