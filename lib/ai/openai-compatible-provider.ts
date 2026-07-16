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

function getHtmlTitle(html: string) {
  return html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
}

function logHtmlDiagnostics(text: string) {
  const lowerText = text.toLowerCase();

  console.error("HTML title:", getHtmlTitle(text));
  console.error("Is Cloudflare:", lowerText.includes("cloudflare"));
  console.error("Is login page:", lowerText.includes("login") || lowerText.includes("\u767b\u5f55"));
  console.error("Is 404:", lowerText.includes("404") || lowerText.includes("not found"));
  console.error("Is Nginx:", lowerText.includes("nginx"));
  console.error("Is WAF:", lowerText.includes("waf") || lowerText.includes("web application firewall"));
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

      console.log("URL =", url);
      console.log("baseUrl =", baseUrl);
      console.log("model =", model);
      console.log("apiKey length =", apiKey.length);

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
      const headers = Object.fromEntries(fetchResponse.headers.entries());

      console.log("status =", fetchResponse.status);
      console.log("statusText =", fetchResponse.statusText);
      console.log("content-type =", contentType);
      console.log("headers =", headers);

      if (!contentType.toLowerCase().includes("application/json")) {
        const text = await fetchResponse.text();

        console.log("Non-JSON response preview =", text.slice(0, 1000));

        if (text.trimStart().toLowerCase().startsWith("<!doctype") || text.includes("<html")) {
          logHtmlDiagnostics(text);
        }

        throw new Error(
          `AI provider returned non-JSON response with status ${fetchResponse.status}.`,
        );
      }

      if (!fetchResponse.ok) {
        const errorText = await fetchResponse.text();
        throw new Error(
          `AI provider request failed with status ${fetchResponse.status}: ${errorText}`,
        );
      }

      const response = (await fetchResponse.json()) as ChatCompletionResponse;
      const content = response.choices?.[0]?.message?.content;

      if (!content) {
        console.error("AI response:", response);
        throw new Error("AI provider returned an empty response.");
      }

      return content;
    },
  };
}
