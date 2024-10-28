import express from "express";
import getGoogleUser from "../controllers/googleController.js";

const routerGoogle = express.Router();

routerGoogle.route("/").post(getGoogleUser);

export default routerGoogle;
