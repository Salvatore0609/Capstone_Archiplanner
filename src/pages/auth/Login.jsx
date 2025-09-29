import { useState, useEffect } from "react";
import { Button, Form, Container, Spinner, Alert, FormGroup } from "react-bootstrap";
import Register from "./Register";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginWithGoogle, loginUser } from "../../redux/action/LoginActions";
import ThemeToggle from "../../components/commons/ThemeToogle";

function Login() {
  const [showRegister, setShowRegister] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.loginNormal) || {};

  const handleSubmit = (event) => {
    event.preventDefault();
    const { username, password } = event.target;
    dispatch(loginUser(username.value, password.value, navigate));
  };

  const handleGoogleLogin = () => {
    dispatch(loginWithGoogle());
  };

  useEffect(() => {
    document.body.classList.add("login-page");
    return () => {
      document.body.classList.remove("login-page");
    };
  }, []);

  return (
    <>
      <ThemeToggle className="position-absolute top-0 start-0 m-3" />
      <Container fluid className="d-flex justify-content-lg-end justify-content-center" style={{ height: "92vh" }}>
        <Form onSubmit={handleSubmit} className="login-form w-100 p-3" style={{ border: "4px solid var(--primary)", borderRadius: "20px" }}>
          <img
            src="/assets/logo2.png"
            alt="Logo"
            style={{
              width: "300px",
              marginBottom: "2rem",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
              animation: "fadeIn 0.5s ease-out",
            }}
            className="rounded-circle"
          />
          {error && <Alert variant="danger">{error}</Alert>}
          <FormGroup>
            <Form.Label className="fw-bold border-0 bg-transparent">Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              required
              autoComplete="username"
              style={{ borderRadius: "25px", border: "3px solid var(--primary)" }}
            />
            <Form.Label className="mt-2 fw-bold border-0 bg-transparent">Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              required
              autoComplete="current-password"
              style={{ borderRadius: "25px", border: "3px solid var(--primary)" }}
            />
            <div className="d-flex gap-3 mt-3">
              <Button type="submit" className="w-100 fw-bold" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Accesso...
                  </>
                ) : (
                  "Accedi"
                )}
              </Button>
              <Button
                className="w-100 text-decoration-none text-white fw-bold"
                onClick={() => setShowRegister(true)}
                style={{ backgroundColor: "#FFBC02" }}
              >
                Registrati
              </Button>
            </div>
            <div className="text-center my-3 fw-bold">— oppure —</div>
            <Button className="w-100 text-decoration-none text-white fw-bold" onClick={handleGoogleLogin} style={{ backgroundColor: "#7BADC6" }}>
              Continua con Google
            </Button>
          </FormGroup>
        </Form>

        <Register show={showRegister} onClose={() => setShowRegister(false)} />
      </Container>
    </>
  );
}

export default Login;
