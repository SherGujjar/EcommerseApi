const Users = require("../models/Users");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
const { createTokenUser, attachCookiesToResponse, checkPermission } = require("../utils/index");

const getAllUsers = async (req, res) => {
  const user = await Users.find({ role: "user" }).select("-password");
  //   console.log(user)

  res.status(StatusCodes.OK).json({ user });
};

const getSingleUser = async (req, res) => {
 
  const { id } = req.params;
  //  console.log(id);
  const user = await Users.findOne({ _id: id }).select("-password");
  if (!user) {
    throw new CustomError.BadRequestError(
      `No user exist with this ${req.params.id}`
    );
  }
  checkPermission(req.user,id)
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    throw new BadRequestError("Please provide all values");
  }

  const user = await Users.findOneAndUpdate(
    { _id: req.user.userId },
    { email, name },
    { new: true, runValidators: true }
  );

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Please provide both values");
  }
  const user = await Users.findOne({ _id: req.user.userId });

  const isPasswordCorrect = await user.comparePassword(oldPassword);

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  user.password = newPassword;
  try {
    await user.save();
  } catch (error) {
    console.log(error);
  }
  res.status(StatusCodes.OK).json({ msg: "Password Updated" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
