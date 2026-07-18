import { buildToneCheckPrompt } from "@/lib/prompt/prompt-builder";
import { runRuleEngine } from "@/lib/rule-engine";
import {
  buildToneCheckResultFromChecks,
  parseToneCheckResult,
} from "./tone-check-core";
import { getAiProvider } from "./providers";
import type {
  ToneCheckAuditCheck,
  ToneCheckBrandProfile,
  ToneCheckContext,
  ToneCheckResult,
} from "./types";

type BuildToneCheckPromptInput = {
  brandProfile: ToneCheckBrandProfile;
  context: ToneCheckContext;
  inputText: string;
};

type GenerateToneCheckInput = BuildToneCheckPromptInput;
export { buildToneCheckPrompt, parseToneCheckResult };

function normalizeForMatch(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function validateAiEvidence({
  checks,
  inputText,
}: {
  checks: ToneCheckAuditCheck[];
  inputText: string;
}) {
  const normalizedInput = normalizeForMatch(inputText);
  const invalidEvidence: string[] = [];
  const validChecks = checks.filter((check) => {
    const originalSentence = normalizeForMatch(check.evidence.originalSentence);
    const isValid =
      originalSentence.length > 0 && normalizedInput.includes(originalSentence);

    if (!isValid) {
      invalidEvidence.push(
        `${check.category}: ${check.evidence.originalSentence}`,
      );
    }

    return isValid;
  });

  return {
    invalidEvidence,
    validChecks,
  };
}

export async function generateToneCheck(
  input: GenerateToneCheckInput,
): Promise<ToneCheckResult> {
  const provider = getAiProvider();
  const prompt = buildToneCheckPrompt(input);
  const rawText = await provider.generateText({ prompt });
  const aiResult = parseToneCheckResult(rawText);
  const ruleChecks = runRuleEngine(input);
  const { invalidEvidence, validChecks } = validateAiEvidence({
    checks: aiResult.checks,
    inputText: input.inputText,
  });

  return buildToneCheckResultFromChecks({
    checks: [...ruleChecks, ...validChecks],
    confidence: invalidEvidence.length > 0 ? "Low" : aiResult.confidence,
    invalidEvidence,
    problems: aiResult.problems,
    rewrite: aiResult.rewrite,
    suggestions: aiResult.suggestions,
    summary: aiResult.summary,
  });
}
