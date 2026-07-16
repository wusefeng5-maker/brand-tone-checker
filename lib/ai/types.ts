export type ToneCheckBrandProfile = {
  name: string;
  audience: string | null;
  toneTags: string[];
  forbiddenWords: string[];
  requiredWords: string[];
  exampleCopy: string | null;
};

export type ToneCheckResult = {
  score: number;
  summary: string;
  problems: string[];
  suggestions: string[];
  rewrite: string;
};

export type GenerateTextInput = {
  prompt: string;
};

export type AiProvider = {
  name: string;
  model: string;
  generateText(input: GenerateTextInput): Promise<string>;
};
