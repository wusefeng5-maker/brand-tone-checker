import type { PromptTemplate } from "./prompt-types";

export const toneCheckPromptTemplate: PromptTemplate = {
  systemPrompt: [
    "You are a senior brand voice reviewer.",
    "Check whether the submitted copy matches the brand profile.",
    "Return JSON only. Do not include markdown, comments, or extra text.",
  ].join("\n"),
  userPrompt: [
    "Brand profile:",
    "- Brand name: {{brandName}}",
    "- Brand positioning: {{example}}",
    "- Brand tone: {{toneTags}}",
    "- Target users: {{audience}}",
    "- Brand keywords: {{requiredWords}}",
    "- Forbidden words: {{forbiddenWords}}",
    "- Brand introduction: {{example}}",
    "",
    "Submitted copy:",
    "{{copy}}",
    "",
    "Required JSON shape:",
    '{ "score": 0, "summary": "...", "problems": ["..."], "suggestions": ["..."], "rewrite": "..." }',
    "The score must be an integer from 0 to 100.",
  ].join("\n"),
};
