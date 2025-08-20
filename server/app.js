import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./utils/database.js";
import errorMiddleware from "./src/middleware/errorMiddleware.js";
import http from "http";
import path from "path";
import cors from "cors";
import { userRouter } from "./src/routes/user.route.js";
import messageRouter from "./src/routes/message.route.js";
import { Server } from "socket.io";
import { Message } from "./src/models/message.model.js";

dotenv.config();
const app = express();
const port = process.env.PORT;

// ✅ CORS first, before routes
const allowedOrigins = [
  "http://localhost:5173",
  "https://chat-app-yvh1.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.static(path.resolve("./public")));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// ✅ socket.io stuff
io.on("connection", (socket) => {
  console.log("connected to socket.io");
  // ...
});

// ✅ Routes
app.get("/", (req, res) => res.send({ message: "Hello vercel" }));
app.use("/api", userRouter);
app.use("/api/messages", messageRouter);

// ✅ Error middleware must be last
app.use(errorMiddleware);

// DB + server
connectDB();
server.listen(port, () => console.log(`Server is listening on port ${port}`));
