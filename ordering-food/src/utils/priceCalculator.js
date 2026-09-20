export const calculateItemTotal = (item) => {
  const basePrice = item.sizes?.find(s => s.name === item.selectedSize)?.price || item.price;
  const addOnsTotal = item.selectedAddOns?.reduce((sum, addon) => sum + addon.price, 0) || 0;
  return (basePrice + addOnsTotal) * item.quantity;
};

export const calculateCartTotal = (cartItems, deliveryFee = 30, couponDiscount = 0) => {
  const itemTotal = cartItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  const taxes = Math.round(itemTotal * 0.05);
  const total = itemTotal + deliveryFee + taxes - couponDiscount;

  return {
    itemTotal,
    deliveryFee,
    taxes,
    couponDiscount,
    total: Math.max(total, 0),
  };
};

export const formatPrice = (price) => {
  return `₹${price}`;
};
