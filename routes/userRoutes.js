import express from "express";
import {
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUser,
  loginUser,
  logoutCurrentUser,
  createUser,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  updateUserById,
} from "../controllers/userController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(createUser)
  .get(authenticate, authorizeAdmin, getAllUsers);
// this is confused with /profile
// router.route("/:id").get(getUserById).delete(deleteUser).put(updateUser);
router.post("/auth", loginUser);
router.post("/logout", logoutCurrentUser);

// user stuff
router
  .route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateCurrentUserProfile);

// admin routes
router
  .route("/:id")
  .delete(authenticate, authorizeAdmin, deleteUserById)
  .get(authenticate, authorizeAdmin, getUserById)
  .put(authenticate, authorizeAdmin, updateUserById);

export default router;
