import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";

const Sidebar = ({ setSelectedUser, selectedUser }) => {
  const { users, getUsers } = useContext(AuthContext);
  const selectedRef = useRef(null);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    selectedRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [selectedUser]);

  const openChat = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="bg-gray-200 w-full sm:w-full overflow-y-auto">
      <ul className="flex flex-col gap-4 p-2">
        {users.length === 0 ? (
          <p className="text-center text-gray-600">No users found!</p>
        ) : (
          users.map((user) => {
            const isSelected = selectedUser?._id === user._id;
            return (
              <li
                key={user._id}
                ref={isSelected ? selectedRef : null}
                onClick={() => openChat(user)}
                className={`cursor-pointer rounded-xl transition-all duration-200 ${
                  isSelected ? "bg-purple-300" : "hover:bg-purple-100"
                }`}
              >
                <div
                  className={`flex items-center w-full gap-4 p-3 bg-gray-100 shadow-sm rounded-md ${
                    isSelected ? "border-2 border-purple-500" : ""
                  }`}
                >
                  <img
                    src={user?.avatar || "/default.png"}
                    alt={user.userName}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default.png";
                    }}
                    className="w-12 h-12 rounded-full"
                  />
                  <h1 className="font-semibold">{user.userName}</h1>

                  {user.unreadCount > 0 && selectedUser?._id !== user._id && (
                    <span className="ml-auto text-sm bg-red-500 text-white px-2 py-1 rounded-full">
                      {user.unreadCount}
                    </span>
                  )}
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
