import { SignUp } from "@clerk/nextjs";
import { AuthPageShell } from "@/components/auth/auth-page-shell";

export default function SignUpPage() {
  return (
    <AuthPageShell title="注册对味" description="创建账号后进入 Dashboard，后续即可开始建立品牌档案。">
      <SignUp
        fallbackRedirectUrl="/dashboard"
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
      />
    </AuthPageShell>
  );
}
