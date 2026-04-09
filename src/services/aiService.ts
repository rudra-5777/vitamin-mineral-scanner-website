const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined

const KNOWN_KEYS = [
  'apple', 'banana', 'orange', 'broccoli', 'carrot', 'tomato',
  'strawberry', 'grape', 'mango', 'pineapple', 'spinach', 'avocado',
  'blueberry', 'lemon', 'peach', 'pear', 'watermelon', 'kiwi', 'cherry',
  'potato', 'onion', 'garlic', 'cucumber', 'pepper', 'lettuce',
]

// Sort keys longest-first so more specific names (e.g. "pineapple") are
// matched before any shorter substring they contain (e.g. "apple").
const SORTED_KEYS = [...KNOWN_KEYS].sort((a, b) => b.length - a.length)

/**
 * Attempt to match a free-form food name string to one of the known
 * database keys. Matches whole words where possible, falling back to
 * substring matching. Falls back to 'default' when no match is found.
 */
export function normalizeFood(name: string): string {
  const lower = name.toLowerCase()
  // Prefer whole-word matches first (avoids "pear" matching inside "pears" etc.)
  for (const key of SORTED_KEYS) {
    if (new RegExp(`\\b${key}\\b`).test(lower)) return key
  }
  // Fall back to substring match, still using longest-key-first order
  for (const key of SORTED_KEYS) {
    if (lower.includes(key)) return key
  }
  return 'default'
}

/**
 * Identify the main food item visible in `imageDataUrl`.
 * Uses Gemini 1.5 Flash when an API key is available; otherwise falls
 * back to a generic heuristic label so the app still works offline.
 */
export async function identifyFood(imageDataUrl: string): Promise<string> {
  if (GEMINI_API_KEY) {
    try {
      const [header, base64] = imageDataUrl.split(',')
      const mimeType = header.split(';')[0].split(':')[1]

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: 'Identify the main food item in this image. Reply with only the food name, for example "Apple" or "Broccoli". No extra words.',
                  },
                  { inline_data: { mime_type: mimeType, data: base64 } },
                ],
              },
            ],
            generationConfig: { maxOutputTokens: 20, temperature: 0.1 },
          }),
        },
      )

      if (response.ok) {
        const data = await response.json()
        const text: string | undefined =
          data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
        if (text) return text
      }
    } catch {
      // Network error or malformed response — fall through to heuristic
    }
  }

  // Heuristic fallback: return a generic label
  return 'Mixed Produce'
}
