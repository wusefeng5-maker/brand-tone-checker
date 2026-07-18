import { SignIn } from "@clerk/nextjs";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { getDictionary } from "@/lib/i18n/server";

export default async function SignInPage() {
  const { t } = await getDictionary();

  return (
    <AuthPageShell
      description={t.auth.signInDescription}
      heroDescription={t.auth.heroDescription}
      heroTitle={t.auth.heroTitle}
      title={t.auth.signInTitle}
    >
      <SignIn
        fallbackRedirectUrl="/dashboard"
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
      />
    </AuthPageShell>
  );
}
