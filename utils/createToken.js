import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

const generateToken = (res, userId) => {
  dotenv.config()
  // console.log(`inside generateToken() `);
  // console.log(`node_env: ${process.env.NODE_ENV} `);
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  //set jwt http cookie
  res.cookie("jwt", token, {
    // expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,                    
    secure: process.env.NODE_ENV === "production",    // Always true for production
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",// Required for cross-origin cookies
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  return token;
};

export default generateToken;
