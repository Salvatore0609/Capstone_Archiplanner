import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Project from "./pages/Project";
import FasePage from "./pages/FasePage";
import Login from "./pages/auth/Login";
import ProfileDetails from "./pages/ProfileDetails";
import { getToken } from "./redux/utils/authUtils";

import { useSelector } from "react-redux";
import LoginSuccess from "./pages/auth/LoginSuccess";

const App = () => {
  const isAuthenticatedNormal = useSelector((state) => state.loginNormal?.isAuthenticated);
  const isAuthenticatedGoogle = useSelector((state) => state.loginGoogle?.isAuthenticated);

  const token = getToken();
  const isAuthenticated = (isAuthenticatedNormal || isAuthenticatedGoogle) && !!token;

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/login-success" element={<LoginSuccess />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />} />
        <Route path="/profile-details" element={isAuthenticated ? <ProfileDetails /> : <Navigate to="/" replace />} />
        <Route path="/project" element={isAuthenticated ? <Project /> : <Navigate to="/" replace />} />
        <Route path="/fase/:id" element={isAuthenticated ? <FasePage /> : <Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
