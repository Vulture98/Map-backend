import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import express from "express";
import router from './routes/userRoutes.js';
import cors from 'cors'
import { routerTask } from "./routes/taskRoutes.js";

dotenv.config()
// Access environment variables
const PORT = process.env.PORT || 5000;
connectDB();

// Initialize Express app instance and middleware
const app = express();
// app.use(express())
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())
app.use(
  cors({
    // origin: process.env.FRONTEND_URL || "http://localhost:5173", 
    // origin: ['http://localhost:5173', 'http://localhost:5174'],
    // origin: "*",
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use('/api/users', router);
app.use('/user/task', routerTask)

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})





