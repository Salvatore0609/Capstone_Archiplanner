import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { saveToken, saveUserData } from "../../redux/utils/authUtils";
import { fetchProfile, loginGoogleSuccess } from "../../redux/action/LoginActions";
import { Spinner } from "react-bootstrap";
import { fetchProjects } from "../../redux/action/projectsActions";
import { useNavigate } from "react-router-dom";

function LoginGoogleSuccess() {
  const [showContent, setShowContent] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("data");
    if (!encoded) return navigate("/");

    let userData;
    try {
      const json = atob(decodeURIComponent(encoded));
      userData = JSON.parse(json);
    } catch {
      return navigate("/");
    }

    if (!userData.token) {
      return navigate("/");
    }

    saveToken(userData.token);
    saveUserData(userData);
    dispatch(loginGoogleSuccess(userData));

    dispatch(fetchProfile());
    dispatch(fetchProjects());

    const timer = setTimeout(() => {
      setShowContent(false);
      navigate("/dashboard");
    }, 2000);

    return () => clearTimeout(timer);
  }, [dispatch, navigate]);

  if (!showContent) return null;

  return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "98vh" }}>
      <img
        src="/assets/logo2.png"
        alt="Logo"
        style={{
          width: "300px",
          marginBottom: "2rem",
          animation: "fadeIn 0.5s ease-out",
        }}
        className="rounded-circle"
      />

      <Spinner animation="border" variant="success" style={{ width: "3rem", height: "3rem" }} />

      <p
        className="mt-3 fw-bold"
        style={{
          fontSize: "1.2rem",
          animation: "fadeIn 0.8s ease-out",
        }}
      >
        Preparati per Archiplanner...
      </p>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default LoginGoogleSuccess;
