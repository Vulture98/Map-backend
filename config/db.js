import mongoose from "mongoose";
import dotenv from "dotenv";


const connectDB = async () => {
  console.log(`Hello from db.js `);
  try {    
    const uri = process.env.MONGO_URI;
    const PORT = process.env.PORT;
    await mongoose.connect(uri);
    console.log(`Successfully Connected to mongoDB`);
  } catch (error) {
    console.error(error.message); // Log error message
  }
};

export default connectDB;
