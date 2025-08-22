import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center p-4 justify-between bg-gray-200 gap-4">
        <h1 className="text-xl font-bold text-gray-800">💬Chat App</h1>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => navigate("/my-profile")}
            className="flex items-center space-x-4 p-2 rounded-xl w-full sm:w-auto"
          >
            <img
              src={user?.avatar || "/default.png"}
              alt={user?.userName || "User"}
              className="object-cover w-[50px] h-[50px] rounded-full border-2 border-purple-500"
            />
            <p className="text-lg font-semibold text-gray-700 truncate">
              {user?.userName}
            </p>
          </button>
          <button
            className="bg-red-500 text-white px-5 py-2 rounded-xl hover:bg-red-600 transition w-full sm:w-auto"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`bg-gray-100 z-20 w-full overflow-y-auto sm:w-[350px] sm:block absolute sm:relative h-full transition-transform duration-300 ${
            selectedUser
              ? "-translate-x-full sm:translate-x-0"
              : "translate-x-0"
          }`}
        >
          <Sidebar
            setSelectedUser={setSelectedUser}
            selectedUser={selectedUser}
          />
        </div>

        {/* Chat panel */}
        <div className="flex-1 h-full">
          {selectedUser ? (
            <Chat selectedUser={selectedUser} />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500 text-xl">
              Select a user from the sidebar to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
