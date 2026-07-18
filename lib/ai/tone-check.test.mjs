import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateToneCheckScore,
  parseToneCheckResult,
} from "./tone-check-core.ts";
import { buildToneCheckPrompt } from "../prompt/prompt-builder.ts";

const brandProfile = {
  name: "Acme",
  audience: "B2B founders",
  toneTags: ["clear", "confident"],
  forbiddenWords: ["cheap"],
  requiredWords: ["trusted"],
  exampleCopy: "Ship faster with less noise.",
};

const context = {
  platform: "Xiaohongshu",
  audience: "New customers",
  goal: "Seeding",
  language: "English",
};

const validAiJson = `{
  "decision": "Needs Revision",
  "confidence": "Medium",
  "summary": "The copy is close, but the CTA is too generic.",
  "checks": [
    {
      "category": "Brand Position",
      "status": "PASS",
      "severity": "Critical",
      "reason": "The sentence supports the brand promise.",
      "evidence": {
        "originalSentence": "Ship trusted campaigns today.",
        "matchedRule": "Use trusted proof points.",
        "severity": "Critical",
        "reason": "It uses the required trusted positioning.",
        "rewrite": "Ship trusted campaigns with less noise.",
        "confidence": "High",
        "suggestion": "Keep the trusted proof point."
      },
      "suggestion": "Keep the trusted proof point."
    },
    {
      "category": "Tone",
      "status": "PARTIAL",
      "severity": "Major",
      "reason": "The CTA is clear but slightly pushy.",
      "evidence": {
        "originalSentence": "Start now before it is too late.",
        "matchedRule": "Avoid aggressive CTA.",
        "severity": "Major",
        "reason": "The brand prefers calm communication.",
        "rewrite": "Start when your team is ready.",
        "confidence": "Medium",
        "suggestion": "Use a calmer CTA."
      },
      "suggestion": "Use a calmer CTA."
    },
    {
      "category": "Forbidden Expressions",
      "status": "FAIL",
      "severity": "Minor",
      "reason": "The copy uses a weak expression.",
      "evidence": {
        "originalSentence": "This is a cheap way to launch.",
        "matchedRule": "Avoid cheap.",
        "severity": "Minor",
        "reason": "Cheap is a forbidden expression.",
        "rewrite": "This is an efficient way to launch.",
        "confidence": "High",
        "suggestion": "Replace cheap with efficient."
      },
      "suggestion": "Replace cheap with efficient."
    }
  ],
  "suggestions": ["Use a calmer CTA.", "Replace the forbidden word."],
  "rewrite": "Ship trusted campaigns with less noise when your team is ready."
}`;

test("buildToneCheckPrompt asks for severity-based audit checks instead of an AI score", () => {
  const prompt = buildToneCheckPrompt({
    brandProfile,
    context,
    inputText: "Launch your next campaign today.",
  });

  assert.match(prompt, /Acme/);
  assert.match(prompt, /B2B founders/);
  assert.match(prompt, /clear, confident/);
  assert.match(prompt, /Xiaohongshu/);
  assert.match(prompt, /English/);
  assert.match(prompt, /Critical, Major, or Minor/);
  assert.match(prompt, /evidence\.originalSentence/);
  assert.match(prompt, /Do not return score/);
  assert.equal(prompt.includes('"score"'), false);
});

test("parseToneCheckResult calculates score from status and severity", () => {
  const result = parseToneCheckResult(validAiJson);

  assert.equal(result.score, 70);
  assert.equal(result.finalDecision, "Needs Revision");
  assert.equal(result.confidence, "Medium");
  assert.deepEqual(result.invalidEvidence, []);
  assert.equal(result.evidence[0]?.originalSentence, "Ship trusted campaigns today.");
  assert.equal(result.evidence[1]?.severity, "Major");
  assert.deepEqual(result.matchedRules, [
    "Use trusted proof points.",
    "Avoid aggressive CTA.",
  ]);
  assert.deepEqual(result.missingRules, ["Avoid aggressive CTA."]);
  assert.deepEqual(result.violatedRules, ["Avoid cheap."]);
});

test("parseToneCheckResult extracts JSON from a fenced block", () => {
  const result = parseToneCheckResult(`Here is the result:

\`\`\`json
${validAiJson}
\`\`\``);

  assert.equal(result.score, 70);
  assert.equal(result.finalDecision, "Needs Revision");
});

test("calculateToneCheckScore uses severity weights", () => {
  assert.equal(
    calculateToneCheckScore([
      {
        category: "Tone",
        status: "PASS",
        severity: "Critical",
        reason: "Good match.",
        evidence: {
          originalSentence: "Ship trusted campaigns today.",
          sentence: "Ship trusted campaigns today.",
          matchedRule: "Use trusted proof points.",
          severity: "Critical",
          reason: "It matches the brand.",
          rewrite: "Ship trusted campaigns today.",
          confidence: "High",
          suggestion: "Keep it.",
        },
        suggestion: "Keep it.",
      },
      {
        category: "Goal Match",
        status: "FAIL",
        severity: "Minor",
        reason: "Local wording issue.",
        evidence: {
          originalSentence: "Buy now.",
          sentence: "Buy now.",
          matchedRule: "Avoid aggressive CTA.",
          severity: "Minor",
          reason: "It is too pushy.",
          rewrite: "Learn more when you are ready.",
          confidence: "Medium",
          suggestion: "Make it calmer.",
        },
        suggestion: "Make it calmer.",
      },
    ]),
    75,
  );
});

test("parseToneCheckResult rejects missing evidence quotes", () => {
  assert.throws(
    () =>
      parseToneCheckResult(
        '{"confidence":"Low","summary":"No","checks":[{"category":"Tone","status":"PASS","severity":"Major","reason":"No","evidence":{"originalSentence":"","matchedRule":"Rule","severity":"Major","reason":"Reason","suggestion":"Suggestion","rewrite":"Rewrite","confidence":"Low"},"suggestion":"Suggestion"}],"suggestions":[],"rewrite":"No"}',
      ),
    /evidence\.originalSentence/,
  );
});
