import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import connectDB from './config/db.js'
import httpLogger from './middleware/http-logger.js'
import logger from './util/logger.js'

import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import HttpError from './models/http-error.js'

dotenv.config()

connectDB()

const app = express()

// parse json body
app.use(express.json())

app.use(httpLogger)

app.get('/', (req, res) => {
  res.send('API is running')
})

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)

// handle not found routes
app.use((req, res, next) => {
  throw new HttpError('Could not find this route.', 404)
})

// delete uploaded file if creating item fails
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error)
  }

  return res
    .status(error.code || 500)
    .json({ message: error.message || 'An unknown error occurred' })
})

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold,
  ),
)
