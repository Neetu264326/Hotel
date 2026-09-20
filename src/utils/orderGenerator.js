export const generateOrderId = () => {
  return 'FD' + Math.floor(10000 + Math.random() * 90000).toString()
}

export const generateTransactionId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let id = 'TXN'
  for (let i = 0; i < 10; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

export const generateMockOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}
