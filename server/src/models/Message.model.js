import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User
      ref: "User",
      required: true,
    },
    content: {
      type: String, // text message
    },
    media: {
      type: String, // URL or file path of image/file
    },
    messageType: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text",
    },
    seen: { type: Boolean, default: false }, // 🔥 must be default false
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
