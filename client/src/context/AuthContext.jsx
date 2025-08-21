import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // <-- must be null when not logged in
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // <-- add loading
  const [users, setUsers] = useState([]);

  //load user from localstorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
    setLoading(false); // finished checking localStorage
  }, []);

  const register = async (formData) => {
    try {
      await axios.post(
        "https://chat-app-theta-eight-87.vercel.app/api/register",
        formData
      );
      //auto login with same
      const loginData = await login({
        email: formData.email,
        password: formData.password,
      });
      return loginData;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  const login = async (formData) => {
    try {
      const res = await axios.post(
        "https://chat-app-theta-eight-87.vercel.app/api/login",
        formData
      );
      setUser(res.data.user);
      setToken(res.data.accessToken);

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.accessToken);

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.accessToken}`;

      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  const updateProfile = async (formData) => {
    try {
      const res = await axios.put(
        `https://chat-app-theta-eight-87.vercel.app/api/update-profile/${user._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      //update user state and local
      //should be aware about what you send as response in backend for user
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  const getUsers = async () => {
    try {
      const res = await axios.get(
        "https://chat-app-theta-eight-87.vercel.app/api/get-users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(res.data.users);
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        register,
        login,
        updateProfile,
        logout,
        user,
        setUser,
        token,
        loading,
        users,
        getUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export { AuthContext };
