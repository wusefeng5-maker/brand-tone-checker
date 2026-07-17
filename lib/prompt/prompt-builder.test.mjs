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

test("buildToneCheckPrompt generates the current tone check prompt content", () => {
  const prompt = buildToneCheckPrompt({
    brandProfile,
    inputText: "Launch your next campaign today.",
  });

  assert.match(prompt, /You are a senior brand voice reviewer\./);
  assert.match(prompt, /Check whether the submitted copy matches the brand profile\./);
  assert.match(prompt, /Return JSON only\. Do not include markdown, comments, or extra text\./);
  assert.match(prompt, /- Brand name: Acme/);
  assert.match(prompt, /- Brand positioning: Ship faster with less noise\./);
  assert.match(prompt, /- Brand tone: clear, confident/);
  assert.match(prompt, /- Target users: B2B founders/);
  assert.match(prompt, /- Brand keywords: trusted/);
  assert.match(prompt, /- Forbidden words: cheap/);
  assert.match(prompt, /Submitted copy:\nLaunch your next campaign today\./);
  assert.match(prompt, /"score": 0/);
  assert.match(prompt, /"rewrite": "\.\.\."/);
});

test("buildToneCheckPrompt replaces all template variables", () => {
  const prompt = buildToneCheckPrompt({
    brandProfile,
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
    copy: "Launch your next campaign today.",
  });

  assert.match(prompt, /Acme/);
  assert.match(prompt, /Launch your next campaign today\./);
  assert.equal(prompt.includes("{{brandName}}"), false);
});
