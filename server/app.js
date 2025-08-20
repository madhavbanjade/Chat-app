import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./utils/database.js";
import errorMiddleware from "./src/middleware/errorMiddleware.js";
import http from "http";
import path from "path";
import cors from "cors";
import { userRouter } from "./router/user.router.js";
import messageRouter from "./router/message.router.js";
import { Server } from "socket.io";
import { Message } from "./models/message.model.js";

dotenv.config();
const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(express.static(path.resolve("./public")));
// Allow frontend (React) to call backend
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,
  })
);

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(`user: ${userData._id} joined their room`);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined Room:" + room);
  });

  //send message
  socket.on("new message", (newMessageReceived) => {
    const { sender, receiver } = newMessageReceived;

    if (!receiver) return console.log("Receiver not defined");

    // Send to receiver's room
    socket.in(receiver).emit("message received", newMessageReceived);
  });

  //seen
  socket.on("mark messages seen", async ({ senderId, receiverId }) => {
    try {
      await Message.updateMany(
        { sender: senderId, receiver: receiverId, seen: false },
        { $set: { seen: true } }
      );

      // ✅ notify only the sender that their messages were seen
      io.to(senderId).emit("messages seen", { by: receiverId });

      console.log(`Messages from ${senderId} marked seen by ${receiverId}`);
    } catch (error) {
      console.error("❌ Error marking messages as seen:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

app.use(errorMiddleware);
//routes
app.get("/", (req, res) => res.send({ message: "Hello vercel" }));
app.use("/api", userRouter);
app.use("/api/messages", messageRouter);
connectDB();
server.listen(port, () => console.log(`Server is listining on port ${port}`));
