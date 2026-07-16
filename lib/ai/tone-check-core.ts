import type { ToneCheckBrandProfile, ToneCheckResult } from "./types";

type BuildToneCheckPromptInput = {
  brandProfile: ToneCheckBrandProfile;
  inputText: string;
};

function formatList(values: string[]) {
  return values.length > 0 ? values.join(", ") : "Not specified";
}

function formatText(value: string | null) {
  return value && value.trim().length > 0 ? value.trim() : "Not specified";
}

export function buildToneCheckPrompt({
  brandProfile,
  inputText,
}: BuildToneCheckPromptInput): string {
  return [
    "You are a senior brand voice reviewer.",
    "Check whether the submitted copy matches the brand profile.",
    "Return JSON only. Do not include markdown, comments, or extra text.",
    "",
    "Brand profile:",
    `- Brand name: ${brandProfile.name}`,
    `- Brand positioning: ${formatText(brandProfile.exampleCopy)}`,
    `- Brand tone: ${formatList(brandProfile.toneTags)}`,
    `- Target users: ${formatText(brandProfile.audience)}`,
    `- Brand keywords: ${formatList(brandProfile.requiredWords)}`,
    `- Forbidden words: ${formatList(brandProfile.forbiddenWords)}`,
    `- Brand introduction: ${formatText(brandProfile.exampleCopy)}`,
    "",
    "Submitted copy:",
    inputText,
    "",
    "Required JSON shape:",
    '{ "score": 0, "summary": "...", "problems": ["..."], "suggestions": ["..."], "rewrite": "..." }',
    "The score must be an integer from 0 to 100.",
  ].join("\n");
}

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
  const rawOutput = rawText;

  try {
    parsed = JSON.parse(extractJson(rawText));
  } catch {
    console.error("Raw AI output:", rawOutput);
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
