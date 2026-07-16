import { createOpenAiCompatibleProvider } from "./openai-compatible-provider";
import type { AiProvider } from "./types";

export function getAiProvider(): AiProvider {
  const providerName = process.env.AI_PROVIDER ?? "openai-compatible";

  if (providerName === "openai-compatible") {
    return createOpenAiCompatibleProvider();
  }

  throw new Error(`Unsupported AI provider: ${providerName}`);
}
