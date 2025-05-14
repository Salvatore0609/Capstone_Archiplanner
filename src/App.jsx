import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Project from "./pages/Project";
import FasePage from "./pages/FasePage";
import Login from "./pages/auth/Login";
import ProfileDetails from "./pages/ProfileDetails";
import { getNormalUserData, getToken, getUserData } from "./redux/utils/authUtils";

import { useDispatch, useSelector } from "react-redux";
import LoginSuccess from "./pages/auth/LoginSuccess";
import LoginNormalSuccess from "./pages/auth/LoginNormalSuccess";
import { useEffect } from "react";
import { loginGoogleSuccess, loginNormalSuccess } from "./redux/action/LoginActions";

const App = () => {
  const dispatch = useDispatch();
  const token = getToken();

  // Restore stored normal login data
  useEffect(() => {
    const normal = getNormalUserData();
    if (normal?.token) {
      // Ensure Redux has the normal user
      dispatch(loginNormalSuccess(normal, normal.token));
    }

    const google = getUserData();
    if (google?.token) {
      // Ensure Redux has the Google user
      dispatch(loginGoogleSuccess(google, google.token));
    }
  }, [dispatch]);

  const isAuthenticatedNormal = useSelector((state) => state.loginNormal?.isAuthenticated);
  const isAuthenticatedGoogle = useSelector((state) => state.loginGoogle?.isAuthenticated);

  const isAuthenticated = (isAuthenticatedNormal || isAuthenticatedGoogle) && !!token;

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/login-normal-success" element={<LoginNormalSuccess />} />
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
