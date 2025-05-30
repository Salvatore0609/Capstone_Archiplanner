import { useState } from "react";
import { Button, Form, Container, Spinner, Alert, FormGroup } from "react-bootstrap";
import Register from "./Register";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginWithGoogle, loginUser } from "../../redux/action/LoginActions";

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

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center" style={{ height: "98vh", maxWidth: "400px" }}>
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
      {error && <Alert variant="danger">{error}</Alert>}
      <Form
        onSubmit={handleSubmit}
        className="w-100 p-3"
        style={{ borderRadius: "25px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)", backdropFilter: "blur(5px)" }}
      >
        <FormGroup>
          <Form.Label className="fw-bold">Username</Form.Label>
          <Form.Control type="text" name="username" required autoComplete="username" style={{ borderRadius: "25px", border: "3px solid #C69B7B" }} />
          <Form.Label className="mt-2 fw-bold">Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            required
            autoComplete="current-password"
            style={{ borderRadius: "25px", border: "3px solid #C69B7B" }}
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
            Login con Google
          </Button>
        </FormGroup>
      </Form>

      <Register show={showRegister} onClose={() => setShowRegister(false)} />
    </Container>
  );
}

export default Login;
