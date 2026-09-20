export const coupons = [
  {
    id: 1,
    code: "WELCOME50",
    description: "Flat ₹50 off on your first order",
    discountType: "flat",
    discountValue: 50,
    minOrder: 200,
    maxDiscount: 50,
    expiryDate: "2026-12-31",
    isActive: true,
    usageLimit: 1,
    color: "#FF6B35",
    icon: "gift",
  },
  {
    id: 2,
    code: "FOOD20",
    description: "20% off up to ₹100",
    discountType: "percentage",
    discountValue: 20,
    minOrder: 300,
    maxDiscount: 100,
    expiryDate: "2026-12-31",
    isActive: true,
    usageLimit: 3,
    color: "#22C55E",
    icon: "percent",
  },
  {
    id: 3,
    code: "FIRSTORDER",
    description: "15% off on first order",
    discountType: "percentage",
    discountValue: 15,
    minOrder: 150,
    maxDiscount: 75,
    expiryDate: "2026-12-31",
    isActive: true,
    usageLimit: 1,
    color: "#8B5CF6",
    icon: "star",
  },
  {
    id: 4,
    code: "SAVE100",
    description: "₹100 off on orders above ₹500",
    discountType: "flat",
    discountValue: 100,
    minOrder: 500,
    maxDiscount: 100,
    expiryDate: "2026-12-31",
    isActive: true,
    usageLimit: 2,
    color: "#FFC857",
    icon: "ticket",
  },
];

export const validateCoupon = (code, orderTotal) => {
  const coupon = coupons.find(
    (c) => c.code.toUpperCase() === code.toUpperCase() && c.isActive
  );

  if (!coupon) {
    return { valid: false, message: "Invalid coupon code" };
  }

  if (orderTotal < coupon.minOrder) {
    return {
      valid: false,
      message: `Minimum order of ₹${coupon.minOrder} required`,
    };
  }

  let discount = 0;
  if (coupon.discountType === "flat") {
    discount = coupon.discountValue;
  } else {
    discount = Math.min(
      Math.round((orderTotal * coupon.discountValue) / 100),
      coupon.maxDiscount
    );
  }

  return {
    valid: true,
    coupon,
    discount,
    message: `Coupon applied! You save ₹${discount}`,
  };
};
