import User from "../models/userModels.js";
import Task from "../models/taskModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// Get all users
export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password field
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});

// Update user role (make admin/remove admin)
export const updateUserRole = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const { isAdmin } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isAdmin },
      { new: true, select: "-password" }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user role", error: error.message });
  }
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  try {
    // console.log(`inside updateUserStatus()`);

    const { userId } = req.params;
    const { status } = req.body;

    // console.log(`"userId":`, userId);
    // console.log(`status:`, status);

    if (!userId) {
      // console.log(`err 1 `);
      return res.status(400).send({ message: "User ID and status are required" });
    }
    const user = await User.findById(userId);
    if (user.isAdmin) {
      // console.log(`ur trying to suspend an admin`);
      return res.status(404).json({ message: "u lack permission to suspend an Admin" });
    }

    // console.log(`going into updating status `);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isSuspended: status },
      { new: true, runValidators: true }
    );
    // console.log(`successfully updated user status  email: ${updatedUser.email} to status: ${updatedUser.isSuspended}`);

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    return res.send(updatedUser);
  } catch (error) {
    // console.error(error);
    return res.status(500).send({ message: "Server error" });
  }
});

export const toggleSuspendall = asyncHandler(async (req, res) => {
  try {
    // console.log(`inside toggleSuspendall()`);
    const { status } = req.body;
    // console.log(`"status":`, status);

    const updatedUsers = await User.updateMany(
      { isAdmin: { $ne: true } }, // Exclude users with isAdmin: true
      { isSuspended: status },
      { new: true, runValidators: true }
    );
    // console.log(`"updatedUsers":`, updatedUsers);
    return res.status(200).json(updatedUsers);

  } catch (error) {
    // console.error(error.message); // Log error message

  }
}); //toggleSuspendall

// Get task statistics
export const getTaskStats = asyncHandler(async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();

    // Get tasks by status
    const tasksByStatus = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Get tasks by user with username
    const tasksByUser = await Task.aggregate([
      {
        $group: {
          _id: "$userId",
          totalTasks: { $sum: 1 },
          todoTasks: {
            $sum: { $cond: [{ $eq: ["$status", "todo"] }, 1, 0] }
          },
          inProgressTasks: {
            $sum: { $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0] }
          },
          doneTasks: {
            $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      {
        $project: {
          _id: 1,
          totalTasks: 1,
          todoTasks: 1,
          inProgressTasks: 1,
          doneTasks: 1,
          username: { $arrayElemAt: ["$userInfo.username", 0] },
          email: { $arrayElemAt: ["$userInfo.email", 0] }
        }
      }
    ]);

    res.status(200).json({
      totalTasks,
      tasksByStatus,
      tasksByUser,
      timeStamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching task statistics", error: error.message });
  }
});

// Get all tasks (admin view)
export const getAllTasks = asyncHandler(async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("userId", "username email")
      .sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error: error.message });
  }
});