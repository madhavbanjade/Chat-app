import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { login, register } = useContext(AuthContext); // 👈 get login function from context
  const [isRegister, setIsRegister] = useState(true);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        // Call register (which auto-logins)
        await register(formData);
      } else {
        // Call login
        await login({ email: formData.email, password: formData.password });
      }

      navigate("/"); // 👈 redirect after login/register
    } catch (error) {
      alert("Invalid credentails!");
      console.error(error.message || error);
    }

    console.log(isRegister ? "Registering..." : "Logging in...", formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="flex flex-col p-4 space-y-2 bg-white rounded-2xl shadow-lg w-[350px]">
        <h1 className="text-purple-500 text-center font-bold text-2xl">
          {isRegister ? "Register" : "Login"}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {isRegister && (
            <input
              type="text"
              placeholder="Username"
              name="userName"
              value={formData.userName}
              className="p-3 rounded-xl border border-violet-500 w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
              onChange={handleChange}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            className="p-3 rounded-xl border border-violet-500 w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            className="p-3 rounded-xl border border-violet-500 w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
            onChange={handleChange}
          />
          <button
            type="submit"
            className="bg-purple-500 text-white py-2 rounded-xl hover:bg-purple-600"
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <p
          className="text-sm text-center text-gray-600 cursor-pointer hover:underline"
          onClick={() => setIsRegister((prev) => !prev)}
        >
          {isRegister
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </p>
      </div>
    </div>
  );
};

export default Login;
