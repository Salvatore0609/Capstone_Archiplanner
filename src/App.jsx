import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Project from "./pages/Project";
import FasePage from "./pages/FasePage";
import Login from "./pages/auth/Login";
import ProfileDetails from "./pages/ProfileDetails";
import { getNormalUserData, getToken, getUserData } from "./redux/utils/authUtils";
import { useDispatch, useSelector } from "react-redux";
import LoginSuccess from "./pages/auth/LoginGoogleSuccess";
import LoginNormalSuccess from "./pages/auth/LoginNormalSuccess";
import { useEffect } from "react";
import { fetchProfile, loginGoogleSuccess, loginNormalSuccess } from "./redux/action/LoginActions";
import { fetchProjects } from "./redux/action/projectsActions";

const App = () => {
  const dispatch = useDispatch();
  const token = getToken();

  useEffect(() => {
    /* dispatch(fetchProfile());
    dispatch(fetchProjects()); */
    const restoreSession = async () => {
      const normalUser = getNormalUserData();
      const googleUser = getUserData();

      // Priorità al login normale se entrambi presenti
      if (normalUser?.token) {
        await dispatch(loginNormalSuccess(normalUser, normalUser.token));
        await dispatch(fetchProfile());
      } else if (googleUser?.token) {
        await dispatch(loginGoogleSuccess(googleUser, googleUser.token));
        await dispatch(fetchProfile());
      }

      dispatch(fetchProjects());
    };

    restoreSession();
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
        <Route path="/project/:id" element={isAuthenticated ? <Project /> : <Navigate to="/" replace />} />
        <Route path="/fase/:id" element={isAuthenticated ? <FasePage /> : <Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
