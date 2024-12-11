import asyncHandler from "./asyncHandler.js";
import User from "../models/userModels.js";


const suspensionCheck = asyncHandler(async (req, res, next) => {
  console.log(`inside suspensionCheck()`);

  console.log(`"req.path":`, req.path);
  console.log(`"req.body":`, req.body);
  console.log(`"req.user":`, req.user);

  // Skip suspension check for login and register routes
  if (req.path === '/login' || req.path === '/register' || req.path === '/logout') {
    console.log(`Hello from suspensionCheck() skip`);
    return next();
  }

  const existingUser = await User.findOne({ email: req.body.email });
  // const user = await User.findById(req.user?._id);
  console.log(`user.isSuspended:`, existingUser.isSuspended);

  if (!existingUser) {
    return next();
  }

  if (existingUser.isSuspended) {
    return res.status(403).json({
      message: "Your account has been suspended. Please contact admin for support."
    });
  }

  next();

})


export { suspensionCheck };