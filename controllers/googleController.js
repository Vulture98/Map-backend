import User from "../models/userModels.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import generateToken from "../utils/createToken.js";
import dotenv from 'dotenv'
import { OAuth2Client } from "google-auth-library";

const getGoogleUser = asyncHandler(async (req, res) => {
  dotenv.config()

  const { token } = req.body;

  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const client = new OAuth2Client(CLIENT_ID);

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const googleId = payload["sub"];
    const username = payload["name"];
    const email = payload["email"];

    // Check for existing user
    let user = await User.findOne({ googleId });
    // console.log(`Hello from post /auth/google `);
    if (!user) {
      // Create a new user if not found
      user = await User.create({
        googleId,
        username,
        email,
        password: "$2a$10$tGW0O7kiyLnIO4pdDRbUbOFCMh7hunT9NU1uDzQ9RKHZ/lvsI1234",
        isGoogle: true,
      });
      console.log(
        `New User created - email: ${user.email} username: ${user.username}`
      );

      // console.log("Response Headers:", res.getHeaders());
      // console.log("Cookies:", res.getHeader("Set-Cookie"));

      const jwtToken = generateToken(res, user._id);
      return res.status(200).json({
        success: true,
        userId: user.googleId,
        name: user.username,
        email: user.email,
        message: "User Created",
      });
    }

    if (user.isSuspended) {
      console.log(`Google User ${user.email} is suspended`);
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended. Please contact admin for support."
      });
    }
    const jwtToken = generateToken(res, user._id);
    // console.log("Response Headers:", res.getHeaders());
    // console.log("Cookies:", res.getHeader("Set-Cookie"));
    // console.log(
    //   `Existing User email: ${user.email} username: ${user.username}`
    // );
    return res.status(200).json({
      success: true,
      userId: user.googleId,
      name: user.username,
      email: user.email,
      message: "Existing User",
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
});

export default getGoogleUser;
