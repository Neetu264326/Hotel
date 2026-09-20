export const generateOrderId = () => {
  const prefix = "FD";
  const number = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}${number}`;
};

export const generateTransactionId = () => {
  const prefix = "TXN";
  const number = Math.floor(1000000 + Math.random() * 9000000);
  return `${prefix}${number}`;
};

export const generateDeliveryPartner = () => {
  const partners = [
    { name: "Rahul K.", rating: 4.8, vehicle: "Bike" },
    { name: "Amit S.", rating: 4.7, vehicle: "Scooter" },
    { name: "Priya M.", rating: 4.9, vehicle: "Bike" },
    { name: "Vikram R.", rating: 4.6, vehicle: "Bicycle" },
  ];
  return partners[Math.floor(Math.random() * partners.length)];
};

export const getEstimatedDelivery = (deliveryOption) => {
  switch (deliveryOption) {
    case "priority":
      return { min: 20, max: 25, text: "20-25 minutes" };
    case "scheduled":
      return { min: 45, max: 60, text: "Scheduled delivery" };
    default:
      return { min: 30, max: 40, text: "30-40 minutes" };
  }
};
