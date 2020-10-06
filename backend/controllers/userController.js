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
    createdUser = await User.create({
      name,
      email,
      password,
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
  const user = await User.findById(req.user._id)

  if (user) {
    return res.status(200).json({
      userId: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    return next(new HttpError('Unable to find a user with this id', 404))
  }
}

/**
 * @desc    Update user profile
 * @route   PUT /api/user/profile
 * @access  Private
 **/
export const updateUserProfile = async (req, res, next) => {
  const { name, email, password } = req.body
  const user = await User.findById(req.user._id)
  if (user) {
    user.name = name || user.name
    user.email = email || user.email
    if (password) {
      user.password = password || user.password
    }

    let token
    try {
      token = generateToken(user._id)
    } catch (error) {
      return next(
        new HttpError(
          'Generating a token failed, please try again later.',
          500,
        ),
      )
    }
    let updatedUser
    try {
      updatedUser = await user.save()
    } catch (error) {
      console.log('error :>> ', error)
    }
    return res.status(200).json({
      userId: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: token,
    })
  } else {
    return next(new HttpError('Unable to find a user with this id', 404))
  }
}

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
 **/
export const getUsers = async (req, res, next) => {
  let users
  try {
    users = await User.find({})
  } catch (error) {
    return next(new HttpError('Something went wrong there', 500))
  }

  return res.status(200).json(users)
}
