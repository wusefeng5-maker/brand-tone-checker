import assert from "node:assert/strict";
import test from "node:test";

import {
  isAdminEmailAllowed,
  parseAdminEmails,
  parseAdminPage,
  parseAiLogFilters,
} from "./admin-rules.ts";

test("parseAdminEmails trims comma-separated emails and ignores empty values", () => {
  assert.deepEqual(parseAdminEmails(" admin@example.com, ,test@example.com "), [
    "admin@example.com",
    "test@example.com",
  ]);
});

test("isAdminEmailAllowed matches emails case-insensitively", () => {
  assert.equal(
    isAdminEmailAllowed("Admin@Example.com", "admin@example.com,test@example.com"),
    true,
  );
  assert.equal(isAdminEmailAllowed("user@example.com", "admin@example.com"), false);
});

test("parseAdminPage falls back to page 1 for invalid values", () => {
  assert.equal(parseAdminPage("3"), 3);
  assert.equal(parseAdminPage("0"), 1);
  assert.equal(parseAdminPage("abc"), 1);
});

test("parseAiLogFilters normalizes supported filters", () => {
  assert.deepEqual(
    parseAiLogFilters({
      email: " admin@example.com ",
      provider: " openai-compatible ",
      status: "FAILED",
    }),
    {
      email: "admin@example.com",
      provider: "openai-compatible",
      status: "FAILED",
    },
  );

  assert.deepEqual(parseAiLogFilters({ status: "UNKNOWN" }), {});
});
