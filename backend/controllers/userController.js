import HttpError from '../models/http-error.js'
import User from '../models/userModel.js'
import {
  generatePassword,
  generateSalt,
} from '../util/generatePasswordAndSalt.js'
import generateToken from '../util/generateToken.js'

/**
 * @desc    Auth user & get token
 * @route   POST /api/user/login
 * @access  Public
 **/
export const authUser = async (req, res, next) => {
  const { email, password } = req.body

  let existingUser
  try {
    existingUser = await User.findOne({ email })
  } catch (error) {
    return next(
      new HttpError('Logging in failed, please try again later.', 500),
    )
  }

  if (!existingUser) {
    return next(new HttpError('Invalid credentials, could not log you in', 401))
  }

  let isValidPassword = false
  try {
    isValidPassword = await existingUser.matchPassword(password)
  } catch (error) {
    return next(new HttpError('Invalid credentials, could not log you in', 500))
  }

  if (!isValidPassword) {
    return next(new HttpError('Invalid credentials, could not log you in', 403))
  }

  let token
  try {
    token = await generateToken(existingUser._id)
  } catch (error) {
    return next(
      new HttpError('Signing up failed, please try again later.', 500),
    )
  }

  return res.status(200).json({
    userId: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
    isAdmin: existingUser.isAdmin,
    token: token,
  })
}

/**
 * @desc    Register a new user
 * @route   POST /api/users
 * @access  Public
 **/
export const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body

  let existingUser
  try {
    existingUser = await User.findOne({ email })
  } catch (error) {
    return next(
      new HttpError('Signing up failed, please try again later.', 500),
    )
  }

  if (existingUser)
    return next(
      new HttpError('User exists already, please login instead.', 422),
    )

  let createdUser
  try {
    const salt = await generateSalt()
    const generatedPassword = await generatePassword(password, salt)
    createdUser = await User.create({
      name,
      email,
      salt,
      password: generatedPassword,
    })
  } catch (error) {
    console.log('error :>> ', error)
    return next(new HttpError('Creating user failed, please try again', 500))
  }

  let token
  try {
    token = generateToken(createdUser._id)
  } catch (error) {
    return next(
      new HttpError('Signing up failed, please try again later.', 500),
    )
  }

  return res.status(200).json({
    userId: createdUser.id,
    name: createdUser.name,
    email: createdUser.email,
    isAdmin: createdUser.isAdmin,
    token: token,
  })
}

/**
 * @desc    Get user profile
 * @route   GET /api/user/profile
 * @access  Private
 **/
export const getUserProfile = async (req, res, next) => {
  let existingUser
  try {
    existingUser = await User.findOne(req.user)
  } catch (error) {
    return next(new HttpError('Unable to find a user with this id', 404))
  }

  const user = await User.findById(req.user._id)

  if (user) {
    return res.status(200).json({
      userId: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      isAdmin: existingUser.isAdmin,
    })
  } else {
    return next(new HttpError('Unable to find a user with this id', 404))
  }
}
