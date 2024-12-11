import express from "express";
import { getAllUsers, updateUserRole, getTaskStats, getAllTasks, updateUserStatus, toggleSuspendall } from "../controllers/adminController.js";
import { authenticate, authorizeAdmin, verifyAdmin } from "../middlewares/authMiddleware.js";
import { loginUser, logoutCurrentUser, updateUser } from "../controllers/userController.js";

const router = express.Router();

// from app.use("/api/admin", adminRoutes);
router.post("/login", loginUser);
router.post("/logout", logoutCurrentUser);

// Protect all admin routes with authenticate and authorizeAdmin middleware
router.use(authenticate, authorizeAdmin);
router.get("/verify", verifyAdmin); //for protected route in front-end

// User management routes
router.get("/users", getAllUsers);
router.patch("/users/:userId/role", updateUserRole);
router.put("/users/toggleSuspension/:userId", updateUserStatus);   //api/admin/users/toggleSuspenion/${id}
router.put("/users/toggleSuspendAll", toggleSuspendall);

// router.delete("/users/:userId", deleteUser);

// Task management routes
router.get("/tasks", getAllTasks);
router.get("/tasks/stats", getTaskStats);

export default router;