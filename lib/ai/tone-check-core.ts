import type { ToneCheckResult } from "./types";

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

  if (
    typeof data.score !== "number" ||
    !Number.isInteger(data.score) ||
    data.score < 0 ||
    data.score > 100
  ) {
    throw new Error("Invalid tone check JSON: score must be an integer from 0 to 100.");
  }

  if (typeof data.summary !== "string") {
    throw new Error("Invalid tone check JSON: summary must be a string.");
  }

  if (typeof data.rewrite !== "string") {
    throw new Error("Invalid tone check JSON: rewrite must be a string.");
  }

  return {
    score: data.score,
    summary: data.summary,
    problems: ensureStringArray(data.problems, "problems"),
    suggestions: ensureStringArray(data.suggestions, "suggestions"),
    rewrite: data.rewrite,
  };
}
