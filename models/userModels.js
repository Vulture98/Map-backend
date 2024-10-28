import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 4,
    },
    isAdmin: {
      type: Boolean,
      // required: true,
      default: false,
    },
    isGoogle: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
