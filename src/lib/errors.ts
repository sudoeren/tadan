export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = "INTERNAL_ERROR",
    public retryable: boolean = false
  ) {
    super(message)
    this.name = "AppError"
  }
}

export class LLMError extends AppError {
  constructor(message: string) {
    super(message, 502, "LLM_ERROR", true)
    this.name = "LLMError"
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, "VALIDATION_ERROR", false)
    this.name = "ValidationError"
  }
}

export function toUserFriendlyError(error: unknown): string {
  if (error instanceof AppError) {
    return error.message
  }

  if (error instanceof Error) {
    const msg = error.message
    if (msg.includes("ECONNREFUSED") || msg.includes("ENOTFOUND")) {
      return "Database is unreachable. Make sure Docker is running."
    }
    if (msg.includes("relation") && msg.includes("does not exist")) {
      return "Database schema is missing. Run `bun run db:reset` to apply migrations."
    }
    if (msg.includes("vector")) {
      return "Vector storage error. Run `bun run db:reset` to fix the database."
    }
    if (msg.includes("OPENROUTER_API_KEY")) {
      return "AI service is not configured. Contact support."
    }
    if (msg.includes("ETIMEDOUT") || msg.includes("timeout")) {
      return "Request timed out. Please try again."
    }
  }

  return "Something went wrong. Please try again."
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: { maxRetries?: number; baseDelayMs?: number } = {}
): Promise<T> {
  const maxRetries = options.maxRetries ?? 2
  const baseDelayMs = options.baseDelayMs ?? 1000

  let lastError: Error | undefined

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt === maxRetries) break

      const isRetryable =
        lastError instanceof AppError ? lastError.retryable : true

      if (!isRetryable) throw lastError

      const delay = baseDelayMs * Math.pow(2, attempt) + Math.random() * 500
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError
}
