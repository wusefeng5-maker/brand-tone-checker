import type {
  ToneCheckAuditCheck,
  ToneCheckAuditStatus,
  ToneCheckConfidence,
  ToneCheckEvidence,
  ToneCheckResult,
  ToneCheckSeverity,
} from "./types";

export function getToneCheckDecision(
  score: number,
  checks: ToneCheckAuditCheck[],
): ToneCheckResult["finalDecision"] {
  const hasCriticalFail = checks.some(
    (check) => check.severity === "Critical" && check.status === "FAIL",
  );
  const majorFailures = checks.filter(
    (check) => check.severity === "Major" && check.status === "FAIL",
  ).length;
  const hasRevision = checks.some((check) => check.status !== "PASS");

  if (hasCriticalFail || majorFailures >= 2 || score < 60) {
    return "OFF BRAND";
  }

  if (hasRevision || score < 85) {
    return "Needs Revision";
  }

  return "PASS";
}

const auditScores: Record<ToneCheckSeverity, Record<ToneCheckAuditStatus, number>> = {
  Critical: {
    PASS: 100,
    PARTIAL: 45,
    FAIL: 0,
  },
  Major: {
    PASS: 100,
    PARTIAL: 60,
    FAIL: 20,
  },
  Minor: {
    PASS: 100,
    PARTIAL: 75,
    FAIL: 50,
  },
};

function extractJson(rawText: string) {
  const fencedMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  const firstBrace = rawText.indexOf("{");
  const lastBrace = rawText.lastIndexOf("}");

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return rawText.slice(firstBrace, lastBrace + 1);
  }

  return rawText.trim();
}

function ensureStringArray(value: unknown, fieldName: string): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`Invalid tone check JSON: ${fieldName} must be a string array.`);
  }

  return value;
}

function optionalStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function normalizeStatus(value: unknown): ToneCheckAuditStatus {
  if (value === "PASS" || value === "PARTIAL" || value === "FAIL") {
    return value;
  }

  throw new Error("Invalid tone check JSON: check status must be PASS, PARTIAL, or FAIL.");
}

function normalizeConfidence(value: unknown): ToneCheckConfidence {
  if (value === "High" || value === "Medium" || value === "Low") {
    return value;
  }

  return "Low";
}

function normalizeSeverity(value: unknown): ToneCheckSeverity {
  if (value === "Critical" || value === "Major" || value === "Minor") {
    return value;
  }

  throw new Error("Invalid tone check JSON: severity must be Critical, Major, or Minor.");
}

function requireText(value: unknown, fieldName: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid tone check JSON: ${fieldName} must be a non-empty string.`);
  }

  return value.trim();
}

function normalizeEvidence(value: unknown): ToneCheckEvidence {
  const evidence =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  return {
    originalSentence: requireText(
      evidence.originalSentence ?? evidence.sentence,
      "evidence.originalSentence",
    ),
    sentence: requireText(
      evidence.originalSentence ?? evidence.sentence,
      "evidence.originalSentence",
    ),
    matchedRule: requireText(evidence.matchedRule, "evidence.matchedRule"),
    severity: normalizeSeverity(evidence.severity),
    reason: requireText(evidence.reason, "evidence.reason"),
    rewrite: requireText(evidence.rewrite, "evidence.rewrite"),
    confidence: normalizeConfidence(evidence.confidence),
    suggestion: requireText(evidence.suggestion, "evidence.suggestion"),
  };
}

function normalizeChecks(value: unknown): ToneCheckAuditCheck[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error("Invalid tone check JSON: checks must be a non-empty array.");
  }

  return value.map((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new Error("Invalid tone check JSON: each check must be an object.");
    }

    const check = item as Record<string, unknown>;

    const severity = normalizeSeverity(check.severity);
    const evidence = normalizeEvidence(check.evidence);

    return {
      category: requireText(check.category, "check.category"),
      status: normalizeStatus(check.status),
      severity,
      reason: requireText(check.reason, "check.reason"),
      evidence: {
        ...evidence,
        severity,
      },
      suggestion: requireText(check.suggestion, "check.suggestion"),
    };
  });
}

export function calculateToneCheckScore(checks: ToneCheckAuditCheck[]) {
  const total = checks.reduce(
    (sum, check) => sum + auditScores[check.severity][check.status],
    0,
  );

  return Math.round(total / checks.length);
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

export function buildToneCheckResultFromChecks({
  checks,
  confidence,
  invalidEvidence = [],
  problems = [],
  rewrite,
  suggestions,
  summary,
}: {
  checks: ToneCheckAuditCheck[];
  confidence: ToneCheckConfidence;
  invalidEvidence?: string[];
  problems?: string[];
  rewrite: string;
  suggestions: string[];
  summary: string;
}): ToneCheckResult {
  if (checks.length === 0) {
    throw new Error("Tone check result requires at least one check.");
  }

  const score = calculateToneCheckScore(checks);
  const evidence = checks.map((check) => check.evidence);
  const brandRulesHit = unique(checks.map((check) => check.evidence.matchedRule));
  const matchedRules = unique(
    checks
      .filter((check) => check.status === "PASS" || check.status === "PARTIAL")
      .map((check) => check.evidence.matchedRule),
  );
  const missingRules = unique(
    checks
      .filter((check) => check.status === "PARTIAL")
      .map((check) => check.evidence.matchedRule),
  );
  const violatedRules = unique(
    checks
      .filter((check) => check.status === "FAIL")
      .map((check) => check.evidence.matchedRule),
  );

  return {
    score,
    finalDecision: getToneCheckDecision(score, checks),
    confidence,
    summary,
    evidence,
    invalidEvidence,
    checks,
    problems,
    suggestions,
    rewrite,
    brandRulesHit,
    matchedRules,
    missingRules,
    violatedRules,
  };
}

export function parseToneCheckResult(rawText: string): ToneCheckResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(extractJson(rawText));
  } catch {
    throw new Error("AI returned invalid JSON.");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("AI returned invalid JSON.");
  }

  const data = parsed as Record<string, unknown>;

  if (typeof data.summary !== "string") {
    throw new Error("Invalid tone check JSON: summary must be a string.");
  }

  if (typeof data.rewrite !== "string") {
    throw new Error("Invalid tone check JSON: rewrite must be a string.");
  }

  const checks = normalizeChecks(data.checks);
  return buildToneCheckResultFromChecks({
    checks,
    confidence: normalizeConfidence(data.confidence),
    summary: data.summary,
    problems: optionalStringArray(data.problems),
    suggestions: ensureStringArray(data.suggestions, "suggestions"),
    rewrite: data.rewrite,
  });
}
