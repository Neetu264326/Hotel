export const validateAddress = (address) => {
  const errors = {};

  if (!address.fullName?.trim()) errors.fullName = "Full name is required";
  if (!address.phone?.trim()) errors.phone = "Phone number is required";
  else if (!/^\d{10}$/.test(address.phone.replace(/\s/g, "")))
    errors.phone = "Enter a valid 10-digit phone number";
  if (!address.house?.trim()) errors.house = "House/Flat number is required";
  if (!address.street?.trim()) errors.street = "Street address is required";
  if (!address.city?.trim()) errors.city = "City is required";
  if (!address.state?.trim()) errors.state = "State is required";
  if (!address.pincode?.trim()) errors.pincode = "Pincode is required";
  else if (!/^\d{6}$/.test(address.pincode))
    errors.pincode = "Enter a valid 6-digit pincode";

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validatePayment = (paymentMethod, paymentData) => {
  const errors = {};

  if (paymentMethod === "card") {
    if (!paymentData.cardName?.trim()) errors.cardName = "Cardholder name is required";
    if (!paymentData.cardNumber?.trim()) errors.cardNumber = "Card number is required";
    else if (paymentData.cardNumber.replace(/\s/g, "").length < 16)
      errors.cardNumber = "Enter a valid 16-digit card number";
    if (!paymentData.expiry?.trim()) errors.expiry = "Expiry date is required";
    else if (!/^\d{2}\/\d{2}$/.test(paymentData.expiry))
      errors.expiry = "Enter a valid MM/YY format";
    if (!paymentData.cvv?.trim()) errors.cvv = "CVV is required";
    else if (paymentData.cvv.length < 3) errors.cvv = "Enter a valid CVV";
  }

  if (paymentMethod === "upi") {
    if (!paymentData.upiId?.trim()) errors.upiId = "UPI ID is required";
    else if (!/^[\w.-]+@[\w]+$/.test(paymentData.upiId))
      errors.upiId = "Enter a valid UPI ID (e.g., name@upi)";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
