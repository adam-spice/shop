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
    totalPrice
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
    totalPrice
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
    order = await Order.findById(id).populate('user', 'name email')
  } catch (error) {
    return next(
      new HttpError('Could not find an order for the provided id.', 404)
    )
  }

  return res.status(200).json(order)
}

/**
 * @desc    Update order to Paid
 * @route   PUT /api/orders/:id/pay
 * @access  Private
 **/
export const updateOrderToPaid = async (req, res, next) => {
  const { orderId } = req.params
  const {
    id,
    status,
    update_time,
    payer: { email_address }
  } = req.body
  let order
  try {
    order = await Order.findById(orderId)
  } catch (error) {
    return next(
      new HttpError('Could not find an order for the provided id.', 404)
    )
  }

  order.isPaid = true
  order.paidAt = Date.now()
  order.paymentResult = {
    id,
    status,
    update_time,
    email_address
  }

  let updatedOrder
  try {
    updatedOrder = await order.save()
  } catch (error) {
    return next(new HttpError('Unable to update order', 500))
  }

  return res.status(200).json(updatedOrder)
}

/**
 * @desc    Get logged in user orders
 * @route   GET /api/orders/myorders
 * @access  Private
 **/
export const getMyOrders = async (req, res, next) => {
  let orders
  try {
    orders = await Order.find({ user: req.user._id })
  } catch (error) {
    return next(
      new HttpError('Could not find any orders for the provided id.', 404)
    )
  }

  return res.status(200).json(orders)
}
