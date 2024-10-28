import express from "express";
import Task from "../models/taskModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/userModels.js";

const createTask = asyncHandler(async (req, res) => {
  console.log(`createTask()`);  
  console.log(`"req.user.username":`, req.user.username);
  try {
    const { title, description, status } = req.body; // Removed userId from here
    const user = req.user._id; // Assuming you are attaching the user ID to the request in a middleware

    // Create a new task
    const newTask = await Task.create({
      title,
      description,
      userId: user, // Save the user ID to userId field in the task
      status,
    });

    // Respond with the created task
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: "Error creating task", error });
    console.error(`"error.message":`, error.message);
  }
});

// Get all tasks
const getAllTasks = asyncHandler(async (req, res) => {
  console.log(`in getAllTasks() `);
  console.log(`"req.user.username":`, req.user.username);
  try {
    //if googleUser    
    if (req.user.googleId   === true) {
      console.log(`"req.user.googleId":`, req.user.googleId);
      // Find the user with the googleId and get their userId
      const user = await User.findOne({ googleId: req.user.googleId });
      console.log(`"user.username":`, user.username);
    }

    const tasks = await Task.find({ userId: req.user.id }); // Fetch tasks only for the logged-in user
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

const deleteTask = asyncHandler(async (req, res) => {
  console.log(`here in deleteTask() `);
  console.log(`task id to be deleted: ${req.params.id} `);
  console.log(`task name to be deleted: ${req.params.title} `);
  const { id } = req.params; // Extract task ID from URL parameters

  try {
    const task = await Task.findByIdAndDelete(id); // Find and delete the task

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
});

const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body; // Destructure all fields from the request body

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description, status }, // Update all three fields
      { new: true, runValidators: true } // Use runValidators to ensure validation rules are followed
    );

    if (!updatedTask) {
      return res.status(404).send({ message: "Task not found" });
    }

    res.send(updatedTask); // Return the updated task
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
});

export { getAllTasks, createTask, deleteTask, updateTask };
