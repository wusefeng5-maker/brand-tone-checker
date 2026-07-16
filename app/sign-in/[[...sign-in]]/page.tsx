import { SignIn } from "@clerk/nextjs";
import { AuthPageShell } from "@/components/auth/auth-page-shell";

export default function SignInPage() {
  return (
    <AuthPageShell title="登录对味" description="进入工作台，继续管理你的品牌语调检查流程。">
      <SignIn
        fallbackRedirectUrl="/dashboard"
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
      />
    </AuthPageShell>
  );
}
