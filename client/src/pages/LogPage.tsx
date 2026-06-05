import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import Login from "../components/Login";
import Signup from "../components/Signup";
import { useAuth } from "../context/AuthContext";

import useBackendHealth from "../hooks/useBackendHealth";
import BackendStatusVisual  from "../components/BackendStatusVisual";

const LogPage: React.FC = () => {
  const backendHealthy = useBackendHealth();
  const isBackendDown = backendHealthy === false;

  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dash");
    }
  }, [user, navigate]);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-gray-400">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 relative">
      <button
        onClick={handleHomeClick}
        className="absolute top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
        aria-label="Back to Home"
      >
        <Home size={20} />
      </button>

     {isBackendDown && (
  <BackendStatusVisual
    side={isLogin ? "left" : "right"}
    mode={isLogin ? "login" : "signup"}
  />
)}



      {isLogin ? (
        <Login onToggle={toggleAuthMode} />
      ) : (
        <Signup onToggle={toggleAuthMode} />
      )}
    </div>
  );
};

export default LogPage;
