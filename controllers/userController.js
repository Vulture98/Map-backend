import User from "../models/userModels.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/createToken.js";

const createUser = asyncHandler(async (req, res) => {  
  const { username, email, password, isAdmin } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  
  const userExists = await User.findOne({ email });
  if (userExists) {
    console.log(`Email already exists `);
    return res.status(400).json({ message: "Email already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);  
  const newUser = await User.create({
    username: email,
    email,
    password: hashPassword,
    isAdmin,
  });

  try {
    await newUser.save();
    const token = generateToken(res, newUser._id);
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      // token: token,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({ message: "Invalid user data" }); // Respond with a clear error message
  }
});

const getAllUsers = asyncHandler(async (req, res) => {  
  const users = await User.find({});  
  console.log(`"users":`, users);
  res.status(200).json({
    count: users.length,
    data: users,
  });  
});

const getUserById = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  console.log(`user to check:`, userId);
  const existingUser = await User.findById(userId);
  if (!existingUser) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({
    _id: existingUser._id,
    username: existingUser.username,
    email: existingUser.email,
  });
});

const deleteUserById = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (user) {
    if (user.isAdmin) {
      // return res.send(400).json({ message: "cannot delete user" });
      res.status(404);
      throw new Error("Cannot delete admin user");
    }
    await User.findByIdAndDelete(userId);
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }

});

const updateUser = asyncHandler(async (req, res) => {
  console.log(`Hello from updateuser `);
  const userId = req.params.id;
  const { username, email, password, isAdmin } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if the new email already exists (excluding the current user)
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }
  }

  if (password) {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    user.password = hashPassword;
  }

  user.username = username;
  user.email = email;
  user.isAdmin = isAdmin;

  const updatedUser = await user.save();
  res.status(200).json(updatedUser);
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(`here in loginUser(): ${email} `);
  const existingUser = await User.findOne({ email });

  if (
    !existingUser ||
    !(await bcrypt.compare(password, existingUser.password))
  ) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const token = generateToken(res, existingUser._id);
  console.log(`"res.cookie-token":`, token);
  res.status(201).json({ message: `welcome ${existingUser.username}` });
  return;
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out" });
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  console.log(`Hello from getCurrentUserProfile()`);
  const CurrentUser = await User.findById(req.user._id);

  if (CurrentUser) {
    res.json({
      _id: CurrentUser._id,
      username: CurrentUser.username,
      email: CurrentUser.email,
      isAdmin: CurrentUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  console.log(`Hello from updateCurrentUserProfile()`);
  const user = await User.findById(req.user._id);
  console.log(`"updateUser":`, user);
  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      console.log(`"req.body.password":`, req.body.password);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.send(404);
    throw new Error("User not found");
  }
});

const updateUserById = asyncHandler(async (req, res) => {
  console.log(`Hello from updateuser `);
  const userId = req.params.id;
  const { username, email } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if the new email already exists (excluding the current user)
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }
  }

  user.username = username;
  user.email = email;

  const updatedUser = await user.save();
  res.status(200).json(updatedUser);
});

const verifyUser = asyncHandler(async (req, res) => {
  console.log(`Hello from verifyUser()`);

  res.status(200).json({ isAuthenticated: true, message: "User verified" });
});

export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUser,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  updateUserById,
  verifyUser,
};
