import { auth } from "@clerk/nextjs/server";
import { LandingPage } from "@/components/marketing/landing-page";

export default async function HomePage() {
  const { userId } = await auth();
  const ctaHref = userId ? "/check" : "/sign-up";

  return <LandingPage ctaHref={ctaHref} />;
}
