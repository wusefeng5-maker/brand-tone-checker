import { currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const user = await currentUser();
  const displayName =
    user?.firstName || user?.username || user?.primaryEmailAddress?.emailAddress || "欢迎回来";

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <div className="rounded-[2rem] border border-zinc-100 bg-white p-8 shadow-sm shadow-zinc-200/70">
        <p className="text-sm font-semibold text-orange-600">Dashboard</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal text-zinc-950">
          {displayName}，认证系统已接入
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
          这里是受保护的 App 占位页面。品牌档案、AI 检查、历史记录和业务数据会在后续阶段开发。
        </p>
      </div>
    </section>
  );
}
