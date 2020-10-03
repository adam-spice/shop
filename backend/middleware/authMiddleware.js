import jwt from 'jsonwebtoken'

import HttpError from '../models/http-error.js'
import User from '../models/userModel.js'

export const protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
      req.user = await User.findById(decoded.id).select('-password')
      next()
    } catch (error) {
      return next(new HttpError('Not authorized, invalid token', 401))
    }
  }

  if (!token) {
    return next(new HttpError('Not authorized, no token', 401))
  }
}
