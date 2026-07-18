export type ToneCheckBrandProfile = {
  name: string;
  audience: string | null;
  toneTags: string[];
  forbiddenWords: string[];
  requiredWords: string[];
  exampleCopy: string | null;
};

export type ToneCheckContext = {
  platform: string;
  audience: string;
  goal: string;
  language: string;
  brand?: string;
  time?: string;
  reviewer?: string;
};

export type ToneCheckDecision = "PASS" | "Needs Revision" | "OFF BRAND";
export type ToneCheckConfidence = "High" | "Medium" | "Low";
export type ToneCheckAuditStatus = "PASS" | "PARTIAL" | "FAIL";
export type ToneCheckSeverity = "Critical" | "Major" | "Minor";

export type ToneCheckEvidence = {
  originalSentence: string;
  sentence: string;
  matchedRule: string;
  severity: ToneCheckSeverity;
  reason: string;
  rewrite: string;
  confidence: ToneCheckConfidence;
  suggestion: string;
};

export type ToneCheckAuditCheck = {
  category: string;
  status: ToneCheckAuditStatus;
  severity: ToneCheckSeverity;
  reason: string;
  evidence: ToneCheckEvidence;
  suggestion: string;
};

export type ToneCheckResult = {
  score: number;
  finalDecision: ToneCheckDecision;
  confidence: ToneCheckConfidence;
  summary: string;
  evidence: ToneCheckEvidence[];
  invalidEvidence: string[];
  checks: ToneCheckAuditCheck[];
  problems: string[];
  suggestions: string[];
  rewrite: string;
  brandRulesHit: string[];
  matchedRules: string[];
  missingRules: string[];
  violatedRules: string[];
  context?: ToneCheckContext;
};

export type GenerateTextInput = {
  prompt: string;
};

export type AiProvider = {
  name: string;
  model: string;
  generateText(input: GenerateTextInput): Promise<string>;
};
