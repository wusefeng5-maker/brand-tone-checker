import assert from "node:assert/strict";
import test from "node:test";

import { buildBrandBrainPrompt, parseBrandBrainDraft } from "./brand-brain.ts";

test("buildBrandBrainPrompt asks for the upgraded Brand Brain JSON shape", () => {
  const prompt = buildBrandBrainPrompt("Acme helps teams ship clearer campaigns.");

  assert.match(prompt, /stable Brand Brain/);
  assert.match(prompt, /brandPersonality/);
  assert.match(prompt, /confidence/);
  assert.match(prompt, /communicationStyle/);
  assert.match(prompt, /brandDo/);
  assert.match(prompt, /brandDont/);
  assert.match(prompt, /typicalCta/);
  assert.match(prompt, /audiencePainPoints/);
  assert.match(prompt, /brandArchetype/);
  assert.match(prompt, /Acme helps teams/);
});

test("parseBrandBrainDraft accepts valid upgraded JSON", () => {
  const draft = parseBrandBrainDraft(`{
    "brandName": "Acme",
    "confidence": "High",
    "brandPersonality": "Calm and confident",
    "communicationStyle": ["clear", "practical"],
    "brandDo": ["Use proof points"],
    "brandDont": ["Avoid hype"],
    "vocabulary": ["trusted"],
    "typicalCta": ["Start with a clear plan"],
    "emotion": ["steady"],
    "audiencePainPoints": ["Campaign chaos"],
    "brandPromise": "Clearer campaign operations",
    "brandArchetype": "Guide",
    "brandKeywords": ["campaigns"],
    "brandSummary": "Acme is a practical tool for campaign teams."
  }`);

  assert.deepEqual(draft, {
    brandName: "Acme",
    confidence: "High",
    brandPersonality: "Calm and confident",
    communicationStyle: ["clear", "practical"],
    brandDo: ["Use proof points"],
    brandDont: ["Avoid hype"],
    vocabulary: ["trusted"],
    typicalCta: ["Start with a clear plan"],
    emotion: ["steady"],
    audiencePainPoints: ["Campaign chaos"],
    brandPromise: "Clearer campaign operations",
    brandArchetype: "Guide",
    brandKeywords: ["campaigns"],
    brandSummary: "Acme is a practical tool for campaign teams.",
  });
});
