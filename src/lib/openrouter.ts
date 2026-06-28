const OPENROUTER_BASE_URL =
  process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1"
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

interface OpenRouterMessage {
  role: "system" | "user" | "assistant"
  content: string
}

interface OpenRouterCompletionParams {
  model: string
  messages: OpenRouterMessage[]
  temperature?: number
  maxTokens?: number
  responseFormat?: { type: "json_object" | "text" }
}

interface OpenRouterCompletionResponse {
  id: string
  choices: {
    message: {
      content: string
    }
  }[]
}

export async function openRouterCompletion(
  params: OpenRouterCompletionParams
): Promise<OpenRouterCompletionResponse> {
  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not configured")
  }

  const response = await fetch(
    `${OPENROUTER_BASE_URL}/chat/completions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.BETTER_AUTH_URL || "http://localhost:3000",
        "X-Title": "tadan",
      },
      body: JSON.stringify({
        model: params.model,
        messages: params.messages,
        temperature: params.temperature ?? 0.3,
        max_tokens: params.maxTokens ?? 4096,
        response_format: params.responseFormat,
      }),
    }
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenRouter API error: ${response.status} ${errorText}`)
  }

  return response.json()
}

export function extractJsonFromResponse(content: string): unknown {
  const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/)
  if (jsonMatch) {
    return JSON.parse(jsonMatch[1])
  }

  const trimmed = content.trim()
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return JSON.parse(trimmed)
  }

  throw new Error("Could not extract JSON from response")
}

export { type OpenRouterMessage, type OpenRouterCompletionParams }
