import { SignUp } from "@clerk/nextjs";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { getDictionary } from "@/lib/i18n/server";

export default async function SignUpPage() {
  const { t } = await getDictionary();

  return (
    <AuthPageShell
      description={t.auth.signUpDescription}
      heroDescription={t.auth.heroDescription}
      heroTitle={t.auth.heroTitle}
      title={t.auth.signUpTitle}
    >
      <SignUp
        fallbackRedirectUrl="/dashboard"
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
      />
    </AuthPageShell>
  );
}
