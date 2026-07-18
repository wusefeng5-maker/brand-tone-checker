import { cookies } from "next/headers";
import {
  dictionaries,
  localeCookieName,
  normalizeLocale,
  type Locale,
} from "./config";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();

  return normalizeLocale(cookieStore.get(localeCookieName)?.value);
}

export async function getDictionary() {
  const locale = await getLocale();

  return {
    locale,
    t: dictionaries[locale],
  };
}
