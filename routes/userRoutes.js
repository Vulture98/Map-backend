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
  verifyUser,
} from "../controllers/userController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import { suspensionCheck } from "../middlewares/suspendMiddleware.js";

const router = express.Router();

// app.use("/api/users", router);

router.get("/verifyUser", authenticate, verifyUser);

router
  .route("/")
  .post(createUser)
  .get(authenticate, authorizeAdmin, getAllUsers);
  
  
router.use(suspensionCheck);
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
