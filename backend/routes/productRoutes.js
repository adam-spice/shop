import express from 'express'
import HttpError from '../models/http-error.js'

import Product from '../models/productModel.js'

const router = express.Router()

/**
 * @desc    Fetch all products
 * @route   GET /api/products
 * @access  Public
 **/
router.get('/', async (req, res) => {
  let products
  try {
    products = await Product.find({})
  } catch (error) {
    return next(
      new HttpError('Fetching users failed, please try again later', 500),
    )
  }

  return res.status(200).json({
    products: products.map((product) => product.toObject({ getters: true })),
  })
})

/**
 * @desc    Fetch single products
 * @route   GET /api/products/:id
 * @access  Public
 **/
router.get('/:id', async (req, res, next) => {
  const productId = req.params.id

  let product
  try {
    product = await Product.findById(productId)
  } catch (error) {
    return next(
      new HttpError('Could not find a product for the provided id.', 404),
    )
  }

  return res.status(200).json({ product: product.toObject({ getters: true }) })
})

export default router
