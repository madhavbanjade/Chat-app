import { io } from "socket.io-client";

// 🔹 Replace with your backend server URL
// const SOCKET_URL = "https://chat-app-q8w9.onrender.com";
const SOCKET_URL = "http://localhost:3000";

// Create socket connection
const socket = io(SOCKET_URL, {
  withCredentials: true, // allow cookies/session
  transports: ["websocket"], // force WebSocket first
});

export default socket;
