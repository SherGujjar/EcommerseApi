const express = require("express")();

const {
  authenticateUser,
  authenticatePermission,
} = require("../middleware/authentication");

const {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
} = require("../controllers/orderController");

express.get('/',authenticateUser,authenticatePermission('admin'),getAllOrders);

express.post('/',authenticateUser,createOrder);

express.get('/showAllMyOrders',authenticateUser,getCurrentUserOrders);

express.get('/:id',authenticateUser,getSingleOrder);
express.patch('/:id',authenticateUser,updateOrder);


module.exports = express;

