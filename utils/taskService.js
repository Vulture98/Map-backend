import { client } from './redisClient.js';

// Function to add a task to Redis
const addTask = async (taskId, taskData) => {
    try {
        await client.set(taskId, JSON.stringify(taskData));
        console.log(`Task ${taskId} added successfully.`);
        return true;
    } catch (error) {
        console.error('Error adding task:', error);
        return false;
    }
};

// Function to get a task from Redis
const getTask = async (taskId) => {
    try {
        const taskData = await client.get(taskId);
        if (taskData) {
            return JSON.parse(taskData);
        }
        return null;
    } catch (error) {
        console.error('Error getting task:', error);
        return null;
    }
};

// Function to delete a task from Redis
const deleteTask = async (taskId) => {
    try {
        await client.del(taskId);
        console.log(`Task ${taskId} deleted successfully.`);
        return true;
    } catch (error) {
        console.error('Error deleting task:', error);
        return false;
    }
};

export { addTask, getTask, deleteTask };
