export type PromptVariableName =
  | "brandName"
  | "audience"
  | "toneTags"
  | "requiredWords"
  | "forbiddenWords"
  | "example"
  | "copy";

export type PromptVariables = Record<PromptVariableName, string>;

export type PromptTemplate = {
  systemPrompt: string;
  userPrompt: string;
};

export type ToneCheckPromptBrandProfile = {
  name: string;
  audience: string | null;
  toneTags: string[];
  forbiddenWords: string[];
  requiredWords: string[];
  exampleCopy: string | null;
};

export type BuildToneCheckPromptInput = {
  brandProfile: ToneCheckPromptBrandProfile;
  inputText: string;
};
