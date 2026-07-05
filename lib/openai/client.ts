import OpenAI from 'openai'

/**
 * OpenAI client — initialized lazily with a fallback check.
 *
 * Reads `OPENAI_API_KEY` from the environment. If the key is missing (e.g.
 * local dev, CI without secrets) the client is left undefined and a flag is
 * exposed so callers can degrade gracefully (return a mock/template
 * blueprint) instead of crashing.
 *
 * Usage:
 *   import { getOpenAI, isOpenAIConfigured } from '@/lib/openai/client'
 *   if (!isOpenAIConfigured()) return mockBlueprint()
 *   const openai = getOpenAI()
 *   const res = await openai.chat.completions.create({ ... })
 */

let _client: OpenAI | null = null
let _checked = false
let _configured = false

/** True when an `OPENAI_API_KEY` is present in the environment. */
export function isOpenAIConfigured(): boolean {
  if (!_checked) {
    _configured = Boolean(
      process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim().length > 0,
    )
    _checked = true
  }
  return _configured
}

/**
 * Return a configured OpenAI client.
 * Throws a clear error if the API key is missing — callers should gate on
 * `isOpenAIConfigured()` first when they want graceful fallback.
 */
export function getOpenAI(): OpenAI {
  if (!isOpenAIConfigured()) {
    throw new Error(
      'OpenAI is not configured. Set the OPENAI_API_KEY environment variable.',
    )
  }
  if (!_client) {
    _client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      // Optional overrides; falls back to OpenAI SDK defaults.
      ...(process.env.OPENAI_BASE_URL
        ? { baseURL: process.env.OPENAI_BASE_URL }
        : {}),
    })
  }
  return _client
}

/**
 * The default model used for blueprint generation. Override via
 * `OPENAI_MODEL` if needed.
 */
export const DEFAULT_MODEL = process.env.OPENAI_MODEL ?? 'gpt-4o'

/** Reset internal state — useful for tests. */
export function _resetOpenAIClient(): void {
  _client = null
  _checked = false
  _configured = false
}

export default getOpenAI
