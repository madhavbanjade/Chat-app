import { Router } from "express";
import {
  markMessageAsSeen,
  receiveMessage,
  sendMessage,
} from "../controller/message.controller.js";
import { media } from "../src/middleware/multer/messageMulter.js";
import { Protected } from "../src/middleware/Protected.js";

const messageRouter = Router();

messageRouter
  .route("/send-message/:id")
  .post(Protected, media.single("media"), sendMessage);
messageRouter.route("/receive-message/:id").get(Protected, receiveMessage); //:id means senderId
messageRouter.route("/seen/:id").put(Protected, markMessageAsSeen); //:id means senderId

export default messageRouter;
