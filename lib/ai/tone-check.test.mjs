import assert from "node:assert/strict";
import test from "node:test";

import { parseToneCheckResult } from "./tone-check-core.ts";
import { buildToneCheckPrompt } from "../prompt/prompt-builder.ts";

const brandProfile = {
  name: "Acme",
  audience: "B2B founders",
  toneTags: ["clear", "confident"],
  forbiddenWords: ["cheap"],
  requiredWords: ["trusted"],
  exampleCopy: "Ship faster with less noise.",
};

test("buildToneCheckPrompt includes the brand profile and requested JSON shape", () => {
  const prompt = buildToneCheckPrompt({
    brandProfile,
    inputText: "Launch your next campaign today.",
  });

  assert.match(prompt, /Acme/);
  assert.match(prompt, /B2B founders/);
  assert.match(prompt, /clear, confident/);
  assert.match(prompt, /cheap/);
  assert.match(prompt, /trusted/);
  assert.match(prompt, /score/);
  assert.match(prompt, /rewrite/);
});

test("parseToneCheckResult accepts valid JSON", () => {
  const result = parseToneCheckResult(`{
    "score": 82,
    "summary": "Mostly on brand.",
    "problems": ["Too generic."],
    "suggestions": ["Use a clearer proof point."],
    "rewrite": "Ship trusted campaigns with less noise."
  }`);

  assert.deepEqual(result, {
    score: 82,
    summary: "Mostly on brand.",
    problems: ["Too generic."],
    suggestions: ["Use a clearer proof point."],
    rewrite: "Ship trusted campaigns with less noise.",
  });
});

test("parseToneCheckResult extracts JSON from a fenced block", () => {
  const result = parseToneCheckResult(`Here is the result:

\`\`\`json
{"score":90,"summary":"On brand.","problems":[],"suggestions":[],"rewrite":"Trusted teams ship clearer campaigns."}
\`\`\``);

  assert.equal(result.score, 90);
  assert.equal(result.summary, "On brand.");
});

test("parseToneCheckResult rejects invalid score values", () => {
  assert.throws(
    () =>
      parseToneCheckResult(
        '{"score":120,"summary":"No","problems":[],"suggestions":[],"rewrite":"No"}',
      ),
    /score/,
  );
});
