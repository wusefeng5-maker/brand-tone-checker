"use client";

import Link from "next/link";
import type { ToneCheckAuditCheck, ToneCheckResult } from "@/lib/ai/types";
import { formatDateTime, type Dictionary, type Locale } from "@/lib/i18n/config";

function CopyButton({ label, text }: { label: string; text: string }) {
  return (
    <button
      className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950"
      onClick={() => void navigator.clipboard.writeText(text)}
      type="button"
    >
      {label}
    </button>
  );
}

function ResultList({
  copyLabel,
  emptyLabel,
  items,
}: {
  copyLabel: string;
  emptyLabel: string;
  items: string[];
}) {
  if (items.length === 0) {
    return <p className="text-sm text-zinc-500">{emptyLabel}</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li
          className="flex items-start justify-between gap-4 rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-zinc-700"
          key={`${item}-${index}`}
        >
          <span>{item}</span>
          <CopyButton label={copyLabel} text={item} />
        </li>
      ))}
    </ul>
  );
}

const decisionClasses = {
  PASS: "border-emerald-200 bg-emerald-50 text-emerald-800",
  "Needs Revision": "border-yellow-200 bg-yellow-50 text-yellow-800",
  "OFF BRAND": "border-red-200 bg-red-50 text-red-700",
};

const confidenceClasses = {
  High: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Medium: "border-yellow-200 bg-yellow-50 text-yellow-800",
  Low: "border-red-200 bg-red-50 text-red-700",
};

const severityClasses = {
  Critical: "border-red-200 bg-red-50 text-red-700",
  Major: "border-yellow-200 bg-yellow-50 text-yellow-800",
  Minor: "border-zinc-200 bg-zinc-50 text-zinc-700",
};

function contextLines(result: ToneCheckResult, locale: Locale) {
  if (!result.context) {
    return [];
  }

  const time = result.context.time
    ? formatDateTime(new Date(result.context.time), locale)
    : "";
  const labels =
    locale === "zh"
      ? {
          audience: "受众",
          brand: "品牌",
          goal: "目标",
          language: "语言",
          platform: "平台",
          reviewer: "审核人",
          time: "时间",
        }
      : {
          audience: "Audience",
          brand: "Brand",
          goal: "Goal",
          language: "Language",
          platform: "Platform",
          reviewer: "Reviewer",
          time: "Time",
        };

  return [
    [labels.brand, result.context.brand],
    [labels.platform, result.context.platform],
    [labels.audience, result.context.audience],
    [labels.goal, result.context.goal],
    [labels.language, result.context.language],
    [labels.time, time],
    [labels.reviewer, result.context.reviewer],
  ].filter(([, value]) => value);
}

function criticalIssues(checks: ToneCheckAuditCheck[]) {
  return checks.filter(
    (check) => check.severity === "Critical" && check.status !== "PASS",
  );
}

function buildMarkdownReport({
  critical,
  labels,
  locale,
  result,
}: {
  critical: ToneCheckAuditCheck[];
  labels: Dictionary["result"];
  locale: Locale;
  result: ToneCheckResult;
}) {
  const context = Object.fromEntries(contextLines(result, locale));

  return [
    `# ${locale === "zh" ? "品牌 QA 报告" : "Brand QA Report"}`,
    "",
    `- Brand: ${context[locale === "zh" ? "品牌" : "Brand"] ?? "-"}`,
    `- Platform: ${context[locale === "zh" ? "平台" : "Platform"] ?? "-"}`,
    `- Decision: ${result.finalDecision}`,
    `- Score: ${result.score}/100`,
    `- Confidence: ${result.confidence}`,
    `- Time: ${context[locale === "zh" ? "时间" : "Time"] ?? "-"}`,
    `- Reviewer: ${context[locale === "zh" ? "审核人" : "Reviewer"] ?? "-"}`,
    "",
    `## ${labels.criticalIssues}`,
    ...(critical.length
      ? critical.map((check) => `- ${check.evidence.matchedRule}: ${check.reason}`)
      : ["- None"]),
    "",
    `## ${labels.evidence}`,
    ...result.evidence.map(
      (item) =>
        `- ${labels.fields.originalSentence}: ${item.originalSentence}\n  - ${labels.fields.matchedRule}: ${item.matchedRule}\n  - ${labels.fields.severity}: ${item.severity}\n  - ${labels.fields.confidence}: ${item.confidence}\n  - ${labels.fields.reason}: ${item.reason}\n  - ${labels.fields.rewrite}: ${item.rewrite}`,
    ),
    "",
    `## ${labels.rewrite}`,
    result.rewrite,
  ].join("\n");
}

export function ToneCheckResultView({
  historyHref,
  labels,
  locale,
  result,
}: {
  historyHref?: string;
  labels: Dictionary;
  locale: Locale;
  result: ToneCheckResult;
}) {
  const r = labels.result;
  const critical = criticalIssues(result.checks);
  const markdownReport = buildMarkdownReport({
    critical,
    labels: r,
    locale,
    result,
  });
  const plainTextReport = markdownReport.replace(/[#*-]/g, "").trim();
  const htmlReport = markdownReport
    .split("\n")
    .map((line) => `<p>${line}</p>`)
    .join("");

  return (
    <section className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm shadow-zinc-200/70">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-orange-600">{r.result}</p>
        <div className="flex flex-wrap gap-2">
          <CopyButton label={r.copyReport} text={markdownReport} />
          <CopyButton label={r.copyPlainText} text={plainTextReport} />
          <CopyButton label={r.copyHtml} text={htmlReport} />
        </div>
      </div>

      <div className="mt-8 space-y-7">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold text-zinc-950">
              {r.finalDecision}
            </h2>
            <span
              className={`mt-3 inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${decisionClasses[result.finalDecision]}`}
            >
              {r.decisionLabels[result.finalDecision]}
            </span>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-950">
              {r.confidenceLabel}
            </h2>
            <span
              className={`mt-3 inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${confidenceClasses[result.confidence]}`}
            >
              {r.confidenceLabels[result.confidence]}
            </span>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-zinc-950">
            {r.criticalIssues}
          </h2>
          <div className="mt-3">
            <ResultList
              copyLabel={labels.common.copy}
              emptyLabel={r.noItems}
              items={critical.map(
                (check) => `${check.evidence.matchedRule}: ${check.reason}`,
              )}
            />
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-zinc-950">{r.evidence}</h2>
          {result.evidence.length > 0 ? (
            <div className="mt-3 space-y-3">
              {result.evidence.map((item, index) => (
                <article
                  className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4"
                  key={`${item.originalSentence}-${index}`}
                >
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${severityClasses[item.severity]}`}
                    >
                      {r.severityLabels[item.severity]}
                    </span>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${confidenceClasses[item.confidence]}`}
                    >
                      {r.confidenceLabels[item.confidence]}
                    </span>
                  </div>
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="font-semibold text-zinc-950">
                        {r.fields.originalSentence}
                      </dt>
                      <dd className="mt-1 text-zinc-700">
                        {item.originalSentence}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-zinc-950">
                        {r.fields.matchedRule}
                      </dt>
                      <dd className="mt-1 text-zinc-700">{item.matchedRule}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-zinc-950">
                        {r.fields.reason}
                      </dt>
                      <dd className="mt-1 text-zinc-700">{item.reason}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-zinc-500">{r.noEvidence}</p>
          )}
          {result.invalidEvidence.length > 0 ? (
            <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
              <p className="font-semibold">{r.invalidEvidence}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {result.invalidEvidence.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div>
          <h2 className="text-sm font-semibold text-zinc-950">{r.actions}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <CopyButton label={r.copyRewrite} text={result.rewrite} />
            <CopyButton label={r.copyReport} text={markdownReport} />
            <Link
              className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950"
              href="/check"
            >
              {r.runAgain}
            </Link>
            <button
              className="rounded-full border border-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-300"
              disabled
              type="button"
            >
              {r.saveGoodExample}
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-zinc-950">{r.rewrite}</h2>
          <div className="mt-3 rounded-2xl bg-zinc-950 px-4 py-4 text-base leading-7 text-white">
            <div className="flex items-start justify-between gap-4">
              <p>{result.rewrite}</p>
              <CopyButton label={labels.common.copy} text={result.rewrite} />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-zinc-950">{r.rules}</h2>
          <div className="mt-3 grid gap-4 lg:grid-cols-3">
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-normal text-zinc-400">
                {r.matchedRules}
              </h3>
              <ResultList
                copyLabel={labels.common.copy}
                emptyLabel={r.noItems}
                items={result.matchedRules}
              />
            </div>
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-normal text-zinc-400">
                {r.missingRules}
              </h3>
              <ResultList
                copyLabel={labels.common.copy}
                emptyLabel={r.noItems}
                items={result.missingRules}
              />
            </div>
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-normal text-zinc-400">
                {r.violatedRules}
              </h3>
              <ResultList
                copyLabel={labels.common.copy}
                emptyLabel={r.noItems}
                items={result.violatedRules}
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-zinc-950">{r.score}</h2>
          <div className="mt-4 flex items-end gap-3">
            <span className="text-5xl font-semibold tracking-normal text-zinc-950">
              {result.score}
            </span>
            <span className="pb-2 text-sm font-semibold text-zinc-400">
              / 100
            </span>
          </div>
        </div>

        {result.context ? (
          <div>
            <h2 className="text-sm font-semibold text-zinc-950">{r.context}</h2>
            <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              {contextLines(result, locale).map(([label, value]) => (
                <span
                  className="rounded-2xl bg-zinc-50 px-4 py-3 text-zinc-700"
                  key={label}
                >
                  {label}: {value}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {historyHref ? (
          <Link
            className="inline-flex rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
            href={historyHref}
          >
            {r.historyLink}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
