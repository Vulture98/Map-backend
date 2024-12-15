import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import router from "./routes/userRoutes.js";
import routerTask from "./routes/taskRoutes.js";
import routerGoogle from "./routes/googleRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";


dotenv.config();
const PORT = 5000;
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [  
  "https://map-frontend-d6yw.vercel.app",
  "https://map-frontend-p78x.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log('Request from origin:', origin);
      // Allow requests with no origin
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        console.log('Origin allowed:', origin);
        callback(null, true);
      } else {
        console.log('Origin blocked:', origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"],  // for cookie handling
  })
);

app.use("/api/users", router);
app.use("/user/task", routerTask);
app.use("/auth/google", routerGoogle);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  return res.status(201).json({ message: "Hello from Map-B" });
});
app.listen(PORT, () => {
  console.log(`server start at port no ${PORT}`);
});
