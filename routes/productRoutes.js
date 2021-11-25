const express = require("express")();

const {authenticateUser,authenticatePermission} = require('../middleware/authentication')

const {
  createProducts,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../controllers/productController");

const {getSingleProductReviews} = require('../controllers/reviewController')

express.get('/',getAllProduct);
express.post('/',authenticateUser,authenticatePermission('admin'),createProducts);
express.post('/uploadimage',authenticateUser,authenticatePermission('admin'),uploadImage);

express.get('/:id',getSingleProduct);
express.delete('/:id',authenticateUser,authenticatePermission('admin'),deleteProduct);
express.patch('/:id',authenticateUser,authenticatePermission('admin'),updateProduct);
express.get('/:id/reviews',getSingleProductReviews);



module.exports = express;
