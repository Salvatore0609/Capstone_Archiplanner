import { useState, useEffect } from "react";
import { Button, Form, Container, Spinner, Alert, FormGroup, Col, Row, Card } from "react-bootstrap";
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
      <Container fluid className="d-flex align-items-center">
        <Row className="w-100 ">
          <Col lg={8} className="d-none d-lg-flex align-items-center justify-content-center">
            <div className="position-relative w-100 " style={{ height: "90vh" }}>
              {/* Testo descrittivo */}
              <div
                className="position-absolute"
                style={{
                  left: "15%",
                  top: "28%",
                  width: "40%",
                  height: "40%",
                  background: "url('/assets/logo.png') no-repeat center center",
                  backgroundSize: "contain",
                  opacity: 1,
                  zIndex: 1000,
                }}
              />
              <Card
                className="p-3 text-light "
                style={{
                  right: "-50%",
                  top: "35%",
                  backgroundColor: "rgba(0, 0, 0, 0)",
                  backdropFilter: "blur(20px)",
                  border: "0px solid",
                  borderRadius: "20px",
                  width: "50%",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.38)",
                  maxHeight: "90%",
                  overflowY: "auto",
                }}
              >
                <Card.Body>
                  <div className="mb-4">
                    <h1 className="text-start mb-1" style={{ color: "var(--primary)", fontSize: "2rem", fontWeight: "bold" }}>
                      ARCHIPLANNER
                    </h1>
                    <h2 className="text-start mb-4" style={{ color: "var(--text-dark)", fontSize: "1.2rem" }}>
                      La piattaforma per la gestione intelligente dei progetti architettonici
                    </h2>
                    <h5 className="text-start mb-4">GESTIONE INTELLIGENTE DELLE FASI PROGETTUALI</h5>

                    <h5 className="text-start mb-4">BANCA DATI NORMATIVA INTEGRATA</h5>

                    <h5 className="text-start mb-4">ORGANIZZAZIONE EFFICACE</h5>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
          <Form onSubmit={handleSubmit} className="login-form  ms-auto py-5">
            <img src="/assets/logo.png" alt="Logo" className="w-100 h-30" />
            {error && <Alert variant="danger">{error}</Alert>}
            <FormGroup>
              <Form.Label className="fw-bold">Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                required
                autoComplete="username"
                style={{ borderRadius: "25px", border: "3px solid var(--primary)" }}
              />
              <Form.Label className="mt-3 fw-bold">Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                required
                autoComplete="current-password"
                style={{ borderRadius: "25px", border: "3px solid var(--primary)" }}
              />
              <div className="d-flex gap-3 mt-4">
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
                  className="w-100 fw-bold"
                  onClick={() => setShowRegister(true)}
                  style={{
                    backgroundColor: "var(--warning)",
                    border: "none",
                  }}
                >
                  Registrati
                </Button>
              </div>
              <div className="text-center my-3 fw-bold">— oppure —</div>
              <Button
                className="w-100 fw-bold"
                onClick={handleGoogleLogin}
                style={{
                  backgroundColor: "var(--info)",
                  border: "none",
                }}
              >
                Continua con Google
              </Button>
            </FormGroup>
          </Form>
        </Row>

        <Register show={showRegister} onClose={() => setShowRegister(false)} />
      </Container>
    </>
  );
}

export default Login;
