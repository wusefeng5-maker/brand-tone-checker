import type { ToneCheckResult } from "@/lib/ai/types";

type BuildCheckCreateDataInput = {
  userId: string;
  brandProfileId: string;
  inputText: string;
  result: ToneCheckResult;
};

type PersistedCheckResultFields = {
  score: number;
  issues: unknown;
  rewrite: string | null;
  tagHits: unknown;
};

function toStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function getTagHits(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, unknown>;
}

export function buildCheckCreateData({
  userId,
  brandProfileId,
  inputText,
  result,
}: BuildCheckCreateDataInput) {
  return {
    userId,
    brandProfileId,
    inputText,
    score: result.score,
    issues: result.problems,
    rewrite: result.rewrite,
    tagHits: {
      brandRulesHit: result.brandRulesHit,
      checks: result.checks,
      confidence: result.confidence,
      context: result.context,
      evidence: result.evidence,
      finalDecision: result.finalDecision,
      invalidEvidence: result.invalidEvidence,
      matchedRules: result.matchedRules,
      missingRules: result.missingRules,
      summary: result.summary,
      suggestions: result.suggestions,
      violatedRules: result.violatedRules,
    },
  };
}

export function readToneCheckResultFromCheck(
  check: PersistedCheckResultFields,
): ToneCheckResult {
  const tagHits = getTagHits(check.tagHits);
  const summary = typeof tagHits.summary === "string" ? tagHits.summary : "";
  const score = check.score;
  const finalDecision =
    tagHits.finalDecision === "PASS" ||
    tagHits.finalDecision === "Needs Revision" ||
    tagHits.finalDecision === "OFF BRAND"
      ? tagHits.finalDecision
      : score >= 80
        ? "PASS"
        : score >= 60
          ? "Needs Revision"
          : "OFF BRAND";

  return {
    score,
    finalDecision,
    confidence:
      tagHits.confidence === "High" ||
      tagHits.confidence === "Medium" ||
      tagHits.confidence === "Low"
        ? tagHits.confidence
        : "Low",
    summary,
    evidence: Array.isArray(tagHits.evidence)
      ? (tagHits.evidence as ToneCheckResult["evidence"])
      : [],
    invalidEvidence: toStringArray(tagHits.invalidEvidence),
    checks: Array.isArray(tagHits.checks)
      ? (tagHits.checks as ToneCheckResult["checks"])
      : [],
    problems: toStringArray(check.issues),
    suggestions: toStringArray(tagHits.suggestions),
    rewrite: check.rewrite ?? "",
    brandRulesHit: toStringArray(tagHits.brandRulesHit),
    matchedRules: toStringArray(tagHits.matchedRules).length
      ? toStringArray(tagHits.matchedRules)
      : toStringArray(tagHits.brandRulesHit),
    missingRules: toStringArray(tagHits.missingRules),
    violatedRules: toStringArray(tagHits.violatedRules),
    context:
      tagHits.context &&
      typeof tagHits.context === "object" &&
      !Array.isArray(tagHits.context)
        ? (tagHits.context as ToneCheckResult["context"])
        : undefined,
  };
}
