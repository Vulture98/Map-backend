import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import {
  createTask,
  getAllTasks,
  deleteTask,
  updateTask,
} from "../controllers/taskController.js";

const routerTask = express.Router();
//tasks
routerTask
  .route("/")
  .get(authenticate, getAllTasks) // Add authentication to get all tasks
  // .post(authenticate, createTask); // Add authentication to create a task
  // .post(createTask); // Add authentication to create a task
  .post(authenticate, createTask); // Add authentication to create a task
routerTask.route("/:id").put(authenticate, updateTask); // You may implement updateTask later

// New route for deleting a task by ID
routerTask
  .route("/:id") // This route will handle deleting a task
  .delete(authenticate, deleteTask); // Add authentication

export { routerTask };
