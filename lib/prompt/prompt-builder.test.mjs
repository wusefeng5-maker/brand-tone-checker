import assert from "node:assert/strict";
import test from "node:test";

import {
  buildToneCheckPrompt,
  renderPromptTemplate,
} from "./prompt-builder.ts";
import { toneCheckPromptTemplate } from "./tone-check-template.ts";

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

test("buildToneCheckPrompt generates audit-based tone check content", () => {
  const prompt = buildToneCheckPrompt({
    brandProfile,
    context,
    inputText: "Launch your next campaign today.",
  });

  assert.match(prompt, /You are a senior brand voice reviewer\./);
  assert.match(prompt, /Audit only subjective brand qualities: Tone, Emotion, and Brand Fit\./);
  assert.match(prompt, /The application checks those with code rules\./);
  assert.match(prompt, /Do not assign or return a numeric score\./);
  assert.match(prompt, /Do not assign or return a final decision\./);
  assert.match(prompt, /Return JSON only\. Do not include markdown, comments, or extra text\./);
  assert.match(prompt, /- Brand name: Acme/);
  assert.match(prompt, /- Brand positioning: Ship faster with less noise\./);
  assert.match(prompt, /- Brand tone: clear, confident/);
  assert.match(prompt, /- Target users: B2B founders/);
  assert.match(prompt, /- Brand keywords: trusted/);
  assert.match(prompt, /- Forbidden words: cheap/);
  assert.match(prompt, /- Platform: Xiaohongshu/);
  assert.match(prompt, /- Audience: New customers/);
  assert.match(prompt, /- Goal: Seeding/);
  assert.match(prompt, /- Output language: English/);
  assert.match(prompt, /Submitted copy:\nLaunch your next campaign today\./);
  assert.match(prompt, /- Tone/);
  assert.match(prompt, /- Emotion/);
  assert.match(prompt, /- Brand Fit/);
  assert.doesNotMatch(prompt, /Brand Position/);
  assert.doesNotMatch(prompt, /Platform Style/);
  assert.doesNotMatch(prompt, /Goal Match/);
  assert.match(prompt, /"confidence": "High \| Medium \| Low"/);
  assert.match(prompt, /"severity": "Major"/);
  assert.match(prompt, /"originalSentence": "\.\.\."/);
  assert.match(prompt, /"checks": \[/);
  assert.match(prompt, /"evidence": \{/);
  assert.equal(prompt.includes('"score"'), false);
});

test("buildToneCheckPrompt replaces all template variables", () => {
  const prompt = buildToneCheckPrompt({
    brandProfile,
    context,
    inputText: "Launch your next campaign today.",
  });

  assert.equal(prompt.includes("{{"), false);
  assert.equal(prompt.includes("}}"), false);
});

test("buildToneCheckPrompt handles empty optional fields", () => {
  const prompt = buildToneCheckPrompt({
    brandProfile: {
      name: "Quiet Co",
      audience: null,
      toneTags: [],
      forbiddenWords: [],
      requiredWords: [],
      exampleCopy: null,
    },
    context,
    inputText: "A simple launch note.",
  });

  assert.match(prompt, /- Brand name: Quiet Co/);
  assert.match(prompt, /- Brand positioning: Not specified/);
  assert.match(prompt, /- Brand tone: Not specified/);
  assert.match(prompt, /- Target users: Not specified/);
  assert.match(prompt, /- Brand keywords: Not specified/);
  assert.match(prompt, /- Forbidden words: Not specified/);
  assert.match(prompt, /- Brand introduction: Not specified/);
});

test("renderPromptTemplate replaces simple variables without a template engine", () => {
  const prompt = renderPromptTemplate(toneCheckPromptTemplate, {
    brandName: "Acme",
    audience: "B2B founders",
    toneTags: "clear, confident",
    requiredWords: "trusted",
    forbiddenWords: "cheap",
    example: "Ship faster with less noise.",
    platform: "Xiaohongshu",
    checkAudience: "New customers",
    goal: "Seeding",
    language: "English",
    copy: "Launch your next campaign today.",
  });

  assert.match(prompt, /Acme/);
  assert.match(prompt, /Launch your next campaign today\./);
  assert.equal(prompt.includes("{{brandName}}"), false);
});
