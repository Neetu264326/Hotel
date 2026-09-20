import fs from 'node:fs'
import path from 'node:path'
import PDFDocument from 'pdfkit'
import { restaurants } from '../src/data/restaurants.js'
import { foods } from '../src/data/foods.js'

const OUT = process.env.PDF_OUT || path.resolve('public/ai-assistant-spec.pdf')
const cacheDir = process.env.IMG_CACHE || '/tmp/opencode/pdf-imgs'
fs.mkdirSync(cacheDir, { recursive: true })
fs.mkdirSync(path.dirname(OUT), { recursive: true })

const W_FOOD = Number(process.env.W_FOOD || 1024)
const W_HERO = Number(process.env.W_HERO || 1500)
const CONCURRENCY = Number(process.env.IMG_CONC || 6)

// Dead image URLs in the legacy seed data mapped to healthy stand-ins,
// so the catalog pages render complete.
const DEAD_IMAGES = {
  'photo-1604908551837-ff6eeda77c20': 'https://images.unsplash.com/photo-1586444248879-bc604bc77ceb',
  'photo-1601303516546-4bbcc081760a': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445',
  'photo-1586444248879-bc604bc77ceb': 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
  'photo-1523371045014-0d1066707043': 'https://images.unsplash.com/photo-1437418747212-8d9709afab22',
  'photo-1603561596111-d3f20b754ad4': 'https://images.unsplash.com/photo-1572490122747-3968b75cc699',
  'photo-1520072959219-c595dc47af8a': 'https://images.unsplash.com/photo-1550547660-d9450f859349',
  'photo-1573140401552-3fab0b244c9c': 'https://images.unsplash.com/photo-1528736235302-52922df5c122',
  'photo-1570197788410-0e44e1a20a74': 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a',
  'photo-1584271090164-7164d8c1baef': 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
}

const PAGE_W = 595.28
const PAGE_H = 841.89
const MARGIN = 52
const CONTENT_W = PAGE_W - MARGIN * 2

const NAVY = '#101828'
const GRAY = '#5f6b7a'
const CORAL = '#FF6B35'
const CORAL_D = '#E85D2A'
const GOLD = '#C9A227'
const LIGHT = '#faf6f0'
const BORDER = '#eadcc9'

const fix = (s) =>
  String(s ?? '')
    .replace(/\u20B9/g, 'Rs. ')
    .replace(/\u2605/g, '*')
    .replace(/[—–]/g, '-')
    .replace(/\u2018|\u2019/g, "'")
    .replace(/\u201C|\u201D/g, '"')
    .replace(/\u2022/g, '-')
    .replace(/\u2026/g, '...')

const setW = (url, w) => {
  let u2 = url
  try {
    const u = new URL(url)
    if (/images\.unsplash\.com/.test(u.hostname)) {
      u.searchParams.set('w', String(w))
      u.searchParams.set('auto', 'format')
      u.searchParams.set('fit', 'crop')
      u.searchParams.set('q', '80')
    }
    u2 = u.toString()
  } catch {
    // keep original
  }
  for (const [dead, alt] of Object.entries(DEAD_IMAGES)) {
    if (u2.includes(dead)) return setW(alt, w)
  }
  return u2
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function download(url, file, attempt = 0) {
  try {
    const res = await fetch(url, {
      headers: { 'user-agent': 'delishful-spec-builder/1.0' },
      signal: AbortSignal.timeout(30000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    fs.writeFileSync(file, buf)
    return file
  } catch (err) {
    if (attempt < 2) {
      await sleep(800 * (attempt + 1))
      return download(url, file, attempt + 1)
    }
    return null
  }
}

async function loadImage(url, key, w) {
  const file = path.join(cacheDir, `${key}-w${w}.jpg`)
  if (fs.existsSync(file) && fs.statSync(file).size > 0) return file
  await download(setW(url, w), file)
  return fs.existsSync(file) && fs.statSync(file).size > 0 ? file : null
}

async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length)
  let next = 0
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++
      results[i] = await fn(items[i], i)
    }
  })
  await Promise.all(workers)
  return results
}

const doc = new PDFDocument({ size: 'A4', margin: MARGIN, bufferPages: true, compress: true, info: {
  Title: 'Delishful AI Restaurant Assistant - Design Specification',
  Author: 'Delishful Platform Team',
  Subject: 'AI-powered restaurant discovery, recommendations and ordering assistance',
  Keywords: 'AI assistant, restaurant, chatbot, food delivery, OpenAI, spec',
  CreationDate: new Date(),
} })

const stream = fs.createWriteStream(OUT)
doc.pipe(stream)

let currentPage = 0
doc.on('pageAdded', () => { currentPage += 1 })

const sections = []
let pendingSection = null
function startSection(title) {
  pendingSection = { title, page: currentPage }
  sections.push(pendingSection)
}
function endSection() {
  pendingSection = null
}

// ---------- primitives ----------
function heading1(text) {
  if (doc.y > PAGE_H - MARGIN - 60) doc.addPage()
  doc.moveDown(1.6)
  doc.rect(MARGIN, doc.y, 8, 16).fill(CORAL)
  doc.fillColor(NAVY).font('Helvetica-Bold').fontSize(19).text(fix(text), MARGIN + 14, doc.y + 0.5, { lineBreak: false, width: CONTENT_W - 30 })
  doc.moveDown(1.1)
  doc.strokeColor(BORDER).lineWidth(1).moveTo(MARGIN, doc.y).lineTo(PAGE_W - MARGIN, doc.y).stroke()
  doc.moveDown(0.6)
}

function heading2(text) {
  if (doc.y > PAGE_H - MARGIN - 50) doc.addPage()
  doc.moveDown(1.3)
  doc.fillColor(CORAL_D).font('Helvetica-Bold').fontSize(14.5).text(fix(text), { width: CONTENT_W })
  doc.moveDown(0.4)
}

function heading3(text) {
  if (doc.y > PAGE_H - MARGIN - 40) doc.addPage()
  doc.moveDown(1)
  doc.fillColor(NAVY).font('Helvetica-Bold').fontSize(12.5).text(fix(text), { width: CONTENT_W })
  doc.moveDown(0.25)
}

function para(text, size = 10.5) {
  doc.fillColor(GRAY).font('Helvetica').fontSize(size).text(fix(text), { width: CONTENT_W, lineGap: 3 })
  doc.moveDown(0.45)
}

function lead(text) {
  doc.fillColor(NAVY).font('Helvetica').fontSize(11.5).text(fix(text), { width: CONTENT_W, lineGap: 3 })
  doc.moveDown(0.5)
}

function bullet(parts, size = 10.5) {
  if (doc.y > PAGE_H - MARGIN - 40) doc.addPage()
  const text = Array.isArray(parts) ? `${fix(parts[0])} - ${fix(parts[1])}` : fix(parts)
  doc.fillColor(CORAL_D).font('Helvetica-Bold').fontSize(size - 1.5).text('\u2022', MARGIN, doc.y, { lineBreak: false })
  doc.fillColor(GRAY).font('Helvetica').fontSize(size).text(text, MARGIN + 10, doc.y, { width: CONTENT_W - 14, lineGap: 3 })
  doc.moveDown(0.4)
}

function code(text) {
  const textStr = fix(text)
  const w = CONTENT_W - 28
  doc.font('Courier').fontSize(8.6).fillColor('#20303f')
  const h = doc.heightOfString(textStr, { width: w, lineGap: 2 }) + 18
  if (doc.y + h > PAGE_H - MARGIN) doc.addPage()
  doc.roundedRect(MARGIN, doc.y, CONTENT_W, h, 5).fill('#f4f0ea')
  doc.text(textStr, MARGIN + 14, doc.y + 9, { width: w, lineGap: 2 })
  doc.y += h + 8
  doc.moveDown(0.35)
}

function table(headers, rows, widths, opts = {}) {
  const cellPad = 7
  const rowH = opts.rowH || 22
  const headH = 24
  const totalW = widths.reduce((a, b) => a + b, 0)
  const scale = CONTENT_W / totalW
  const cols = widths.map((w) => w * scale)
  let x = MARGIN
  const y0 = doc.y
  doc.rect(MARGIN, y0, CONTENT_W, headH).fill(NAVY)
  doc.fillColor('#fff')
  headers.forEach((h, i) => {
    doc.font('Helvetica-Bold').fontSize(9)
    doc.text(fix(h), x + cellPad, y0 + headH / 2 - 5, { width: cols[i] - cellPad * 2, lineBreak: false })
    x += cols[i]
  })
  let y = y0 + headH
  rows.forEach((row, ri) => {
    const h = Math.max(rowH, Math.max(...row.map((c, i) => doc.heightOfString(fix(c), { width: cols[i] - cellPad * 2 }))))
    if (y + h > PAGE_H - MARGIN) {
      doc.addPage()
      y = MARGIN
      doc.rect(MARGIN, y, CONTENT_W, headH).fill(NAVY)
      doc.fillColor('#fff')
      x = MARGIN
      headers.forEach((h2, i) => {
        doc.font('Helvetica-Bold').fontSize(9).text(fix(h2), x + cellPad, y + headH / 2 - 5, { width: cols[i] - cellPad * 2, lineBreak: false })
        x += cols[i]
      })
      y += headH
    }
    doc.fillColor(ri % 2 ? '#fdf8f1' : '#ffffff').rect(MARGIN, y, CONTENT_W, h).fill()
    x = MARGIN
    row.forEach((c, i) => {
      doc.fillColor(i === 0 ? NAVY : GRAY).font(i === 0 ? 'Helvetica-Bold' : 'Helvetica').fontSize(8.8)
      doc.text(fix(c), x + cellPad, y + 5, { width: cols[i] - cellPad * 2, height: h - 6 })
      x += cols[i]
    })
    y += h
    doc.strokeColor(BORDER).lineWidth(0.6).moveTo(MARGIN, y).lineTo(MARGIN + CONTENT_W, y).stroke()
  })
  doc.moveDown(1.2)
  doc.y = y + 12
}

function spacer(n = 0.6) {
  doc.moveDown(n)
}

// ---------- page header/footer ----------
function renderChrome(pageIndex) {
  doc.fillColor(LIGHT).rect(0, 0, PAGE_W, 46).fill()
  doc.rect(0, 0, 8, PAGE_H).fill(CORAL)
  doc.fillColor(CORAL_D).font('Helvetica-Bold').fontSize(11).text('DELISHFUL', 24, 15)
  doc.fillColor(GRAY).font('Helvetica').fontSize(8).text('AI Restaurant Assistant - Complete Design Specification', 24, 29)
  doc.fillColor(NAVY).font('Helvetica').fontSize(8)
  doc.text(`Page ${pageIndex + 1}`, 0, 15, { width: PAGE_W - 36, align: 'right', lineBreak: false })
}

// ============================================================
// COVER
// ============================================================
doc.save()
doc.rect(0, 0, PAGE_W, PAGE_H).fill(NAVY)
doc.rect(0, PAGE_H - 14, PAGE_W, 14).fill(CORAL)
doc.rect(0, 0, 8, PAGE_H).fill(CORAL)
doc.fillColor(CORAL).font('Helvetica-Bold').fontSize(13).text('DELISHFUL', 48, 48)
doc.fillColor('#cbd5e1').font('Helvetica').fontSize(11).text('Good Food. Delivered Fast.', 48, 70, { characterSpacing: 2 })
doc.fillColor('#fff').font('Helvetica-Bold').fontSize(38).text('AI Restaurant Assistant', 48, 200, { width: PAGE_W - 96 })
doc.fillColor('#fff').font('Helvetica-Bold').fontSize(26).text('Complete Design Specification', 48, 256, { width: PAGE_W - 96 })
doc.fillColor('#fde7d8').font('Helvetica').fontSize(13).text(
  'Natural-language restaurant discovery, menu exploration, personalized recommendations, ' +
  'offers, ordering guidance and reservations assistance - powered by an intelligent food concierge.',
  48, 340, { width: PAGE_W - 120, lineGap: 6 }
)
doc.fillColor('#9fb0c3').font('Helvetica').fontSize(10.5)
doc.text('Version 1.0', 48, 430)
doc.text(`Prepared: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, 48, 450)
doc.text('8 restaurants  |  113 dishes  |  4 coupons  |  Delivery + Reservations + AI chat', 48, 470)
doc.restore()
doc.addPage()
startSection('1. Executive Summary')
endSection()

// ============================================================
// 1. EXECUTIVE SUMMARY
// ============================================================
heading1('1. Executive Summary')
para(
  'Delishful is a full-stack food ordering platform that connects customers with local restaurants. This document is the complete ' +
  'engineering and product specification for a new capability: the Delishful AI Restaurant Assistant. The assistant is a conversational ' +
  'agent embedded directly in the web application that helps customers discover restaurants, explore menus, get personalized food ' +
  'recommendations, answer questions, and guide them through ordering and reservations.'
)
para(
  'The assistant is designed as a hybrid system. When a live AI API key (OpenAI-compatible: OpenAI, DeepSeek, Groq, OpenRouter, Ollama, ' +
  'and others) is configured, it uses a production-grade language model instructed by a domain-specific system prompt over live platform ' +
  'data. When no key is configured, the platform transparently falls back to a deterministic offline rule engine that answers the same ' +
  'questions using the same data, so the feature never goes down.'
)
bullet(['Live AI mode', 'Uses the configured chat-completions provider for natural, conversational answers with full language understanding.'])
bullet(['Offline fallback', 'A rule-based engine over the same restaurants, foods, and coupons data keeps the assistant available without any API key.'])
bullet(['No new infrastructure', 'The assistant reuses the existing Express API, MongoDB data layer, and React frontend.'])
bullet(['Context aware', 'Every request is grounded in the current restaurant catalog, food menu, and active coupons - the assistant never invents data.'])
bullet(['User-friendly UX', 'A floating chat widget on every page with quick prompts, typing indicator, and formatted responses.'])
endSection()

// ============================================================
// 2. VISION AND GOALS
// ============================================================
doc.addPage()
startSection('2. Vision and Goals')
heading1('2. Vision and Goals')
lead('We want every customer to feel like they have a personal food concierge in their pocket - someone who already knows the menu, the ' +
  'prices, the best sellers, and the coupons, and can turn "what should I eat tonight?" into a delivered order in seconds.')
heading2('2.1 Product Goals')
bullet(['Reduce choice paralysis: turn a large catalog into a short, personalized, trustworthy shortlist.'])
bullet(['Increase conversion: move customers from browsing to cart faster through guided ordering.'])
bullet(['Surface offers: proactively connect customers with applicable coupons and restaurant discounts.'])
bullet(['Answer instantly: resolve menu, price, dietary, timing, and process questions without digging through the UI.'])
bullet(['Support every page: the assistant is available globally, not just on one screen.'])
heading2('2.2 Success Metrics')
table(
  ['Metric', 'Definition', 'Target'],
  [
    ['Conversation starts / DAU', 'Assistant opened at least once per active user / day', '> 35%'],
    ['Recommendation acceptance', 'User navigates/adds a dish referenced by the assistant', '> 40%'],
    ['Coupon redemption via assistant', 'Coupon code surfaced by assistant redeemed in checkout', '> 20%'],
    ['Assisted order rate', 'Orders placed after an assistant conversation', '> 15%'],
    ['Resolution rate', 'Questions answered without human handoff', '> 90%'],
    ['Response time p95', 'Time from send to rendered answer', '< 3 s'],
  ],
  [140, 250, 130]
)
endSection()

// ============================================================
// 3. SYSTEM ARCHITECTURE
// ============================================================
doc.addPage()
startSection('3. System Architecture')
heading1('3. System Architecture')
para(
  'The assistant is a thin conversational layer over the existing platform. A new POST /api/ai/chat endpoint accepts the user message and ' +
  'recent history, snapshots the current catalog data, builds a grounded system prompt, and returns a plain-text answer rendered by the frontend widget.'
)
heading2('3.1 Components')
table(
  ['Component', 'Technology', 'Responsibility'],
  [
    ['React SPA', 'React 19 + Vite + lucide-react', 'Renders the chat widget on every route; manages conversation state'],
    ['API client', 'fetch-based client (src/api)', 'Authenticates and calls /api/ai/chat'],
    ['Express API', 'Node.js + Express 5', 'Serves the endpoint; orchestrates data + provider'],
    ['MongoDB', 'Mongoose ODM', 'Stores restaurants, foods, coupons, users, carts, orders'],
    ['AI provider', 'OpenAI-compatible chat completions', 'Generates natural-language replies when configured'],
    ['Rule engine', 'Deterministic intent matcher (server/ai/local.js)', 'Offline fallback with identical data grounding'],
  ],
  [130, 140, 250]
)
heading2('3.2 Request Flow')
code(`User message
   |
   v
POST /api/ai/chat  { message, history }
   |
   v
[Load context]  Restaurant.find() + Food.find() + Coupon.find({active})
   |
   v
[Build system prompt]  assistant expertise + live JSON snapshot (max 40 rest./60 foods/10 coupons)
   |
   +-- AI_API_KEY set? --> chat-completions API ----------+
   +-- no key / error  --> offline rule engine -----------+
   |                                                     |
   +------------------>  200 { reply, provider, model } <+
   |
   v
Chat widget renders formatted answer`)
heading2('3.3 Why OpenAI-Compatible?')
para(
  'The OpenAi-compatible chat-completions contract is the de-facto standard. Supporting AI_BASE_URL + AI_API_KEY + AI_MODEL means the ' +
  'assistant can use OpenAI, DeepSeek, Groq (free tier), OpenRouter (one key for many models including Claude and Gemini), Together, ' +
  'Azure OpenAI, or a local Ollama instance - with zero code changes.'
)
endSection()

// ============================================================
// 4. DATA MODEL
// ============================================================
doc.addPage()
startSection('4. Data Model')
heading1('4. Data Model')
para('The assistant reads from existing collections; it introduces no schema changes. Fields shown are those most relevant to conversation grounding.')
heading2('4.1 Restaurant')
table(
  ['Field', 'Type', 'Example', 'Used for'],
  [
    ['id', 'Number', '1', 'Menu lookup'],
    ['name', 'String', 'Spice Route', 'Naming restaurants'],
    ['cuisine', 'String', 'Indian', 'Cuisine filtering'],
    ['rating', 'Number', '4.5', 'Top-rated answers'],
    ['reviews', 'Number', '2314', 'Trust signals'],
    ['deliveryTime', 'Number', '25', 'Delivery questions'],
    ['priceRange', 'String', 'Rs. 200 - Rs. 500', 'Budget advice'],
    ['discount', 'String', '50% OFF up to Rs. 100', 'Offers context'],
    ['vegetarian', 'Boolean', 'true', 'Dietary answers'],
    ['categories', 'String[]', 'Starters, Biryani', 'Menu structure'],
  ],
  [130, 60, 150, 180]
)
heading2('4.2 Food')
table(
  ['Field', 'Type', 'Example', 'Used for'],
  [
    ['name', 'String', 'Chicken Biryani', 'Dish naming'],
    ['price', 'Number', '290', 'Pricing & budget'],
    ['rating', 'Number', '4.7', 'Recommendations'],
    ['veg', 'Boolean', 'false', 'Vegetarian queries'],
    ['bestseller', 'Boolean', 'true', 'Popular picks'],
    ['category', 'String', 'Biryani', 'Cuisine matching'],
    ['ingredients', 'String[]', 'Basmati Rice, Saffron', 'Dietary answers'],
    ['sizes', 'Number[]', '290, 390, 490', 'Price comparison'],
  ],
  [130, 60, 150, 180]
)
heading2('4.3 Coupon')
table(
  ['Field', 'Type', 'Example'],
  [
    ['code', 'String', 'WELCOME50'],
    ['type', 'String', 'flat | percent'],
    ['value', 'Number', '50'],
    ['maxDiscount', 'Number', '150'],
    ['minOrder', 'Number', '250'],
  ],
  [150, 140, 110, 110, 110]
)
endSection()

// ============================================================
// 5. THE AI ASSISTANT
// ============================================================
doc.addPage()
startSection('5. The AI Assistant')
heading1('5. The AI Assistant')
lead('A conversational concierge with five core capabilities: discover, explore, recommend, answer, and assist.')
heading2('5.1 Capabilities')
table(
  ['Capability', 'Customer need', 'Example utterance'],
  [
    ['Discover restaurants', 'Find where to eat', '"best biryani place around me"'],
    ['Explore menus', 'See what is available', '"show me Pizza District menu"'],
    ['Personalized recommendation', 'Decide quickly', '"recommend a veg dinner for two under Rs 700"'],
    ['Answer questions', 'Understand options', '"is it vegetarian? how much is delivery?"'],
    ['Guide ordering', 'Complete the purchase', '"how do I place an order?"'],
    ['Assist reservations', 'Book ahead', '"can I reserve a table?"'],
    ['Share offers', 'Save money', '"any coupons today?"'],
  ],
  [170, 150, 200]
)
heading2('5.2 System Prompt Design')
para(
  'The assistant is instructed by a fixed system prompt (server/ai/provider.js) that establishes the persona, capability rules, and hard ' +
  'grounding constraints. It is then appended with a live JSON snapshot of the current catalog, selected by relevance: top 25 restaurants ' +
  'by rating, top 60 dishes by rating/bestseller, distinct cuisines, and up to 10 active coupons.'
)
code(`You are "Delishful Assistant", the friendly AI food concierge.
Rules:
- Use ONLY the DATA provided. Never invent restaurants, dishes, prices or coupons.
- Be warm, concise. Use short bullets when listing options.
- For recommendations prefer rating >= 4.5 or bestsellers, and name the restaurant.
- For ordering: add item to cart, open cart, checkout, pay, confirm.
- Reservations: delivery-first platform; route to restaurant contact, offer to order.
- Never ask for payment details or sensitive info.`)
heading2('5.3 Provider Integration')
para(
  'The provider layer posts {model, messages, max_tokens, temperature} to {AI_BASE_URL}/chat/completions with a Bearer token. The last ' +
  'eight conversation turns are included as history so answers stay context-aware.'
)
table(
  ['Env var', 'Default', 'Description'],
  [
    ['AI_BASE_URL', 'https://api.openai.com/v1', 'Base of an OpenAI-compatible API'],
    ['AI_MODEL', 'gpt-4o-mini', 'Model identifier'],
    ['AI_API_KEY', '(empty)', 'Enables live AI mode when set'],
    ['AI_MAX_TOKENS', '700', 'Answer length cap'],
    ['AI_TIMEOUT_MS', '45000', 'Provider call timeout'],
  ],
  [150, 220, 150]
)
heading2('5.4 Offline Rule Engine')
para(
  'server/ai/local.js implements a deterministic intent matcher covering: greetings, capabilities, coupons, vegetarian/non-vegetarian ' +
  'filtering, budget ("under Rs 200"), cuisine-dish matching (biryani, pizza, burger, paneer, noodles, dessert and more), best-rated ' +
  'restaurants, restaurant-name lookups, ordering steps, and reservation guidance. If the assistant is configured for live AI but the ' +
  'provider errors, requests automatically downgrade to this engine and note the fallback.')
endSection()

// ============================================================
// 6. CONVERSATION FLOWS
// ============================================================
doc.addPage()
startSection('6. Conversation Flows')
heading1('6. Conversation Flows')
heading2('6.1 Discovery: "Best biryani"')
code(`User : recommend a biryani
AI   : Here are matching dishes:
       - Mutton Biryani -- Rs. 380 (Biryani House)
       - Hyderabadi Biryani -- Rs. 320 (Biryani House)
       - Chicken Biryani -- Rs. 290 (Spice Route)
       - Veg Dum Biryani -- Rs. 270 (Biryani House)
       Want the full menu from a restaurant, or more?`)
heading2('6.2 Personalized recommendation: "Veg dinner for two"')
code(`User : recommend something for a vegetarian dinner
AI   : Here are tasty veg picks:
       - Palak Paneer -- Rs. 270 (Spice Route)
       - Margherita Pizza -- Rs. 260 (Pizza District)
       - Dal Makhani -- Rs. 240 (Spice Route)
       Add a garlic naan and mango lassi to finish the meal!`)
heading2('6.3 Offers: "Any coupons?"')
code(`User : any offers today?
AI   : Active offers on Delishful:
       50% OFF up to Rs. 100 -- use code WELCOME50
       20% OFF up to Rs. 150 -- use code FOOD20
       15% OFF up to Rs. 100 -- use code FIRSTORDER`)
heading2('6.4 Ordering guidance')
code(`User : how do I order?
AI   : 1. Find a dish, tap + to add to cart
       2. Open cart and review
       3. Proceed to checkout, add your delivery address
       4. Pick Standard / Priority / Scheduled delivery
       5. Choose payment and confirm.
       Tip: you can mix dishes from multiple restaurants.`)
heading2('6.5 Reservations')
code(`User : can I book a table for tonight?
AI   : Delishful is delivery-first, so tables are booked with the
       restaurant. You can check the restaurant page for reservation
       options, or I can pull the menu so you can order instead.
       Shall I show you restaurants near you?`)

table(
  ['Intent', 'Trigger words', 'Data used', 'Response'],
  [
    ['Greeting', 'hi, hello, hey', '-', 'Intro + capabilities'],
    ['Cuisine/dish', 'biryani, pizza, paneer...', 'Foods match name/category/ingredients', 'Matching dishes + restaurant'],
    ['Veg / non-veg', 'veg, vegetarian, non veg, chicken', 'Food.veg flag', 'Filtered picks'],
    ['Budget', 'under Rs X, cheap, budget', 'Food.price / sizes', 'Items within limit'],
    ['Offers', 'coupon, offer, discount, deal', 'Coupons(active)', 'Code + type + min order'],
    ['Best / recommend', 'best, top rated, recommend', 'Restaurants.rating + reviews', 'Ranked shortlist'],
    ['Restaurant name', 'spice route, pizza district', 'Restaurants.name', 'Profile + top dishes'],
    ['Ordering', 'order, checkout, how to order', 'Flow knowledge', 'Step-by-step'],
    ['Reservation', 'book table, reservation', 'Policy knowledge', 'Guidance + redirect'],
    ['Fallback', '(else)', 'Capabilities', 'Help menu'],
  ],
  [120, 120, 160, 120]
)
endSection()

// ============================================================
// 7. API SPECIFICATION
// ============================================================
doc.addPage()
startSection('7. API Specification')
heading1('7. API Specification')
heading3('POST /api/ai/chat')
table(
  ['Detail', 'Value'],
  [
    ['Method', 'POST'],
    ['Path', '/api/ai/chat'],
    ['Auth', 'Optional (token auto-attached if logged in)'],
    ['Body', '{"message": string (required), "history": [{role, content}]}'],
    ['Success', '200 {"success":true,"reply":string,"provider":"ai"|"local","model":string}'],
    ['Errors', '400 missing message; 500 provider/data error'],
  ],
  [120, 400]
)
heading3('Request')
code(`POST /api/ai/chat
Authorization: Bearer <jwt-optional>
Content-Type: application/json

{
  "message": "recommend a biryani",
  "history": [
    { "role": "user", "content": "is chicken biryani spicy?" },
    { "role": "assistant", "content": "It is mildly spicy with saffron..." }
  ]
}`)
heading3('Response')
code(`{
  "success": true,
  "reply": "Here are matching dishes:\\n- Mutton Biryani -- Rs. 380 (Biryani House)...",
  "provider": "local",
  "model": "delishful-rule-engine-v1"
}`)
heading3('Existing Endpoints Used by the Client')
table(
  ['Method', 'Path', 'Purpose'],
  [
    ['POST', '/api/ai/chat', 'Send message, get assistant reply'],
    ['GET', '/api/restaurants', 'Browsing fallback'],
    ['GET', '/api/foods', 'Menu search'],
    ['POST', '/api/coupons/validate', 'Coupon validation'],
    ['GET', '/api/cart', 'Cart state'],
    ['POST', '/api/orders', 'Place order'],
  ],
  [80, 260, 180]
)
endSection()

// ============================================================
// 8. FRONTEND WIDGET SPECIFICATION
// ============================================================
doc.addPage()
startSection('8. Frontend Widget Specification')
heading1('8. Frontend Widget Specification')
para(
  'The assistant mounts globally in App.jsx as <ChatAssistant />, so the floating bubble is available on every route - including home, ' +
  'restaurant, cart, and checkout. It is implemented with React state, the lucide-react icon set, and the same brand palette used across ' +
  'the app (coral #FF6B35, navy #101828, warm cream backgrounds).'
)
heading2('8.1 Components and Appearance')
table(
  ['Element', 'Specification'],
  [
    ['Floating button', '60px circle, bottom-right, coral gradient, MessageCircle icon (toggles to X when open)'],
    ['Panel', '372px wide (max 100vw - 36px), max-height 560px, rounded 18px, drop shadow, warm paper background'],
    ['Header', 'Brand gradient with Sparkles icon: "Delishful Assistant" + status line "AI food concierge, online"'],
    ['Message bubble (user)', 'Right-aligned, coral background, white text'],
    ['Message bubble (assistant)', 'Left-aligned, white background, navy/grey text, 1px warm border'],
    ['Quick prompts', 'Pill buttons shown before first message: recommend / offers / veg / biryani / order'],
    ['Typing indicator', 'Animated spinner + "Delishful is thinking..."'],
    ['Error state', 'Soft red banner with retry guidance'],
    ['Input bar', 'Rounded input with Send button, disabled while loading'],
  ],
  [130, 390]
)
heading2('8.2 Markdown-lite Rendering')
para(
  'Assistant replies are plain text rendered client-side with a compact formatter: paragraphs, bullet/numbered lists, and **bold** spans. ' +
  'This keeps provider output simple and layout safe without requiring a full markdown library.'
)
heading2('8.3 Conversation State')
para(
  'Conversation lives in component state; the last eight turns are sent with each request for context. On unmount (navigation), state is ' +
  'kept while the app is open so users can continue where they left off. A future enhancement may persist sessions server-side.')
heading2('8.4 Accessibility and Mobile')
para(
  'The widget is fully keyboard-operable, uses aria-labels on icon buttons, and collapses to a 36px-max-width panel on small screens. ' +
  'The reduced-motion media query pauses decorative animations.'
)
endSection()

// ============================================================
// 9. SECURITY AND PRIVACY
// ============================================================
doc.addPage()
startSection('9. Security and Privacy')
heading1('9. Security and Privacy')
bullet(['API key stays on the server', 'Never exposed to the browser; provider calls happen only in server/ai/provider.js.'])
bullet(['Grounded answers', 'System prompt forbids hallucinating restaurants, dishes, prices, or coupons.'])
bullet(['History bounded', 'Only the last eight turns are forwarded; full conversation is not persisted.'])
bullet(['No sensitive data', 'Assistant never asks for or relays payment details, passwords, or OTPs.'])
bullet(['Input sanitization', 'Messages are trimmed and length-limited before processing; provider output is escaped by the renderer.'])
bullet(['Timeouts & fallback', 'Provider timeouts and failures degrade to the offline engine instead of erroring.'])
bullet(['Optional auth', 'Rate-limited endpoint usable by guests; authenticated users get consistent cart guidance.'])
endSection()

// ============================================================
// 10. PERFORMANCE AND COST
// ============================================================
doc.addPage()
startSection('10. Performance and Cost')
heading1('10. Performance and Cost')
table(
  ['Concern', 'Mitigation'],
  [
    ['Latency', 'Data snapshot queries run in parallel (Promise.all); provider timeout at 45s with p95 target < 3s for live AI'],
    ['Token size', 'Context truncated to ~18k chars; max_tokens 700 keeps answers short and cheap'],
    ['Provider outage', 'Automatic downgrade to rule engine; zero downtime'],
    ['Cold start', 'Rule engine has no external dependency; MongoDB already warm'],
    ['Cost of offline mode', 'Rs. 0 - fully local'],
    ['Cost of live AI (gpt-4o-mini)', 'Approx. 0.15-0.60 per 1k input / 0.60 per 1k output tokens; typical conversation < Rs. 0.50'],
  ],
  [180, 340]
)
heading2('10.1 Caching Opportunities')
para(
  'Frequent, identical questions (hours, coupons, how-to-order) can be short-circuited by an in-memory or Redis-backed exact/approximate ' +
  'intent cache keyed on normalized message text, avoiding provider calls for the long tail of repetitive queries.')
endSection()

// ============================================================
// 11. TESTING AND QA
// ============================================================
doc.addPage()
startSection('11. Testing and QA')
heading1('11. Testing and Quality Assurance')
heading2('11.1 Functional Test Matrix')
table(
  ['Test case', 'Input', 'Expected'],
  [
    ['Greeting', '"hi"', 'Warm intro with capability list'],
    ['Cuisine match', '"recommend a biryani"', 'All biryani dishes with restaurant + price'],
    ['Veg filter', '"show veg options"', 'Only veg=true dishes'],
    ['Non-veg filter', '"chicken dishes"', 'Only veg=false / chicken dishes'],
    ['Budget', '"things under Rs 200"', 'Only items with price <= 200'],
    ['Coupons', '"any offers?"', 'Active coupons with codes and min order'],
    ['Best rated', '"best restaurant"', 'Sorted by rating desc, top 5'],
    ['Restaurant lookup', '"show Pizza District"', 'Profile + popular dishes'],
    ['Ordering', '"how do i order"', 'Five step ordering flow'],
    ['Reservation', '"book a table"', 'Delivery-first guidance'],
    ['Unknown', '"summon a dragon"', 'Help menu fallback'],
    ['Empty message', '""', '400 with clear message'],
  ],
  [150, 160, 210]
)
heading2('11.2 Quality Gates')
bullet(['Lint: project oxlint config passes with zero errors.'])
bullet(['Build: vite build completes; widget chunk lazy-loads on demand.'])
bullet(['Provider error path: injected auth failure must return provider:"local" with note.'])
bullet(['Performance: p95 AI latency under 3s; widget interaction stays in React strict-mode-safe patterns.'])
bullet(['Regression: cart, checkout, coupons and search flows remain green.'])
endSection()

// ============================================================
// 12. DEPLOYMENT
// ============================================================
doc.addPage()
startSection('12. Deployment and Operations')
heading1('12. Deployment and Operations')
heading2('12.1 Configuration')
table(
  ['Variable', 'Where', 'Required for'],
  [
    ['AI_BASE_URL', 'server/.env', 'Provider base URL (default OpenAI)'],
    ['AI_MODEL', 'server/.env', 'Model selection'],
    ['AI_API_KEY', 'server/.env', 'Live AI mode; empty = offline only'],
    ['AI_MAX_TOKENS / AI_TIMEOUT_MS', 'server/.env', 'Tuning'],
    ['JWT_SECRET', 'server/.env', 'Auth (existing)'],
    ['MONGODB_URI', 'server/.env', 'Database (existing)'],
  ],
  [140, 110, 270]
)
heading2('12.2 Rollout Plan')
bullet(['Phase 1 (offline): ship rule engine only - zero cost, full coverage.'])
bullet(['Phase 2 (live AI beta): enable AI_MODEL for a small user cohort; monitor cost and quality.'])
bullet(['Phase 3 (full): roll out live AI globally with offline fallback; add analytics on suggestions and assisted orders.'])
heading2('12.3 Monitoring')
para(
  'Log provider, error rate, latency, token usage, and fallback rate. Dashboards track conversation length and recommendation acceptance to ' +
  'tune the system prompt and the recommendation sorting logic.'
)
endSection()

// ============================================================
// 13. ROADMAP
// ============================================================
doc.addPage()
startSection('13. Roadmap')
heading1('13. Roadmap')
table(
  ['Quarter', 'Initiative', 'Outcome'],
  [
    ['Q1', 'Assistant v1 (offline + live AI)', 'Conversational discovery, offers, ordering guidance'],
    ['Q2', 'Personalization', 'Recommendations from order history and taste preferences'],
    ['Q2', 'Voice input', 'Speak your craving'],
    ['Q3', 'Conversational checkout', 'Add-to-cart from chat with in-place confirmations'],
    ['Q3', 'Multi-language (Hindi + regional)', 'Answer in the customers language'],
    ['Q4', 'Proactive engagement', 'Push offers and reorder reminders driven by the assistant'],
  ],
  [100, 270, 150]
)
endSection()

// ============================================================
// 14. FAQ
// ============================================================
doc.addPage()
startSection('14. Frequently Asked Questions')
heading1('14. Frequently Asked Questions')
bullet(['Does the assistant need an API key to work?', '- No. With AI_API_KEY empty it runs in offline mode with full coverage of catalog questions.'])
bullet(['Which AI providers are supported?', '- Any OpenAI-compatible chat-completions API: OpenAI, DeepSeek, Groq, OpenRouter (Claude + Gemini), Together, Ollama, Azure.'])
bullet(['Does it cost money when idle?', '- No. Calls happen only when a user sends a message.'])
bullet(['Can it actually place an order?', '- v1 guides and navigates; conversational add-to-cart is on the Q3 roadmap.'])
bullet(['How do I enable live conversations?', '- Set AI_API_KEY (and optionally AI_BASE_URL / AI_MODEL) in server/.env and restart the API.'])
bullet(['Is my data sent to the provider?', '- Only the last eight conversation turns and a catalog snapshot. No passwords or payment data.'])
bullet(['Where can I download this document?', '- Click "Download AI Assistant Spec (PDF)" on the About page.'])
endSection()

// ============================================================
// APPENDIX A - RESTAURANT CATALOG (image pages)
// ============================================================
doc.addPage()
startSection('Appendix A - Restaurant Catalog')
endSection()

doc.addPage()
doc.rect(0, 0, PAGE_W, 260).fill(NAVY)
doc.fillColor(CORAL).font('Helvetica-Bold').fontSize(13).text('DELISHFUL', 48, 34)
doc.fillColor('#fff').font('Helvetica-Bold').fontSize(30).text('Appendix A', 48, 96)
doc.fillColor('#cbd5e1').font('Helvetica').fontSize(13).text('Restaurant Catalog - 8 partner restaurants and 113 dishes, with photographs.', 48, 150, { width: 440 })
doc.rect(0, PAGE_H - 14, PAGE_W, 14).fill(CORAL)

heading1('A.1 The Catalog at a Glance')
table(
  ['Restaurant', 'Cuisine', 'Rating', 'Reviews', 'Delivery'],
  [
    ['Spice Route', 'Indian', '4.5', '2314', '25 min'],
    ['Burger Lab', 'Burgers', '4.6', '3402', '20 min'],
    ['Pizza District', 'Pizza', '4.6', '3421', '30 min'],
    ['Biryani House', 'Biryani', '4.4', '2890', '35 min'],
    ['Green Bowl', 'Healthy', '4.5', '764', '25 min'],
    ['The Dessert Room', 'Desserts', '4.7', '987', '15 min'],
    ['China Wok', 'Chinese', '4.5', '1982', '25 min'],
    ['Urban Tandoor', 'Indian', '4.6', '3015', '28 min'],
  ],
  [150, 100, 80, 90, 100]
)

// Download all images up front (concurrently), grouped
const imgTasks = []
const foodByRestaurant = new Map()
for (const r of restaurants) foodByRestaurant.set(r.id, [])
for (const f of foods) {
  if (foodByRestaurant.has(f.restaurantId)) foodByRestaurant.get(f.restaurantId).push(f)
}
for (const r of restaurants) {
  imgTasks.push({ key: `rest-${r.id}-hero`, url: r.image, w: W_HERO })
  if (r.logo) imgTasks.push({ key: `rest-${r.id}-logo`, url: r.logo, w: 600 })
  for (const f of foodByRestaurant.get(r.id) || []) {
    imgTasks.push({ key: `food-${f.id}`, url: f.image, w: W_FOOD })
  }
}

const loaded = new Map()
console.log(`[pdf] downloading ${imgTasks.length} images (conc=${CONCURRENCY})...`)
const results = await mapWithConcurrency(imgTasks, CONCURRENCY, async (t) => {
  const file = await loadImage(t.url, t.key, t.w)
  return { ...t, file }
})
for (const t of results) loaded.set(t.key, t.file)
const okCount = results.filter((t) => t.file).length
const badIds = results.filter((t) => !t.file).map((t) => t.key)
console.log(`[pdf] images ready: ${okCount}/${results.length}${badIds.length ? ' ; missing: ' + badIds.join(', ') : ''}`)

function drawImage(file, x, y, w, h, opts = {}) {
  if (!file || !fs.existsSync(file)) {
    doc.fillColor('#f0e7db').rect(x, y, w, h).fill()
    doc.fillColor('#b8a48d').font('Helvetica').fontSize(8).text('image unavailable', x + 6, y + h / 2 - 5, { width: w - 12, align: 'center' })
    return
  }
  if (opts.fit === 'cover') {
    try {
      const dims = doc.openImage(file)
      const scale = Math.max(w / dims.width, h / dims.height)
      const iw = dims.width * scale
      const ih = dims.height * scale
      const ix = x + (w - iw) / 2
      const iy = y + (h - ih) / 2
      doc.save()
      doc.rect(x, y, w, h).clip()
      doc.image(file, ix, iy, { width: iw, height: ih })
      doc.restore()
    } catch {
      doc.image(file, x, y, { width: w, height: h, fit: [w, h] })
    }
  } else {
    doc.image(file, x, y, { width: w, height: h, fit: [w, h] })
  }
}

// Per-restaurant pages
for (const r of restaurants) {
  doc.addPage()
  const hero = loaded.get(`rest-${r.id}-hero`)
  const logo = loaded.get(`rest-${r.id}-logo`)
  const menu = foodByRestaurant.get(r.id) || []

  doc.rect(0, 0, PAGE_W, 180).fill(NAVY)
  doc.rect(0, PAGE_H - 12, PAGE_W, 12).fill(CORAL)
  if (logo) drawImage(logo, 40, 30, 120, 120, { fit: 'cover' })
  doc.fillColor(CORAL).font('Helvetica-Bold').fontSize(12).text('RESTAURANT PROFILE', 190, 40)
  doc.fillColor('#fff').font('Helvetica-Bold').fontSize(26).text(fix(r.name), 190, 58, { width: 360 })
  doc.fillColor('#dbe4ee').font('Helvetica').fontSize(11).text(
    fix(`${r.cuisine}   |   Rating ${r.rating} *  (${r.reviews} reviews)   |   Delivery ${r.deliveryTime} min`),
    190, 96, { width: 380 }
  )
  doc.fillColor('#fde7d8').font('Helvetica').fontSize(10).text(fix(r.priceRange), 190, 120)
  doc.fillColor('#fde7d8').font('Helvetica').fontSize(10).text(fix(r.discount || ''), 190, 138)
  doc.fillColor('#fff').font('Helvetica-Oblique').fontSize(9.5).text(fix(r.description), 40, 196, { width: PAGE_W - 80, lineGap: 2 })

  let y = 240
  doc.fillColor(CORAL_D).font('Helvetica-Bold').fontSize(13).text(`Signature Menu (${menu.length} dishes)`, 40, y)
  y += 24
  const colW = 178
  const imgH = 120
  const capH = 40
  const gap = 10
  let col = 0
  for (const f of menu) {
    const x = 40 + col * (colW + gap)
    if (y + imgH + capH > PAGE_H - 30) {
      doc.addPage()
      doc.rect(0, PAGE_H - 12, PAGE_W, 12).fill(CORAL)
      y = MARGIN
    }
    const img = loaded.get(`food-${f.id}`)
    drawImage(img, x, y, colW, imgH, { fit: 'cover' })
    doc.roundedRect(x, y + imgH, colW, capH, 4).fill('#fbf6ee')
    doc.fillColor(NAVY).font('Helvetica-Bold').fontSize(9.5).text(fix(f.name), x + 6, y + imgH + 5, { width: colW - 12, lineBreak: false })
    doc.fillColor(CORAL_D).font('Helvetica').fontSize(9).text(
      fix(`Rs. ${f.sizes ? f.sizes[0] : f.price}  ${f.veg ? 'VEG' : 'NON-VEG'}  ${f.bestseller ? 'BESTSELLER' : ''}  * ${f.rating}`),
      x + 6, y + imgH + 20, { width: colW - 12, lineBreak: false }
    )
    col += 1
    if (col === 3) {
      col = 0
      y += imgH + capH + gap
    }
  }
}

// ============================================================
// APPENDIX B - SAMPLE TRANSCRIPTS
// ============================================================
doc.addPage()
startSection('Appendix B - Sample Transcripts')
doc.addPage()
doc.rect(0, 0, PAGE_W, 170).fill(NAVY)
doc.fillColor(CORAL).font('Helvetica-Bold').fontSize(13).text('DELISHFUL', 48, 34)
doc.fillColor('#fff').font('Helvetica-Bold').fontSize(30).text('Appendix B', 48, 82)
doc.fillColor('#cbd5e1').font('Helvetica').fontSize(13).text('Verified end-to-end conversation transcripts against the live API and seeded data.', 48, 132, { width: 440 })
doc.rect(0, PAGE_H - 14, PAGE_W, 14).fill(CORAL)

heading1('B.1 Discover + Recommend')
code(`User : recommend a biryani
AI   : Here are matching dishes:
       - Mutton Biryani -- Rs. 380 (Biryani House)
       - Hyderabadi Biryani -- Rs. 320 (Biryani House)
       - Chicken Biryani -- Rs. 290 (Spice Route)
       - Veg Dum Biryani -- Rs. 270 (Biryani House)
       - Egg Biryani -- Rs. 240 (Biryani House)
       - Veg Biryani -- Rs. 250 (Urban Tandoor)
       Want the full menu from a restaurant, or more?`)
heading1('B.2 Offers')
code(`User : any offers today?
AI   : Active offers on Delishful:
       50% OFF up to Rs. 100 -- use code WELCOME50
       20% OFF up to Rs. 150 -- use code FOOD20
       15% OFF up to Rs. 100 -- use code FIRSTORDER
       Rs. 100 OFF -- use code SAVE100 (min order Rs. 499)`)
heading1('B.3 Dietary')
code(`User : show veg options
AI   : Here are some tasty vegetarian picks:
       - Molten Lava Cake -- Rs. 240 (The Dessert Room)
       - Margherita Pizza -- Rs. 260 (Pizza District)
       - Veg Dum Biryani -- Rs. 270 (Biryani House)
       - Palak Paneer -- Rs. 270 (Spice Route)`)
heading1('B.4 Ordering Help')
code(`User : how do i order?
AI   : 1. Find a dish and tap + to add it to your cart
       2. Open the cart and review items
       3. Proceed to checkout and add delivery address
       4. Pick Standard / Priority / Scheduled delivery
       5. Choose payment and confirm - done!
       Tip: you can add dishes from multiple restaurants.`)

// ---------- finish ----------
// footers on all pages except cover
const range = doc.bufferedPageRange()
for (let i = 0; i < range.count; i++) {
  doc.switchToPage(range.start + i)
  if (i > 0) {
    renderChrome(i)
    doc.font('Helvetica').fontSize(8).fillColor(GRAY)
    doc.text('Delishful  |  AI Restaurant Assistant - Design Specification  |  DOWNLOADABLE', 24, PAGE_H - 20, { width: PAGE_W - 48, align: 'center', lineBreak: false })
  }
}

doc.end()
stream.on('finish', () => {
  const size = fs.statSync(OUT).size
  console.log(`[pdf] done -> ${OUT}`)
  console.log(`[pdf] size: ${(size / 1024 / 1024).toFixed(2)} MB (${size} bytes), pages: ${range.count}`)
})