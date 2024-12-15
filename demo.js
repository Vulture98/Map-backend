import { addTask, getTask, deleteTask } from './utils/taskService.js';
import { client } from './utils/redisClient.js';

const runDemo = async () => {
    try {
        // Connect to Redis
        await client.connect();
        console.log('Connected to Redis successfully!');

        // Example 1: Adding tasks
        const tasks = [
            { id: 'user1:task1', data: { title: 'Complete Redis Tutorial', priority: 'high', completed: false } },
            { id: 'user1:task2', data: { title: 'Implement Task Manager', priority: 'medium', completed: false } },
            { id: 'user2:task1', data: { title: 'Review Code', priority: 'low', completed: true } }
        ];

        // Add all tasks
        console.log('\n--- Adding Tasks ---');
        for (const task of tasks) {
            await addTask(task.id, task.data);
        }

        // Retrieve all tasks
        console.log('\n--- Retrieving Tasks ---');
        for (const task of tasks) {
            const retrievedTask = await getTask(task.id);
            console.log(`Task ${task.id}:`, retrievedTask);
        }

        // Delete a specific task
        console.log('\n--- Deleting Task ---');
        const taskToDelete = 'user1:task1';
        await deleteTask(taskToDelete);

        // Try to retrieve the deleted task
        console.log('\n--- Verifying Deletion ---');
        const deletedTask = await getTask(taskToDelete);
        console.log(`Deleted task ${taskToDelete} retrieval result:`, deletedTask);

        // Cleanup and close connection
        await client.quit();
        console.log('\nRedis connection closed successfully!');
    } catch (error) {
        console.error('Error in demo:', error);
        await client.quit();
    }
};

// Run the demo
runDemo();