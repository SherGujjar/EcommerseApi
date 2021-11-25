const express = require("express")();

const { authenticateUser } = require("../middleware/authentication");

const {
  createReviews,
  getAllReviews,
  getSingleReview,
  deleteReview,
  updateReview,
} = require("../controllers/reviewController");

express.post('/',authenticateUser,createReviews);

express.get('/',getAllReviews);

express.get('/:id',getSingleReview);

express.delete('/:id',authenticateUser,deleteReview);

express.patch('/:id',authenticateUser,updateReview);

module.exports = express;
