import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LogPage from "./pages/LogPage";
// import AuthCallback from "./components/AuthCallback"; // pehle use kr rhe he ab nhi kr rhe hai - supabase handle it
import DashPage from "./pages/DashPage";
import ProfilePage from "./pages/ProfilePage";
import GroupPage from "./pages/GroupPage";
import ExpensePage from "./pages/ExpensePage";
import ProtectedRoute from "./components/ProtectedRoutes";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/log" element={<LogPage />} />
      {/* <Route path="/auth/callback" element={<AuthCallback />} /> */}
      <Route path="/dash" element={<ProtectedRoute><DashPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/groups" element={<ProtectedRoute><GroupPage /></ProtectedRoute>} />
      <Route path="/groups/:groupId/expenses" element={<ProtectedRoute><ExpensePage /></ProtectedRoute>} />
    </Routes>
  );
};

export default App;
