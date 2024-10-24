import User from "../models/userModels.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";

const findUserById = asyncHandler(async (userId) => {
  return await User.findById(userId);
});

const checkExistingEmail = asyncHandler(async (email) => {
  return await User.findOne({ email });
});

const sendNotFound = asyncHandler(async (res) => {
  res.status(404).json({ message: "User not found" });
});

const hashPassword = asyncHandler(async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
});

const sendUserResponse = asyncHandler(async (res, user) => {
  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

const sendError = asyncHandler(async (res, status, message) => {
  res.status(status).json({ message });
});

export {
  findUserById,
  checkExistingEmail,
  sendNotFound,
  hashPassword,
  sendUserResponse,
  sendError,
};