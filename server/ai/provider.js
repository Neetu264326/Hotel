import dotenv from 'dotenv'

dotenv.config()

const BASE_URL = (process.env.AI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '')
const MODEL = process.env.AI_MODEL || 'gpt-4o-mini'
const API_KEY = process.env.AI_API_KEY || ''
const MAX_TOKENS = Number(process.env.AI_MAX_TOKENS || 700)
const TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || 45000)

const SYSTEM_PROMPT = `You are "Delishful Assistant", the friendly AI restaurant concierge for Delishful, a food delivery platform.

Your job is to help customers:
1. Discover restaurants and explore menus.
2. Get personalized food recommendations.
3. Answer questions about food, cuisines, prices, vegetarian options and delivery.
4. Assist with ordering (add to cart, checkout flow) and note how reservations work.
5. Recommend coupons and offers.

Rules:
- Be warm, concise and helpful. Use short bullet points when listing options.
- Use ONLY the DATA provided below. Never invent restaurants, dishes, prices or coupons that are not in the data.
- When the user asks for a recommendation, pick highly rated (rating >= 4.5) or bestseller items and name the restaurant.
- If you are not sure or the data does not cover something, say so honestly and suggest browsing restaurants.
- If the user clearly wants to order, tell them the steps: add item to cart (tap the + on a dish), open Cart, go to Checkout, choose payment, confirm.
- If the user asks about reservations/table booking, explain that Delishful is a delivery platform and reservations are handled through the restaurant's reservation option/contact, and offer to help order instead.
- Never ask for payment details or sensitive information.

CURRENT DATA (feel free to reference):
Restaurants:
{RESTAURANTS}

Foods (sample, top rated):
{FOODS}

Cuisines:
{CUISINES}

Coupons / Offers:
{COUPONS}`

export const isAssistantConfigured = () => Boolean(API_KEY)

const summary = (arr, limit) => {
  const list = Array.isArray(arr) ? arr : []
  const sliced = limit ? list.slice(0, limit) : list
  return JSON.stringify(sliced).slice(0, 18000)
}

export const buildContext = ({ restaurants = [], foods = [], cuisines = [], coupons = [] }) => {
  const topFoods = [...foods]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0) || Number(Boolean(b.bestseller)) - Number(Boolean(a.bestseller)))
    .slice(0, 40)
  return SYSTEM_PROMPT
    .replace('{RESTAURANTS}', summary(restaurants, 25))
    .replace('{FOODS}', summary(topFoods, 60))
    .replace('{CUISINES}', summary(cuisines, 20))
    .replace('{COUPONS}', summary(coupons, 10))
}

/**
 * Call an OpenAI-compatible chat completions API.
 * Works with OpenAI, Azure-style OpenAI, DeepSeek, Groq, OpenRouter, Together,
 * Ollama (AI_BASE_URL=http://localhost:11434/v1) and other OpenAI-compatible servers.
 */
export const askAssistant = async ({ message, history = [], context, temperature = 0.6 }) => {
  if (!API_KEY) {
    throw new Error('AI_API_KEY is not configured')
  }

  const messages = [
    { role: 'system', content: context },
    ...(history || []).slice(-8),
    { role: 'user', content: message },
  ]

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        max_tokens: MAX_TOKENS,
        temperature,
        stream: false,
      }),
      signal: controller.signal,
    })

    if (!response.ok) {
      let detail = ''
      try {
        const err = await response.json()
        detail = err?.error?.message || err?.message || ''
      } catch {
        // ignore
      }
      throw new Error(`AI provider error (${response.status}): ${detail}`)
    }

    const data = await response.json()
    const reply = data?.choices?.[0]?.message?.content
    if (typeof reply !== 'string' || !reply.trim()) {
      throw new Error('AI provider returned an empty response')
    }
    return { reply, provider: 'ai', model: MODEL }
  } finally {
    clearTimeout(timeout)
  }
}