import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login.jsx";
import { AuthContext } from "./context/AuthContext.jsx";
import { useContext } from "react";
import Home from "./components/Home.jsx";
import MyProfile from "./components/MyProfile.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />

        {/* protected Route */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-profile"
          element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          }
        />

        {/* catch all unknown routes*/}
        <Route
          path="*"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
