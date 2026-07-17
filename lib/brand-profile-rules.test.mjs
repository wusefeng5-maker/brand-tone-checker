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

test("parseBrandProfileFormData rejects fields over production limits", () => {
  const formData = new FormData();
  formData.set("name", "a".repeat(101));
  formData.set("audience", "a".repeat(201));
  formData.set("toneTags", "a".repeat(51));
  formData.set("forbiddenWords", Array.from({ length: 31 }, (_, index) => `word${index}`).join(","));
  formData.set("requiredWords", "trusted");
  formData.set("exampleCopy", "a".repeat(1001));

  const result = parseBrandProfileFormData(formData);

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.match(result.errors.name, /100/);
    assert.match(result.errors.audience, /200/);
    assert.match(result.errors.toneTags, /50/);
    assert.match(result.errors.forbiddenWords, /30/);
    assert.match(result.errors.exampleCopy, /1000/);
  }
});
