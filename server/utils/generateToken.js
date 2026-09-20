import jwt from 'jsonwebtoken'

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'delishful_secret_key_change_this_in_production', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

export default generateToken