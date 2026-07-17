import { toneCheckPromptTemplate } from "./tone-check-template.ts";
import type {
  BuildToneCheckPromptInput,
  PromptTemplate,
  PromptVariables,
} from "./prompt-types";

function formatList(values: string[]) {
  return values.length > 0 ? values.join(", ") : "Not specified";
}

function formatText(value: string | null) {
  return value && value.trim().length > 0 ? value.trim() : "Not specified";
}

function buildToneCheckVariables({
  brandProfile,
  inputText,
}: BuildToneCheckPromptInput): PromptVariables {
  return {
    brandName: formatText(brandProfile.name),
    audience: formatText(brandProfile.audience),
    toneTags: formatList(brandProfile.toneTags),
    requiredWords: formatList(brandProfile.requiredWords),
    forbiddenWords: formatList(brandProfile.forbiddenWords),
    example: formatText(brandProfile.exampleCopy),
    copy: inputText,
  };
}

function replaceVariables(template: string, variables: PromptVariables) {
  return template.replace(/{{\s*(\w+)\s*}}/g, (match, key: string) => {
    if (key in variables) {
      return variables[key as keyof PromptVariables];
    }

    return match;
  });
}

export function renderPromptTemplate(
  template: PromptTemplate,
  variables: PromptVariables,
) {
  return [
    replaceVariables(template.systemPrompt, variables),
    "",
    replaceVariables(template.userPrompt, variables),
  ].join("\n");
}

export function buildToneCheckPrompt(input: BuildToneCheckPromptInput) {
  return renderPromptTemplate(
    toneCheckPromptTemplate,
    buildToneCheckVariables(input),
  );
}
