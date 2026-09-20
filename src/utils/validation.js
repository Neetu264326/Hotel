export const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone)

export const normalizePhone = (phone) => {
  if (!phone) return ''
  let digits = String(phone).replace(/[^\d]/g, '')
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2)
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1)
  return digits
}

export const isIndianMobile = (phone) => {
  const digits = normalizePhone(phone)
  return /^[6-9]\d{9}$/.test(digits)
}

export const validateAddress = (form) => {
  const errors = {}
  if (!form.fullName || form.fullName.trim().length < 3) {
    errors.fullName = 'Please enter your full name'
  }
  if (!isIndianMobile(form.phone)) {
    errors.phone = 'Enter a valid 10-digit mobile number'
  }
  if (!form.house || form.house.trim().length < 2) {
    errors.house = 'Enter house / flat / building'
  }
  if (!form.street || form.street.trim().length < 3) {
    errors.street = 'Enter street / area / locality'
  }
  if (!form.city || form.city.trim().length < 2) {
    errors.city = 'Enter your city'
  }
  if (!form.state || form.state.trim().length < 2) {
    errors.state = 'Enter your state'
  }
  if (!form.pincode || !/^\d{6}$/.test(form.pincode)) {
    errors.pincode = 'Enter a valid 6-digit pincode'
  }
  return errors
}

export const validateUPI = (upiId) => {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z]{2,}$/.test(upiId)
}

export const validateCardNumber = (number) => {
  const cleaned = number.replace(/\s/g, '')
  return /^\d{16}$/.test(cleaned)
}

export const validateCardExpiry = (expiry) => {
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return false
  const [mm, yy] = expiry.split('/').map(Number)
  const now = new Date()
  const year = 2000 + yy
  const month = mm - 1
  if (month < 0 || month > 11) return false
  const expDate = new Date(year, month, 1)
  const curDate = new Date(now.getFullYear(), now.getMonth(), 1)
  return expDate >= curDate
}

export const validateCVV = (cvv) => /^\d{3,4}$/.test(cvv)
