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
      <Form onSubmit={handleSubmit} className="w-100">
        <FormGroup>
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" name="username" required autoComplete="username" />
          <Form.Label className="mt-2">Password</Form.Label>
          <Form.Control type="password" name="password" required autoComplete="current-password" />
          <Button type="submit" className="w-100 mt-3" disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Accesso...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </FormGroup>
      </Form>
      <div className="text-center my-3">— oppure —</div>
      <Button variant="outline-dark" className="w-100" onClick={handleGoogleLogin}>
        Login con Google
      </Button>
      <div className="mt-3">
        <span>Non hai un account?</span>{" "}
        <Button variant="link" onClick={() => setShowRegister(true)}>
          Registrati
        </Button>
      </div>
      <Register show={showRegister} onClose={() => setShowRegister(false)} />
    </Container>
  );
}

export default Login;
