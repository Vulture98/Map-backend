'use strict';

import redis from 'redis';
import { promisify } from 'util';

// Create a Redis client
const client = redis.createClient({
    host: 'localhost', // Change this if your Redis server is hosted elsewhere
    port: 6379, // Default Redis port
});

// Handle connection events
client.on('connect', () => {
    console.log('Connected to Redis');
});

client.on('ready', () => {
    console.log('Redis client is ready to use');
});

client.on('error', (err) => {
    console.error('Redis error: ', err);
});

client.on('end', () => {
    console.log('Redis client has closed');
});

// Promisify Redis client methods for easier async/await usage
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

export { getAsync, setAsync, client };
