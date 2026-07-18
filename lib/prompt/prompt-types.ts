export type PromptVariableName =
  | "brandName"
  | "audience"
  | "toneTags"
  | "requiredWords"
  | "forbiddenWords"
  | "example"
  | "platform"
  | "checkAudience"
  | "goal"
  | "language"
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
  context: {
    platform: string;
    audience: string;
    goal: string;
    language: string;
  };
  inputText: string;
};
