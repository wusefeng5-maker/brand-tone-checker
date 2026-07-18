import type {
  ToneCheckAuditCheck,
  ToneCheckAuditStatus,
  ToneCheckBrandProfile,
  ToneCheckConfidence,
  ToneCheckContext,
  ToneCheckEvidence,
} from "@/lib/ai/types";

const GLOBAL_MAX_LENGTH = 5000;
const TITLE_MAX_LENGTH = 80;

const platformLengthLimits: Array<{
  match: string[];
  max: number;
}> = [
  { match: ["小红书", "xiaohongshu"], max: 1000 },
  { match: ["抖音", "douyin"], max: 500 },
  { match: ["公众号", "wechat"], max: 2000 },
  { match: ["官网", "website"], max: 1500 },
  { match: ["邮件", "email"], max: 1200 },
  { match: ["tiktok"], max: 2200 },
  { match: ["instagram"], max: 2200 },
];

function normalize(value: string) {
  return value.toLowerCase();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function firstSnippet(inputText: string) {
  return (
    inputText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find(Boolean)
      ?.slice(0, 180) || inputText.trim().slice(0, 180)
  );
}

function sentenceFor(inputText: string, needle: string) {
  const sentences = inputText
    .split(/(?<=[。！？!?])\s+|\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
  const normalizedNeedle = normalize(needle);

  return (
    sentences.find((sentence) => normalize(sentence).includes(normalizedNeedle)) ||
    firstSnippet(inputText)
  );
}

function makeEvidence({
  confidence = "High",
  inputText,
  matchedRule,
  reason,
  rewrite,
  sentence,
  suggestion,
}: {
  confidence?: ToneCheckConfidence;
  inputText: string;
  matchedRule: string;
  reason: string;
  rewrite: string;
  sentence?: string;
  suggestion: string;
}): ToneCheckEvidence {
  const originalSentence = sentence || firstSnippet(inputText);

  return {
    originalSentence,
    sentence: originalSentence,
    matchedRule,
    severity: "Critical",
    reason,
    rewrite,
    confidence,
    suggestion,
  };
}

function makeCheck({
  category,
  evidence,
  reason,
  status,
  suggestion,
}: {
  category: string;
  evidence: ToneCheckEvidence;
  reason: string;
  status: ToneCheckAuditStatus;
  suggestion: string;
}): ToneCheckAuditCheck {
  return {
    category,
    status,
    severity: "Critical",
    reason,
    evidence,
    suggestion,
  };
}

function includesAny(inputText: string, words: string[]) {
  const normalizedInput = normalize(inputText);

  return words.filter((word) => word && normalizedInput.includes(normalize(word)));
}

function missingWords(inputText: string, words: string[]) {
  const normalizedInput = normalize(inputText);

  return words.filter((word) => word && !normalizedInput.includes(normalize(word)));
}

function findRepeatedWord(inputText: string) {
  const normalizedInput = normalize(inputText);
  const wordMatch = normalizedInput.match(/\b([a-z0-9]{3,})\b(?:\s+\1\b){2,}/i);
  const charMatch = inputText.match(/([\u4e00-\u9fa5A-Za-z0-9])\1{4,}/);

  return wordMatch?.[0] || charMatch?.[0] || "";
}

function getPlatformLimit(platform: string) {
  const normalizedPlatform = normalize(platform);

  return platformLengthLimits.find((item) =>
    item.match.some((token) => normalizedPlatform.includes(token)),
  );
}

export function runRuleEngine({
  brandProfile,
  context,
  inputText,
}: {
  brandProfile: ToneCheckBrandProfile;
  context: ToneCheckContext;
  inputText: string;
}): ToneCheckAuditCheck[] {
  const checks: ToneCheckAuditCheck[] = [];
  const trimmedText = inputText.trim();
  const forbiddenHits = includesAny(trimmedText, brandProfile.forbiddenWords);
  const requiredMissing = missingWords(trimmedText, brandProfile.requiredWords);
  const keywordHits = includesAny(trimmedText, brandProfile.requiredWords);
  const platformLimit = getPlatformLimit(context.platform);
  const repeated = findRepeatedWord(trimmedText);
  const title = trimmedText.split(/\r?\n/).find(Boolean) ?? "";

  checks.push(
    makeCheck({
      category: "Empty Content",
      status: trimmedText ? "PASS" : "FAIL",
      reason: trimmedText
        ? "The submitted copy is not empty."
        : "The submitted copy is empty.",
      suggestion: trimmedText ? "No action needed." : "Add copy before checking.",
      evidence: makeEvidence({
        inputText: trimmedText || " ",
        matchedRule: "Copy must not be empty.",
        reason: trimmedText
          ? "The input contains content."
          : "The input has no content to review.",
        suggestion: trimmedText ? "No action needed." : "Add copy before checking.",
        rewrite: trimmedText || "",
      }),
    }),
  );

  checks.push(
    makeCheck({
      category: "Length",
      status: trimmedText.length <= GLOBAL_MAX_LENGTH ? "PASS" : "FAIL",
      reason:
        trimmedText.length <= GLOBAL_MAX_LENGTH
          ? "The copy is within the global length limit."
          : `The copy is ${trimmedText.length} characters, above the ${GLOBAL_MAX_LENGTH} character limit.`,
      suggestion:
        trimmedText.length <= GLOBAL_MAX_LENGTH
          ? "No action needed."
          : "Shorten the copy before running Brand QA.",
      evidence: makeEvidence({
        inputText: trimmedText,
        matchedRule: `Copy length must be ${GLOBAL_MAX_LENGTH} characters or fewer.`,
        reason: `Current length: ${trimmedText.length}.`,
        suggestion:
          trimmedText.length <= GLOBAL_MAX_LENGTH
            ? "No action needed."
            : "Shorten the copy.",
        rewrite: trimmedText.slice(0, GLOBAL_MAX_LENGTH),
      }),
    }),
  );

  if (platformLimit) {
    checks.push(
      makeCheck({
        category: "Platform Length",
        status: trimmedText.length <= platformLimit.max ? "PASS" : "FAIL",
        reason:
          trimmedText.length <= platformLimit.max
            ? "The copy fits the selected platform length guardrail."
            : `The copy is ${trimmedText.length} characters, above the ${platformLimit.max} character guardrail for ${context.platform}.`,
        suggestion:
          trimmedText.length <= platformLimit.max
            ? "No action needed."
            : `Shorten the copy for ${context.platform}.`,
        evidence: makeEvidence({
          inputText: trimmedText,
          matchedRule: `${context.platform} copy should be ${platformLimit.max} characters or fewer.`,
          reason: `Current length: ${trimmedText.length}.`,
          suggestion:
            trimmedText.length <= platformLimit.max
              ? "No action needed."
              : `Shorten the copy for ${context.platform}.`,
          rewrite: trimmedText.slice(0, platformLimit.max),
        }),
      }),
    );
  }

  checks.push(
    makeCheck({
      category: "Forbidden Words",
      status: forbiddenHits.length > 0 ? "FAIL" : "PASS",
      reason:
        forbiddenHits.length > 0
          ? `The copy contains forbidden expression(s): ${forbiddenHits.join(", ")}.`
          : "No forbidden expressions were found.",
      suggestion:
        forbiddenHits.length > 0
          ? "Remove or replace forbidden expressions."
          : "No action needed.",
      evidence: makeEvidence({
        inputText: trimmedText,
        matchedRule:
          forbiddenHits.length > 0
            ? `Avoid forbidden expression(s): ${forbiddenHits.join(", ")}.`
            : "Avoid configured forbidden expressions.",
        reason:
          forbiddenHits.length > 0
            ? "A configured forbidden expression appears in the submitted copy."
            : "No configured forbidden expression appears in the submitted copy.",
        sentence: forbiddenHits[0]
          ? sentenceFor(trimmedText, forbiddenHits[0])
          : undefined,
        suggestion:
          forbiddenHits.length > 0
            ? "Replace the forbidden expression."
            : "No action needed.",
        rewrite:
          forbiddenHits.length > 0
            ? forbiddenHits.reduce(
                (text, word) =>
                  text.replace(new RegExp(escapeRegExp(word), "gi"), ""),
                trimmedText,
              )
            : trimmedText,
      }),
    }),
  );

  checks.push(
    makeCheck({
      category: "Required Expressions",
      status: requiredMissing.length > 0 ? "FAIL" : "PASS",
      reason:
        requiredMissing.length > 0
          ? `The copy is missing required expression(s): ${requiredMissing.join(", ")}.`
          : "Required expressions are present or not configured.",
      suggestion:
        requiredMissing.length > 0
          ? "Add the required expression(s) where they fit naturally."
          : "No action needed.",
      evidence: makeEvidence({
        inputText: trimmedText,
        matchedRule:
          requiredMissing.length > 0
            ? `Use required expression(s): ${requiredMissing.join(", ")}.`
            : "Use configured required expressions.",
        reason:
          requiredMissing.length > 0
            ? "A configured required expression is missing."
            : "No required expression is missing.",
        suggestion:
          requiredMissing.length > 0
            ? "Add missing required expressions."
            : "No action needed.",
        rewrite:
          requiredMissing.length > 0
            ? `${trimmedText}\n${requiredMissing.join(" ")}`
            : trimmedText,
      }),
    }),
  );

  checks.push(
    makeCheck({
      category: "Core Keywords",
      status:
        brandProfile.requiredWords.length === 0 || keywordHits.length > 0
          ? "PASS"
          : "FAIL",
      reason:
        brandProfile.requiredWords.length === 0
          ? "No core keywords are configured."
          : keywordHits.length > 0
            ? `The copy contains core keyword(s): ${keywordHits.join(", ")}.`
            : "The copy does not contain any configured core keyword.",
      suggestion:
        brandProfile.requiredWords.length === 0 || keywordHits.length > 0
          ? "No action needed."
          : "Add at least one configured brand keyword.",
      evidence: makeEvidence({
        inputText: trimmedText,
        matchedRule: "Use configured core brand keywords when relevant.",
        reason:
          keywordHits.length > 0
            ? `Matched keyword(s): ${keywordHits.join(", ")}.`
            : "No configured brand keyword appears in the submitted copy.",
        suggestion:
          brandProfile.requiredWords.length === 0 || keywordHits.length > 0
            ? "No action needed."
            : "Add a configured brand keyword.",
        rewrite:
          brandProfile.requiredWords.length === 0 || keywordHits.length > 0
            ? trimmedText
            : `${trimmedText}\n${brandProfile.requiredWords[0]}`,
      }),
    }),
  );

  checks.push(
    makeCheck({
      category: "Repeated Words",
      status: repeated ? "FAIL" : "PASS",
      reason: repeated
        ? `The copy contains repeated wording: ${repeated}.`
        : "No excessive repeated wording was found.",
      suggestion: repeated ? "Remove accidental repetition." : "No action needed.",
      evidence: makeEvidence({
        inputText: trimmedText,
        matchedRule: "Avoid accidental repeated words or characters.",
        reason: repeated
          ? "The same word or character appears repeatedly."
          : "No excessive repetition was found.",
        sentence: repeated ? sentenceFor(trimmedText, repeated) : undefined,
        suggestion: repeated ? "Remove repetition." : "No action needed.",
        rewrite: repeated
          ? trimmedText.replace(repeated, repeated.split(/\s+/)[0])
          : trimmedText,
      }),
    }),
  );

  checks.push(
    makeCheck({
      category: "Title Length",
      status: title.length <= TITLE_MAX_LENGTH ? "PASS" : "FAIL",
      reason:
        title.length <= TITLE_MAX_LENGTH
          ? "The first line fits the title length guardrail."
          : `The first line is ${title.length} characters, above the ${TITLE_MAX_LENGTH} character title guardrail.`,
      suggestion:
        title.length <= TITLE_MAX_LENGTH
          ? "No action needed."
          : "Shorten the first line into a clearer title.",
      evidence: makeEvidence({
        inputText: trimmedText,
        matchedRule: `Title or first line should be ${TITLE_MAX_LENGTH} characters or fewer.`,
        reason: `First line length: ${title.length}.`,
        sentence: title || undefined,
        suggestion:
          title.length <= TITLE_MAX_LENGTH
            ? "No action needed."
            : "Shorten the title.",
        rewrite:
          title.length <= TITLE_MAX_LENGTH
            ? trimmedText
            : title.slice(0, TITLE_MAX_LENGTH),
      }),
    }),
  );

  return checks;
}
