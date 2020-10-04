import HttpError from '../models/http-error.js'
import Order from '../models/orderModel.js'

/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Private
 **/
export const addOrderItems = async (req, res, next) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body

  if (orderItems && orderItems.length === 0) {
    return next(new HttpError('No order items', 400))
  }

  const order = new Order({
    orderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  })

  const createdOrder = await order.save()

  return res.status(201).json(createdOrder)
}
