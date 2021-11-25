const Order = require("../models/order");

const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");

const { checkPermission } = require("../utils");

const Product = require("../models/product");

const getAllOrders = async (req, res) => {
  const order = await Order.find({});
  res.status(StatusCodes.OK).json({ order });
};

const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new CustomError.NotFoundError(`No order with id ${orderId}`);
  }

  checkPermission(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
  const order = await Order.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ order, count: order.length });
};

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = "someRandomValue";
  return { client_secret, amount };
};

const createOrder = async (req, res) => {
  const { items: orderItems, tax, shippingFee } = req.body;

  if (!orderItems || orderItems.length < 1) {
    throw new CustomError.BadRequestError("No cart item provided");
  }
 // console.log(cartItems)
  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError(
      "Please provide tax and shipping fee"
    );
  }

  let cartItems = [];
  let subtotal = 0;

  for (const item of orderItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new CustomError.NotFoundError(
        `No product with id: ${item.product}`
      );
    }
    const { name, price, image, _id } = dbProduct;

    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };
    // add item to order
    cartItems = [...cartItems, singleOrderItem];
    // calculate subtotal
    subtotal += item.amount * price;
  }
  //calculate total
  const total = tax + shippingFee + subtotal;
  //get client secret
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "usd",
  });
//   console.log(cartItems)
  const order = await Order.create({
    cartItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });
  res
    .status(StatusCodes.CREATED)
    .json({ order, clentSecret: order.clientSecret });
};

const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;

  const {paymentIntentId} = req.body;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new CustomError.NotFoundError(`No order with id ${orderId}`);
  }

  checkPermission(req.user, order.user);

  order.paymentIntentId = paymentIntentId
  order.status = 'paid';
  await order.save(); 
  res.status(StatusCodes.OK).json({ order });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
