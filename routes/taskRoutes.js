import express from "express";
import {
  getAllTasks,
  createTask,
  deleteTask,
  updateTask,
  updateIndex,
} from "../controllers/taskController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const routerTask = express.Router();

// admin stuff
routerTask
  .route("/")
  .get(authenticate, getAllTasks)
  .post(authenticate, createTask);

routerTask.route("/:id").put(authenticate, updateTask); // You may implement updateTask later

routerTask
  .route("/:id") // This route will handle deleting a task
  .delete(authenticate, deleteTask); // Add authentication

routerTask
  .route("/index/:id")
  .put(authenticate, updateIndex); //

export default routerTask;
