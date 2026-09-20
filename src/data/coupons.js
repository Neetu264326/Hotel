export const coupons = [
  { code: 'WELCOME50', description: '₹50 OFF on your first order', type: 'flat', value: 50, minOrder: 0 },
  { code: 'FOOD20', description: '20% OFF up to ₹150', type: 'percent', value: 20, minOrder: 0, maxDiscount: 150 },
  { code: 'FIRSTORDER', description: '15% OFF up to ₹100', type: 'percent', value: 15, minOrder: 0, maxDiscount: 100 },
  { code: 'SAVE100', description: '₹100 OFF on orders above ₹499', type: 'flat', value: 100, minOrder: 499 },
]

export const addOns = [
  { name: 'Extra Cheese', price: 60 },
  { name: 'Extra Sauce', price: 30 },
  { name: 'Fries', price: 80 },
  { name: 'Beverage', price: 70 },
  { name: 'Extra Toppings', price: 50 },
  { name: 'Extra Spice', price: 20 },
]
