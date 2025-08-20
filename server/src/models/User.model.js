import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    // renamed from 'file' to 'avatar' for clarity
    type: String,
    accept: "image/*",
    default: "/default.png", // optional default image
  },
  bio: {
    type: String,
    default: "Hello",
  },
});

export const User = mongoose.model("User", userSchema);
