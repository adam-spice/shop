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

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 **/
export const getOrderById = async (req, res, next) => {
  const { id } = req.params
  let order
  try {
    order = await Order.findById(id).populate('user', 'name')
  } catch (error) {
    return next(
      new HttpError('Could not find an order for the provided id.', 404),
    )
  }

  return res.status(200).json(order)
}
