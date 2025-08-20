import { Router } from "express";
import {
  getUsers,
  login,
  register,
  updateProfile,
} from "../controller/User.controller.js";
import { Protected } from "../middleware/Protected.js";
import { upload } from "../middleware/multer/userMulter.js";

export const userRouter = Router();
userRouter.route("/register").post(register);
userRouter.route("/login").post(login);
userRouter
  .route("/update-profile/:id")
  .put(Protected, upload.single("avatar"), updateProfile);
userRouter.route("/get-users").get(Protected, getUsers);
