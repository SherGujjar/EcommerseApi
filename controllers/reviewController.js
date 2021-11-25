const Review = require("../models/review");
const User = require("../models/Users");

const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");

const { checkPermission } = require("../utils");

const Product = require("../models/product");

const createReviews = async (req, res) => {
  const { product: productId } = req.body;

  const isValidProduct = await Product.findOne({ _id: productId });

  if (!isValidProduct) {
    throw new CustomError.NotFoundError(
      `No product found with id : ${productId}`
    );
  }

  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });

  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      "Already submitted review for this product"
    );
  }

  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: "product",
    select: "name company price",
  });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.find({ _id: reviewId }).populate({
    path: "product",
    select: "name company price",
  });

  if (!review) {
    throw CustomError.NotFoundError(`No such review with this ${reviewId}`);
  }

  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const { id } = req.params;
  const { title, comment, rating } = req.body;
  const review = await Review.findOne({ _id: id });
  if (!review) {
    throw new CustomError.NotFoundError(
      `No such review exist with this id ${id}`
    );
  }

  checkPermission(req.user, review.user);
  review.rating = rating;
  review.comment = comment;
  review.title = title;
  await review.save();
  res.status(StatusCodes.OK).json({ msg: "Sucess ! Review Updated" });
};

const deleteReview = async (req, res) => {
  const { id } = req.params;
  console.log(id, " review id");
  const review = await Review.findOne({ _id: id });
  if (!review) {
    throw new CustomError.NotFoundError(
      `No such review exist with this id ${id}`
    );
  }

  checkPermission(req.user, review.user);
  await review.remove();
  res.status(StatusCodes.OK).json({ msg: "Sucess ! Review Deleted" });
};

const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

module.exports = {
  createReviews,
  getAllReviews,
  getSingleReview,
  deleteReview,
  updateReview,
  getSingleProductReviews
};
