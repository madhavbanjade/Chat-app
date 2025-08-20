import mongoose from "mongoose";
import { Message } from "../models/message.model.js";

export const sendMessage = async (req, res, next) => {
  try {
    const sender = req.user;
    const receiver = req.params.id;
    const { content } = req.body;

    if (!receiver) throw Error("Receiver is required!");
    let messageData = {
      sender,
      receiver,
      seen: false,
    };
    if (content) {
      messageData.content = content;
      messageData.messageType = "text";
    }
    if (req.file) {
      messageData.media = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
      messageData.messageType = "image"; // ✅ set message type
    }

    const message = new Message(messageData);
    await message.save();

    res.status(201).json({ success: true, message });
  } catch (error) {
    next(error);
  }
};

export const receiveMessage = async (req, res, next) => {
  try {
    const sender = req.params.id;
    const receiver = req.user;
    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    }).sort({ createdAt: 1 });
    res.status(200).json({ success: true, messages });
  } catch (error) {
    next(error);
  }
};

export const markMessageAsSeen = async (req, res, next) => {
  try {
    const senderId = req.params.id;
    const receiverId = req.user;

    await Message.updateMany(
      {
        sender: senderId,
        receiver: receiverId,
        seen: false,
      },
      { $set: { seen: true } }
    );
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
