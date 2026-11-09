const ALLERGEN_MAP = [
  { label: 'Dairy', keys: ['milk', 'butter', 'cream', 'cheese', 'paneer', 'curd', 'yogurt', 'yoghurt', 'ghee', 'mozzarella', 'mayonnaise'] },
  { label: 'Gluten', keys: ['wheat', 'flour', 'bread', 'naan', 'pasta', 'pizza', 'biscuit', 'maida', 'semolina', 'noodle', 'pancake'] },
  { label: 'Eggs', keys: ['egg', 'eggs', 'mayonnaise'] },
  { label: 'Tree Nuts', keys: ['almond', 'cashew', 'walnut', 'pistachio', 'hazelnut', 'pecan'] },
  { label: 'Peanuts', keys: ['peanut'] },
  { label: 'Soy', keys: ['soy', 'soya', 'tofu'] },
  { label: 'Shellfish', keys: ['prawn', 'shrimp', 'crab', 'lobster'] },
  { label: 'Fish', keys: ['fish', 'salmon', 'tuna', 'sardine'] },
  { label: 'Sesame', keys: ['sesame', 'til'] },
]

export const deriveAllergens = (ingredients = []) => {
  const text = ingredients.join(' ').toLowerCase()
  if (!text) return []
  return ALLERGEN_MAP.filter((entry) => entry.keys.some((key) => text.includes(key))).map((e) => e.label)
}

// Deterministic star distribution derived from the average rating.
export const ratingBreakdown = (rating) => {
  const r = Math.min(5, Math.max(0, Number(rating) || 0))
  const sigma = 1.15
  const stars = [5, 4, 3, 2, 1]
  const weights = stars.map((star) => Math.exp(-((star - r) ** 2) / (2 * sigma * sigma)))
  const total = weights.reduce((sum, w) => sum + w, 0)
  const raw = weights.map((w) => (w / total) * 100)
  const out = raw.map((v) => Math.floor(v))
  let remainder = 100 - out.reduce((sum, v) => sum + v, 0)
  const order = raw
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac)
  let k = 0
  while (remainder > 0) {
    out[order[k % order.length].i] += 1
    remainder -= 1
    k += 1
  }
  return stars.map((star, i) => ({ star, percent: out[i] }))
}
