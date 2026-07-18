import assert from "node:assert/strict";
import test from "node:test";

import { runRuleEngine } from "./rule-engine.ts";

const brandProfile = {
  name: "Acme",
  audience: "New customers",
  toneTags: ["calm"],
  forbiddenWords: ["buy now"],
  requiredWords: ["trusted"],
  exampleCopy: "Introduce the product in a clear and trusted way.",
};

test("runRuleEngine catches code-level brand QA rules without AI", () => {
  const checks = runRuleEngine({
    brandProfile,
    context: {
      platform: "douyin",
      audience: "new customers",
      goal: "conversion",
      language: "English",
    },
    inputText: `${"Long title ".repeat(60)}
buy now now now now now.`,
  });

  const byCategory = Object.fromEntries(
    checks.map((check) => [check.category, check]),
  );

  assert.equal(byCategory["Forbidden Words"]?.status, "FAIL");
  assert.equal(byCategory["Required Expressions"]?.status, "FAIL");
  assert.equal(byCategory["Core Keywords"]?.status, "FAIL");
  assert.equal(byCategory["Platform Length"]?.status, "FAIL");
  assert.equal(byCategory["Repeated Words"]?.status, "FAIL");
  assert.equal(byCategory["Title Length"]?.status, "FAIL");
  assert.equal(byCategory["Forbidden Words"]?.severity, "Critical");
});

test("runRuleEngine passes configured keyword checks when a required word appears", () => {
  const checks = runRuleEngine({
    brandProfile,
    context: {
      platform: "xiaohongshu",
      audience: "new customers",
      goal: "seeding",
      language: "English",
    },
    inputText: "Introduce the product in a trusted way.",
  });

  const byCategory = Object.fromEntries(
    checks.map((check) => [check.category, check]),
  );

  assert.equal(byCategory["Required Expressions"]?.status, "PASS");
  assert.equal(byCategory["Core Keywords"]?.status, "PASS");
});
