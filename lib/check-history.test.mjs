import assert from "node:assert/strict";
import test from "node:test";

import {
  buildCheckCreateData,
  readToneCheckResultFromCheck,
} from "./check-history.ts";

const evidence = {
  originalSentence: "Start now before it is too late.",
  sentence: "Start now before it is too late.",
  matchedRule: "Avoid aggressive CTA.",
  severity: "Major",
  reason: "The brand prefers calm communication.",
  rewrite: "Start when your team is ready.",
  confidence: "Medium",
  suggestion: "Use a calmer CTA.",
};

const checks = [
  {
    category: "Tone",
    status: "PARTIAL",
    severity: "Major",
    reason: "The CTA is clear but slightly pushy.",
    evidence,
    suggestion: "Use a calmer CTA.",
  },
];

const result = {
  score: 60,
  finalDecision: "Needs Revision",
  confidence: "Medium",
  summary: "The copy mostly matches the brand voice.",
  evidence: [evidence],
  invalidEvidence: [],
  checks,
  problems: [],
  suggestions: ["Use a calmer CTA."],
  rewrite: "Start when your team is ready.",
  brandRulesHit: ["Avoid aggressive CTA."],
  matchedRules: ["Avoid aggressive CTA."],
  missingRules: ["Avoid aggressive CTA."],
  violatedRules: [],
  context: {
    platform: "Xiaohongshu",
    audience: "New customers",
    goal: "Seeding",
    language: "English",
    brand: "Acme",
    time: "2026-07-18T00:00:00.000Z",
    reviewer: "user@example.com",
  },
};

test("buildCheckCreateData maps a tone check result into persisted check fields", () => {
  const data = buildCheckCreateData({
    userId: "user_1",
    brandProfileId: "brand_1",
    inputText: "Start now before it is too late.",
    result,
  });

  assert.deepEqual(data, {
    userId: "user_1",
    brandProfileId: "brand_1",
    inputText: "Start now before it is too late.",
    score: 60,
    issues: [],
    rewrite: "Start when your team is ready.",
    tagHits: {
      brandRulesHit: ["Avoid aggressive CTA."],
      checks,
      confidence: "Medium",
      context: result.context,
      evidence: [evidence],
      finalDecision: "Needs Revision",
      invalidEvidence: [],
      matchedRules: ["Avoid aggressive CTA."],
      missingRules: ["Avoid aggressive CTA."],
      summary: "The copy mostly matches the brand voice.",
      suggestions: ["Use a calmer CTA."],
      violatedRules: [],
    },
  });
});

test("readToneCheckResultFromCheck restores the tone check result for history pages", () => {
  const restored = readToneCheckResultFromCheck({
    score: 60,
    issues: [],
    rewrite: "Start when your team is ready.",
    tagHits: {
      brandRulesHit: ["Avoid aggressive CTA."],
      checks,
      confidence: "Medium",
      context: result.context,
      evidence: [evidence],
      finalDecision: "Needs Revision",
      invalidEvidence: [],
      matchedRules: ["Avoid aggressive CTA."],
      missingRules: ["Avoid aggressive CTA."],
      summary: "The copy mostly matches the brand voice.",
      suggestions: ["Use a calmer CTA."],
      violatedRules: [],
    },
  });

  assert.deepEqual(restored, result);
});

test("readToneCheckResultFromCheck keeps old records readable", () => {
  const restored = readToneCheckResultFromCheck({
    score: 45,
    issues: ["Too pushy."],
    rewrite: "A calmer rewrite.",
    tagHits: {},
  });

  assert.equal(restored.finalDecision, "OFF BRAND");
  assert.equal(restored.confidence, "Low");
  assert.deepEqual(restored.evidence, []);
  assert.deepEqual(restored.invalidEvidence, []);
  assert.deepEqual(restored.checks, []);
  assert.deepEqual(restored.problems, ["Too pushy."]);
  assert.deepEqual(restored.matchedRules, []);
  assert.deepEqual(restored.missingRules, []);
  assert.deepEqual(restored.violatedRules, []);
});
