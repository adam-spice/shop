import HttpError from '../models/http-error.js'
import User from '../models/userModel.js'

/**
 * @desc    Auth user & get token
 * @route   POST /api/user/login
 * @access  Public
 **/
export const authUser = async (req, res, next) => {
  const { email, password } = req.body
  console.log('password', password)
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
    isValidPassword = existingUser.matchPassword(password)
  } catch (error) {
    return next(new HttpError('Invalid credentials, could not log you in', 500))
  }

  if (!isValidPassword) {
    return next(new HttpError('Invalid credentials, could not log you in', 403))
  }

  return res.status(200).json({
    userId: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
    isAdmin: existingUser.isAdmin,
    token: null,
  })
}
