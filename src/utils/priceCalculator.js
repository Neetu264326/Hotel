export const calculateItemPrice = (food, size, addOns) => {
  const sizeIndex = food.sizes ? Math.max(0, size) : 0
  const base = food.sizes ? food.sizes[sizeIndex] : food.price
  const addOnTotal = (addOns || []).reduce((sum, a) => sum + a.price, 0)
  return base + addOnTotal
}

export const calculateSubtotal = (items) => {
  return items.reduce((sum, item) => sum + item.lineTotal, 0)
}

export const calculateTax = (subtotal, rate = 0.05) => {
  return Math.round(subtotal * rate)
}

export const formatPrice = (value) => {
  return '₹' + value.toFixed(0)
}
