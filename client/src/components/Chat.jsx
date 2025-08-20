import React, { useContext, useEffect, useRef, useState } from "react";
import { MessageContext } from "../context/MessageContext";
import { AuthContext } from "../context/AuthContext";

const Chat = ({ selectedUser }) => {
  const { user } = useContext(AuthContext);
  const { sendMessage, getMessages, messages, loading } =
    useContext(MessageContext);
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState();

  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);
  ``;
  // ✅ Scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Fetch messages when user changes
  useEffect(() => {
    if (!selectedUser?._id) return;

    console.log("🔄 Fetching messages with:", selectedUser._id);

    getMessages(selectedUser._id)
      .then(() => {
        console.log("✅ Messages fetched successfully");
      })
      .catch((err) => {
        console.error("❌ Error fetching messages:", err);
      });
  }, [selectedUser._id]);

  // Send text
  const handleSendMessage = async () => {
    if (!input.trim() || !selectedUser) return;

    try {
      await sendMessage(selectedUser._id, input, null);
      setInput("");
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  };

  // Send image
  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedUser) return;

    try {
      await sendMessage(selectedUser._id, null, file);
    } catch (error) {
      console.error("❌ Error sending image:", error);
    }
  };

  if (!selectedUser)
    return (
      <div className="flex items-center justify-center h-full text-gray-500 text-lg">
        Select a user to start conversation
      </div>
    );

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between bg-green-400 rounded-lg h-16 px-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <img
            src={selectedUser.avatar || "/default.png"}
            alt={selectedUser.userName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <h2 className="text-lg font-semibold text-white">
            {selectedUser?.userName}
          </h2>
        </div>
        <button
          onClick={() => fileInputRef.current.click()}
          className="p-2 bg-white rounded-lg hover:bg-gray-200"
        >
          Upload File
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleSendImage}
        />
      </div>

      {/* Chat body */}
      <div className="flex-1 p-4 overflow-y-auto">
        {loading ? (
          <p className="text-center text-gray-400">Loading messages...</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex mb-2 ${
                msg.sender === user._id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-xl shadow max-w-xs break-words relative flex flex-col ${
                  msg.sender === user._id
                    ? "bg-green-200 self-end"
                    : "bg-white self-start"
                }`}
              >
                {/* Message content */}
                {msg.messageType === "text" ? (
                  <p className="break-words">{msg.content}</p>
                ) : (
                  <img
                    src={msg.media}
                    alt="sent"
                    className="rounded-lg max-w-[200px] cursor-pointer"
                    onClick={() => setSelectedImage(msg.media)}
                  />
                )}

                {/* Timestamp */}
                {msg.createdAt && (
                  <span className="text-[10px] text-gray-500 self-end mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef}></div>
      </div>

      {/* Chat input */}
      <div className="flex items-end gap-2 p-4 bg-white border-t">
        <input
          type="text"
          placeholder="Type a message.."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none"
        />
        <button
          onClick={handleSendMessage}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Send
        </button>
      </div>

      {/* Image preview modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="preview"
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-6 text-white text-2xl"
            onClick={() => setSelectedImage(null)}
          >
            ✖
          </button>
        </div>
      )}
    </div>
  );
};

export default Chat;
