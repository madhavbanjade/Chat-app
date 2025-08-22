import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import socket from "../components/socket/Socket";
import { AuthContext } from "../context/AuthContext";

const MessageContext = createContext();
const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) return;

    // join personal room
    socket.emit("setup", user);

    socket.on("message received", (newMessageReceived) => {
      console.log("Message Received:", newMessageReceived);
      setMessages((prev) => [...prev, newMessageReceived]);
    });
    return () => {
      socket.off("receiveMessage");
    };
  }, [user]);
  //send message
  const sendMessage = async (receiverId, content, file) => {
    try {
      const formData = new FormData();
      if (content) formData.append("content", content);
      if (file) formData.append("media", file);
      const res = await axios.post(
        `https://chat-app-q8w9.onrender.com/api/messages/send-message/${receiverId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // if using JWT
          },
        }
      );

      if (res.data.success) {
        const newMessage = res.data.message;

        // ✅ Add to local state
        setMessages((prev) => [...prev, newMessage]);

        // ✅ Emit socket event so receiver gets it instantly
        socket.emit("new message", newMessage);
      }
    } catch (error) {
      console.error("Send Message Error:", error);
    }
  };
  // Get Messages between current user and another user
  const getMessages = async (userId) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://chat-app-q8w9.onrender.com/api/messages/receive-message/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setMessages(res.data.messages);
        socket.emit("join chat", userId);
        // ✅ Mark messages as seen when opening chat
        await markMessageAsSeen(userId);
      }
    } catch (err) {
      console.error("Get Messages Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // mark all unseen messages from sender as seen
  const markMessageAsSeen = async (senderId) => {
    try {
      await axios.put(
        `https://chat-app-q8w9.onrender.com/api/messages/seen/${senderId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // ✅ Update local state immediately so UI updates without waiting
      setMessages((prev) =>
        prev.map((msg) =>
          msg.sender === senderId ? { ...msg, seen: true } : msg
        )
      );

      // ✅ Emit with a distinct event name
      socket.emit("mark messages seen", {
        senderId, // who sent the messages
        receiverId: user._id, // current logged-in user (viewer)
      });
    } catch (error) {
      console.error("Mark Messages As Seen Error:", error);
    }
  };

  return (
    <MessageContext.Provider
      value={{
        messages,
        loading,
        sendMessage,
        getMessages,
        markMessageAsSeen,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export default MessageProvider;
export { MessageContext };
