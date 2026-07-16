import {
  buildToneCheckPrompt,
  parseToneCheckResult,
} from "./tone-check-core";
import { getAiProvider } from "./providers";
import type { ToneCheckBrandProfile, ToneCheckResult } from "./types";

type BuildToneCheckPromptInput = {
  brandProfile: ToneCheckBrandProfile;
  inputText: string;
};

type GenerateToneCheckInput = BuildToneCheckPromptInput;
export { buildToneCheckPrompt, parseToneCheckResult };

export async function generateToneCheck(
  input: GenerateToneCheckInput,
): Promise<ToneCheckResult> {
  const provider = getAiProvider();
  const prompt = buildToneCheckPrompt(input);
  const rawText = await provider.generateText({ prompt });

  return parseToneCheckResult(rawText);
}
