import assert from "node:assert/strict";
import test from "node:test";

import {
  canCreateBrandProfile,
  parseBrandProfileFormData,
  parseDelimitedInput,
} from "./brand-profile-rules.ts";

test("parseDelimitedInput splits comma and newline separated values", () => {
  assert.deepEqual(parseDelimitedInput("professional, warm\nclear"), [
    "professional",
    "warm",
    "clear",
  ]);
});

test("parseDelimitedInput removes empty and duplicate values", () => {
  assert.deepEqual(parseDelimitedInput("warm, , warm\nclear"), ["warm", "clear"]);
});

test("canCreateBrandProfile allows free users to create only one profile", () => {
  assert.equal(canCreateBrandProfile("FREE", 0), true);
  assert.equal(canCreateBrandProfile("FREE", 1), false);
});

test("canCreateBrandProfile does not limit paid plans", () => {
  assert.equal(canCreateBrandProfile("PRO", 12), true);
  assert.equal(canCreateBrandProfile("AGENCY", 50), true);
});

test("parseBrandProfileFormData validates name and normalizes fields", () => {
  const formData = new FormData();
  formData.set("name", "  Acme  ");
  formData.set("audience", "  B2B founders ");
  formData.set("toneTags", "expert, direct");
  formData.set("forbiddenWords", "cheap\nbest ever");
  formData.set("requiredWords", "reliable");
  formData.set("exampleCopy", "  Ship faster with less noise. ");

  const result = parseBrandProfileFormData(formData);

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.deepEqual(result.data, {
      name: "Acme",
      audience: "B2B founders",
      toneTags: ["expert", "direct"],
      forbiddenWords: ["cheap", "best ever"],
      requiredWords: ["reliable"],
      exampleCopy: "Ship faster with less noise.",
    });
  }
});

test("parseBrandProfileFormData rejects empty names", () => {
  const formData = new FormData();
  formData.set("name", " ");

  const result = parseBrandProfileFormData(formData);

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.errors.name, "Brand name is required.");
  }
});
