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
      summary: result.summary,
      suggestions: result.suggestions,
    },
  };
}

export function readToneCheckResultFromCheck(
  check: PersistedCheckResultFields,
): ToneCheckResult {
  const tagHits = getTagHits(check.tagHits);
  const summary = typeof tagHits.summary === "string" ? tagHits.summary : "";

  return {
    score: check.score,
    summary,
    problems: toStringArray(check.issues),
    suggestions: toStringArray(tagHits.suggestions),
    rewrite: check.rewrite ?? "",
  };
}
