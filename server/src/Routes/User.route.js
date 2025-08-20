  import { Router } from "express";
  import {
    getUsers,
    login,
    register,
    updateProfile,
  } from "../controller/User.Controller.js";
  import { Protected } from "../middleware/Protected.js";
  import { upload } from "../middleware/multer/userMulter.js";

  const userRouter = Router();
  userRouter.route("/register").post(register);
  userRouter.route("/login").post(login);
  userRouter
    .route("/update-profile/:id")
    .put(Protected, upload.single("avatar"), updateProfile);
  userRouter.route("/get-users").get(Protected, getUsers);

  export default userRouter;
