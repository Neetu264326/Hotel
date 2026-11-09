import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Please provide name, email, phone and password' })
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' })
    }

    const user = await User.create({ name, email, phone, password })

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      addresses: user.addresses,
      token: generateToken(user._id),
    })
  } catch (error) {
    next(error)
  }
}

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      addresses: user.addresses,
      token: generateToken(user._id),
    })
  } catch (error) {
    next(error)
  }
}

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      addresses: user.addresses,
    })
  } catch (error) {
    next(error)
  }
}

export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (req.body.name) user.name = req.body.name
    if (req.body.phone) user.phone = req.body.phone
    if (req.body.email) user.email = req.body.email

    if (req.body.password) {
      user.password = req.body.password
    }

    if (req.body.addresses) {
      user.addresses = req.body.addresses
    }

    const updated = await user.save()
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      role: updated.role,
      addresses: updated.addresses,
    })
  } catch (error) {
    next(error)
  }
}
