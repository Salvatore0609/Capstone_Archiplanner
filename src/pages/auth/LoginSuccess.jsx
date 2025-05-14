import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { saveToken, saveUserData } from "../../redux/utils/authUtils";
import { loginGoogleSuccess } from "../../redux/action/LoginActions";
import { Spinner } from "react-bootstrap";

function LoginSuccess() {
  const [showContent, setShowContent] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const avatar = decodeURIComponent(params.get("avatar") || "");
    const email = params.get("email");
    const nome = params.get("name");

    if (!token) {
      window.location.href = "/";
      return;
    }
    //Salva i dati
    const userData = { token, email, nome, avatar, provider: "google" };
    saveToken(token);
    saveUserData(userData);
    dispatch(loginGoogleSuccess(userData));
    //Timer per il caricamento
    const timer = setTimeout(() => {
      setShowContent(false);
      window.location.href = "/dashboard";
    }, 5000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  if (!showContent) return null;

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
        className="mt-3"
        style={{
          color: "#333",
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

export default LoginSuccess;
