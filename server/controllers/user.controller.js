import { token } from "../utils/jwt.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";

export const register = async (req, res, next) => {
  try {
    const { userName, email, password, ...rest } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("Email taken,try new one!");
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
      ...rest,
    });
    const accessToken = token(user._id);

    res.status(201).json({
      message: "New user alert!",
      user,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid Credientials!");
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) throw new Error("Invalid Credientials!");
    const accessToken = token(user._id);
    res.status(200).json({
      success: true,
      user,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    //this can make difficulties
    const userId = req.params.id;
    const updates = {
      userName: req.body.userName,
      bio: req.body.bio,
    };

    //if file is uploaded, add it to updates
    if (req.file) {
      updates.avatar = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const loggedInUser = req.user;
    const users = await User.find({ _id: { $ne: loggedInUser } }).select(
      "-password"
    ); //exclude me

    //count unread message for each user
    const usersWithUnread = await Promise.all(
      users.map(async (user) => {
        const unreadCount = await Message.countDocuments({
          sender: user._id,
          receiver: loggedInUser,
          seen: false,
        });
        return {
          ...user.toObject(),
          unreadCount,
        };
      })
    );

    if (!users) throw Error("No users");
    res.status(200).json({
      success: true,
      users: usersWithUnread,
    });
  } catch (error) {
    next(error);
  }
};
