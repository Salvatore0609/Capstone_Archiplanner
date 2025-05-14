import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { /* getNormalUserData */ saveToken /* saveNormalUserData  */ } from "../../redux/utils/authUtils";
import { loginNormalSuccess } from "../../redux/action/LoginActions";
import { Spinner } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";

function NormalLoginSuccess() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleLogin = async () => {
      try {
        const token = searchParams.get("token");

        if (!token) {
          window.location.href = "/";
          return;
        }
        console.log("Token ricevuto:", token);
        // Salva il token
        saveToken(token);

        /* // Salva tutto in localStorage
        saveNormalUserData(userData); */

        // Fetch dati COMPLETI utente
        const response = await fetch(`${import.meta.env.VITE_API_URL}/utenti/current-user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch profile");

        const userData = await response.json();
        console.log("Dati utente ricevuti:", userData);

        // Dispatch completo per login normale
        dispatch(loginNormalSuccess(userData, token));
        console.log("Dispatch eseguito con successo!");

        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 5000);
      } catch (error) {
        console.error("Login error:", error);
        window.location.href = "/";
      }
    };

    handleLogin();
  }, [dispatch, searchParams]);

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

export default NormalLoginSuccess;
