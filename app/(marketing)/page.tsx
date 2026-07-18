import { auth } from "@clerk/nextjs/server";
import { LandingPage } from "@/components/marketing/landing-page";
import { getDictionary } from "@/lib/i18n/server";

export default async function HomePage() {
  const { userId } = await auth();
  const { locale, t } = await getDictionary();
  const ctaHref = userId ? "/check" : "/sign-up";

  return <LandingPage ctaHref={ctaHref} labels={t.common} locale={locale} />;
}
