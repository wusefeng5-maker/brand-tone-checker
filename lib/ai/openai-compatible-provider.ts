import type { AiProvider, GenerateTextInput } from "./types";

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function createOpenAiCompatibleProvider(): AiProvider {
  const apiKey = process.env.OPENAI_COMPATIBLE_API_KEY;
  const baseUrl = process.env.OPENAI_COMPATIBLE_BASE_URL;
  const model = process.env.OPENAI_COMPATIBLE_MODEL;

  if (!apiKey) {
    throw new Error("OPENAI_COMPATIBLE_API_KEY is not configured.");
  }

  if (!baseUrl) {
    throw new Error("OPENAI_COMPATIBLE_BASE_URL is not configured.");
  }

  if (!model) {
    throw new Error("OPENAI_COMPATIBLE_MODEL is not configured.");
  }

  return {
    name: "openai-compatible",
    model,
    async generateText({ prompt }: GenerateTextInput) {
      const url = `${trimTrailingSlash(baseUrl)}/chat/completions`;

      const fetchResponse = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content: "You return valid JSON only.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: {
            type: "json_object",
          },
        }),
      });

      const contentType = fetchResponse.headers.get("content-type") ?? "";

      if (!contentType.toLowerCase().includes("application/json")) {
        throw new Error(
          `AI provider returned non-JSON response with status ${fetchResponse.status}.`,
        );
      }

      if (!fetchResponse.ok) {
        throw new Error(
          `AI provider request failed with status ${fetchResponse.status}.`,
        );
      }

      const response = (await fetchResponse.json()) as ChatCompletionResponse;
      const content = response.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("AI provider returned an empty response.");
      }

      return content;
    },
  };
}
