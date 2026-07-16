import type { ToneCheckResult } from "@/lib/ai/types";

function ResultList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-zinc-500">No issues found.</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-zinc-700"
          key={item}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export function ToneCheckResultView({ result }: { result: ToneCheckResult }) {
  return (
    <section className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm shadow-zinc-200/70">
      <p className="text-sm font-semibold text-orange-600">Result</p>
      <div className="mt-4 flex items-end gap-3">
        <span className="text-5xl font-semibold tracking-normal text-zinc-950">
          {result.score}
        </span>
        <span className="pb-2 text-sm font-semibold text-zinc-400">/ 100</span>
      </div>

      <div className="mt-8 space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-zinc-950">Summary</h2>
          <p className="mt-2 text-base leading-7 text-zinc-600">
            {result.summary}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-zinc-950">Problems</h2>
          <div className="mt-3">
            <ResultList items={result.problems} />
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-zinc-950">Suggestions</h2>
          <div className="mt-3">
            <ResultList items={result.suggestions} />
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-zinc-950">Rewrite</h2>
          <p className="mt-3 rounded-2xl bg-zinc-950 px-4 py-4 text-base leading-7 text-white">
            {result.rewrite}
          </p>
        </div>
      </div>
    </section>
  );
}
