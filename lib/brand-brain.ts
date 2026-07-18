export const BRAND_BRAIN_SOURCE_MAX_LENGTH = 12000;

export type BrandBrainDraft = {
  confidence: "High" | "Medium" | "Low";
  brandName: string;
  brandPersonality: string;
  communicationStyle: string[];
  brandDo: string[];
  brandDont: string[];
  vocabulary: string[];
  typicalCta: string[];
  emotion: string[];
  audiencePainPoints: string[];
  brandPromise: string;
  brandArchetype: string;
  brandKeywords: string[];
  brandSummary: string;
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

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function asConfidence(value: unknown): BrandBrainDraft["confidence"] {
  if (value === "High" || value === "Medium" || value === "Low") {
    return value;
  }

  return "Low";
}

export function parseBrandBrainDraft(rawText: string): BrandBrainDraft {
  let parsed: unknown;

  try {
    parsed = JSON.parse(extractJson(rawText));
  } catch {
    throw new Error("AI returned invalid Brand Brain JSON.");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("AI returned invalid Brand Brain JSON.");
  }

  const data = parsed as Record<string, unknown>;

  return {
    confidence: asConfidence(data.confidence),
    brandName: asString(data.brandName),
    brandPersonality: asString(data.brandPersonality),
    communicationStyle: asStringArray(data.communicationStyle),
    brandDo: asStringArray(data.brandDo),
    brandDont: asStringArray(data.brandDont),
    vocabulary: asStringArray(data.vocabulary),
    typicalCta: asStringArray(data.typicalCta),
    emotion: asStringArray(data.emotion),
    audiencePainPoints: asStringArray(data.audiencePainPoints),
    brandPromise: asString(data.brandPromise),
    brandArchetype: asString(data.brandArchetype),
    brandKeywords: asStringArray(data.brandKeywords),
    brandSummary: asString(data.brandSummary),
  };
}

export function buildBrandBrainPrompt(sourceText: string) {
  return [
    "You are a senior brand strategist building a stable Brand Brain.",
    "Analyze the provided brand material and infer reusable brand standards.",
    "Do not write a one-sentence summary. Produce concrete, durable rules a content QA reviewer can use.",
    "Return JSON only. Do not include markdown, comments, or extra text.",
    "",
    "Required JSON shape:",
    JSON.stringify({
      brandName: "...",
      confidence: "High | Medium | Low",
      brandPersonality: "...",
      communicationStyle: ["..."],
      brandDo: ["..."],
      brandDont: ["..."],
      vocabulary: ["..."],
      typicalCta: ["..."],
      emotion: ["..."],
      audiencePainPoints: ["..."],
      brandPromise: "...",
      brandArchetype: "...",
      brandKeywords: ["..."],
      brandSummary: "...",
    }),
    "",
    "Quality requirements:",
    "- Each array should contain 3 to 8 specific items when evidence supports it.",
    "- Prefer stable brand rules over campaign-specific copy.",
    "- Use plain language that a reviewer can apply directly.",
    "- If a field is not supported by the source, return an empty string or empty array rather than inventing.",
    "- If the source is too short, generic, or lacks brand-specific evidence, confidence must be Low.",
    "",
    "Brand material:",
    sourceText,
  ].join("\n");
}

export async function generateBrandBrainDraft(
  sourceText: string,
): Promise<BrandBrainDraft> {
  const { getAiProvider } = await import("./ai/providers.ts");
  const provider = getAiProvider();
  const rawText = await provider.generateText({
    prompt: buildBrandBrainPrompt(sourceText),
  });

  return parseBrandBrainDraft(rawText);
}
