const normalize = (s = '') => s.toLowerCase().trim()

const has = (text, ...words) => words.some((w) => text.includes(w))

const pick = (items, n = 5) => {
  const sorted = [...items].sort(
    (a, b) => (b.rating || 0) - (a.rating || 0) || Number(Boolean(b.bestseller)) - Number(Boolean(a.bestseller))
  )
  return sorted.slice(0, n)
}

const formatMoney = (val) => (Number.isFinite(val) ? `₹${val}` : '')

const line = (t, price, rest) => `• ${t}${price ? ` — ${formatMoney(price)}` : ''}${rest ? ` (${rest})` : ''}`

const buildContextRef = (restaurants, foods, coupons) => ({
  foods,
  restaurants,
  coupons,
})

const respond = (message, ctx) => {
  const u = normalize(message)

  if (has(u, 'hi', 'hello', 'hey', 'namaste')) {
    return `Hello! 👋 I'm the Delishful Assistant.\n\nI can help you:\n- Find restaurants & explore menus\n- Recommend top dishes\n- Compare prices & veg options\n- Find coupons & offers\n- Explain how ordering works\n\nTry asking: "recommend me something good" or "any offers today?"`
  }

  if (has(u, 'thank')) return `You're welcome! Happy to help. 🍽️`

  if (has(u, 'help', 'what can you do', 'how do you work', 'capabilities')) {
    return `Here's what I can do:\n- "Best restaurant near me" → top rated restaurants\n- "Recommend a pizza" → best pizzas with price & restaurant\n- "Show veg options" → vegetarian dishes\n- "Any offers or coupons?" → active deals\n- "How do I order?" → the ordering steps\n- "Budget meals under ₹200" → cheap tasty picks`
  }

  if (has(u, 'reservation', 'reserve', 'book a table', 'table booking', 'reservations')) {
    return `Delishful is primarily a food-delivery platform, so tables aren't booked here directly.\n\nYou can still:\n- Order from the restaurant's menu and have it delivered\n- Contact the restaurant through their page for reservation details\n\nWant me to pull up the menu for a restaurant to order instead?`
  }

  if (has(u, 'order', 'how to order', 'place order', 'checkout')) {
    return `Ordering on Delishful is easy:\n\n1. Find a dish you like and tap the ➕ to add it to your cart\n2. Open the cart and review your items\n3. Tap "Proceed to Checkout" and add your delivery address\n4. Pick a delivery option (Standard / Priority / Scheduled)\n5. Choose a payment method and confirm — done!\n\nTip: You can add dishes from multiple restaurants in one cart. And if you want, I can recommend something to start with.`
  }

  if (has(u, 'coupon', 'offer', 'discount', 'deal', 'promo', 'code', 'save')) {
    const coupons = ctx.coupons || []
    if (coupons.length === 0) {
      return `I don't see any active coupons right now. Check the Offers page for the latest deals!`
    }
    const head = `Here are the active offers on Delishful:\n\n`
    const rows = coupons.map((c) => {
      const typeText = c.type === 'flat' ? `₹${c.value} OFF` : `${c.value}% OFF${c.maxDiscount ? ` (up to ₹${c.maxDiscount})` : ''}`
      const min = c.minOrder ? `\nMin order: ₹${c.minOrder}` : ''
      return `${typeText} — use code ${c.code}${min}`
    })
    return head + rows.join('\n')
  }

  if (has(u, 'veg', 'vegetarian', 'pure veg', 'no meat')) {
    const veg = pick(ctx.foods.filter((f) => f.veg), 6)
    if (veg.length === 0) return `I couldn't find vegetarian dishes in the current data.`
    return `Here are some tasty vegetarian picks:\n\n${veg.map((f) => line(f.name, f.price || f.sizes?.[0], ctx.restaurants.find((r) => String(r.id) === String(f.restaurantId))?.name)).join('\n')}`
  }

  if (has(u, 'non veg', 'nonveg', 'meat', 'chicken', 'mutton', 'kebab')) {
    const meat = pick(ctx.foods.filter((f) => !f.veg), 6)
    if (meat.length === 0) return `I couldn't find non-vegetarian dishes in the current data.`
    return `Great, here are non-veg favourites:\n\n${meat.map((f) => line(f.name, f.price || f.sizes?.[0], ctx.restaurants.find((r) => String(r.id) === String(f.restaurantId))?.name)).join('\n')}`
  }

  if (has(u, 'under ') && has(u, '₹')) {
    const m = u.match(/under\s*₹?\s*(\d+)/)
    if (m) {
      const budget = Number(m[1])
      const within = pick(ctx.foods.filter((f) => (f.price || f.sizes?.[0] || 0) <= budget), 6)
      if (within.length === 0) return `I don't have dishes within ₹${budget} right now.`
      return `Budget picks under ₹${budget}:\n\n${within.map((f) => line(f.name, f.price || f.sizes?.[0], ctx.restaurants.find((r) => String(r.id) === String(f.restaurantId))?.name)).join('\n')}`
    }
  }

  if (has(u, 'cheap', 'budget', 'affordable', 'low price', 'inexpensive')) {
    const cheap = pick(ctx.foods.filter((f) => (f.price || f.sizes?.[0] || 999) <= 200), 6)
    if (cheap.length === 0) return `I couldn't find budget options under ₹200 in the data.`
    return `Affordable and tasty:\n\n${cheap.map((f) => line(f.name, f.price || f.sizes?.[0], ctx.restaurants.find((r) => String(r.id) === String(f.restaurantId))?.name)).join('\n')}`
  }

  const cuisineMatch = (list) => list.filter((f) =>
    [f.category, f.name].concat(f.ingredients || []).some((s) => u.includes(normalize(s)))
  )

  const CUISINE_HINTS = ['biryani', 'pizza', 'burger', 'paneer', 'chinese', 'noodles', 'dessert', 'cake', 'shake', 'wrap', 'curry', 'rice', 'salad', 'kebab', 'sandwich', 'pasta', 'tikka', 'tacos', 'pancake', 'toast', 'soup', 'falafel', 'smoothie', 'guilt-free']
  if (CUISINE_HINTS.some((k) => u.includes(k))) {
    const dishes = cuisineMatch(ctx.foods)
    const matches = pick(dishes, 6)
    if (matches.length > 0) {
      return `Here are matching dishes:\n\n${matches.map((f) => line(f.name, f.price || f.sizes?.[0], ctx.restaurants.find((r) => String(r.id) === String(f.restaurantId))?.name)).join('\n')}\n\nWant the full menu from a restaurant, or should I recommend more?`
    }
    const restMatch = ctx.restaurants.filter((r) => u.includes(normalize(r.cuisine)))
    if (restMatch.length > 0) {
      return `Here are restaurants serving that:\n\n${restMatch.map((r) => `• ${r.name} — ${r.cuisine} • ${r.rating}★ • ${r.deliveryTime}-${r.deliveryTime + 10} min`).join('\n')}`
    }
  }

  if (has(u, 'best', 'top rated', 'top-rated', 'highest rated', 'popular', 'trending', 'recommend', 'suggest', 'good', 'something nice', 'what should i eat', 'surprise')) {
    const top = pick(ctx.restaurants, 5)
    if (top.length === 0) return `I don't have restaurant data right now.`
    return `Here are the top-rated restaurants near you:\n\n${top.map((r) => `• ${r.name} — ${r.cuisine} • ${r.rating}★ (${r.reviews?.toLocaleString?.() || r.reviews} ratings) • ${r.deliveryTime}-${r.deliveryTime + 10} min`).join('\n')}\n\nWant a specific dish recommendation instead? Tell me a cuisine like "biryani" or "pizza".`
  }

  const namedRestaurant = ctx.restaurants.find((r) => u.includes(normalize(r.name)))
  if (namedRestaurant) {
    const menu = pick(ctx.foods.filter((f) => String(f.restaurantId) === String(namedRestaurant.id)), 6)
    return `${namedRestaurant.name} — ${namedRestaurant.cuisine} • ${namedRestaurant.rating}★\n${
      namedRestaurant.discount ? `Offer: ${namedRestaurant.discount}\n` : ''
    }${menu.length ? `\nPopular dishes:\n${menu.map((f) => line(f.name, f.price || f.sizes?.[0])).join('\n')}` : ''}`
  }

  return `I can help you discover restaurants, explore menus, get recommendations, find offers, and walk you through ordering.\n\nHere are a few things you can ask me:\n- "Recommend a biryani"\n- "Show veg options"\n- "Best restaurant"\n- "Any coupons?"\n- "How do I order?"\n\nWhat would you like to know? 🍽️`
}

export const askLocal = ({ message, restaurants = [], foods = [], coupons = [] }) => {
  const reply = respond(message, buildContextRef(restaurants, foods, coupons))
  return { reply, provider: 'local', model: 'delishful-rule-engine-v1' }
}