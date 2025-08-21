import { Router } from "express";
import {
  getUsers,
  login,
  register,
  updateProfile,
} from "../controller/user.controller.js";
import { Protected } from "../src/middleware/Protected.js";
import { upload } from "../src/middleware/multer/userMulter.js";

export const userRouter = Router();
userRouter.route("/register").post(register);
userRouter.route("/login").post(login);
userRouter
  .route("/update-profile/:id")
  .put(Protected, upload.single("avatar"), updateProfile);
userRouter.route("/get-users").get(Protected, getUsers);
