import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getToken, saveNormalUserData, saveToken } from "../../redux/utils/authUtils";
import { loginNormalSuccess } from "../../redux/action/LoginActions";
import { Spinner } from "react-bootstrap";

import { fetchProjects } from "../../redux/action/projectsActions";
import { useNavigate } from "react-router-dom";

function NormalLoginSuccess() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogin = async () => {
      try {
        const token = getToken();

        if (!token) {
          navigate("/");
          return;
        }

        // Salva il token
        saveToken(token);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/utenti/current-user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) alert("Impossibile caricare il profilo", response.status, response.statusText);
        const userData = await response.json();
        console.log("User data:", userData);

        dispatch(loginNormalSuccess(userData, token));
        saveNormalUserData({ ...userData, token });

        dispatch(fetchProjects());

        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 5000);
      } catch (error) {
        console.error("Login error:", error);
        window.location.href = "/";
      }
    };

    handleLogin();
  }, [dispatch, navigate]);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "98vh" }}>
      <img
        src="/assets/logo1.jpg"
        alt="Logo"
        style={{
          width: "200px",
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

export default NormalLoginSuccess;
