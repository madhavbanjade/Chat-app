import { Router } from "express";
import {
  markMessageAsSeen,
  receiveMessage,
  sendMessage,
} from "../controller/Message.Controller.js";
import { media } from "../middleware/multer/messageMulter.js";
import { Protected } from "../middleware/Protected.js";

export const messageRouter = Router();

messageRouter
  .route("/send-message/:id")
  .post(Protected, media.single("media"), sendMessage);
messageRouter.route("/receive-message/:id").get(Protected, receiveMessage); //:id means senderId
messageRouter.route("/seen/:id").put(Protected, markMessageAsSeen); //:id means senderId
