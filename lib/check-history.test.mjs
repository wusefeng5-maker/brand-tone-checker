import assert from "node:assert/strict";
import test from "node:test";

import {
  buildCheckCreateData,
  readToneCheckResultFromCheck,
} from "./check-history.ts";

const result = {
  score: 88,
  summary: "The copy mostly matches the brand voice.",
  problems: ["The opener is too generic."],
  suggestions: ["Add a more specific proof point."],
  rewrite: "Trusted teams launch sharper campaigns with less noise.",
};

test("buildCheckCreateData maps a tone check result into persisted check fields", () => {
  const data = buildCheckCreateData({
    userId: "user_1",
    brandProfileId: "brand_1",
    inputText: "Launch your campaign today.",
    result,
  });

  assert.deepEqual(data, {
    userId: "user_1",
    brandProfileId: "brand_1",
    inputText: "Launch your campaign today.",
    score: 88,
    issues: ["The opener is too generic."],
    rewrite: "Trusted teams launch sharper campaigns with less noise.",
    tagHits: {
      summary: "The copy mostly matches the brand voice.",
      suggestions: ["Add a more specific proof point."],
    },
  });
});

test("readToneCheckResultFromCheck restores the tone check result for history pages", () => {
  const restored = readToneCheckResultFromCheck({
    score: 88,
    issues: ["The opener is too generic."],
    rewrite: "Trusted teams launch sharper campaigns with less noise.",
    tagHits: {
      summary: "The copy mostly matches the brand voice.",
      suggestions: ["Add a more specific proof point."],
    },
  });

  assert.deepEqual(restored, result);
});
