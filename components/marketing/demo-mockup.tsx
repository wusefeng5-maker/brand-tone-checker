import type { Locale } from "@/lib/i18n/config";

const demoContent = {
  zh: {
    title: "静态演示",
    status: "已对味",
    brandProfile: "品牌档案：新消费茶饮",
    input: "本周新品上线，喜欢的朋友赶紧下单，错过就没有了。",
    scoreBefore: "62",
    scoreAfter: "92",
    issues: ["语气过度催促", "缺少品牌关键词", "促销感偏强"],
    rewrite:
      "本周新品来了。清爽、轻甜、刚刚好，适合把今天过成一点点小假期。",
    issuesTitle: "发现的问题",
    rewriteTitle: "建议改写",
    scoreLabels: {
      before: "检查前",
      after: "改写后",
    },
  },
  en: {
    title: "Static demo",
    status: "On brand",
    brandProfile: "Brand Brain: modern tea brand",
    input: "New product is live this week. Order now before it is gone.",
    scoreBefore: "62",
    scoreAfter: "92",
    issues: ["CTA is too aggressive", "Missing brand keywords", "Feels too promotional"],
    rewrite:
      "This week's new drink is here: crisp, lightly sweet, and made for a small pause in your day.",
    issuesTitle: "Issues found",
    rewriteTitle: "Suggested rewrite",
    scoreLabels: {
      before: "Before",
      after: "After",
    },
  },
} as const;

export function DemoMockup({ locale }: { locale: Locale }) {
  const demo = demoContent[locale];

  return (
    <div className="relative mx-auto w-full max-w-lg rounded-[2rem] border border-white/70 bg-white p-4 shadow-2xl shadow-orange-200/60">
      <div className="rounded-[1.5rem] border border-zinc-100 bg-zinc-50 p-4 sm:p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-600">
              {demo.title}
            </p>
            <p className="mt-1 text-sm font-medium text-zinc-700">
              {demo.brandProfile}
            </p>
          </div>
          <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {demo.status}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <p className="text-sm leading-6 text-zinc-600">{demo.input}</p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <ScoreTile
            label={demo.scoreLabels.before}
            score={demo.scoreBefore}
            tone="warn"
          />
          <ScoreTile
            label={demo.scoreLabels.after}
            score={demo.scoreAfter}
            tone="good"
          />
        </div>

        <div className="mt-4 rounded-2xl border border-orange-100 bg-orange-50/70 p-4">
          <p className="text-sm font-semibold text-zinc-900">
            {demo.issuesTitle}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {demo.issues.map((issue) => (
              <span
                className="rounded-full bg-white px-3 py-1 text-xs font-medium text-orange-700 shadow-sm"
                key={issue}
              >
                {issue}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-emerald-100 bg-white p-4">
          <p className="mb-2 text-sm font-semibold text-zinc-900">
            {demo.rewriteTitle}
          </p>
          <p className="text-sm leading-6 text-zinc-600">{demo.rewrite}</p>
        </div>
      </div>
    </div>
  );
}

function ScoreTile({
  label,
  score,
  tone,
}: {
  label: string;
  score: string;
  tone: "warn" | "good";
}) {
  const toneClass =
    tone === "good"
      ? "from-emerald-500 to-lime-400 text-emerald-700"
      : "from-red-500 to-orange-400 text-orange-700";

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-4">
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <div className="mt-2 flex items-end gap-1">
        <span
          className={`bg-gradient-to-br bg-clip-text text-4xl font-bold text-transparent ${toneClass}`}
        >
          {score}
        </span>
        <span className={`pb-1 text-sm font-semibold ${toneClass}`}>/100</span>
      </div>
    </div>
  );
}
